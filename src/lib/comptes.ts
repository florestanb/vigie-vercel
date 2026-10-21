import crypto from "node:crypto";
import path from "node:path";
import { RACINE_DONNEES } from "./donnees";
import { avecVerrou, creerSiAbsent, ecrire, lireJson, lister } from "./stockage";
import { OFFRES, offreDe, type IdAbonnement, type IdOffre } from "./offres";

/**
 * Comptes clients, sans mot de passe : un compte = une adresse e-mail. Il est créé au premier paiement
 * (ou à la première connexion par lien) et porte les droits achetés.
 *
 * Stockage : un fichier JSON par compte (comptes/<id>.json). Les écritures d'un même compte sont sérialisées,
 * y compris entre instances du serveur (verrou en base).
 */

/** Dossier des comptes en mode fichiers (sans base de données). */
export const DOSSIER_COMPTES = path.join(RACINE_DONNEES, "comptes");
const JOUR = 86_400_000;

/** Achat unique : un nombre de sites, débloqués au fil de l'eau, pendant une durée limitée. */
export interface Droit {
  /** Identifiant de la session de paiement Stripe : rend l'attribution idempotente. */
  id: string;
  /** « ponctuel » (les achats de l'ancienne grille gardent leur identifiant et valent un audit ponctuel). */
  offre: string;
  achete: string;
  expire: string;
  domaines: string[];
  /** Paiement Stripe (payment_intent) : sert à retrouver l'achat en cas de remboursement. */
  paiement?: string;
  /** Date du remboursement : l'achat ne donne plus accès à rien. */
  rembourse?: string;
  /** Le rappel « vos accès expirent bientôt » a été envoyé. */
  rappelEnvoye?: boolean;
}

export interface Abonnement {
  id: string;
  /** Formule souscrite (absente sur les abonnements de l'ancienne grille : elle vaut alors « agence »). */
  offre?: IdAbonnement;
  /** Statut Stripe : active, trialing, past_due, canceled, unpaid… */
  statut: string;
  debutPeriode: string;
  finPeriode: string;
  resilieFinPeriode: boolean;
  /** Domaines analysés pendant la période en cours (quota mensuel). */
  domainesPeriode: string[];
}

export interface SiteSuivi {
  domaine: string;
  url: string;
  ajoute: string;
  historique: { audit: string; date: string; note: number; illegaux: number }[];
  /** Date du dernier lancement d'audit par la tournée (évite de relancer un audit encore en cours). */
  lance?: string;
}

export interface Compte {
  id: string;
  email: string;
  cree: string;
  stripeClient?: string;
  droits: Droit[];
  abonnement?: Abonnement;
  sitesSuivis: SiteSuivi[];
  /** Dernier audit de chaque site débloqué, pour y revenir depuis le compte. */
  audits?: Record<string, { id: string; date: string }>;
  /** Marque blanche (offres agence) : rapports et dossiers au nom du client. */
  marque?: Marque;
  /** Empreinte SHA-256 de la clé d'API (la clé elle-même n'est montrée qu'une fois) et date de création. */
  api?: { empreinte: string; cree: string; apercu: string };
  /** Alertes « nouvelle obligation » déjà envoyées (identifiant de règle et version), pour ne pas les répéter. */
  alertesLoi?: string[];
}

export interface Marque {
  nom: string;
  /** Logo en data URL (PNG, JPEG ou SVG), 200 Ko au plus. */
  logo?: string;
  /** Couleur principale, au format #rrggbb. */
  couleur?: string;
  /** Coordonnées affichées au pied des rapports (site, e-mail ou téléphone de l'agence). */
  contact?: string;
}

/** Formule de l'abonnement (offre « agence » pour les abonnements de l'ancienne grille). */
export const offreAbonnement = (a: Abonnement) => offreDe(a.offre, "agence");

