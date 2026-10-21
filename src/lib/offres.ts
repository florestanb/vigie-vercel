/**
 * Offres payantes de Vigie : source unique pour la page Tarifs, le paiement, les droits d'accès et les CGV.
 * Aucune donnée secrète ici : le fichier est aussi utilisé côté navigateur.
 *
 * Une offre ponctuelle, et trois abonnements : un site, ou une agence qui gère les sites de ses clients.
 */

export type IdAbonnement = "site" | "agence" | "agence-plus";
export type IdOffre = "ponctuel" | IdAbonnement;

export interface Offre {
  id: IdOffre;
  nom: string;
  accroche: string;
  /** Prix en euros, tel que payé par le client. */
  prix: number;
  periode: "unique" | "mois";
  /** Nombre de sites différents couverts (par achat, ou par mois pour un abonnement). */
  sites: number;
  /** Durée d'accès d'un achat unique, en jours. */
  dureeJours?: number;
  documents: boolean;
  /** Réaudit hebdomadaire des sites et alertes (nouveaux manquements, nouvelles obligations). */
  suivi: boolean;
  /** Documents hébergés par Vigie, intégrés au site du client et mis à jour après son approbation. */
  hebergement: boolean;
  /** Rapports et dossiers au nom et au logo du client (agences). */
  marqueBlanche: boolean;
  /** Accès par clé d'API et import de sites par fichier CSV. */
  api: boolean;
  recommandee?: boolean;
  avantages: string[];
}

export const OFFRES: Record<IdOffre, Offre> = {
  ponctuel: {
    id: "ponctuel",
    nom: "Audit ponctuel",
    accroche: "Un site, une mise en conformité.",
    prix: 49,
    periode: "unique",
    sites: 1,
    dureeJours: 30,
    documents: true,
    suivi: false,
    hebergement: false,
    marqueBlanche: false,
    api: false,
    avantages: [
      "Rapport complet d'un site : tous les constats, preuves et sources",
      "Génération de tous les documents : mentions légales, confidentialité, cookies, CGV, CGU, accessibilité",
      "Audits et générations illimités pendant 30 jours",
      "Rapport et dossier de preuve en PDF",
    ],
  },
  site: {
    id: "site",
    nom: "Site",
    accroche: "Rester en règle, sans y penser.",
    prix: 19,
    periode: "mois",
    sites: 1,
    documents: true,
    suivi: true,
    hebergement: true,
    marqueBlanche: false,
    api: false,
    avantages: [
      "Tout ce que contient l'audit ponctuel, sans limite de durée",
      "Documents hébergés : intégrés une fois à votre site, mis à jour quand la loi change",
      "Réaudit chaque semaine, alerte en cas de nouveau manquement",
      "Alerte quand une nouvelle obligation vous concerne",
      "Sans engagement, résiliable en un clic",
    ],
  },
  agence: {
    id: "agence",
    nom: "Agence",
    accroche: "Pour les agences et freelances qui livrent des sites.",
    prix: 149,
    periode: "mois",
    sites: 25,
    documents: true,
    suivi: true,
    hebergement: true,
    marqueBlanche: true,
    api: true,
    recommandee: true,
    avantages: [
      "25 sites clients suivis, documents hébergés compris",
      "Rapports et dossiers de preuve PDF à votre nom et à votre logo",
      "Tableau de bord de tous vos clients, import et export CSV",
      "Accès par API pour vos propres outils",
      "Alertes « nouvelle obligation » par client concerné",
    ],
  },
  "agence-plus": {
    id: "agence-plus",
    nom: "Agence+",
    accroche: "Pour les portefeuilles de sites plus larges.",
    prix: 299,
    periode: "mois",
    sites: 100,
    documents: true,
    suivi: true,
    hebergement: true,
    marqueBlanche: true,
    api: true,
    avantages: ["Tout ce que contient l'offre Agence", "100 sites clients suivis", "Sans engagement, résiliable en un clic"],
  },
};

export const ORDRE_OFFRES: IdOffre[] = ["ponctuel", "site", "agence", "agence-plus"];
export const ABONNEMENTS: IdAbonnement[] = ["site", "agence", "agence-plus"];
export const estAbonnement = (id: IdOffre): id is IdAbonnement => OFFRES[id].periode === "mois";

/** Offre d'un achat ou d'un abonnement enregistré (les achats antérieurs à la grille actuelle valent l'audit ponctuel). */
export function offreDe(id: string | undefined, defaut: IdOffre = "ponctuel"): Offre {
  return (id && OFFRES[id as IdOffre]) || OFFRES[defaut];
}

/** Nombre de constats montrés gratuitement, dans le rapport comme dans le mail de prospection. */
export const CONSTATS_OFFERTS = 2;

export const prixAffiche = (o: Offre) => `${o.prix} €${o.periode === "mois" ? " / mois" : ""}`;

/** Moyens de paiement proposés au paiement (à activer dans le tableau de bord Stripe). */
export const MOYENS_DE_PAIEMENT = ["Carte bancaire (CB, Visa, Mastercard, Amex)", "Apple Pay", "Google Pay", "PayPal", "Prélèvement SEPA", "Link"];
