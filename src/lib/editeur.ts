/**
 * Identité de la société qui exploite Vigie : la seule chose à remplir pour que les pages légales
 * (mentions légales, CGU, CGV, confidentialité) soient complètes. Tant qu'un champ vaut « [À COMPLÉTER : …] »,
 * il est surligné sur la page et un avertissement s'affiche.
 */
export const EDITEUR = {
  nom: "[À COMPLÉTER : dénomination sociale]",
  formeJuridique: "[À COMPLÉTER : forme juridique, ex. SAS]",
  capital: "[À COMPLÉTER : montant du capital social, ex. 1 000 €]",
  siege: "[À COMPLÉTER : adresse du siège social]",
  rcs: "[À COMPLÉTER : RCS + ville du greffe + SIREN, ex. RCS Paris 123 456 789]",
  tva: "[À COMPLÉTER : numéro de TVA intracommunautaire]",
  email: "[À COMPLÉTER : adresse e-mail de contact]",
  telephone: "[À COMPLÉTER : numéro de téléphone]",
  directeurPublication: "[À COMPLÉTER : prénom et nom du représentant légal]",
  hebergeur: "[À COMPLÉTER : hébergeur, ici Vercel Inc. et son adresse postale (voir vercel.com/legal)]",
  hebergeurTelephone: "[À COMPLÉTER : téléphone de l'hébergeur]",
  /** Tribunal compétent pour les litiges entre professionnels. */
  tribunal: "[À COMPLÉTER : tribunal des activités économiques de la ville du siège]",
  /** Régime de TVA des prix affichés (les offres et montants sont dans src/lib/offres.ts). */
  mentionTva: "[À COMPLÉTER : « TVA incluse au taux de 20 % » ou « TVA non applicable, art. 293 B du CGI »]",
  /** Durée de conservation des audits, appliquée par Vigie (voir VIGIE_CONSERVATION_JOURS). */
  conservationAuditsMois: 12,
  /** Prestataire d'envoi des e-mails de prospection et de la messagerie. */
  messagerie: "[À COMPLÉTER : fournisseur de messagerie, ex. Google Workspace (Google Ireland Ltd)]",
};

/** Date de la dernière mise à jour des textes légaux de Vigie. */
export const TEXTES_LEGAUX_MIS_A_JOUR = "2026-10-13";
