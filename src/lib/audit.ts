import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { crawler } from "./crawler/crawler";
import { DOSSIER_AUDITS, RACINE_DONNEES } from "./donnees";
import { EDITEUR } from "./editeur";
import { rechercherEntreprise } from "./entreprise";
import { desindexer, indexerAudit } from "./historique";
import { analyserAvecClaude } from "./ia/analyse";
import { iaDisponible, messageErreurIA } from "./ia/client";
import { profilDepuisCrawl } from "./profil";
import { CATALOGUE } from "./rules/catalogue";
import { executerChecks } from "./rules/checks";
import type { Audit } from "./types";

const CHECKS = [...new Set(CATALOGUE.map((r) => r.check).filter(Boolean) as string[])];
const DOSSIER = DOSSIER_AUDITS;

export interface OptionsAudit {
  /** false : audit automatique seul, sans lecture des textes par Claude (plus rapide, sans coût d'API). */
  ia?: boolean;
  /** false : pas de parcours du tunnel de commande. */
  tunnel?: boolean;
}

export async function lancerAudit(url: string, onEtape: (m: string) => void = () => {}, options: OptionsAudit = {}): Promise<Audit> {
  const { capturesBrutes, ...crawl } = await crawler(url, { onEtape, tunnel: options.tunnel });

  onEtape("Vérification de l'entreprise au répertoire Sirene");
  const entreprise = crawl.identite.siren[0] ? await rechercherEntreprise(crawl.identite.siren[0]) : null;

  const constatsAuto = executerChecks(crawl, entreprise, CHECKS);
  const profilDetecte = profilDepuisCrawl(crawl, entreprise);

  const audit: Audit = {
    id: crypto.randomBytes(9).toString("base64url"),
    url: crawl.urlFinale,
    date: new Date().toISOString(),
    crawl,
    profilDetecte,
    profil: profilDetecte,
    entreprise,
    constatsAuto,
    constatsIA: {},
    resumeIA: null,
    iaDisponible: iaDisponible() && options.ia !== false,
  };

  if (audit.iaDisponible) {
    onEtape("Lecture des textes légaux par Claude");
    try {
      const ia = await analyserAvecClaude(crawl, profilDetecte, entreprise);
      audit.profil = { ...profilDetecte, ...ia.profil };
      audit.constatsIA = ia.constats;
      audit.resumeIA = ia.resume;
    } catch (e) {
      audit.iaErreur = messageErreurIA(e);
    }
  }

  await enregistrerCaptures(audit.id, capturesBrutes);
  await enregistrer(audit);
  return audit;
}

/** Captures d'écran d'un audit, gardées à côté de lui (data/captures/<audit>/<nom>.jpg) et supprimées avec lui. */
export const DOSSIER_CAPTURES = path.join(RACINE_DONNEES, "captures");

async function enregistrerCaptures(auditId: string, captures: Record<string, Buffer>): Promise<void> {
  if (!Object.keys(captures).length) return;
  const dossier = path.join(DOSSIER_CAPTURES, auditId);
  await fs.mkdir(dossier, { recursive: true });
  for (const [nom, image] of Object.entries(captures)) await fs.writeFile(path.join(dossier, `${nom}.jpg`), image);
}

export async function lireCapture(auditId: string, nom: string): Promise<Buffer | null> {
  if (!/^[\w-]{6,40}$/.test(auditId) || !/^[a-z-]{2,30}$/.test(nom)) return null;
  return fs.readFile(path.join(DOSSIER_CAPTURES, auditId, `${nom}.jpg`)).catch(() => null);
}

/** Toutes les captures d'un audit, par nom. */
export async function lireCaptures(audit: Audit): Promise<Record<string, Buffer>> {
  const r: Record<string, Buffer> = {};
  for (const c of audit.crawl.captures ?? []) {
    const image = await lireCapture(audit.id, c.nom);
    if (image) r[c.nom] = image;
  }
  return r;
}

