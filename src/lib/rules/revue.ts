/**
 * Revue juridique du registre, règle par règle : les articles exacts (récupérables automatiquement, voir
 * scripts/citations.ts), le champ d'application en clair (« s'applique si » / « ne s'applique pas si ») et les
 * doutes à faire trancher par un avocat. Ce fichier est le document de travail de la validation juridique :
 * docs/revue-juridique.md en est généré (npm run revue).
 *
 * Rédigé le 14 octobre 2026, à partir des sources du registre, sans accès au texte consolidé officiel de Légifrance :
 * les numéros d'articles français sont à confirmer par la récupération automatique ou par l'avocat.
 */

/** Référence d'article récupérable : code français, loi française (identifiant Légifrance) ou texte européen (CELEX). */
export type RefArticle =
  | { type: "code"; code: string; num: string }
  | { type: "loi"; nom: string; cid: string; num: string }
  | { type: "ue"; nom: string; celex: string; num: string };

export interface Revue {
  articles: RefArticle[];
  sApplique: string[];
  neSAppliquePas: string[];
  /** Points d'interprétation ou de référence à faire trancher par l'avocat. Vide : rien de particulier relevé. */
  doutes: string[];
}

const conso = (num: string): RefArticle => ({ type: "code", code: "Code de la consommation", num });
const civil = (num: string): RefArticle => ({ type: "code", code: "Code civil", num });
const commerce = (num: string): RefArticle => ({ type: "code", code: "Code de commerce", num });
const lcen = (num: string): RefArticle => ({ type: "loi", nom: "LCEN (loi n° 2004-575)", cid: "JORFTEXT000000801164", num });
const il = (num: string): RefArticle => ({ type: "loi", nom: "Loi Informatique et Libertés (n° 78-17)", cid: "JORFTEXT000000886460", num });
const rgpd = (num: string): RefArticle => ({ type: "ue", nom: "RGPD", celex: "32016R0679", num });
const dsa = (num: string): RefArticle => ({ type: "ue", nom: "DSA", celex: "32022R2065", num });

const PRO = "L'éditeur est une entreprise, une association ou un organisme public.";
const PARTICULIER = "Particulier qui publie un site à titre non professionnel (il peut ne donner que les coordonnées de son hébergeur).";
const COLLECTE = "Le site collecte des données personnelles (formulaire, compte, commande, newsletter) ou dépose des traceurs.";
const B2C_EN_LIGNE = "Le site permet de conclure un contrat à distance avec des consommateurs.";
const B2B_SEUL = "Vente exclusivement à des professionnels.";

