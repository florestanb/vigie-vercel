import type { DocumentCible } from "../types";
import { MODELE_DECLARATION_ACCESSIBILITE, MODELE_FORMULAIRE_RETRACTATION, MODELE_INFORMATION_RETRACTATION, MODELE_MENTION_FORMULAIRE, type Modele } from "./modeles";

export type TypeDocument = Exclude<DocumentCible, "interface" | "interne">;

export interface PlanDocument {
  titre: string;
  description: string;
  /** Sections attendues, dans l'ordre. Le moteur de rédaction s'y tient. */
  sections: string[];
  /** Informations à demander à l'utilisateur si le site ne les donne pas. */
  questions: { cle: string; libelle: string; aide?: string }[];
  /** Mots ou motifs qui doivent figurer dans le document produit (contrôle après rédaction). */
  controles: { libelle: string; motif: RegExp }[];
  /** Modèles officiels sur lesquels s'appuyer : tout le document, ou la section nommée. */
  modeles?: (Modele & { section?: string })[];
}

export const PLANS: Record<TypeDocument, PlanDocument> = {
  "mentions-legales": {
    titre: "Mentions légales",
    description: "Identification de l'éditeur, du directeur de la publication et de l'hébergeur.",
    sections: ["Éditeur du site", "Directeur de la publication", "Hébergement", "Contact", "Activité réglementée (le cas échéant)", "Propriété intellectuelle", "Médiation de la consommation (le cas échéant)"],
    questions: [
      { cle: "raisonSociale", libelle: "Dénomination sociale ou nom et prénom" },
      { cle: "formeJuridique", libelle: "Forme juridique et capital social", aide: "Ex. SAS au capital de 10 000 €" },
      { cle: "adresse", libelle: "Adresse du siège" },
      { cle: "immatriculation", libelle: "SIREN et RCS / RNE", aide: "Ex. RCS Lyon 123 456 789" },
      { cle: "tva", libelle: "Numéro de TVA intracommunautaire", aide: "Laisser vide en franchise en base" },
      { cle: "email", libelle: "E-mail de contact" },
      { cle: "telephone", libelle: "Téléphone" },
      { cle: "directeur", libelle: "Directeur ou directrice de la publication" },
      { cle: "hebergeur", libelle: "Hébergeur : nom, adresse, téléphone" },
    ],
    controles: [
      { libelle: "Éditeur identifié", motif: /[ée]diteur/i },
      { libelle: "Directeur de la publication", motif: /directeur|directrice/i },
      { libelle: "Hébergeur", motif: /h[ée]berg/i },
    ],
  },
  confidentialite: {
    titre: "Politique de confidentialité",
    description: "Information RGPD sur les traitements de données personnelles du site.",
    sections: [
      "Qui est responsable de vos données",
      "Quelles données nous collectons et pourquoi (tableau : finalité, données, base légale, durée)",
      "Qui reçoit vos données (destinataires et sous-traitants)",
      "Transferts hors de l'Union européenne",
      "Durées de conservation",
      "Vos droits et comment les exercer",
      "Directives après le décès",
      "Réclamation auprès de la CNIL",
      "Cookies et traceurs (renvoi vers la politique cookies)",
      "Sécurité",
      "Mises à jour de cette politique",
      "Annexe : mention courte à placer sous chaque formulaire",
    ],
    modeles: [{ ...MODELE_MENTION_FORMULAIRE, section: "Annexe : mention courte à placer sous chaque formulaire" }],
    questions: [
      { cle: "contactRgpd", libelle: "Adresse pour exercer ses droits", aide: "E-mail ou adresse postale" },
      { cle: "dpo", libelle: "Délégué à la protection des données (si désigné)" },
      { cle: "durees", libelle: "Durées de conservation pratiquées", aide: "Ex. clients : 3 ans après le dernier achat" },
      { cle: "prestataires", libelle: "Prestataires qui traitent des données", aide: "Ex. Shopify, Mailchimp, Stripe" },
    ],
    controles: [
      { libelle: "Base légale", motif: /base l[ée]gale|fondement/i },
      { libelle: "Durées", motif: /dur[ée]e/i },
      { libelle: "Droits", motif: /droit d'acc[èe]s|vos droits/i },
      { libelle: "CNIL", motif: /cnil/i },
      { libelle: "Directives post-mortem", motif: /d[ée]c[èe]s|post-mortem/i },
    ],
  },
  cookies: {
    titre: "Politique cookies",
    description: "Information sur les traceurs et gestion du consentement.",
    sections: ["Qu'est-ce qu'un traceur", "Traceurs utilisés sur ce site (tableau : nom, service, finalité, durée, consentement requis)", "Gérer et retirer votre consentement", "Durée de conservation de votre choix"],
    questions: [{ cle: "outilConsentement", libelle: "Outil de consentement utilisé", aide: "Ex. Axeptio, tarteaucitron" }],
    controles: [
      { libelle: "Finalités", motif: /finalit[ée]/i },
      { libelle: "Retrait du consentement", motif: /retirer|modifier vos choix|g[ée]rer/i },
      { libelle: "Durée", motif: /mois/i },
    ],
  },
  cgv: {
    titre: "Conditions générales de vente",
    description: "Conditions de vente en ligne aux consommateurs, conformes au Code de la consommation.",
    sections: [
      "Identification du vendeur",
      "Champ d'application et acceptation",
      "Produits et services",
      "Prix",
      "Commande et étapes de conclusion du contrat",
      "Paiement",
      "Livraison ou exécution",
      "Droit de rétractation (délai, fonctionnalité de rétractation en ligne, exceptions, formulaire type en annexe)",
      "Garanties légales (conformité et vices cachés, encadré réglementaire)",
      "Garantie commerciale et service après-vente (le cas échéant)",
      "Durée, reconduction et résiliation (si abonnement)",
      "Responsabilité",
      "Données personnelles",
      "Accessibilité du service",
      "Médiation et litiges",
      "Archivage",
      "Droit applicable",
      "Annexe : formulaire de rétractation",
    ],
    questions: [
      { cle: "delaiLivraison", libelle: "Délais de livraison", aide: "Ex. 3 à 5 jours ouvrés en France métropolitaine" },
      { cle: "zones", libelle: "Pays de livraison" },
      { cle: "fraisRetour", libelle: "Frais de retour en cas de rétractation", aide: "À la charge du client ou offerts" },
      { cle: "paiements", libelle: "Moyens de paiement acceptés" },
      { cle: "mediateur", libelle: "Médiateur de la consommation", aide: "Nom et site du médiateur auquel vous adhérez" },
      { cle: "exceptions", libelle: "Produits exclus de la rétractation", aide: "Ex. produits personnalisés, denrées périssables" },
    ],
    controles: [
      { libelle: "Rétractation 14 jours", motif: /14\s*jours|quatorze jours/i },
      { libelle: "Fonctionnalité de rétractation en ligne", motif: /en ligne|bouton|fonctionnalit[ée]/i },
      { libelle: "Formulaire type", motif: /formulaire/i },
      { libelle: "Garantie légale de conformité", motif: /garantie l[ée]gale de conformit[ée]/i },
      { libelle: "Vices cachés", motif: /vices? cach[ée]s?/i },
      { libelle: "Médiateur", motif: /m[ée]diat/i },
      { libelle: "Avis officiel de rétractation (R221-3)", motif: /sans donner de motif dans un délai de quatorze jours/ },
      { libelle: "Modèle officiel de formulaire (R221-1)", motif: /vous notifie\/notifions \(\*\) par la présente/ },
      { libelle: "Instructions du modèle retirées", motif: /^(?![\s\S]*Instructions à suivre pour remplir)/ },
    ],
    modeles: [{ ...MODELE_INFORMATION_RETRACTATION, section: "Droit de rétractation (délai, fonctionnalité de rétractation en ligne, exceptions, formulaire type en annexe)" },
      { ...MODELE_FORMULAIRE_RETRACTATION, section: "Annexe : formulaire de rétractation" },
    ],
  },
  cgu: {
    titre: "Conditions générales d'utilisation",
    description: "Règles d'usage du service, des comptes et des contenus, conformes au DSA.",
    sections: [
      "Objet et acceptation",
      "Accès au service et création de compte",
      "Règles d'usage et contenus interdits",
      "Contenus publiés par les utilisateurs et licence",
      "Modération : signalement, décisions et recours",
      "Point de contact unique",
      "Propriété intellectuelle",
      "Responsabilité",
      "Suspension et résiliation du compte",
      "Données personnelles",
      "Modification des conditions",
      "Droit applicable et litiges",
    ],
    questions: [
      { cle: "pointContact", libelle: "Point de contact pour les utilisateurs et les autorités", aide: "E-mail dédié" },
      { cle: "moderation", libelle: "Comment les contenus sont-ils modérés ?", aide: "Manuellement, automatiquement, a priori, a posteriori" },
    ],
    controles: [
      { libelle: "Signalement", motif: /signal/i },
      { libelle: "Point de contact", motif: /point de contact/i },
      { libelle: "Modération", motif: /mod[ée]ration/i },
    ],
  },
  accessibilite: {
    titre: "Déclaration d'accessibilité",
    description: "État de conformité au RGAA, contenus non accessibles et voies de recours.",
    sections: ["Engagement d'accessibilité (sans titre)", "État de conformité", "Résultat des tests", "Contenus non accessibles", "Établissement de cette déclaration d'accessibilité", "Retour d'information et contact", "Voies de recours"],
    questions: [
      { cle: "etat", libelle: "État de conformité", aide: "Non, partiellement ou totalement conforme (selon audit RGAA)" },
      { cle: "dateAudit", libelle: "Date de l'audit" },
    ],
    controles: [
      { libelle: "État de conformité", motif: /conforme/i },
      { libelle: "Voies de recours", motif: /d[ée]fenseur des droits|recours/i },
      { libelle: "Format officiel DINUM", motif: /Libre réponse 71120/ },
    ],
    modeles: [MODELE_DECLARATION_ACCESSIBILITE],
  },
};

export const ORDRE_DOCUMENTS: TypeDocument[] = ["mentions-legales", "confidentialite", "cookies", "cgv", "cgu", "accessibilite"];