/**
 * Lecture des textes par Claude sur un audit déjà fait (audit gratuit puis débloqué) : précise les constats
 * « à vérifier ». Sans effet si elle a déjà eu lieu.
 */
export async function approfondirAudit(id: string): Promise<Audit | null> {
  const audit = await chargerAudit(id);
  if (!audit || !iaDisponible() || (audit.iaDisponible && !audit.iaErreur)) return audit;
  try {
    const ia = await analyserAvecClaude(audit.crawl, audit.profilDetecte, audit.entreprise);
    audit.profil = { ...audit.profilDetecte, ...ia.profil };
    audit.constatsIA = ia.constats;
    audit.resumeIA = ia.resume;
    audit.iaDisponible = true;
    delete audit.iaErreur;
  } catch (e) {
    audit.iaErreur = messageErreurIA(e);
  }
  await enregistrer(audit);
  return audit;
}

export async function enregistrer(audit: Audit): Promise<void> {
  await fs.mkdir(DOSSIER, { recursive: true });
  await fs.writeFile(path.join(DOSSIER, `${audit.id}.json`), JSON.stringify(audit));
  await indexerAudit(audit).catch(() => {});
  purger().catch(() => {});
}

export interface Approbation {
  date: string;
  type: string;
  /** SHA-256 du texte approuvé : prouve quelle version exacte le client a validée. */
  empreinte: string;
  caracteres: number;
}

/**
 * Trace de l'approbation d'un modèle par le client avant export. Conservée à part des audits (qui sont
 * purgés) pendant le délai de prescription entre commerçants (5 ans, C. com. art. L110-4) : c'est la preuve
 * que le document a été relu et validé par le client. Elle ne contient aucune donnée personnelle.
 */
export async function enregistrerApprobation(auditId: string, type: string, texte: string): Promise<Approbation> {
  const approbation: Approbation = {
    date: new Date().toISOString(),
    type,
    empreinte: crypto.createHash("sha256").update(texte, "utf8").digest("hex"),
    caracteres: texte.length,
  };
  const dossier = path.join(RACINE_DONNEES, "approbations");
  await fs.mkdir(dossier, { recursive: true });
  await fs.appendFile(path.join(dossier, `${auditId}.jsonl`), JSON.stringify(approbation) + "\n");
  return approbation;
}

/** Supprime les audits plus anciens que la durée de conservation annoncée dans la politique de confidentialité. */
export async function purger(): Promise<number> {
  const limite = Date.now() - EDITEUR.conservationAuditsMois * 30.44 * 86_400_000;
  const supprimes: string[] = [];
  for (const f of await fs.readdir(DOSSIER)) {
    if (!f.endsWith(".json")) continue;
    const chemin = path.join(DOSSIER, f);
    if ((await fs.stat(chemin)).mtimeMs < limite) {
      await fs.unlink(chemin);
      await fs.rm(path.join(DOSSIER_CAPTURES, f.slice(0, -5)), { recursive: true, force: true });
      supprimes.push(f.slice(0, -5));
    }
  }
  await desindexer(supprimes).catch(() => {});
  return supprimes.length;
}

export async function chargerAudit(id: string): Promise<Audit | null> {
  if (!/^[\w-]{6,40}$/.test(id)) return null;
  try {
    return actualiser(JSON.parse(await fs.readFile(path.join(DOSSIER, `${id}.json`), "utf8")) as Audit);
  } catch {
    return null;
  }
}

/**
 * Rejoue les vérifications automatiques et la déduction du profil sur le crawl enregistré,
 * pour qu'un audit ancien profite des contrôles corrigés depuis. Le profil affiné par Claude est conservé.
 */
function actualiser(audit: Audit): Audit {
  const profilDetecte = profilDepuisCrawl(audit.crawl, audit.entreprise);
  const profilAffine = JSON.stringify(audit.profil) !== JSON.stringify(audit.profilDetecte);
  return {
    ...audit,
    constatsAuto: executerChecks(audit.crawl, audit.entreprise, CHECKS),
    profilDetecte,
    profil: profilAffine ? audit.profil : profilDetecte,
  };
}
