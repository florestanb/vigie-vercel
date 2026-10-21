import crypto from "node:crypto";
import type { TypeDocument } from "./documents/plans";
import { PLANS } from "./documents/plans";
import { DERNIERE_MISE_A_JOUR } from "./rules/catalogue";
import { ecrire as ecrireFichier, lireJson, lireTexte, lister, supprimer } from "./stockage";

/**
 * Documents hébergés : le client intègre une fois un document approuvé à son site (lien, cadre ou script),
 * et Vigie sert ensuite la dernière version qu'il a approuvée. Quand le registre change sur une règle du
 * document, il est marqué « à mettre à jour » et le client est prévenu : il génère et approuve la nouvelle
 * version, qui remplace l'ancienne sur son site sans qu'il ait à y toucher.
 *
 * Vigie ne publie jamais un texte que le client n'a pas approuvé : la version servie est toujours la
 * dernière version approuvée, avec la date et l'empreinte de cette approbation.
 */

export interface VersionHebergee {
  texte: string;
  /** SHA-256 du texte : la même empreinte que celle enregistrée à l'approbation. */
  empreinte: string;
  approuve: string;
  audit: string;
  /** Date du registre des obligations au moment de l'approbation. */
  registre: string;
}

export interface DocumentHeberge {
  /** Identifiant public, dans l'adresse du document : imprévisible, il ne révèle ni le client ni le site. */
  id: string;
  compte: string;
  domaine: string;
  type: TypeDocument;
  cree: string;
  version: VersionHebergee;
  /** Versions précédentes (sans le texte) : historique pour le dossier de preuve. */
  historique: Omit<VersionHebergee, "texte">[];
  /** Le registre a changé sur une règle de ce document depuis la dernière approbation. */
  aMettreAJour?: { depuis: string; regles: string[] };
}

const empreinte = (texte: string) => crypto.createHash("sha256").update(texte, "utf8").digest("hex");
const fichier = (id: string) => {
  if (!/^[\w-]{16,40}$/.test(id)) throw new Error("Document inconnu.");
  return `documents-heberges/${id}.json`;
};

export async function chargerHeberge(id: string): Promise<DocumentHeberge | null> {
  try {
    return await lireJson<DocumentHeberge | null>(fichier(id), null);
  } catch {
    return null;
  }
}

async function ecrire(d: DocumentHeberge): Promise<void> {
  await ecrireFichier(fichier(d.id), JSON.stringify(d));
}

export async function tousLesHeberges(): Promise<DocumentHeberge[]> {
  const liste: DocumentHeberge[] = [];
  for (const { cle } of await lister("documents-heberges/").catch(() => [])) {
    const id = cle.match(/^documents-heberges\/([\w-]+)\.json$/)?.[1];
    if (!id) continue;
    const d = await chargerHeberge(id);
    if (d) liste.push(d);
  }
  return liste;
}

export async function hebergesDuCompte(compte: string): Promise<DocumentHeberge[]> {
  return (await tousLesHeberges()).filter((d) => d.compte === compte).sort((a, b) => a.domaine.localeCompare(b.domaine) || a.type.localeCompare(b.type));
}

/** Le texte a-t-il été approuvé par le client, pour cet audit et ce type de document ? */
export async function estApprouve(auditId: string, type: string, texte: string): Promise<{ date: string } | null> {
  if (!/^[\w-]{6,40}$/.test(auditId)) return null;
  const e = empreinte(texte);
  const lignes = ((await lireTexte(`approbations/${auditId}.jsonl`).catch(() => null)) ?? "").split("\n");
  for (const l of lignes.reverse()) {
    try {
      const a = JSON.parse(l) as { date: string; type: string; empreinte: string };
      if (a.type === type && a.empreinte === e) return { date: a.date };
    } catch {
      /* ligne vide */
    }
  }
  return null;
}

/**
 * Publie (ou met à jour) la version hébergée d'un document approuvé. Un même compte a un seul document
 * hébergé par site et par type : son adresse ne change jamais, seule la version servie change.
 */
export async function publierHeberge(compte: string, domaine: string, type: TypeDocument, auditId: string, texte: string): Promise<DocumentHeberge> {
  const approbation = await estApprouve(auditId, type, texte);
  if (!approbation) throw new Error("Seule une version que vous avez approuvée peut être publiée.");
  const version: VersionHebergee = { texte, empreinte: empreinte(texte), approuve: approbation.date, audit: auditId, registre: DERNIERE_MISE_A_JOUR };
  const existant = (await hebergesDuCompte(compte)).find((d) => d.domaine === domaine && d.type === type);
  if (existant) {
    if (existant.version.empreinte !== version.empreinte) {
      const { texte: _ancien, ...trace } = existant.version;
      existant.historique.push(trace);
    }
    existant.version = version;
    delete existant.aMettreAJour;
    await ecrire(existant);
    return existant;
  }
  const d: DocumentHeberge = { id: crypto.randomBytes(12).toString("base64url"), compte, domaine, type, cree: new Date().toISOString(), version, historique: [] };
  await ecrire(d);
  return d;
}

export async function retirerHeberge(compte: string, id: string): Promise<void> {
  const d = await chargerHeberge(id);
  if (d?.compte === compte) await supprimer(fichier(id));
}

/** Marque « à mettre à jour » les documents touchés par des règles modifiées du registre. Renvoie les documents marqués. */
export async function signalerMiseAJour(reglesParType: Partial<Record<TypeDocument, string[]>>): Promise<DocumentHeberge[]> {
  const marques: DocumentHeberge[] = [];
  for (const d of await tousLesHeberges()) {
    const regles = reglesParType[d.type];
    if (!regles?.length) continue;
    d.aMettreAJour = { depuis: d.aMettreAJour?.depuis ?? new Date().toISOString(), regles: [...new Set([...(d.aMettreAJour?.regles ?? []), ...regles])] };
    await ecrire(d);
    marques.push(d);
  }
  return marques;
}

export const titreDocument = (d: DocumentHeberge) => PLANS[d.type].titre;

/** Codes d'intégration à coller une fois sur le site du client. */
export function codesIntegration(origine: string, d: DocumentHeberge) {
  const url = `${origine}/d/${d.id}`;
  return {
    lien: url,
    cadre: `<iframe src="${url}?integre=1" title="${titreDocument(d)}" style="width:100%;min-height:80vh;border:0"></iframe>`,
    script: `<div data-vigie-document="${d.id}"></div><script src="${url}/integration.js" async></script>`,
  };
}
