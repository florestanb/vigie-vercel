import crypto from "node:crypto";
import { lancerAudit } from "../audit";
import { serverless } from "../navigateur";
import { ajouterLigne, avecVerrou, ecrire, lireJson, lireTexte, lister } from "../stockage";
import { declencher } from "../taches";
import { calculerScore, evaluer } from "../rules/engine";
import { brouillonEml, expediteurDepuisEnv, redigerMail } from "./mail";
import { constatsCertains, destinataire, motifExclusion } from "./selection";

/**
 * Campagne de prospection : audit d'une liste de sites, l'un après l'autre, et préparation d'un brouillon de
 * mail pour chaque site qui présente des manquements certains. Rien n'est envoyé : l'envoi se fait à la main,
 * depuis la messagerie, après relecture.
 *
 * Tout est enregistré au fil de l'eau (prospection/<campagne>/), ce qui permet de suivre l'avancement depuis
 * l'interface et de reprendre une campagne interrompue.
 *
 * Une campagne avance par étapes : une étape audite un site. Sur le serveur, chaque étape tourne dans sa
 * propre exécution et déclenche la suivante (voir taches.ts) ; un jeton de « chaîne » garantit qu'une seule
 * suite d'étapes fait avancer une campagne. En ligne de commande, les étapes s'enchaînent dans le processus.
 */

export const RACINE = "prospection";
/** Liste d'opposition : domaines ou adresses de ceux qui ont répondu STOP. Elle vaut pour toutes les campagnes. */
const OPPOSITION = `${RACINE}/opposition.txt`;
/** Au-delà, une étape commencée est considérée comme interrompue (durée maximale d'une exécution, plus une marge). */
const DUREE_MAX_ETAPE_MS = 6 * 60_000;
/** Sans activité depuis ce délai (et sans étape en cours), la chaîne d'étapes s'est arrêtée. */
const SILENCE_MAX_MS = 2 * 60_000;
/** Attente maximale dans une même exécution ; une pause plus longue se fait en plusieurs fois. */
const ATTENTE_MAX_MS = 30_000;

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

type Meta = Omit<Campagne, "lignes" | "statut"> & {
  statut: Campagne["statut"];
  /** Jeton de la suite d'étapes en cours : une étape d'une autre chaîne s'arrête aussitôt. */
  chaine?: string;
  arretDemande?: boolean;
  /** Étape en cours (site en train d'être audité). */
  pas?: { site: string; debut: string };
  /** Dernière activité de la chaîne d'étapes. */
  activite?: string;
  /** Pas d'audit avant cette date (pause entre deux sites). */
  prochain?: string;
};

const ID_VALIDE = /^[\w-]{4,60}$/;
const dossier = (id: string) => {
  if (!ID_VALIDE.test(id)) throw new Error("Campagne inconnue.");
  return `${RACINE}/${id}`;
};
const cleMeta = (id: string) => `${dossier(id)}/meta.json`;
const cleResultats = (id: string) => `${dossier(id)}/resultats.json`;
const hote = (u: string) => new URL(u).hostname.replace(/^www\./, "").toLowerCase();
const age = (iso?: string) => (iso ? Date.now() - Date.parse(iso) : Infinity);

/** La chaîne d'étapes d'une campagne « en cours » est-elle toujours vivante ? */
const chaineVivante = (m: Partial<Meta>) => (m.pas ? age(m.pas.debut) < DUREE_MAX_ETAPE_MS : age(m.activite) < SILENCE_MAX_MS || (!!m.prochain && age(m.prochain) < SILENCE_MAX_MS));

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

export async function chargerCampagne(id: string): Promise<Campagne | null> {
  const lignes = await lireJson<Ligne[] | null>(cleResultats(id), null);
  if (!lignes) return null;
  // Les campagnes lancées avant l'interface n'ont pas de meta.json.
  const meta = await lireJson<Partial<Meta>>(cleMeta(id), {});
  const statut = meta.statut === "en-cours" && !chaineVivante(meta) ? "interrompue" : (meta.statut ?? "terminee");
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
  const ids = (await lister(`${RACINE}/`)).map((e) => e.cle.match(/^prospection\/([\w-]{4,60})\/resultats\.json$/)?.[1]).filter((id): id is string => !!id);
  const campagnes = await Promise.all(ids.map((n) => chargerCampagne(n).catch(() => null)));
  return campagnes.filter((c): c is Campagne => c !== null).sort((a, b) => b.creee.localeCompare(a.creee));
}

