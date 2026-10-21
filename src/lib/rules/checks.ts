import type { Constat, DonneesCrawl, Entreprise, PageLegale } from "../types";
import { MOTIFS_PAGES_LEGALES, RE } from "../crawler/patterns";
import { SERVICES } from "../crawler/trackers";

/**
 * Vérifications automatiques, sans IA : elles ne lisent que ce que le crawler a observé.
 * Une vérification renvoie null quand elle n'a rien à dire (la règle reste alors « à vérifier »).
 */
type Check = (c: DonneesCrawl, e: Entreprise | null) => Constat | null;

const page = (c: DonneesCrawl, type: PageLegale["type"]) => c.pagesLegales.find((p) => p.type === type);
const liste = (xs: string[], max = 5) => xs.slice(0, max).join(", ") + (xs.length > max ? `… (+${xs.length - max})` : "");

const CATEGORIES_CONSENTEMENT = new Set(["analytics", "publicite", "reseau-social"]);
const CATEGORIES_INTEGRATIONS = new Set(["video", "carte", "polices", "chat"]);

const FORME_SOCIETE = /\b(SAS|SASU|SARL|EURL|SA|SNC|SCS|SCA|SCI|SCOP|SELARL|SELAS|SCP)\b|soci[ée]t[ée] (par actions simplifi[ée]e|[àa] responsabilit[ée] limit[ée]e|anonyme|en nom collectif|civile)/;
const FORME_AUTRE = /entrepreneur individuel|entreprise individuelle|micro-?entrepr|auto-?entrepr|\bEI\b|association|loi (de )?1901/i;
const ADRESSE = /\b\d{5}\s+\p{L}|\b\d{1,4}(?:\s?(?:bis|ter))?,?\s+(?:rue|avenue|av\.|boulevard|bd|place|quai|chemin|all[ée]e|impasse|route|cours|square)\b/iu;
const ADRESSE_ETRANGERE = /\b(street|road|avenue|house|way|drive|suite|strasse|straße|calle|via|platz)\b|\b[A-Z]\d{2}\s?[A-Z0-9]{4}\b|\b\d{4,5}\b/i;
const TELEPHONE_INTERNATIONAL = /\+\d{1,3}[\s.()\d-]{7,}\d/;

function presencePage(c: DonneesCrawl, type: PageLegale["type"], nom: string): Constat {
  const p = page(c, type);
  if (!p) return { statut: "manquant", preuve: `Aucune page « ${nom} » trouvée depuis la page d'accueil, ni aux adresses usuelles.` };
  const chemin = new URL(p.url).pathname;
  if (p.nonLu) return { statut: "partiel", preuve: `Document « ${nom} » trouvé (${chemin}), mais son texte n'a pas pu être lu : ${p.nonLu}. Un texte en image n'est pas lisible par tous (lecteurs d'écran, moteurs de recherche) : publiez-le aussi en texte.`, url: p.url, incertain: true };
  if (p.trouveeParAdresse)
    return { statut: "partiel", preuve: `Page « ${nom} » trouvée à l'adresse ${chemin}, mais aucun lien n'y mène depuis la page d'accueil : elle doit être accessible depuis toutes les pages.`, url: p.url, incertain: true };
  const liens = c.liens.filter((l) => l.href.split("#")[0] === p.url.split("#")[0]);
  // Le pied de page est l'usage, pas une exigence du texte : un lien ailleurs peut suffire.
  if (liens.length && !liens.some((l) => l.dansPiedDePage))
    return { statut: "partiel", preuve: `Page « ${nom} » trouvée (${chemin}) mais son lien n'a pas été repéré dans le pied de page : il doit rester accessible depuis toutes les pages.`, url: p.url, incertain: true };
  if (p.texte.trim().length < 200) return { statut: "partiel", preuve: `La page « ${nom} » est quasiment vide (${p.texte.trim().length} caractères).`, url: p.url };
  return { statut: "conforme", preuve: `Page « ${nom} » accessible (${chemin}).`, url: p.url };
}

/** Les SIREN respectent l'algorithme de Luhn. */
export function luhn(n: string): boolean {
  let somme = 0;
  for (let i = 0; i < n.length; i++) {
    let d = Number(n[n.length - 1 - i]);
    if (i % 2 === 1) d = d * 2 > 9 ? d * 2 - 9 : d * 2;
    somme += d;
  }
  return somme % 10 === 0;
}

