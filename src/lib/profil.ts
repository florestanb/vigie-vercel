import type { DonneesCrawl, Editeur, Entreprise, Profil, Secteur, SiteType } from "./types";

const CATEGORIES_TRACEURS = new Set(["analytics", "publicite", "reseau-social", "video", "carte", "chat"]);

/** Premier profil, déduit des seuls signaux techniques. Claude l'affine ensuite, l'utilisateur le corrige. */
export function profilDepuisCrawl(c: DonneesCrawl, entreprise: Entreprise | null): Profil {
  const s = c.signaux;
  const texteMentions = c.pagesLegales.filter((p) => p.type === "mentions-legales").map((p) => p.texte).join("\n");

  // Un lien vers un panier ou un bouton « S'abonner » (souvent vers une plateforme tierce de réservation ou de paiement) vaut vente en ligne.
  const lienAchat = c.liens.some((l) => /\/(cart|panier|basket|checkout)(\/|\?|$)/i.test(l.href) || /^(s['’]abonner|souscrire|acheter|commander)\b/i.test(l.texte));
  const venteEnLigne = s.panier || s.paiement.length > 0 || lienAchat || (s.abonnement && s.compte && s.prix);
  const types: SiteType[] = [];
  if (s.marketplace && venteEnLigne) types.push("marketplace");
  if (s.abonnement && s.compte && !s.panier) types.push("saas");
  if (venteEnLigne && !types.includes("saas")) types.push("ecommerce");
  if (s.blog && !venteEnLigne) types.push("media");
  if (s.commentaires) types.push("communaute");
  if (types.length === 0) types.push("vitrine");

  let editeur: Editeur = "societe";
  if (/\.gouv\.fr$|\.fr\/?$/.test(new URL(c.urlFinale).hostname) && /mairie|minist[èe]re|pr[ée]fecture|collectivit[ée]|r[ée]publique fran[çc]aise/i.test(c.texteAccueil)) editeur = "public";
  else if (/\bassociation\b|loi (de )?1901|\bRNA\b|W\d{9}/i.test(texteMentions)) editeur = "association";
  else if (/entrepreneur individuel|micro-?entrepr|auto-?entrepr|\bEI\b|entreprise individuelle/i.test(texteMentions) || entreprise?.formeJuridique?.match(/entrepreneur individuel/i)) editeur = "entrepreneur-individuel";
  else if (!c.identite.siren.length && !/\b(SAS|SASU|SARL|EURL|SA|SNC|SCI|SCOP|SELARL|soci[ée]t[ée])\b/.test(texteMentions) && texteMentions.length > 0 && !s.panier) editeur = "particulier";

  const trancheMicro = ["NN", "00", "01", "02", "03"].includes(entreprise?.trancheEffectif ?? "");
  const traceursObserves =
    c.requetesAvantConsentement.some((r) => CATEGORIES_TRACEURS.has(r.categorie)) ||
    c.cookiesAvantConsentement.some((k) => CATEGORIES_TRACEURS.has(k.categorie));

  const secteurs: Secteur[] = [];
  if (s.alcool) secteurs.push("alcool");

  return {
    types,
    editeur,
    b2c: !s.reserveAuxPros,
    b2b: s.pro || s.reserveAuxPros,
    venteEnLigne,
    abonnements: s.abonnement && (s.compte || venteEnLigne),
    contenusNumeriques: types.includes("saas") || s.contenusNumeriques,
    collecteDonnees: c.formulaires.length > 0 || s.compte || s.newsletter || venteEnLigne,
    comptesUtilisateurs: s.compte,
    newsletter: s.newsletter,
    traceurs: traceursObserves || !!c.cmp,
    contenusUtilisateurs: s.commentaires || types.includes("marketplace"),
    avisClients: s.avis,
    chatbotIA: !!s.chatbot,
    publicite: c.requetesAvantConsentement.some((r) => r.categorie === "publicite") || c.cookiesAvantConsentement.some((k) => k.categorie === "publicite"),
    reductionsPrix: s.prixBarres,
    allegationsEnvironnementales: s.allegationsVertes.length > 0,
    horsUE: false,
    microEntreprise: entreprise ? trancheMicro && entreprise.categorie !== "ETI" && entreprise.categorie !== "GE" : editeur !== "societe",
    grandeEntreprise: entreprise?.categorie === "GE",
    mineurs: false,
    secteurs,
  };
}

export const LIBELLES_PROFIL: Record<Exclude<keyof Profil, "types" | "editeur" | "secteurs">, string> = {
  b2c: "Vend ou s'adresse à des particuliers",
  b2b: "S'adresse à des professionnels",
  venteEnLigne: "Commande ou paiement en ligne",
  abonnements: "Abonnements ou reconduction tacite",
  contenusNumeriques: "Contenus ou services numériques",
  collecteDonnees: "Collecte de données personnelles",
  comptesUtilisateurs: "Comptes utilisateurs",
  newsletter: "Newsletter ou prospection e-mail",
  traceurs: "Cookies ou traceurs non essentiels",
  contenusUtilisateurs: "Contenus publiés par les utilisateurs",
  avisClients: "Avis clients affichés",
  chatbotIA: "Chatbot ou assistant IA",
  publicite: "Publicité, affiliation ou contenus sponsorisés",
  reductionsPrix: "Prix barrés ou promotions",
  allegationsEnvironnementales: "Allégations environnementales",
  horsUE: "Éditeur établi hors de l'UE",
  microEntreprise: "Moins de 10 salariés et CA ≤ 2 M€",
  grandeEntreprise: "Chiffre d'affaires ≥ 250 M€",
  mineurs: "Public pouvant être mineur",
};

export const LIBELLES_TYPES: Record<SiteType, string> = {
  vitrine: "Site vitrine",
  ecommerce: "Boutique en ligne",
  saas: "Logiciel / application en ligne",
  marketplace: "Place de marché",
  media: "Blog ou média",
  communaute: "Communauté / contenus d'utilisateurs",
};

export const LIBELLES_EDITEUR: Record<Editeur, string> = {
  societe: "Société",
  "entrepreneur-individuel": "Entrepreneur individuel",
  association: "Association",
  particulier: "Particulier (site non professionnel)",
  public: "Organisme public",
};

export const LIBELLES_SECTEURS: Record<Secteur, string> = {
  alcool: "Alcool",
  alimentaire: "Alimentaire",
  immobilier: "Immobilier",
  "credit-assurance": "Crédit, assurance",
  sante: "Santé",
  tourisme: "Voyages, tourisme",
  "btp-artisan": "BTP, artisanat",
  livre: "Livres",
  "jeux-argent": "Jeux d'argent",
  "electronique-electromenager": "Électronique, électroménager",
  formation: "Formation professionnelle",
  "profession-reglementee": "Profession réglementée",
};