export const normaliserEmail = (e: string) => e.trim().toLowerCase();
export const idDeEmail = (email: string) => crypto.createHash("sha256").update(normaliserEmail(email)).digest("hex").slice(0, 24);
export const domaineDe = (url: string) => new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`).hostname.replace(/^www\./, "").toLowerCase();
export const emailValide = (e: string) => /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i.test(e.trim());

const fichier = (id: string) => {
  if (!/^[a-f0-9]{24}$/.test(id)) throw new Error("Compte inconnu.");
  return `comptes/${id}.json`;
};

export async function chargerCompte(id: string): Promise<Compte | null> {
  try {
    return await lireJson<Compte | null>(fichier(id), null);
  } catch {
    return null;
  }
}

/** Identifiants de tous les comptes. */
export async function listerComptes(): Promise<string[]> {
  return (await lister("comptes/")).map((e) => e.cle.match(/^comptes\/([a-f0-9]{24})\.json$/)?.[1]).filter((id): id is string => !!id);
}

/** Lit, modifie et réécrit un compte, sans que deux modifications du même compte se chevauchent. */
export async function modifierCompte(id: string, modif: (c: Compte) => void | Promise<void>): Promise<Compte> {
  return avecVerrou(`compte:${id}`, async () => {
    const c = await chargerCompte(id);
    if (!c) throw new Error("Compte introuvable.");
    await modif(c);
    await ecrire(fichier(id), JSON.stringify(c, null, 2));
    return c;
  });
}

export async function trouverOuCreerCompte(email: string): Promise<Compte> {
  if (!emailValide(email)) throw new Error("Adresse e-mail invalide.");
  const id = idDeEmail(email);
  const existant = await chargerCompte(id);
  if (existant) return existant;
  const compte: Compte = { id, email: normaliserEmail(email), cree: new Date().toISOString(), droits: [], sitesSuivis: [] };
  // Si deux requêtes créent le même compte en même temps, la seconde relit celui de la première.
  await creerSiAbsent(fichier(id), JSON.stringify(compte, null, 2));
  return (await chargerCompte(id)) ?? compte;
}

/** Retrouve le compte d'un client Stripe (abonnements : les événements ne portent que l'identifiant client). */
export async function compteParClientStripe(client: string): Promise<Compte | null> {
  for (const id of await listerComptes()) {
    const c = await chargerCompte(id);
    if (c?.stripeClient === client) return c;
  }
  return null;
}

// ---------- Droits ----------

export function droitsActifs(c: Compte, maintenant = Date.now()): Droit[] {
  return c.droits.filter((d) => !d.rembourse && Date.parse(d.expire) > maintenant);
}

export function abonnementActif(c: Compte, maintenant = Date.now()): Abonnement | null {
  const a = c.abonnement;
  if (!a || !["active", "trialing", "past_due"].includes(a.statut)) return null;
  // Un jour de grâce : le renouvellement peut arriver quelques heures après la fin de période.
  return Date.parse(a.finPeriode) + JOUR > maintenant ? a : null;
}

export interface Acces {
  /** Rapport complet visible. */
  complet: boolean;
  /** Génération des documents autorisée. */
  documents: boolean;
  /** Si le site n'est pas encore débloqué : ce que le client peut encore débloquer avec ses achats en cours. */
  deblocable?: { source: string; restants: number; total: number; documents: boolean };
}

/** Ce que le compte peut voir et faire pour un domaine. */
export function accesDomaine(c: Compte | null, domaine: string, maintenant = Date.now()): Acces {
  if (!c) return { complet: false, documents: false };
  const droits = droitsActifs(c, maintenant);
  const abo = abonnementActif(c, maintenant);
  const couvrants = droits.filter((d) => d.domaines.includes(domaine));
  if (abo?.domainesPeriode.includes(domaine)) return { complet: true, documents: true };
  if (couvrants.length) return { complet: true, documents: couvrants.some((d) => offreDe(d.offre).documents) };

  // Pas encore débloqué : on propose la source la plus généreuse qui a de la place.
  const quota = abo ? offreAbonnement(abo).sites : 0;
  const candidats = [
    ...(abo && abo.domainesPeriode.length < quota ? [{ source: "abonnement", restants: quota - abo.domainesPeriode.length, total: quota, documents: true }] : []),
    ...droits
      .filter((d) => d.domaines.length < offreDe(d.offre).sites)
      .map((d) => ({ source: d.id, restants: offreDe(d.offre).sites - d.domaines.length, total: offreDe(d.offre).sites, documents: offreDe(d.offre).documents })),
  ].sort((a, b) => Number(b.documents) - Number(a.documents));
  return { complet: false, documents: false, deblocable: candidats[0] };
}

/** Débloque un domaine sur la meilleure source disponible (ou sur celle indiquée). */
export async function debloquerDomaine(compteId: string, domaine: string, source?: string): Promise<Acces> {
  const compte = await modifierCompte(compteId, (c) => {
    const acces = accesDomaine(c, domaine);
    if (acces.complet) return;
    const choix = source ?? acces.deblocable?.source;
    if (!choix) throw new Error("Aucun achat en cours ne permet de débloquer un site de plus.");
    if (choix === "abonnement") {
      const abo = abonnementActif(c);
      if (!abo || abo.domainesPeriode.length >= offreAbonnement(abo).sites) throw new Error("Quota mensuel atteint.");
      abo.domainesPeriode.push(domaine);
      return;
    }
    const droit = droitsActifs(c).find((d) => d.id === choix);
    if (!droit || droit.domaines.length >= offreDe(droit.offre).sites) throw new Error("Cet achat ne permet plus de débloquer de site.");
    droit.domaines.push(domaine);
  });
  return accesDomaine(compte, domaine);
}

/** Ajoute un achat unique (idempotent : rejouer le même paiement ne crée pas de second droit). */
export async function ajouterDroit(
  compteId: string,
  idPaiement: string,
  offre: Exclude<IdOffre, IdAbonnement>,
  date = new Date(),
  paiement?: string,
): Promise<Droit | null> {
  let cree: Droit | null = null;
  await modifierCompte(compteId, (c) => {
    if (c.droits.some((d) => d.id === idPaiement)) return;
    cree = {
      id: idPaiement,
      offre,
      achete: date.toISOString(),
      expire: new Date(date.getTime() + (OFFRES[offre].dureeJours ?? 30) * JOUR).toISOString(),
      domaines: [],
      ...(paiement ? { paiement } : {}),
    };
    c.droits.push(cree);
  });
  // Renvoie le droit seulement s'il vient d'être créé : l'e-mail de confirmation part une seule fois.
  return cree;
}

/** Remboursement : l'achat correspondant cesse immédiatement de donner accès. */
export async function revoquerPaiement(compteId: string, paiement: string): Promise<boolean> {
  let trouve = false;
  await modifierCompte(compteId, (c) => {
    for (const d of c.droits) {
      if (d.paiement === paiement && !d.rembourse) {
        d.rembourse = new Date().toISOString();
        trouve = true;
      }
    }
  });
  return trouve;
}

/** Retient le dernier audit d'un site débloqué (lien « Voir le rapport » du compte). */
export async function retenirAudit(compteId: string, domaine: string, auditId: string, date = new Date().toISOString()): Promise<void> {
  await modifierCompte(compteId, (c) => {
    c.audits ??= {};
    const actuel = c.audits[domaine];
    if (!actuel || actuel.date <= date) c.audits[domaine] = { id: auditId, date };
  });
}

/** Met à jour l'abonnement ; une nouvelle période remet le quota mensuel à zéro. */
export async function majAbonnement(compteId: string, a: Omit<Abonnement, "domainesPeriode">): Promise<void> {
  await modifierCompte(compteId, (c) => {
    const memePeriode = c.abonnement?.id === a.id && c.abonnement.debutPeriode === a.debutPeriode;
    c.abonnement = { ...a, domainesPeriode: memePeriode ? c.abonnement!.domainesPeriode : [] };
  });
}