export const CHECKS: Record<string, Check> = {
  "page-mentions": (c) => presencePage(c, "mentions-legales", "Mentions légales"),
  "page-confidentialite": (c) => presencePage(c, "confidentialite", "Politique de confidentialité"),
  "page-cgv": (c) => presencePage(c, "cgv", "Conditions générales de vente"),
  "page-cgu": (c) => presencePage(c, "cgu", "Conditions générales d'utilisation"),

  "identite-editeur": (c, e) => {
    const mentions = page(c, "mentions-legales");
    if (!mentions) return { statut: "manquant", preuve: "Pas de page de mentions légales." };
    const t = mentions.texte;
    const societe = FORME_SOCIETE.test(t) || /^(SAS|SARL|SA|EURL|SNC|SCI)/i.test(e?.formeJuridique ?? "");
    const elements: [string, boolean][] = [
      ["forme juridique", FORME_SOCIETE.test(t) || FORME_AUTRE.test(t)],
      ["adresse du siège", ADRESSE.test(t)],
      ...(societe ? [["capital social", RE.capital.test(t)] as [string, boolean]] : []),
    ];
    const trouve = elements.filter(([, ok]) => ok).map(([n]) => n);
    const manque = elements.filter(([, ok]) => !ok).map(([n]) => n);
    if (!manque.length) return { statut: "conforme", preuve: `Relevé dans les mentions : ${trouve.join(", ")}.`, url: mentions.url };
    // Un regex peut manquer une formulation inhabituelle : l'absence n'est qu'un indice.
    return { statut: "partiel", preuve: `Non repéré dans les mentions : ${manque.join(", ")}.`, url: mentions.url, incertain: true };
  },

  contact: (c) => {
    const { emails, telephones } = c.identite;
    if (emails.length && telephones.length) return { statut: "conforme", preuve: `${emails[0]} · ${telephones[0]}` };
    if (emails.length || telephones.length)
      // Vigie lit les pages légales et l'accueil : la donnée manquante peut figurer sur une page de contact.
      return { statut: "partiel", preuve: `Trouvé : ${[...emails, ...telephones].slice(0, 2).join(", ")}. Manque ${emails.length ? "un numéro de téléphone" : "une adresse e-mail"}.`, incertain: true };
    const formulaire = c.formulaires.some((f) => /contact/i.test(f.page));
    // Vigie lit les pages légales et l'accueil : les coordonnées peuvent figurer sur une page de contact.
    return {
      statut: formulaire ? "partiel" : "manquant",
      preuve: formulaire ? "Seul un formulaire de contact est proposé : une adresse e-mail et un téléphone sont exigés." : "Ni e-mail ni téléphone trouvés dans les pages légales.",
      incertain: true,
    };
  },

  siren: (c, e) => {
    if (!c.identite.siren.length) return { statut: "manquant", preuve: "Aucun numéro SIREN ou RCS trouvé dans les mentions légales." };
    const n = c.identite.siren[0];
    if (!luhn(n)) return { statut: "partiel", preuve: `Le numéro ${n} n'est pas un SIREN valide (clé de contrôle incorrecte).` };
    if (e) return { statut: "conforme", preuve: `SIREN ${n} : ${e.nom}${e.formeJuridique ? ` (${e.formeJuridique})` : ""}, vérifié au répertoire Sirene.` };
    return { statut: "partiel", preuve: `SIREN ${n} trouvé mais introuvable au répertoire Sirene : à vérifier.` };
  },

  tva: (c) =>
    c.identite.tva.length
      ? { statut: "conforme", preuve: `Numéro ${c.identite.tva[0]}.` }
      : { statut: "a-verifier", preuve: "Aucun numéro de TVA trouvé. Il n'est pas exigé en franchise en base de TVA ; sinon, il faut l'ajouter." },

  "directeur-publication": (c) =>
    !page(c, "mentions-legales")
      ? { statut: "manquant", preuve: "Pas de page de mentions légales." }
      : c.identite.directeurPublication
        ? { statut: "conforme", preuve: "Directeur ou responsable de la publication mentionné." }
        : c.identite.directeurAilleurs
          ? { statut: "conforme", preuve: `Directeur de la publication indiqué sur ${new URL(c.identite.directeurAilleurs).pathname}, mais pas dans les mentions légales : l'y ajouter rend l'information plus facile à trouver.`, url: c.identite.directeurAilleurs }
          : {
              statut: "manquant",
              preuve: `Aucun directeur de la publication trouvé, ni dans les pages légales (${c.pagesLegales.map((p) => new URL(p.url).pathname).join(", ")}), ni en pied de page, ni sur les ${c.pagesVisitees.length - c.pagesLegales.length} autres pages lues.`,
            },

  hebergeur: (c) => {
    if (!c.identite.hebergeur) return { statut: "manquant", preuve: "L'hébergeur n'est pas identifié dans les pages légales." };
    const texte = c.pagesLegales.filter((p) => p.type === "mentions-legales").map((p) => p.texte).join("\n") || c.pagesLegales.map((p) => p.texte).join("\n");
    const debut = texte.search(RE.hebergeur);
    const zone = debut < 0 ? "" : texte.slice(debut, debut + 800);
    const adresse = ADRESSE.test(zone) || ADRESSE_ETRANGERE.test(zone);
    const telephone = new RegExp(RE.telephone.source).test(zone) || TELEPHONE_INTERNATIONAL.test(zone);
    const nom = c.identite.hebergeur === "mentionné" ? "un hébergeur" : c.identite.hebergeur;
    const manque = [!adresse && "adresse", !telephone && "téléphone"].filter(Boolean) as string[];
    if (!manque.length) return { statut: "conforme", preuve: `Hébergeur : ${nom}, avec adresse et téléphone.` };
    return { statut: "partiel", preuve: `Hébergeur : ${nom}, mais sans ${manque.join(" ni ")} repéré à proximité.`, incertain: true };
  },

  "formulaires-mention": (c) => {
    const personnels = c.formulaires.filter((f) => f.champs.some((x) => /email|tel|nom|name|phone|adresse|address|password/i.test(x)));
    if (!personnels.length) return null;
    const sansMention = personnels.filter((f) => !/confidentialit|donn[ée]es personnelles|rgpd|vie priv[ée]e|privacy|traitement de vos donn/i.test(f.texteProche));
    if (!sansMention.length) return { statut: "conforme", preuve: `${personnels.length} formulaire(s), tous accompagnés d'une mention d'information.` };
    return {
      statut: sansMention.length === personnels.length ? "manquant" : "partiel",
      preuve: `${sansMention.length} formulaire(s) sur ${personnels.length} sans mention d'information ni lien vers la politique de confidentialité (${liste(sansMention.map((f) => new URL(f.page).pathname), 3)}).`,
      url: sansMention[0].page,
      // Vigie ne lit que le texte autour du formulaire : un lien placé plus loin peut lui échapper.
      incertain: true,
    };
  },

  https: (c) =>
    c.https ? { statut: "conforme", preuve: "Site servi en HTTPS." } : { statut: "manquant", preuve: `Le site est servi en clair (${new URL(c.urlFinale).protocol}).` },

  "traceurs-avant-consentement": (c) => {
    const cookies = [...new Set(c.cookiesAvantConsentement.filter((k) => CATEGORIES_CONSENTEMENT.has(k.categorie)).map((k) => `${k.nom}${k.service ? ` (${k.service})` : ""}`))];
    const scripts = [...new Set(c.requetesAvantConsentement.filter((r) => CATEGORIES_CONSENTEMENT.has(r.categorie)).map((r) => r.service ?? r.domaine))];
    if (!cookies.length && !scripts.length)
      return { statut: "conforme", preuve: "Aucun traceur publicitaire ou de mesure d'audience non exemptée n'a été chargé avant le consentement." };
    // Preuve certaine : des cookies de mesure ou de publicité écrits sur le terminal avant tout choix (art. 82).
    if (cookies.length)
      return { statut: "manquant", preuve: `Cookies déposés dès l'arrivée, sans consentement : ${liste(cookies, 6)}${scripts.length ? ` ; services chargés : ${liste(scripts, 5)}` : ""}.` };
    // Scripts chargés sans cookie : souvent le « mode consentement » de Google, qui attend le choix de l'internaute.
    return {
      statut: "manquant",
      preuve: `Services chargés dès l'arrivée : ${liste(scripts, 6)}, mais aucun cookie de suivi déposé. Possible mode consentement : à vérifier dans les réglages de l'outil.`,
      incertain: true,
    };
  },

  "traceurs-apres-refus": (c) => {
    const r = c.apresRefus;
    if (!r?.clique) return null;
    const cookies = [...new Set(r.cookiesEcrits.filter((k) => CATEGORIES_CONSENTEMENT.has(k.categorie)).map((k) => `${k.nom}${k.service ? ` (${k.service})` : ""}`))];
    const scripts = [...new Set(r.requetes.filter((q) => CATEGORIES_CONSENTEMENT.has(q.categorie)).map((q) => q.service ?? q.domaine))];
    if (!cookies.length && !scripts.length)
      return { statut: "conforme", preuve: `Après un clic sur « ${r.bouton} » puis le rechargement de la page, aucun traceur publicitaire ou de mesure d'audience non exemptée n'a été déposé ni chargé.` };
    // Preuve certaine : des cookies de suivi écrits sur le terminal après un refus explicite.
    if (cookies.length)
      return { statut: "manquant", preuve: `Après un clic sur « ${r.bouton} », des cookies de suivi ont quand même été déposés : ${liste(cookies, 6)}${scripts.length ? ` ; services contactés : ${liste(scripts, 5)}` : ""}.` };
    // Requêtes sans cookie : souvent le « mode consentement avancé » de Google, qui envoie des signaux sans cookie après un refus.
    return {
      statut: "manquant",
      preuve: `Après un clic sur « ${r.bouton} », le site contacte encore ${liste(scripts, 6)}, sans déposer de cookie. Possible « mode consentement » qui envoie des signaux anonymes : la CNIL ne l'a pas validé, à vérifier dans les réglages de l'outil.`,
      incertain: true,
    };
  },

  "accessibilite-auto": (c) => {
    const a = c.accessibilite;
    if (!a || a.erreur) return null;
    const graves = a.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    const decrire = (vs: typeof a.violations) =>
      liste(vs.map((v) => `${v.aide}${v.criteres.length ? ` (WCAG ${v.criteres.join(", ")})` : ""} : ${v.occurrences} élément${v.occurrences > 1 ? "s" : ""}`), 5);
    if (!a.violations.length)
      return { statut: "a-verifier", preuve: `Aucune erreur détectée par les ${a.reussis} tests automatiques sur la page d'accueil. Ces tests ne couvrent qu'une partie des critères : un audit manuel (RGAA) reste nécessaire.` };
    if (graves.length)
      return { statut: "partiel", preuve: `Erreurs d'accessibilité certaines sur la page d'accueil : ${decrire(graves)}.`, url: a.page };
    return { statut: "partiel", preuve: `Erreurs d'accessibilité de moindre impact sur la page d'accueil : ${decrire(a.violations)}.`, url: a.page, incertain: true };
  },

  "bouton-commande": (c) => {
    const t = c.tunnel;
    if (!t?.commandeAtteinte) return null;
    const clairs = t.boutonsFinals.filter((b) => /obligation de paiement|payer|paiement|acheter|achat|pay\b|pay now|buy/i.test(b));
    if (clairs.length) return { statut: "conforme", preuve: `Page de commande atteinte (sans rien commander) : bouton « ${clairs[0]} ».`, url: t.etapes.at(-1)?.url };
    if (t.boutonsFinals.length)
      // La directive cite « commander maintenant » ou « confirmer » parmi les formules ambiguës (considérant 39).
      return {
        statut: "partiel",
        preuve: `Le bouton de la page de commande s'intitule « ${t.boutonsFinals[0]} » : une formule qui ne dit pas qu'il faudra payer. Préférez « Commander avec obligation de paiement » ou « Payer ».`,
        url: t.etapes.at(-1)?.url,
        incertain: true,
      };
    return { statut: "a-verifier", preuve: "Page de commande atteinte, mais le bouton final n'apparaît qu'après la saisie des coordonnées : à vérifier par vous.", url: t.etapes.at(-1)?.url };
  },

  "prix-reference": (c) =>
    c.tunnel?.prixBarre
      ? {
          statut: "a-verifier",
          preuve: `Prix barré relevé sur ${new URL(c.tunnel.prixBarre.url).pathname} : « ${c.tunnel.prixBarre.texte} ». Le prix barré doit être le prix le plus bas pratiqué pendant les 30 jours précédant la réduction : vérifiez-le dans votre historique de prix.`,
          url: c.tunnel.prixBarre.url,
        }
      : null,

  "integrations-tierces": (c) => {
    const tiers = [...new Set(c.requetesAvantConsentement.filter((r) => CATEGORIES_INTEGRATIONS.has(r.categorie)).map((r) => r.service ?? r.domaine))];
    if (!tiers.length) return { statut: "conforme", preuve: "Aucune intégration tierce (vidéo, carte, polices) chargée avant consentement." };
    return { statut: "partiel", preuve: `Contenus tiers chargés sans consentement : ${liste(tiers)}. Les héberger localement ou les bloquer jusqu'au choix de l'internaute.` };
  },

  cmp: (c) =>
    c.cmp
      ? { statut: "conforme", preuve: `Solution de consentement détectée : ${c.cmp}.` }
      : c.boutonRefus !== null
        ? { statut: "conforme", preuve: "Un bandeau cookies est affiché (outil non identifié)." }
        : { statut: "manquant", preuve: "Aucun bandeau ou outil de gestion du consentement détecté." },

  "bouton-refus": (c) => {
    if (c.boutonRefus === true) return { statut: "conforme", preuve: "Un bouton de refus est visible au premier niveau du bandeau." };
    if (c.boutonRefus === false && c.murPayant)
      return {
        statut: "partiel",
        preuve: `Le bandeau${c.cmp ? ` (${c.cmp})` : ""} propose d'accepter les traceurs ou de s'abonner, sans bouton de refus gratuit. Ce « mur » avec alternative payante n'est pas interdit par principe : la CNIL l'apprécie au cas par cas (alternative réelle et équitable, prix raisonnable).`,
        incertain: true,
      };
    if (c.boutonRefus === false) return { statut: "manquant", preuve: `Le bandeau${c.cmp ? ` (${c.cmp})` : ""} propose d'accepter mais aucun bouton « Tout refuser » n'est visible au premier niveau.` };
    return c.cmp ? { statut: "a-verifier", preuve: "Bandeau détecté mais ses boutons n'ont pas pu être lus." } : null;
  },

  "duree-cookies": (c) => {
    const longs = c.cookiesAvantConsentement.filter((k) => k.expireJours !== null && k.expireJours > 395);
    if (!longs.length) return c.cookiesAvantConsentement.length ? { statut: "conforme", preuve: "Aucun cookie observé au-delà de 13 mois." } : null;
    return { statut: "partiel", preuve: `Cookies de plus de 13 mois : ${liste(longs.map((k) => `${k.nom} (${k.expireJours} jours)`))}.` };
  },

  "mesure-audience": (c) => {
    const tous = [...c.requetesAvantConsentement.map((r) => r.service), ...c.cookiesAvantConsentement.map((k) => k.service)].filter(Boolean) as string[];
    const nonExemptes = SERVICES.filter((s) => s.categorie === "analytics" && !s.exempte && tous.includes(s.service)).map((s) => s.service);
    const exemptes = SERVICES.filter((s) => s.categorie === "analytics" && s.exempte && tous.includes(s.service)).map((s) => s.service);
    if (nonExemptes.length) return { statut: "manquant", preuve: `${liste(nonExemptes)} ne bénéficie(nt) pas de l'exemption CNIL et a/ont été chargé(s) sans consentement.` };
    if (exemptes.length) return { statut: "a-verifier", preuve: `${liste(exemptes)} peut être exempté de consentement s'il est configuré selon les conditions CNIL (IP anonymisée, pas de recoupement).` };
    return null;
  },

  "lien-retractation": (c) =>
    c.signaux.lienRetractation
      ? { statut: "conforme", preuve: "Un lien ou bouton de rétractation est présent sur le site." }
      : {
          statut: "manquant",
          preuve: "Aucun lien ou bouton « Se rétracter » sur les pages publiques. Obligatoire depuis le 19 juin 2026 ; s'il se trouve dans l'espace client ou sur la plateforme de paiement, c'est conforme.",
          incertain: true,
        },

  "lien-resiliation": (c) =>
    c.signaux.lienResiliation
      ? { statut: "conforme", preuve: "Un lien de résiliation est présent." }
      : { statut: "a-verifier", preuve: "Aucun lien « Résilier » visible sur les pages publiques. Il peut se trouver dans l'espace client : à vérifier." },

  mediateur: (c) =>
    c.identite.mediateur
      ? { statut: "conforme", preuve: "Un médiateur de la consommation est mentionné." }
      : c.pagesLegales.some((p) => p.type === "cgv")
        ? { statut: "manquant", preuve: "Aucun médiateur de la consommation mentionné, ni dans les pages légales ni dans les CGV." }
        : { statut: "manquant", preuve: "Aucun médiateur de la consommation mentionné dans les pages lues (CGV introuvables).", incertain: true },

  "lien-odr": (c) =>
    c.signaux.lienODR ? { statut: "a-retirer", preuve: "Le site renvoie encore vers la plateforme européenne RLL, fermée depuis le 20 juillet 2025." } : null,

  "mention-accessibilite": (c) =>
    c.signaux.mentionAccessibilite
      ? { statut: "conforme", preuve: "Mention ou déclaration d'accessibilité présente." }
      : { statut: "manquant", preuve: "Aucune mention « Accessibilité : … conforme » ni déclaration d'accessibilité trouvée." },

  "allegations-vertes": (c) =>
    c.signaux.allegationsVertes.length
      ? { statut: "a-verifier", preuve: `Termes relevés : ${liste(c.signaux.allegationsVertes.map((a) => `« ${a} »`))}. Chacun doit être précis et justifié, sinon le retirer.` }
      : null,

  langue: (c) =>
    !c.langue || c.langue.toLowerCase().startsWith("fr")
      ? { statut: "conforme", preuve: "Contenu proposé en français." }
      : { statut: "partiel", preuve: `La page d'accueil est déclarée en « ${c.langue} » : l'offre et les conditions doivent exister en français.`, incertain: true },

  "message-alcool": (c) =>
    c.signaux.messageAlcool
      ? { statut: "conforme", preuve: "Message sanitaire présent." }
      : {
          statut: "manquant",
          // Le secteur est déduit des mots du site : si le site ne vend pas d'alcool, ce point ne le concerne pas.
          preuve: "Le site semble vendre de l'alcool, et le message « L'abus d'alcool est dangereux pour la santé… » n'a pas été trouvé. Si vous ne vendez pas d'alcool, décochez ce secteur dans le profil.",
          incertain: true,
        },
};