export const REVUE: Record<string, Revue> = {
  // ───────── Identification de l'éditeur ─────────
  "id.page-mentions": {
    articles: [lcen("1-1"), lcen("1-2")],
    sApplique: ["Toute personne dont l'activité est d'éditer un service de communication au public en ligne : tout site, quel que soit son objet."],
    neSAppliquePas: [],
    doutes: ["La loi exige que les informations soient « facilement, directement et en permanence » accessibles, pas une page intitulée « Mentions légales » : le constat porte sur l'accessibilité de l'information."],
  },
  "id.identite-editeur": {
    articles: [lcen("1-1"), { type: "code", code: "Code de commerce", num: "R123-237" }],
    sApplique: [PRO, "Personne morale : dénomination, forme, siège, capital (le capital n'est exigé que des sociétés commerciales)."],
    neSAppliquePas: [PARTICULIER],
    doutes: ["Vérifier dans l'article 1-1 consolidé (après la loi SREN) que la liste des mentions est inchangée ; une source secondaire signale un ajout relatif aux prestataires de stockage."],
  },
  "id.contact": {
    articles: [lcen("1-1"), lcen("19"), conso("R111-1"), conso("L221-5")],
    sApplique: [PRO, B2C_EN_LIGNE],
    neSAppliquePas: [PARTICULIER],
    doutes: ["Le contrôle cherche e-mail et téléphone dans les pages légales et l'accueil : un numéro publié uniquement sur une page de contact non visitée peut échapper (constat marqué incertain)."],
  },
  "id.immatriculation": {
    articles: [lcen("1-1"), { type: "code", code: "Code de commerce", num: "R123-237" }],
    sApplique: ["Entreprise assujettie à l'immatriculation au RCS ou au registre national des entreprises."],
    neSAppliquePas: ["Associations non immatriculées, organismes publics, particuliers."],
    doutes: [],
  },
  "id.tva": {
    articles: [lcen("19"), { type: "code", code: "Code général des impôts", num: "286 ter" }],
    sApplique: ["Entreprise assujettie à la TVA et identifiée à la TVA."],
    neSAppliquePas: ["Entreprise en franchise en base de TVA (art. 293 B du CGI)."],
    doutes: ["Vigie ne sait pas si l'entreprise est en franchise : le point reste « à vérifier » en l'absence de numéro, jamais « illégal »."],
  },
  "id.directeur-publication": {
    articles: [lcen("1-1"), { type: "loi", nom: "Loi n° 82-652 du 29 juillet 1982", cid: "JORFTEXT000000880222", num: "93-2" }],
    sApplique: [
      "Tout service de communication au public en ligne, pas seulement les sites de presse (loi de 1982, art. 93-2 : « Tout service de communication au public par voie électronique est tenu d'avoir un directeur de la publication »).",
      "Pour une personne morale, c'est de droit son représentant légal (Cass. crim., 22 janvier 2019).",
    ],
    neSAppliquePas: [PARTICULIER],
    doutes: ["Confirmer la référence de l'arrêt du 22 janvier 2019 (numéro de pourvoi) avant de le citer aux clients."],
  },
  "id.hebergeur": {
    articles: [lcen("1-1")],
    sApplique: ["Tout site, y compris celui d'un particulier non professionnel."],
    neSAppliquePas: [],
    doutes: ["Confirmer la liste exacte des informations sur l'hébergeur dans l'article 1-1 consolidé (nom, adresse, téléphone)."],
  },
  "id.profession-reglementee": {
    articles: [lcen("19"), conso("R111-2")],
    sApplique: ["Professions réglementées (avocats, médecins, architectes, experts-comptables…)."],
    neSAppliquePas: ["Activités non réglementées."],
    doutes: ["Le secteur est déclaré par le client ou déduit du site : à confirmer au cas par cas."],
  },
  "id.autorisation-activite": {
    articles: [lcen("19"), conso("R111-2")],
    sApplique: ["Activité soumise à autorisation (carte professionnelle, ORIAS, Atout France, agrément ANJ…)."],
    neSAppliquePas: ["Activité libre."],
    doutes: [],
  },

  // ───────── Données personnelles ─────────
  "rgpd.politique": {
    articles: [rgpd("12"), rgpd("13"), il("48")],
    sApplique: [COLLECTE, "Y compris en vente entre professionnels : les coordonnées de salariés sont des données personnelles."],
    neSAppliquePas: ["Site qui ne collecte aucune donnée personnelle et ne dépose aucun traceur."],
    doutes: ["Le RGPD impose une information, pas une page intitulée « Politique de confidentialité » : une information complète placée ailleurs suffit."],
  },
  "rgpd.responsable": { articles: [rgpd("13")], sApplique: [COLLECTE], neSAppliquePas: [], doutes: [] },
  "rgpd.dpo": {
    articles: [rgpd("13"), rgpd("37")],
    sApplique: ["Seulement si un délégué a été désigné ; désignation obligatoire pour les organismes publics et les suivis réguliers ou données sensibles à grande échelle."],
    neSAppliquePas: ["Organisme qui n'a pas désigné de délégué et n'y est pas tenu."],
    doutes: ["Le profil (public, grande entreprise, santé) ne dit pas si un délégué existe : règle classée zone de flou, à garder ainsi."],
  },
  "rgpd.finalites-bases": { articles: [rgpd("6"), rgpd("13")], sApplique: [COLLECTE], neSAppliquePas: [], doutes: [] },
  "rgpd.destinataires": { articles: [rgpd("13")], sApplique: [COLLECTE], neSAppliquePas: [], doutes: [] },
  "rgpd.transferts": {
    articles: [rgpd("13"), rgpd("44"), rgpd("45"), rgpd("46")],
    sApplique: ["Données transférées hors de l'Union (outil non européen, hébergement hors UE)."],
    neSAppliquePas: ["Aucun destinataire hors de l'Union."],
    doutes: ["Vigie déduit les transferts des services détectés : un service américain peut héberger les données dans l'UE. Le constat sur ce point devrait rester incertain."],
  },
  "rgpd.durees": { articles: [rgpd("5"), rgpd("13")], sApplique: [COLLECTE], neSAppliquePas: [], doutes: [] },
  "rgpd.droits": { articles: [rgpd("13"), rgpd("15"), rgpd("21")], sApplique: [COLLECTE], neSAppliquePas: [], doutes: [] },
  "rgpd.directives-post-mortem": {
    articles: [il("85")],
    sApplique: [COLLECTE],
    neSAppliquePas: [],
    doutes: [
      "L'article 85, II vise le « prestataire d'un service de communication au public en ligne » et l'oblige à informer l'utilisateur du sort de ses données à son décès : vérifier s'il concerne tout site qui collecte des données, ou seulement les services avec compte utilisateur.",
    ],
  },
  "rgpd.reclamation-cnil": { articles: [rgpd("13"), rgpd("77")], sApplique: [COLLECTE], neSAppliquePas: [], doutes: [] },
  "rgpd.caractere-obligatoire": {
    articles: [rgpd("13")],
    sApplique: ["Formulaire dont certaines données conditionnent le contrat ou sont exigées."],
    neSAppliquePas: [],
    doutes: [],
  },
  "rgpd.decision-automatisee": {
    articles: [rgpd("13"), rgpd("22")],
    sApplique: ["Décision entièrement automatisée produisant des effets juridiques ou significatifs, ou profilage."],
    neSAppliquePas: ["Publicité ou recommandations sans effet significatif : l'article 22 ne vise que les décisions à effets significatifs."],
    doutes: ["La condition « publicité ou chatbot » est large : la règle reste en zone de flou, ce qui est approprié."],
  },
  "rgpd.formulaires": {
    articles: [rgpd("12"), rgpd("13")],
    sApplique: ["Chaque formulaire qui collecte des données personnelles."],
    neSAppliquePas: [],
    doutes: ["L'information « au moment de la collecte » peut être donnée par un lien vers la politique : le contrôle accepte un lien à proximité."],
  },
  "rgpd.mineurs": {
    articles: [rgpd("8"), il("45")],
    sApplique: ["Service de la société de l'information proposé directement à des mineurs, fondé sur le consentement."],
    neSAppliquePas: ["Traitement fondé sur une autre base légale que le consentement (contrat, obligation légale…)."],
    doutes: [],
  },
  "rgpd.representant-ue": {
    articles: [rgpd("3"), rgpd("27")],
    sApplique: ["Responsable établi hors de l'Union qui cible des personnes dans l'Union."],
    neSAppliquePas: ["Traitement occasionnel, sans données sensibles à grande échelle et peu risqué (art. 27.2)."],
    doutes: [],
  },
  "rgpd.registre": {
    articles: [rgpd("30")],
    sApplique: [COLLECTE],
    neSAppliquePas: ["Moins de 250 salariés ET traitement seulement occasionnel, sans risque ni données sensibles (rare pour un site marchand)."],
    doutes: [],
  },
  "rgpd.sous-traitants": { articles: [rgpd("28")], sApplique: ["Tout prestataire qui traite des données pour le compte de l'éditeur."], neSAppliquePas: [], doutes: [] },
  "rgpd.violations": { articles: [rgpd("33"), rgpd("34")], sApplique: [COLLECTE], neSAppliquePas: [], doutes: [] },

  // ───────── Sécurité ─────────
  "secu.https": {
    articles: [rgpd("32")],
    sApplique: ["Site qui collecte des données personnelles."],
    neSAppliquePas: [],
    doutes: ["Aucun texte ne nomme HTTPS : c'est la doctrine CNIL qui le tient pour minimal. Zone de flou, à garder ainsi."],
  },

  // ───────── Cookies ─────────
  "cookies.consentement-prealable": {
    articles: [il("82"), { type: "ue", nom: "Directive ePrivacy 2002/58/CE", celex: "02002L0058-20091219", num: "5" }],
    sApplique: ["Tout site qui lit ou dépose des traceurs non strictement nécessaires."],
    neSAppliquePas: ["Traceurs strictement nécessaires au service demandé, ou mesure d'audience exemptée selon les conditions CNIL."],
    doutes: ["La catégorie de chaque traceur vient d'une liste tenue par Vigie : un traceur mal classé fausse le constat. La liste mérite une relecture."],
  },
  "cookies.tiers-integres": {
    articles: [il("82"), rgpd("6")],
    sApplique: ["Vidéos, cartes, polices ou boutons de réseaux sociaux chargés depuis un tiers."],
    neSAppliquePas: [],
    doutes: ["Question non tranchée en France (décision allemande de 2022 sur Google Fonts). Zone de flou, à garder ainsi."],
  },
  "cookies.bandeau": {
    articles: [il("82"), rgpd("4"), rgpd("7")],
    sApplique: ["Site qui utilise des traceurs soumis à consentement."],
    neSAppliquePas: ["Site sans traceur soumis à consentement : aucun bandeau n'est exigé."],
    doutes: ["La loi exige un consentement, pas un « bandeau » : c'est la forme usuelle de son recueil."],
  },
  "cookies.refus-simple": {
    articles: [il("82"), rgpd("7")],
    sApplique: ["Site qui demande le consentement à des traceurs."],
    neSAppliquePas: [],
    doutes: ["Exigence de la recommandation CNIL de 2020, appliquée dans ses sanctions : zone de flou, à garder ainsi. Un « mur » avec alternative payante s'apprécie au cas par cas."],
  },
  "cookies.refus-respecte": {
    articles: [il("82"), { type: "ue", nom: "Directive ePrivacy 2002/58/CE", celex: "02002L0058-20091219", num: "5" }],
    sApplique: ["Site qui propose de refuser les traceurs."],
    neSAppliquePas: [],
    doutes: ["Des requêtes sans cookie après refus (mode consentement de Google) ne sont pas tranchées : le contrôle les classe en zone de flou."],
  },
  "cookies.duree": { articles: [], sApplique: ["Site qui utilise des traceurs."], neSAppliquePas: [], doutes: ["Recommandation CNIL seulement : hors de la note, à garder ainsi."] },
  "cookies.information": { articles: [il("82"), rgpd("7")], sApplique: ["Site qui utilise des traceurs soumis à consentement."], neSAppliquePas: [], doutes: [] },
  "cookies.mesure-audience": {
    articles: [il("82")],
    sApplique: ["Outil de mesure d'audience chargé sans consentement."],
    neSAppliquePas: ["Outil configuré selon les conditions d'exemption de la CNIL."],
    doutes: ["La configuration réelle (anonymisation, absence de recoupement) ne se voit pas de l'extérieur."],
  },

  // ───────── Vente à distance ─────────
  "vente.cgv": {
    articles: [civil("1127-1"), conso("L221-5"), conso("L221-11"), commerce("L441-1")],
    sApplique: ["Tout site qui permet de conclure un contrat en ligne : les conditions contractuelles doivent être mises à disposition de façon à pouvoir être conservées et reproduites (C. civ. art. 1127-1)."],
    neSAppliquePas: ["Site sans vente ni contrat en ligne."],
    doutes: ["La loi n'impose pas un document intitulé « CGV » aux ventes aux consommateurs, mais la mise à disposition des stipulations contractuelles. Entre professionnels, les CGV ne sont dues que sur demande (C. com. L441-1) : une absence de page n'est pas en soi illégale pour un site B2B."],
  },
  "vente.info-precontractuelle": { articles: [conso("L111-1"), conso("R111-1"), conso("L221-5"), conso("R221-2")], sApplique: [B2C_EN_LIGNE], neSAppliquePas: [B2B_SEUL], doutes: [] },
  "vente.retractation-info": {
    articles: [conso("L221-5"), conso("L221-18"), conso("L221-28"), conso("R221-1")],
    sApplique: [B2C_EN_LIGNE],
    neSAppliquePas: [B2B_SEUL, "Contrats exclus du droit de rétractation (art. L221-28 : biens personnalisés, denrées périssables, loisirs à date déterminée…)."],
    doutes: [],
  },
  "vente.bouton-retractation": {
    articles: [conso("L221-21"), conso("D221-5"), { type: "ue", nom: "Directive (UE) 2023/2673", celex: "32023L2673", num: "1" }],
    sApplique: [B2C_EN_LIGNE + " Contrats ouvrant droit à rétractation, depuis le 19 juin 2026."],
    neSAppliquePas: [B2B_SEUL, "Contrats exclus du droit de rétractation (art. L221-28)."],
    doutes: [
      "Numéros (L221-21, D221-5) et dates de l'ordonnance n° 2026-2 et du décret n° 2026-3 relevés dans des sources secondaires : à confirmer sur le texte consolidé.",
      "Sanction propre non identifiée : aucune n'est affichée.",
    ],
  },
  "vente.bouton-commande": { articles: [conso("L221-14"), civil("1127-2")], sApplique: [B2C_EN_LIGNE], neSAppliquePas: [B2B_SEUL], doutes: ["Libellés « Valider la commande », « Commander » : ambiguïté appréciée au cas par cas (CJUE, 7 avril 2022, C-249/21) ; le contrôle les classe en zone de flou."] },
  "vente.confirmation": { articles: [conso("L221-13")], sApplique: [B2C_EN_LIGNE], neSAppliquePas: [B2B_SEUL], doutes: [] },
  "vente.garanties": {
    articles: [conso("L217-3"), conso("L217-7"), conso("D211-2"), civil("1641")],
    sApplique: [B2C_EN_LIGNE + " Vente de biens ou de contenus numériques."],
    neSAppliquePas: [B2B_SEUL],
    doutes: ["Confirmer la référence de l'encadré réglementaire des garanties (D211-2 ou article voisin après la réforme de 2021-2022)."],
  },
  "vente.livraison": { articles: [conso("L216-1"), conso("L216-4")], sApplique: [B2C_EN_LIGNE + " Vente de biens livrés."], neSAppliquePas: [B2B_SEUL, "Services et contenus numériques sans livraison physique."], doutes: [] },
  "vente.mediateur": {
    articles: [conso("L612-1"), conso("L616-1"), conso("R616-1")],
    sApplique: ["Tout professionnel qui contracte avec des consommateurs, qu'il vende en ligne ou non : coordonnées du médiateur sur son site et dans ses CGV."],
    neSAppliquePas: [B2B_SEUL],
    doutes: [],
  },
  "vente.lien-rll-obsolete": { articles: [{ type: "ue", nom: "Règlement (UE) 2024/3228", celex: "32024R3228", num: "1" }], sApplique: ["Site qui affiche encore le lien vers la plateforme RLL."], neSAppliquePas: [], doutes: [] },
  "vente.archivage": { articles: [conso("L213-1"), conso("D213-1"), civil("1127-1")], sApplique: [B2C_EN_LIGNE], neSAppliquePas: [B2B_SEUL], doutes: [] },
  "vente.etapes-contrat": {
    articles: [civil("1127-1"), civil("1127-3")],
    sApplique: ["Tout contrat conclu par voie électronique."],
    neSAppliquePas: ["Contrats entre professionnels qui en ont convenu autrement (C. civ. art. 1127-3)."],
    doutes: ["L'exception entre professionnels n'est pas prise en compte par la condition actuelle (« vente en ligne ») : à ajouter."],
  },
  "vente.clauses-abusives": { articles: [conso("L212-1"), conso("R212-1"), conso("R212-2")], sApplique: ["Contrats proposés aux consommateurs et non-professionnels."], neSAppliquePas: [B2B_SEUL + " (le droit commun des contrats s'applique alors : C. civ. 1171, C. com. L442-1)."], doutes: [] },
  "vente.b2b-penalites": { articles: [commerce("L441-1"), commerce("L441-10"), commerce("D441-5")], sApplique: ["Ventes entre professionnels."], neSAppliquePas: ["Ventes aux seuls consommateurs."], doutes: [] },
  "vente.abonnement-reconduction": {
    articles: [conso("L215-1"), conso("L215-4")],
    sApplique: ["Contrats de prestation de services à reconduction tacite conclus avec des consommateurs."],
    neSAppliquePas: [B2B_SEUL],
    doutes: ["L'obligation porte sur un courrier à envoyer avant l'échéance, invisible depuis le site : seule la description dans les conditions peut être vérifiée."],
  },
  "vente.resiliation-3-clics": { articles: [conso("L215-1-1"), conso("D215-1")], sApplique: ["Contrats conclus par voie électronique avec des consommateurs ou non-professionnels, qui peuvent être résiliés."], neSAppliquePas: [B2B_SEUL], doutes: [] },
  "vente.contenus-numeriques": { articles: [conso("L111-1"), conso("L221-28"), conso("L224-25-12")], sApplique: [B2C_EN_LIGNE + " Contenus ou services numériques."], neSAppliquePas: [B2B_SEUL], doutes: [] },
  "vente.changement-fournisseur": {
    articles: [{ type: "ue", nom: "Data Act", celex: "32023R2854", num: "23" }, { type: "ue", nom: "Data Act", celex: "32023R2854", num: "31" }],
    sApplique: ["Fournisseurs de services de traitement de données (informatique en nuage, y compris certains logiciels en ligne)."],
    neSAppliquePas: ["Services sur mesure non commercialisés à grande échelle, et certaines dérogations de l'article 31."],
    doutes: ["Passée en zone de flou le 14 octobre 2026 : tout logiciel en ligne n'est pas un « service de traitement de données » au sens du Data Act. À confirmer, avec les critères de qualification."],
  },
  "vente.paiement-surcout": { articles: [{ type: "code", code: "Code monétaire et financier", num: "L112-12" }], sApplique: [B2C_EN_LIGNE], neSAppliquePas: [B2B_SEUL], doutes: [] },
  "vente.geoblocage": {
    articles: [{ type: "ue", nom: "Règlement géoblocage", celex: "32018R0302", num: "3" }, { type: "ue", nom: "Règlement géoblocage", celex: "32018R0302", num: "4" }],
    sApplique: ["Vente en ligne à des clients de l'Union."],
    neSAppliquePas: ["Le règlement n'oblige pas à livrer partout : seule la discrimination d'accès ou de conditions est visée."],
    doutes: [],
  },
  "vente.securite-produits": { articles: [{ type: "ue", nom: "Règlement (UE) 2023/988", celex: "32023R0988", num: "19" }], sApplique: ["Vente en ligne de produits de consommation, depuis le 13 décembre 2024."], neSAppliquePas: ["Services."], doutes: [] },
  "vente.accessibilite-cgv": {
    articles: [{ type: "ue", nom: "Directive (UE) 2019/882", celex: "32019L0882", num: "13" }],
    sApplique: ["Services de commerce électronique vers les consommateurs, depuis le 28 juin 2025."],
    neSAppliquePas: ["Microentreprises (moins de 10 salariés et 2 M€ de chiffre d'affaires ou de bilan)."],
    doutes: ["Confirmer l'article de transposition française (loi n° 2005-102 et décret n° 2023-931) qui reprend l'annexe V."],
  },

  // ───────── Prix ─────────
  "prix.ttc": { articles: [conso("L112-1")], sApplique: ["Prix proposés aux consommateurs."], neSAppliquePas: [B2B_SEUL + " (prix hors taxes admis)."], doutes: [] },
  "prix.reductions": { articles: [conso("L112-1-1")], sApplique: ["Annonce de réduction de prix à des consommateurs."], neSAppliquePas: ["Prix barrés qui ne sont pas présentés comme une réduction (ex. prix conseillé clairement présenté comme tel) : à apprécier."], doutes: [] },
  "prix.personnalises": { articles: [conso("L221-5")], sApplique: ["Prix personnalisé par décision automatisée."], neSAppliquePas: ["Prix identique pour tous."], doutes: ["Invisible depuis le site ; la condition « publicité » ne prouve pas une personnalisation des prix."] },

  // ───────── Plateformes ─────────
  "plat.cgu": { articles: [dsa("14")], sApplique: ["Services intermédiaires, dont l'hébergement de contenus fournis par les utilisateurs."], neSAppliquePas: ["Site qui n'héberge aucun contenu fourni par ses utilisateurs."], doutes: ["Un SaaS qui stocke des données de ses clients est un « service d'hébergement » au sens du DSA : à confirmer selon le service."] },
  "plat.point-contact": { articles: [dsa("11"), dsa("12")], sApplique: ["Tout fournisseur de services intermédiaires."], neSAppliquePas: [], doutes: [] },
  "plat.signalement": { articles: [dsa("16"), dsa("17")], sApplique: ["Services d'hébergement de contenus de tiers, quelle que soit leur taille."], neSAppliquePas: [], doutes: [] },
  "plat.classement": {
    articles: [conso("L111-7"), { type: "ue", nom: "Règlement P2B", celex: "32019R1150", num: "5" }, dsa("27"), dsa("30")],
    sApplique: ["Plateformes de mise en relation et places de marché."],
    neSAppliquePas: ["Micro et petites entreprises pour les articles 27 et 30 du DSA (art. 19)."],
    doutes: ["La règle mélange des obligations dont le champ diffère (Code de la consommation, P2B, DSA) : à séparer pour que chaque constat vise la bonne source."],
  },
  "plat.p2b": { articles: [{ type: "ue", nom: "Règlement P2B", celex: "32019R1150", num: "3" }, { type: "ue", nom: "Règlement P2B", celex: "32019R1150", num: "11" }], sApplique: ["Services d'intermédiation en ligne proposés à des entreprises."], neSAppliquePas: ["Petites entreprises pour le système interne de plaintes (art. 11.5)."], doutes: [] },
  "plat.avis": { articles: [conso("L111-7-2"), conso("L121-4")], sApplique: ["Toute personne qui collecte, modère ou diffuse des avis de consommateurs."], neSAppliquePas: [], doutes: ["Confirmer la numérotation des articles réglementaires (D111-16 et suivants, ou D111-9 et suivants)."] },
  "plat.interfaces-trompeuses": { articles: [dsa("25"), conso("L121-1")], sApplique: ["Plateformes en ligne (DSA) ; tout professionnel (pratiques trompeuses)."], neSAppliquePas: ["Micro et petites entreprises pour le seul article 25 du DSA."], doutes: [] },
  "plat.mineurs": { articles: [dsa("28")], sApplique: ["Plateformes en ligne accessibles aux mineurs."], neSAppliquePas: ["Micro et petites entreprises (DSA art. 19)."], doutes: [] },
  "plat.cyberscore": { articles: [conso("L111-7-3")], sApplique: ["Plateformes dépassant les seuils fixés par décret."], neSAppliquePas: ["Plateformes sous les seuils."], doutes: ["Vérifier que le décret d'application et l'arrêté de seuils sont en vigueur, et leurs dates."] },

  // ───────── Accessibilité ─────────
  "a11y.mention": {
    articles: [{ type: "loi", nom: "Loi n° 2005-102", cid: "JORFTEXT000000809647", num: "47" }],
    sApplique: ["Organismes publics et entreprises au-delà du seuil de chiffre d'affaires fixé par décret."],
    neSAppliquePas: ["Autres entreprises."],
    doutes: ["Vérifier que l'article 47 consolidé (après l'ordonnance n° 2023-859) maintient cette mention et ce seuil pour les entreprises privées."],
  },
  "a11y.conformite": {
    articles: [{ type: "ue", nom: "Directive (UE) 2019/882", celex: "32019L0882", num: "4" }, { type: "loi", nom: "Loi n° 2005-102", cid: "JORFTEXT000000809647", num: "47" }],
    sApplique: ["Services de commerce électronique et services numériques couverts, depuis le 28 juin 2025 ; organismes publics."],
    neSAppliquePas: ["Microentreprises qui fournissent des services."],
    doutes: ["La taille de l'entreprise est déduite (répertoire Sirene) ou supposée : sans Sirene, le constat ne doit pas être présenté comme certain."],
  },

  // ───────── Prospection et publicité ─────────
  "pub.prospection-email": { articles: [{ type: "code", code: "Code des postes et des communications électroniques", num: "L34-5" }], sApplique: ["Prospection par e-mail ou SMS de personnes physiques."], neSAppliquePas: ["Prospection entre professionnels sur adresse professionnelle et en rapport avec leur activité (doctrine CNIL : opposition suffit)."], doutes: [] },
  "pub.bloctel": { articles: [conso("L223-2")], sApplique: ["Professionnel qui recueille le numéro de téléphone d'un consommateur."], neSAppliquePas: [B2B_SEUL], doutes: [] },
  "pub.identification": { articles: [lcen("20"), conso("L121-4"), dsa("26")], sApplique: ["Site qui diffuse de la publicité ou des contenus sponsorisés."], neSAppliquePas: [], doutes: [] },
  "pub.influence": { articles: [{ type: "loi", nom: "Loi n° 2023-451", cid: "JORFTEXT000047663185", num: "5" }], sApplique: ["Personnes qui exercent une activité d'influence commerciale."], neSAppliquePas: ["Marque qui publie sa propre publicité sur son site."], doutes: ["La condition (publicité + média ou communauté) ne prouve pas une activité d'influence : déclaratif, à garder ainsi."] },

  // ───────── Environnement ─────────
  "env.allegations-generiques": {
    articles: [conso("L121-2"), { type: "code", code: "Code de l'environnement", num: "L229-68" }, { type: "code", code: "Code de l'environnement", num: "L541-9-1" }, { type: "ue", nom: "Directive (UE) 2024/825", celex: "32024L0825", num: "1" }],
    sApplique: ["Allégations environnementales dans une communication commerciale."],
    neSAppliquePas: [],
    doutes: ["Directive 2024/825 non transposée au 14 octobre 2026 : suivre le projet de loi DDADUE et mettre la règle à jour dès sa publication."],
  },
  "env.durabilite": { articles: [{ type: "code", code: "Code de l'environnement", num: "L541-9-2" }], sApplique: ["Vente en ligne des équipements couverts par l'indice."], neSAppliquePas: ["Smartphones et tablettes, couverts depuis le 20 juin 2025 par l'étiquette énergie européenne."], doutes: [] },
  "env.pieces-detachees": { articles: [conso("L111-4")], sApplique: ["Vente aux consommateurs de biens dont le fabricant a communiqué la disponibilité des pièces."], neSAppliquePas: [B2B_SEUL], doutes: [] },
  "env.reparation": { articles: [{ type: "ue", nom: "Directive (UE) 2024/1799", celex: "32024L1799", num: "5" }, { type: "ue", nom: "Directive (UE) 2024/1799", celex: "32024L1799", num: "16" }], sApplique: ["Biens couverts par la directive."], neSAppliquePas: [], doutes: ["Directive non transposée au 14 octobre 2026."] },

  // ───────── IA, langue ─────────
  "ia.chatbot": { articles: [{ type: "ue", nom: "AI Act", celex: "32024R1689", num: "50" }], sApplique: ["Fournisseur d'un système d'IA qui dialogue avec des personnes, depuis le 2 août 2026."], neSAppliquePas: ["Site qui installe un outil tiers dont il n'est pas le fournisseur (l'obligation pèse alors sur l'éditeur de l'outil)."], doutes: ["Qualification fournisseur ou déployeur au cas par cas : zone de flou, à garder ainsi.", "Le texte cité est celui publié en 2024 : vérifier la version consolidée après le règlement omnibus (UE) 2026/1744."] },
  "langue.francais": { articles: [{ type: "loi", nom: "Loi n° 94-665 (Toubon)", cid: "JORFTEXT000000349929", num: "2" }], sApplique: ["Offre de biens ou services aux consommateurs en France."], neSAppliquePas: [B2B_SEUL], doutes: ["Un site étranger en anglais visant la France : application territoriale à apprécier."] },

  // ───────── Sectoriel ─────────
  "sect.alcool": { articles: [{ type: "code", code: "Code de la santé publique", num: "L3323-4" }, { type: "code", code: "Code de la santé publique", num: "L3342-1" }], sApplique: ["Publicité en ligne pour des boissons alcooliques, y compris la présentation des produits sur un site marchand."], neSAppliquePas: [], doutes: ["Le secteur est déduit de mots du site : faux positifs possibles (constat marqué incertain)."] },
  "sect.alimentaire": { articles: [{ type: "ue", nom: "Règlement INCO", celex: "32011R1169", num: "14" }], sApplique: ["Vente à distance de denrées alimentaires préemballées."], neSAppliquePas: [], doutes: [] },
  "sect.immobilier": { articles: [{ type: "loi", nom: "Loi n° 70-9 (Hoguet)", cid: "JORFTEXT000000512228", num: "6" }], sApplique: ["Agents immobiliers et administrateurs de biens."], neSAppliquePas: ["Particuliers qui vendent leur bien."], doutes: ["Vérifier que l'arrêté du 10 janvier 2017 sur l'affichage des honoraires est toujours en vigueur dans cette version."] },
  "sect.credit-assurance": { articles: [conso("L312-5"), { type: "code", code: "Code des assurances", num: "L512-1" }], sApplique: ["Prêteurs, intermédiaires en crédit et en assurance."], neSAppliquePas: [], doutes: ["Directive (UE) 2023/2225 sur le crédit à la consommation applicable à partir du 20 novembre 2026 : à mettre à jour à cette date."] },
  "sect.sante": { articles: [{ type: "code", code: "Code de la santé publique", num: "L1111-8" }, { type: "code", code: "Code de la santé publique", num: "L5125-33" }], sApplique: ["Hébergement de données de santé pour compte de tiers ; vente en ligne de médicaments."], neSAppliquePas: [], doutes: [] },
  "sect.tourisme": { articles: [{ type: "code", code: "Code du tourisme", num: "L211-8" }, { type: "code", code: "Code du tourisme", num: "L211-18" }], sApplique: ["Opérateurs de voyages et séjours (forfaits)."], neSAppliquePas: [], doutes: [] },
  "sect.btp": {
    articles: [{ type: "loi", nom: "Loi n° 96-603", cid: "JORFTEXT000000193678", num: "22-2" }, { type: "code", code: "Code des assurances", num: "L243-2" }],
    sApplique: ["Artisans et entreprises du bâtiment soumis à une assurance obligatoire."],
    neSAppliquePas: [],
    doutes: ["Reclassée en recommandation le 14 octobre 2026 : le texte vise les devis et factures, pas le site. À confirmer."],
  },
  "sect.livre": { articles: [{ type: "loi", nom: "Loi n° 81-766 (Lang)", cid: "JORFTEXT000000517179", num: "1" }], sApplique: ["Vente de livres neufs."], neSAppliquePas: ["Livres d'occasion."], doutes: [] },
  "sect.jeux": { articles: [{ type: "loi", nom: "Loi n° 2010-476", cid: "JORFTEXT000022204510", num: "21" }], sApplique: ["Opérateurs de jeux d'argent en ligne."], neSAppliquePas: [], doutes: ["Préciser les articles exacts (agrément, messages de mise en garde) : la règle cite la loi sans article."] },
  "sect.formation": { articles: [{ type: "code", code: "Code du travail", num: "L6352-12" }], sApplique: ["Organismes de formation professionnelle déclarés."], neSAppliquePas: [], doutes: [] },
  "sect.photos-retouchees": { articles: [{ type: "code", code: "Code de la santé publique", num: "L2133-2" }], sApplique: ["Photographies à usage commercial de mannequins dont la silhouette a été modifiée."], neSAppliquePas: ["Retouches qui ne modifient pas la silhouette."], doutes: [] },
};
