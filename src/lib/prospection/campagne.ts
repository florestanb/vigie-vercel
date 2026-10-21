import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { lancerAudit } from "../audit";
import { RACINE_DONNEES } from "../donnees";
import { calculerScore, evaluer } from "../rules/engine";
import { brouillonEml, expediteurDepuisEnv, redigerMail } from "./mail";
import { constatsCertains, destinataire, motifExclusion } from "./selection";

/**
 * Campagne de prospection : audit d'une liste de sites, l'un après l'autre, et préparation d'un brouillon de
 * mail pour chaque site qui présente des manquements certains. Rien n'est envoyé : l'envoi se fait à la main,
 * depuis la messagerie, après relecture.
 *
 * Tout est écrit sur disque au fil de l'eau (data/prospection/<campagne>/), ce qui permet de suivre
 * l'avancement depuis l'interface et de reprendre une campagne interrompue.
 */

export const RACINE = path.join(RACINE_DONNEES, "prospection");
/** Liste d'opposition : domaines ou adresses de ceux qui ont répondu STOP. Elle vaut pour toutes les campagnes. */
const OPPOSITION = path.join(RACINE, "opposition.txt");

export type Etat = "mail" | "conforme" | "exclu" | "sans-adresse" | "opposition" | "deja-contacte" | "erreur";

export interface Ligne {
  site: string;
  etat: Etat;
  note?: number;
  manquements?: number;
  destinataire?: string;
  objet?: string;
  /** Nom de base des fichiers du mail (mails/<fichier>.html, .txt, .eml). */
  fichier?: string;
  audit?: string;
  detail?: string;
  /** Date à laquelle le mail a été marqué comme envoyé. */
  envoye?: string;
}

export interface Campagne {
  id: string;
  creee: string;
  sites: string[];
  pause: number;
  ia: boolean;
  statut: "en-cours" | "terminee" | "arretee" | "interrompue";
  lignes: Ligne[];
}

type Meta = Omit<Campagne, "lignes" | "statut"> & { statut: Campagne["statut"] };

const ID_VALIDE = /^[\w-]{4,60}$/;
const dossier = (id: string) => {
  if (!ID_VALIDE.test(id)) throw new Error("Campagne inconnue.");
  return path.join(RACINE, id);
};
const hote = (u: string) => new URL(u).hostname.replace(/^www\./, "").toLowerCase();

/** Campagnes qui tournent dans ce processus. Une campagne « en cours » sur disque mais absente d'ici a été interrompue. */
// Rangée sur globalThis pour survivre au rechargement à chaud des modules en développement.
const actives: Map<string, { arreter: boolean }> = ((globalThis as { __vigieCampagnes?: Map<string, { arreter: boolean }> }).__vigieCampagnes ??= new Map());

export function normaliserSites(texte: string): string[] {
  return [
    ...new Set(
      texte
        .split(/[\n,;\s]+/)
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("#"))
        .map((l) => (/^https?:\/\//i.test(l) ? l : `https://${l}`))
        .filter((l) => {
          try {
            return new URL(l).hostname.includes(".");
          } catch {
            return false;
          }
        }),
    ),
  ];
}

// ---------- Lecture ----------

async function lireJson<T>(fichier: string, defaut: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(fichier, "utf8")) as T;
  } catch {
    return defaut;
  }
}

export async function chargerCampagne(id: string): Promise<Campagne | null> {
  const d = dossier(id);
  const lignes = await lireJson<Ligne[] | null>(path.join(d, "resultats.json"), null);
  if (!lignes) return null;
  // Les campagnes lancées avant l'interface n'ont pas de meta.json.
  const meta = await lireJson<Partial<Meta>>(path.join(d, "meta.json"), {});
  const statut = meta.statut === "en-cours" && !actives.has(id) ? "interrompue" : (meta.statut ?? "terminee");
  return {
    id,
    creee: meta.creee ?? id.slice(0, 10),
    sites: meta.sites ?? lignes.map((l) => l.site),
    pause: meta.pause ?? 15,
    ia: meta.ia ?? false,
    statut,
    lignes,
  };
}