/** Vérifications qui concluent à partir des pages légales trouvées : elles ne valent que si Vigie a pu les chercher. */
const DEPENDANTES_DES_PAGES = new Set([
  "page-mentions", "page-confidentialite", "page-cgv", "page-cgu", "identite-editeur", "siren", "contact",
  "directeur-publication", "hebergeur", "mediateur", "mention-accessibilite",
]);

/**
 * Pied de page non lu (chargé par un script que Vigie n'a pas déclenché, page de blocage…) :
 * l'absence d'une page légale n'est alors qu'un indice, pas un constat.
 */
export function piedDePageLu(c: DonneesCrawl): boolean {
  if (c.statutHttp && c.statutHttp >= 400) return false;
  // Pages légales masquées par un mur de cookies ou illisibles : leur contenu est inconnu.
  if (c.pagesLegales.some((p) => p.nonLu && !p.format)) return false;
  // Une page légale bloquée par une vérification anti-robots : on ne sait pas ce qu'elle contient.
  if (c.pagesBloquees?.length) return false;
  // Il faut avoir vu le menu légal du site : au moins deux liens légaux dans le pied de page.
  const legaux = c.liens.filter((l) => l.dansPiedDePage && MOTIFS_PAGES_LEGALES.some((m) => m.texte.test(l.texte) || m.url.test(l.href)));
  return new Set(legaux.map((l) => l.href.split("#")[0])).size >= 2;
}

