import { reglesApplicables } from "./rules/engine";
import type { Profil, Regle } from "./types";

/**
 * Pages « obligations par activité » (/obligations/...) : pour un type de site courant, la liste des
 * obligations du registre qui s'y appliquent. Contenu tiré du catalogue, donc toujours à jour et sourcé.
 */

const BASE: Profil = {
  types: ["vitrine"],
  editeur: "societe",
  b2c: true,
  b2b: false,
  venteEnLigne: false,
  abonnements: false,
  contenusNumeriques: false,
  collecteDonnees: true,
  comptesUtilisateurs: false,
  newsletter: false,
  traceurs: true,
  contenusUtilisateurs: false,
  avisClients: false,
  chatbotIA: false,
  publicite: false,
  reductionsPrix: false,
  allegationsEnvironnementales: false,
  horsUE: false,
  microEntreprise: true,
  grandeEntreprise: false,
  mineurs: false,
  secteurs: [],
};

export interface Activite {
  slug: string;
  nom: string;
  titre: string;
  intro: string;
  profil: Profil;
}

export const ACTIVITES: Activite[] = [
  {
    slug: "boutique-en-ligne",
    nom: "Boutique en ligne",
    titre: "Obligations légales d'une boutique en ligne",
    intro: "Vendre en ligne à des particuliers impose des mentions, des conditions de vente, des droits pour le client et des règles strictes sur les cookies et les prix.",
    profil: { ...BASE, types: ["ecommerce"], venteEnLigne: true, comptesUtilisateurs: true, newsletter: true, reductionsPrix: true, avisClients: true, microEntreprise: false },
  },
  {
    slug: "site-vitrine",
    nom: "Site vitrine",
    titre: "Obligations légales d'un site vitrine",
    intro: "Même sans vente en ligne, un site d'entreprise doit identifier son éditeur, informer sur les données collectées et respecter les règles des cookies.",
    profil: { ...BASE },
  },
  {
    slug: "logiciel-saas",
    nom: "Logiciel en ligne (SaaS)",
    titre: "Obligations légales d'un logiciel en ligne (SaaS)",
    intro: "Un service par abonnement cumule les règles des contrats en ligne, de la résiliation, des données hébergées pour les clients et, s'il y en a, de l'IA.",
    profil: { ...BASE, types: ["saas"], b2b: true, venteEnLigne: true, abonnements: true, contenusNumeriques: true, comptesUtilisateurs: true, chatbotIA: true, microEntreprise: false },
  },
  {
    slug: "place-de-marche",
    nom: "Place de marché",
    titre: "Obligations légales d'une place de marché",
    intro: "Mettre en relation vendeurs et acheteurs ajoute les obligations des plateformes : transparence du classement, conditions pour les vendeurs, signalement des contenus.",
    profil: { ...BASE, types: ["marketplace"], venteEnLigne: true, comptesUtilisateurs: true, contenusUtilisateurs: true, avisClients: true, microEntreprise: false },
  },
  {
    slug: "vente-alcool",
    nom: "Vente d'alcool en ligne",
    titre: "Obligations légales d'un site qui vend de l'alcool",
    intro: "Caves, domaines et bars en ligne : aux règles de la vente à distance s'ajoutent celles de la loi Évin sur la publicité et la vente aux mineurs.",
    profil: { ...BASE, types: ["ecommerce"], venteEnLigne: true, secteurs: ["alcool"] },
  },
  {
    slug: "agence-immobiliere",
    nom: "Agence immobilière",
    titre: "Obligations légales d'un site d'agence immobilière",
    intro: "Honoraires, carte professionnelle, diagnostic énergétique : la loi Hoguet impose des mentions précises sur le site d'une agence.",
    profil: { ...BASE, secteurs: ["immobilier"] },
  },
  {
    slug: "organisme-de-formation",
    nom: "Organisme de formation",
    titre: "Obligations légales d'un site d'organisme de formation",
    intro: "Numéro de déclaration d'activité, certification, vente de formations en ligne : ce que le site doit afficher.",
    profil: { ...BASE, venteEnLigne: true, secteurs: ["formation"] },
  },
  {
    slug: "artisan-btp",
    nom: "Artisan et BTP",
    titre: "Obligations légales d'un site d'artisan ou d'entreprise du BTP",
    intro: "Assurance décennale, mentions de l'entreprise, formulaire de devis : les points à vérifier sur le site d'un artisan.",
    profil: { ...BASE, secteurs: ["btp-artisan"] },
  },
];

export function obligationsDe(a: Activite): Regle[] {
  return reglesApplicables(a.profil).filter((r) => !r.obsolete);
}