export async function lireOpposition(): Promise<Set<string>> {
  return new Set(
    ((await lireTexte(OPPOSITION).catch(() => null)) ?? "")
      .split("\n")
      .map((l) => l.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function ajouterOpposition(valeur: string): Promise<void> {
  const v = valeur.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
  if (!v || v.length > 200 || /\s/.test(v)) throw new Error("Indiquez un domaine ou une adresse e-mail.");
  if ((await lireOpposition()).has(v)) return;
  await ajouterLigne(OPPOSITION, v);
}

/** Domaines déjà contactés (mail marqué envoyé) dans n'importe quelle campagne : on ne leur réécrit pas. */
async function domainesContactes(): Promise<Set<string>> {
  const contactes = new Set<string>();
  for (const c of await listerCampagnes()) for (const l of c.lignes) if (l.envoye) contactes.add(hote(l.site));
  return contactes;
}

export async function marquerEnvoye(id: string, site: string, envoye: boolean): Promise<void> {
  await avecVerrou(`campagne:${id}`, async () => {
    const lignes = await lireJson<Ligne[]>(cleResultats(id), []);
    const ligne = lignes.find((l) => l.site === site);
    if (!ligne) throw new Error("Site introuvable dans la campagne.");
    if (envoye) ligne.envoye = new Date().toISOString();
    else delete ligne.envoye;
    await ecrireResultats(id, lignes);
  });
}

/** Clé d'un fichier de mail, après contrôle du nom (pas de sortie du dossier de la campagne). */
export function cheminMail(id: string, fichier: string, ext: "html" | "txt" | "eml"): string {
  if (!/^[a-z0-9.-]{1,120}$/.test(fichier)) throw new Error("Fichier inconnu.");
  return `${dossier(id)}/mails/${fichier}.${ext}`;
}

// ---------- Exécution ----------

export async function creerCampagne(sites: string[], options: { pause?: number; ia?: boolean } = {}): Promise<string> {
  if (!sites.length) throw new Error("Aucune adresse de site valide.");
  if (sites.length > 500) throw new Error("500 sites au plus par campagne.");
  const creee = new Date().toISOString();
  const id = `${creee.slice(0, 10)}-${crypto.randomBytes(3).toString("hex")}`;
  const meta: Meta = { id, creee, sites, pause: Math.min(Math.max(options.pause ?? 15, 2), 300), ia: options.ia ?? false, statut: "en-cours", activite: creee };
  await ecrire(cleMeta(id), JSON.stringify(meta, null, 2));
  await ecrire(cleResultats(id), "[]");
  return id;
}

async function lireMeta(id: string): Promise<Meta | null> {
  return lireJson<Meta | null>(cleMeta(id), null);
}

async function ecrireMeta(meta: Meta): Promise<void> {
  await ecrire(cleMeta(meta.id), JSON.stringify(meta, null, 2));
}

async function ecrireResultats(id: string, lignes: Ligne[]): Promise<void> {
  await ecrire(cleResultats(id), JSON.stringify(lignes, null, 2));
  const csv = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const entetes = ["site", "etat", "note", "manquements", "destinataire", "objet", "envoye", "audit", "detail"] as const;
  await ecrire(`${dossier(id)}/resultats.csv`, "\ufeff" + [entetes.join(";"), ...lignes.map((l) => entetes.map((k) => csv(l[k])).join(";"))].join("\n"));
}

/** (Re)met la campagne en marche avec une nouvelle chaîne d'étapes. Renvoie son jeton, ou null si rien à faire. */
async function demarrer(id: string, seulementSiArretee = false): Promise<string | null> {
  return avecVerrou(`campagne:${id}`, async () => {
    const meta = await lireMeta(id);
    if (!meta) throw new Error("Campagne inconnue.");
    // Une campagne neuve n'a pas encore de chaîne : elle démarre. Une chaîne vivante n'est pas doublée.
    if (seulementSiArretee && meta.statut === "en-cours" && meta.chaine && chaineVivante(meta)) return null;
    const lignes = await lireJson<Ligne[]>(cleResultats(id), []);
    const faits = new Set(lignes.map((l) => l.site));
    if (meta.sites.every((s) => faits.has(s))) {
      await ecrireMeta({ ...meta, statut: "terminee", pas: undefined, arretDemande: undefined });
      return null;
    }
    const chaine = crypto.randomBytes(8).toString("hex");
    // Une étape encore en cours d'une ancienne chaîne est conservée : la nouvelle attendra qu'elle finisse.
    await ecrireMeta({ ...meta, statut: "en-cours", chaine, arretDemande: undefined, activite: new Date().toISOString(), prochain: undefined });
    return chaine;
  });
}

/** Demande l'arrêt : l'étape en cours se termine, aucune autre ne commence. */
export async function arreterCampagne(id: string): Promise<void> {
  await avecVerrou(`campagne:${id}`, async () => {
    const meta = await lireMeta(id);
    if (!meta || meta.statut !== "en-cours") return;
    // Chaîne déjà éteinte : la campagne s'arrête tout de suite.
    if (!chaineVivante(meta)) await ecrireMeta({ ...meta, statut: "arretee", pas: undefined, arretDemande: undefined, chaine: undefined });
    else await ecrireMeta({ ...meta, arretDemande: true });
  });
}

type Etape =
  | { type: "fini" }
  | { type: "occupe" }
  | { type: "attente"; ms: number }
  | { type: "fait"; ligne: Ligne; rang: number; total: number };

/** Réserve le prochain site à auditer (sous verrou), ou dit pourquoi il n'y en a pas. */
async function reserver(id: string, chaine: string): Promise<{ type: "site"; site: string; rang: number; total: number; meta: Meta } | Exclude<Etape, { type: "fait" }>> {
  return avecVerrou(`campagne:${id}`, async () => {
    const meta = await lireMeta(id);
    if (!meta || meta.statut !== "en-cours" || meta.chaine !== chaine) return { type: "fini" };
    const maintenant = new Date().toISOString();
    if (meta.arretDemande && !meta.pas) {
      await ecrireMeta({ ...meta, statut: "arretee", arretDemande: undefined, chaine: undefined });
      return { type: "fini" };
    }
    const lignes = await lireJson<Ligne[]>(cleResultats(id), []);
    if (meta.pas) {
      if (age(meta.pas.debut) < DUREE_MAX_ETAPE_MS) return { type: "occupe" };
      // Étape précédente interrompue (délai d'exécution dépassé) : le site est noté en erreur, on passe au suivant.
      if (!lignes.some((l) => l.site === meta.pas!.site)) {
        lignes.push({ site: meta.pas.site, etat: "erreur", detail: "Audit interrompu : le site a mis trop de temps à répondre." });
        await ecrireResultats(id, lignes);
      }
      meta.pas = undefined;
      if (meta.arretDemande) {
        await ecrireMeta({ ...meta, statut: "arretee", arretDemande: undefined, chaine: undefined });
        return { type: "fini" };
      }
    }
    const faits = new Set(lignes.map((l) => l.site));
    const i = meta.sites.findIndex((s) => !faits.has(s));
    if (i < 0) {
      await ecrireMeta({ ...meta, statut: "terminee", chaine: undefined, prochain: undefined });
      return { type: "fini" };
    }
    const attente = meta.prochain ? Date.parse(meta.prochain) - Date.now() : 0;
    if (attente > 0) {
      await ecrireMeta({ ...meta, activite: maintenant });
      return { type: "attente", ms: attente };
    }
    const reserve: Meta = { ...meta, pas: { site: meta.sites[i], debut: maintenant }, activite: maintenant, prochain: undefined };
    await ecrireMeta(reserve);
    return { type: "site", site: meta.sites[i], rang: i + 1, total: meta.sites.length, meta: reserve };
  });
}

/** Une étape : audite le prochain site de la campagne et prépare le mail s'il y a lieu. */
export async function traiterSuivant(id: string, chaine: string): Promise<Etape> {
  const r = await reserver(id, chaine);
  if (r.type !== "site") return r;
  const { site, meta } = r;
  const exp = expediteurDepuisEnv();
  const opposes = await lireOpposition();
  const contactes = await domainesContactes();
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
        await ecrire(cheminMail(id, nom, "html"), mail.html);
        await ecrire(cheminMail(id, nom, "txt"), `À : ${dest ?? "(aucune adresse trouvée)"}\nObjet : ${mail.objet}\n\n${mail.texte}`);
        await ecrire(cheminMail(id, nom, "eml"), brouillonEml(mail, exp));
        ligne = { ...base, etat: dest ? "mail" : "sans-adresse", destinataire: dest ?? undefined, objet: mail.objet, fichier: nom };
      }
    } catch (e) {
      ligne = { site, etat: "erreur", detail: (e as Error).message.split("\n")[0] };
    }
  }
  await avecVerrou(`campagne:${id}`, async () => {
    const lignes = await lireJson<Ligne[]>(cleResultats(id), []);
    if (!lignes.some((l) => l.site === site)) lignes.push(ligne);
    await ecrireResultats(id, lignes);
    const actuelle = (await lireMeta(id)) ?? meta;
    const maintenant = Date.now();
    // Une pause entre deux audits, pour ne pas solliciter les sites ni être pris pour un robot agressif.
    await ecrireMeta({
      ...actuelle,
      pas: undefined,
      activite: new Date(maintenant).toISOString(),
      prochain: audite ? new Date(maintenant + actuelle.pause * 1000).toISOString() : undefined,
    });
  });
  return { type: "fait", ligne, rang: r.rang, total: r.total };
}