/** Le site a refusé le robot (code d'erreur, page anti-robots) : rien de ce qui a été vu n'est le vrai site. */
export function siteBloque(c: DonneesCrawl): boolean {
  return (!!c.statutHttp && c.statutHttp >= 400) || RE.antiRobot.test(c.titre + " " + c.texteAccueil.slice(0, 2000));
}

export function executerChecks(c: DonneesCrawl, e: Entreprise | null, ids: string[]): Record<string, Constat> {
  const r: Record<string, Constat> = {};
  const fiable = piedDePageLu(c);
  const bloque = siteBloque(c);
  for (const id of ids) {
    const fn = CHECKS[id];
    const res = fn?.(c, e);
    if (!res) continue;
    if (bloque) {
      // Aucun constat ne peut être affirmé sur un site qu'on n'a pas vu.
      r[id] =
        res.statut === "conforme" || res.statut === "a-verifier"
          ? res
          : { ...res, incertain: true, preuve: `${res.preuve} Le site a bloqué le robot d'audit${c.statutHttp && c.statutHttp >= 400 ? ` (code ${c.statutHttp})` : ""} : à confirmer.` };
      continue;
    }
    r[id] = !fiable && DEPENDANTES_DES_PAGES.has(id) && res.statut !== "conforme"
      ? {
          ...res,
          incertain: true,
          preuve: `${res.preuve} ${c.pagesBloquees?.length ? "Une page légale du site a été bloquée par une protection anti-robots" : "Le pied de page du site n'a pas pu être lu"} : à confirmer.`,
        }
      : res;
  }
  return r;
}
