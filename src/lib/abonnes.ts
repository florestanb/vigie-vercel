import crypto from "node:crypto";
import { abonnementActif, accesDomaine, chargerCompte, listerComptes, modifierCompte, offreAbonnement, type Compte, type Marque } from "./comptes";
import type { Offre } from "./offres";

/**
 * Fonctions réservées aux abonnés : documents hébergés, marque blanche (rapports au nom de l'agence) et API.
 */

/** Formule de l'abonnement en cours, ou null. */
export function formule(c: Compte | null): Offre | null {
  const abo = c && abonnementActif(c);
  return abo ? offreAbonnement(abo) : null;
}

/** Le compte peut-il héberger les documents de ce site ? */
export function peutHeberger(c: Compte | null, domaine: string): boolean {
  return !!formule(c)?.hebergement && accesDomaine(c, domaine).documents;
}

/** Marque à appliquer aux rapports et dossiers produits pour ce compte (offres agence seulement). */
export function marqueDe(c: Compte | null): Marque | null {
  return formule(c)?.marqueBlanche && c?.marque?.nom ? c.marque : null;
}

const LOGO = /^data:image\/(png|jpeg|svg\+xml);base64,[A-Za-z0-9+/=]+$/;

export async function enregistrerMarque(compteId: string, saisie: Partial<Marque>): Promise<Marque> {
  const nom = String(saisie.nom ?? "").trim().slice(0, 80);
  if (!nom) throw new Error("Indiquez le nom qui apparaîtra sur les rapports.");
  const logo = saisie.logo ? String(saisie.logo) : undefined;
  if (logo && (!LOGO.test(logo) || logo.length > 280_000)) throw new Error("Logo invalide : PNG, JPEG ou SVG de 200 Ko au plus.");
  const couleur = saisie.couleur && /^#[0-9a-f]{6}$/i.test(saisie.couleur) ? saisie.couleur : undefined;
  const contact = saisie.contact ? String(saisie.contact).trim().slice(0, 120) : undefined;
  const marque: Marque = { nom, ...(logo ? { logo } : {}), ...(couleur ? { couleur } : {}), ...(contact ? { contact } : {}) };
  await modifierCompte(compteId, (c) => {
    if (!formule(c)?.marqueBlanche) throw new Error("La marque blanche fait partie des offres Agence.");
    c.marque = marque;
  });
  return marque;
}

// ---------- Clés d'API ----------

const empreinteCle = (cle: string) => crypto.createHash("sha256").update(cle).digest("hex");

/** Crée (ou remplace) la clé d'API du compte. La clé n'est renvoyée qu'ici : seule son empreinte est gardée. */
export async function creerCleApi(compteId: string): Promise<string> {
  const cle = `vg_${crypto.randomBytes(24).toString("base64url")}`;
  await modifierCompte(compteId, (c) => {
    if (!formule(c)?.api) throw new Error("L'accès par API fait partie des offres Agence.");
    c.api = { empreinte: empreinteCle(cle), cree: new Date().toISOString(), apercu: `${cle.slice(0, 7)}…${cle.slice(-4)}` };
  });
  return cle;
}

export async function revoquerCleApi(compteId: string): Promise<void> {
  await modifierCompte(compteId, (c) => void delete c.api);
}

/** Compte correspondant à l'en-tête « Authorization: Bearer vg_… », s'il a toujours droit à l'API. */
export async function compteParCleApi(req: Request): Promise<Compte | null> {
  const cle = req.headers.get("authorization")?.match(/^Bearer\s+(vg_[\w-]{20,60})$/)?.[1];
  if (!cle) return null;
  const e = empreinteCle(cle);
  for (const id of await listerComptes()) {
    const c = await chargerCompte(id);
    const attendu = c?.api?.empreinte;
    if (attendu && crypto.timingSafeEqual(Buffer.from(attendu), Buffer.from(e))) return formule(c)?.api ? c : null;
  }
  return null;
}

// ---------- Import CSV ----------

/** Adresses de sites lues dans un fichier CSV ou une liste collée : première colonne, ou toute cellule qui ressemble à une adresse. */
export function sitesDepuisCsv(texte: string): string[] {
  const sites = new Set<string>();
  for (const ligne of texte.split(/\r?\n/).slice(0, 2000)) {
    for (const cellule of ligne.split(/[;,\t]/)) {
      const v = cellule.trim().replace(/^"|"$/g, "");
      if (/^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(v)) {
        sites.add(v);
        break;
      }
    }
  }
  return [...sites];
}

/** Échappe une cellule pour un export CSV (séparateur « ; », lisible par Excel en français). */
export const celluleCsv = (v: unknown) => {
  // Une cellule qui commence par = + - @ serait lue comme une formule par le tableur.
  const s = typeof v === "number" ? String(v) : String(v ?? "").replace(/^([=+\-@])/, "'$1");
  return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
