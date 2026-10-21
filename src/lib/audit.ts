import crypto from "node:crypto";
import { crawler } from "./crawler/crawler";
import { EDITEUR } from "./editeur";
import { rechercherEntreprise } from "./entreprise";
import { desindexer, indexerAudit } from "./historique";
import { analyserAvecClaude } from "./ia/analyse";
import { iaDisponible, messageErreurIA } from "./ia/client";
import { profilDepuisCrawl } from "./profil";
import { CATALOGUE } from "./rules/catalogue";
import { executerChecks } from "./rules/checks";
import { ajouterLigne, ecrire, lire, lireTexte, lister, supprimer, supprimerDossier } from "./stockage";
import type { Audit } from "./types";

const CHECKS = [...new Set(CATALOGUE.map((r) => r.check).filter(Boolean) as string[])];
const cleAudit = (id: string) => `audits/${id}.json`;

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

/** Captures d'écran d'un audit, gardées à côté de lui (captures/<audit>/<nom>.jpg) et supprimées avec lui. */
async function enregistrerCaptures(auditId: string, captures: Record<string, Buffer>): Promise<void> {
  for (const [nom, image] of Object.entries(captures)) await ecrire(`captures/${auditId}/${nom}.jpg`, image);
}

export async function lireCapture(auditId: string, nom: string): Promise<Buffer | null> {
  if (!/^[\w-]{6,40}$/.test(auditId) || !/^[a-z-]{2,30}$/.test(nom)) return null;
  return lire(`captures/${auditId}/${nom}.jpg`).catch(() => null);
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
  await ecrire(cleAudit(audit.id), JSON.stringify(audit));
  await indexerAudit(audit).catch(() => {});
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
  await ajouterLigne(`approbations/${auditId}.jsonl`, JSON.stringify(approbation));
  return approbation;
}

/**
 * Supprime les audits plus anciens que la durée de conservation annoncée dans la politique de confidentialité.
 * Appelée par la tournée quotidienne (et non plus à chaque audit : lister tous les audits coûte une requête).
 */
export async function purger(): Promise<number> {
  const limite = Date.now() - EDITEUR.conservationAuditsMois * 30.44 * 86_400_000;
  const supprimes: string[] = [];
  for (const { cle, modifie } of await lister("audits/")) {
    const id = cle.match(/^audits\/([\w-]+)\.json$/)?.[1];
    if (!id || modifie.getTime() >= limite) continue;
    await supprimer(cle);
    await supprimerDossier(`captures/${id}`);
    supprimes.push(id);
  }
  await desindexer(supprimes).catch(() => {});
  return supprimes.length;
}

export async function chargerAudit(id: string): Promise<Audit | null> {
  if (!/^[\w-]{6,40}$/.test(id)) return null;
  try {
    const texte = await lireTexte(cleAudit(id));
    return texte ? actualiser(JSON.parse(texte) as Audit) : null;
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

/** Fichier d'audit tel qu'il est conservé (pour en calculer l'empreinte dans le dossier de preuve). */
export async function lireFichierAudit(id: string): Promise<Buffer | null> {
  return /^[\w-]{6,40}$/.test(id) ? lire(cleAudit(id)).catch(() => null) : null;
}