export async function listerCampagnes(): Promise<Campagne[]> {
  const noms = await fs.readdir(RACINE).catch(() => [] as string[]);
  const campagnes = await Promise.all(noms.filter((n) => ID_VALIDE.test(n)).map((n) => chargerCampagne(n).catch(() => null)));
  return campagnes.filter((c): c is Campagne => c !== null).sort((a, b) => b.creee.localeCompare(a.creee));
}

export async function lireOpposition(): Promise<Set<string>> {
  return new Set(
    (await fs.readFile(OPPOSITION, "utf8").catch(() => ""))
      .split("\n")
      .map((l) => l.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function ajouterOpposition(valeur: string): Promise<void> {
  const v = valeur.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
  if (!v || v.length > 200 || /\s/.test(v)) throw new Error("Indiquez un domaine ou une adresse e-mail.");
  if ((await lireOpposition()).has(v)) return;
  await fs.mkdir(RACINE, { recursive: true });
  await fs.appendFile(OPPOSITION, v + "\n");
}

/** Domaines déjà contactés (mail marqué envoyé) dans n'importe quelle campagne : on ne leur réécrit pas. */
async function domainesContactes(): Promise<Set<string>> {
  const contactes = new Set<string>();
  for (const c of await listerCampagnes()) for (const l of c.lignes) if (l.envoye) contactes.add(hote(l.site));
  return contactes;
}

export async function marquerEnvoye(id: string, site: string, envoye: boolean): Promise<void> {
  const fichier = path.join(dossier(id), "resultats.json");
  const lignes = await lireJson<Ligne[]>(fichier, []);
  const ligne = lignes.find((l) => l.site === site);
  if (!ligne) throw new Error("Site introuvable dans la campagne.");
  if (envoye) ligne.envoye = new Date().toISOString();
  else delete ligne.envoye;
  await fs.writeFile(fichier, JSON.stringify(lignes, null, 2));
}

/** Chemin d'un fichier de mail, après contrôle du nom (pas de sortie du dossier de la campagne). */
export function cheminMail(id: string, fichier: string, ext: "html" | "txt" | "eml"): string {
  if (!/^[a-z0-9.-]{1,120}$/.test(fichier)) throw new Error("Fichier inconnu.");
  return path.join(dossier(id), "mails", `${fichier}.${ext}`);
}

// ---------- Exécution ----------

export async function creerCampagne(sites: string[], options: { pause?: number; ia?: boolean } = {}): Promise<string> {
  if (!sites.length) throw new Error("Aucune adresse de site valide.");
  if (sites.length > 500) throw new Error("500 sites au plus par campagne.");
  const creee = new Date().toISOString();
  const id = `${creee.slice(0, 10)}-${crypto.randomBytes(3).toString("hex")}`;
  const d = dossier(id);
  await fs.mkdir(path.join(d, "mails"), { recursive: true });
  const meta: Meta = { id, creee, sites, pause: Math.min(Math.max(options.pause ?? 15, 2), 300), ia: options.ia ?? false, statut: "en-cours" };
  await fs.writeFile(path.join(d, "meta.json"), JSON.stringify(meta, null, 2));
  await fs.writeFile(path.join(d, "resultats.json"), "[]");
  return id;
}

export function estActive(id: string): boolean {
  return actives.has(id);
}

export function arreterCampagne(id: string): void {
  const a = actives.get(id);
  if (a) a.arreter = true;
}

/**
 * Exécute (ou reprend) une campagne jusqu'au bout. Les sites déjà traités sont sautés.
 * `onLigne` est appelé après chaque site.
 */
export async function executerCampagne(id: string, onLigne: (l: Ligne, rang: number, total: number) => void = () => {}): Promise<void> {
  if (actives.has(id)) throw new Error("Cette campagne est déjà en cours.");
  const d = dossier(id);
  const metaFichier = path.join(d, "meta.json");
  const meta = await lireJson<Meta | null>(metaFichier, null);
  if (!meta) throw new Error("Campagne inconnue.");
  const controle = { arreter: false };
  actives.set(id, controle);
  await fs.writeFile(metaFichier, JSON.stringify({ ...meta, statut: "en-cours" }, null, 2));

  try {
    const exp = expediteurDepuisEnv();
    const opposes = await lireOpposition();
    const contactes = await domainesContactes();
    const journal = path.join(d, "resultats.json");
    const lignes = await lireJson<Ligne[]>(journal, []);
    const faits = new Set(lignes.map((l) => l.site));

    for (const [i, site] of meta.sites.entries()) {
      if (controle.arreter) break;
      if (faits.has(site)) continue;
      let ligne: Ligne;
      let audite = false;
      if (opposes.has(hote(site))) ligne = { site, etat: "opposition" };
      else if (contactes.has(hote(site))) ligne = { site, etat: "deja-contacte" };
      else {
        audite = true;
        try {
          const audit = await lancerAudit(site, () => {}, { ia: meta.ia, tunnel: false });
          const note = calculerScore(evaluer(audit.profil, audit.constatsAuto, audit.constatsIA)).note;
          const exclusion = motifExclusion(audit);
          const constats = constatsCertains(audit);
          const dest = destinataire(audit);
          const base = { site, note, manquements: constats.length, audit: audit.id };
          if (exclusion) ligne = { ...base, etat: "exclu", detail: exclusion };
          else if (!constats.length) ligne = { ...base, etat: "conforme" };
          else if (dest && opposes.has(dest.toLowerCase())) ligne = { ...base, etat: "opposition" };
          else {
            const mail = redigerMail(audit, constats, dest, exp);
            const nom = hote(audit.url).replace(/[^a-z0-9.-]/g, "_");
            await fs.writeFile(cheminMail(id, nom, "html"), mail.html);
            await fs.writeFile(cheminMail(id, nom, "txt"), `À : ${dest ?? "(aucune adresse trouvée)"}\nObjet : ${mail.objet}\n\n${mail.texte}`);
            await fs.writeFile(cheminMail(id, nom, "eml"), brouillonEml(mail, exp));
            ligne = { ...base, etat: dest ? "mail" : "sans-adresse", destinataire: dest ?? undefined, objet: mail.objet, fichier: nom };
          }
        } catch (e) {
          ligne = { site, etat: "erreur", detail: (e as Error).message.split("\n")[0] };
        }
      }
      lignes.push(ligne);
      await fs.writeFile(journal, JSON.stringify(lignes, null, 2));
      await ecrireCsv(d, lignes);
      onLigne(ligne, i + 1, meta.sites.length);
      // Une pause entre deux audits, pour ne pas solliciter les sites ni être pris pour un robot agressif.
      if (audite && i < meta.sites.length - 1 && !controle.arreter) await attendre(meta.pause * 1000, controle);
    }
    await fs.writeFile(metaFichier, JSON.stringify({ ...meta, statut: controle.arreter ? "arretee" : "terminee" }, null, 2));
  } finally {
    actives.delete(id);
  }
}

async function attendre(ms: number, controle: { arreter: boolean }) {
  for (let t = 0; t < ms && !controle.arreter; t += 500) await new Promise((r) => setTimeout(r, 500));
}

async function ecrireCsv(d: string, lignes: Ligne[]) {
  const csv = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const entetes = ["site", "etat", "note", "manquements", "destinataire", "objet", "envoye", "audit", "detail"] as const;
  await fs.writeFile(
    path.join(d, "resultats.csv"),
    "﻿" + [entetes.join(";"), ...lignes.map((l) => entetes.map((k) => csv(l[k])).join(";"))].join("\n"),
  );
}