/**
 * Exécute (ou reprend) une campagne jusqu'au bout dans ce processus (ligne de commande).
 * Les sites déjà traités sont sautés. `onLigne` est appelé après chaque site.
 */
export async function executerCampagne(id: string, onLigne: (l: Ligne, rang: number, total: number) => void = () => {}): Promise<void> {
  const chaine = await demarrer(id);
  if (!chaine) return;
  for (;;) {
    const r = await traiterSuivant(id, chaine);
    if (r.type === "fini") return;
    if (r.type === "occupe") throw new Error("Cette campagne est déjà en cours.");
    if (r.type === "attente") await new Promise((ok) => setTimeout(ok, Math.min(r.ms, 2000)));
    else onLigne(r.ligne, r.rang, r.total);
  }
}

/** Lance (ou reprend) la campagne sur le serveur : la première étape part dans une exécution séparée. */
export async function lancerCampagne(id: string): Promise<void> {
  const chaine = await demarrer(id, true);
  if (chaine) await declencher({ type: "campagne", id, chaine });
}

/** Étape exécutée par la route interne : un site (ou une partie de la pause), puis déclenche la suivante. */
export async function etapeEnFond(id: string, chaine: string): Promise<void> {
  const r = await traiterSuivant(id, chaine);
  if (r.type === "fini" || r.type === "occupe") return;
  if (r.type === "attente") await new Promise((ok) => setTimeout(ok, Math.min(r.ms, serverless() ? ATTENTE_MAX_MS : r.ms)));
  await declencher({ type: "campagne", id, chaine });
}

/** Tournée : relance les campagnes « en cours » dont la chaîne d'étapes s'est interrompue. */
export async function relancerCampagnes(): Promise<number> {
  let n = 0;
  for (const c of await listerCampagnes()) {
    if (c.statut !== "interrompue") continue;
    const meta = await lireMeta(c.id);
    if (meta?.statut !== "en-cours") continue;
    await lancerCampagne(c.id);
    n++;
  }
  return n;
}
