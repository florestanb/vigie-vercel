import type { PageLegale } from "../types";

type TypeLegal = PageLegale["type"];

/** Reconnaissance des pages légales à partir du texte du lien et de son URL. Ordre = priorité. */
export const MOTIFS_PAGES_LEGALES: { type: TypeLegal; texte: RegExp; url: RegExp }[] = [
  { type: "mentions-legales", texte: /mentions?\s+l[ée]gales?|informations?\s+l[ée]gales|legals?\s+(mentions?|notices?|informations?)|legal\s+notice|imprint|impressum|[ée]diteur du site/i, url: /mentions?[-_]?legales?|legals?[-_]?(notices?|mentions?|informations?)|imprint|impressum|informations?[-_]legales/i },
  { type: "confidentialite", texte: /confidentialit[ée]|donn[ée]es\s+personnelles|vie\s+priv[ée]e|privacy|rgpd|protection\s+des\s+donn[ée]es/i, url: /confidentialit|donnees[-_]?personnelles|privacy|rgpd|vie[-_]?privee|protection[-_]des[-_]donnees/i },
  { type: "cookies", texte: /politique\s+(de\s+)?cookies|gestion\s+des\s+cookies|cookies?\s+policy|charte\s+cookies|^cookies$/i, url: /cookie/i },
  // « Conditions générales » ou « Terms and conditions » seuls : selon le site, ce sont ses CGV, ses CGU, ou les deux.
  { type: "cgv", texte: /conditions\s+g[ée]n[ée]rales\s+de\s+vente|\bcgv\b|conditions\s+de\s+vente|conditions\s+commerciales|terms\s+of\s+sale|conditions\s+g[ée]n[ée]rales\s+d['’]achat|terms\s*(and|&)\s*conditions|^\s*conditions\s+g[ée]n[ée]rales\s*$/i, url: /\bcgv\b|conditions[-_]generales[-_]de[-_]vente|conditions[-_]de[-_]vente|terms[-_]of[-_]sale|terms[-_](and[-_])?conditions|cgv/i },
  { type: "cgu", texte: /conditions\s+g[ée]n[ée]rales\s+d['’]utilisation|\bcgu\b|conditions\s+d['’]utilisation|terms\s+of\s+(use|service)|terms\s*(and|&)\s*conditions|^\s*conditions\s+g[ée]n[ée]rales\s*$/i, url: /\bcgu\b|conditions[-_]generales[-_]d[-_]?utilisation|conditions[-_]d[-_]?utilisation|terms[-_]of[-_](use|service)|terms[-_](and[-_])?conditions|\/terms\b|cgu/i },
  { type: "accessibilite", texte: /accessibilit[ée]/i, url: /accessibilit/i },
];

/** Pages internes intéressantes à visiter en plus des pages légales. */
export const MOTIFS_PAGES_UTILES: RegExp[] = [
  /contact/i,
  /panier|cart|checkout|commande/i,
  /boutique|shop|produit|product|collections?\//i,
  /tarif|pricing|prix|abonnement|offres?|plans?\b/i,
  /inscription|signup|register|creer-un-compte|mon-compte|account|login|connexion/i,
  /newsletter/i,
];

export const RE = {
  siren: /\b(?:siren|siret|rcs|r\.c\.s\.?|n°\s*d['’]immatriculation|immatricul[ée]e?)[^0-9]{0,40}((?:\d[\s.]?){9}(?:(?:\d[\s.]?){5})?)/gi,
  sirenNu: /\b\d{3}\s?\d{3}\s?\d{3}\b/g,
  tva: /\bFR\s?[0-9A-HJ-NP-Z]{2}\s?\d{3}\s?\d{3}\s?\d{3}\b/gi,
  rcs: /\brcs\b|r\.c\.s\.|registre du commerce|registre national des entreprises|\brne\b|r[ée]pertoire des m[ée]tiers/i,
  capital: /capital\s+(social\s+)?(de\s+|variable\s+)?[:\s]*[\d\s.,]+\s*(€|euros?|eur)/i,
  email: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi,
  telephone: /(?<![\dA-Za-z])(?:\+33\s?(?:\(0\)\s?)?|0)[1-9](?:[\s.-]?\d{2}){4}(?!\d)/g,
  // « Directeur de la publication : … » et ses variantes ; pas « directeur général » ni « directeur commercial ».
  directeur: /(co)?(directeur|directrice|responsable)s?\s+(de\s+)?(la\s+)?publication|direction\s+de\s+(la\s+)?publication|publication\s*:\s*\p{Lu}|directeur\s+de\s+(la\s+)?r[ée]daction|responsable\s+[ée]ditorial|publication\s+director|editor\s+in\s+chief|verantwortlich\s+f[üu]r\s+den\s+inhalt/iu,
  hebergeur: /h[ée]berg(?:eur|ement|[ée] par)|hosting|hosted by/i,
  mediateur: /m[ée]diat(?:eur|ion)\s+(de\s+la\s+)?consommation|m[ée]diateur|cm2c|medicys|sas\s+cnpm|mediateur-conso|centre de la m[ée]diation de la consommation/i,
  odr: /ec\.europa\.eu\/(consumers\/)?odr|webgate\.ec\.europa\.eu\/odr|plateforme (europ[ée]enne )?(de )?(r[èe]glement en ligne|rll)/i,
  retractation: /r[ée]tract|renoncer au contrat|droit de retour|annuler (ma|une|la) commande|withdraw/i,
  resiliation: /r[ée]silier|r[ée]siliation|cancel( my)? subscription|mettre fin [àa] (mon|votre) abonnement/i,
  accessibilite: /accessibilit[ée]\s*:?\s*(non|partiellement|totalement)\s+conforme|d[ée]claration d['’]accessibilit[ée]/i,
  prix: /\d+(?:[.,]\d{2})?\s?(?:€|eur\b)|€\s?\d+/i,
  ttc: /\bttc\b|toutes taxes comprises/i,
  panier: /ajouter au panier|add to cart|mon panier|votre panier|commander|acheter maintenant|buy now|passer (la|à la) commande|checkout/i,
  abonnement: /abonnement|abonnez-vous|par mois|\/mois|\/an\b|par an|mensuel|annuel|subscribe|per month|essai gratuit|free trial/i,
  compte: /mon compte|mon espace|espace client|se connecter|connexion|cr[ée]er un compte|sign in|log in|login|sign up|account/i,
  newsletter: /newsletter|lettre d['’]information|inscrivez-vous à notre|abonnez-vous à notre/i,
  avis: /avis clients?|avis v[ée]rifi[ée]s|trustpilot|★|note moyenne|\d(?:[.,]\d)?\s?\/\s?5\b|reviews?/i,
  // Mots entiers seulement (« gin » ne doit pas attraper « login » ou « origin »).
  alcool: /\b(vins?|champagnes?|whiskys?|whiskies|rhums?|bi[èe]res?|spiritueux|cognacs?|vodkas?|gin|liqueurs?|cavistes?|cr[ée]mants?|ap[ée]ritifs?)\b/i,
  marketplace: /devenir vendeur|vendez sur|vendre sur notre|vendeurs? (tiers|partenaires|professionnels)|place de march[ée]|marketplace|vendu par\s+[A-Z]/i,
  contenusNumeriques: /ebook|e-book|t[ée]l[ée]chargement imm[ée]diat|licence|logiciel|application|streaming|formation en ligne|cours en ligne|saas|plateforme en ligne/i,
  blog: /\bblog\b|actualit[ée]s|articles?\b|magazine/i,
  commentaires: /laisser un commentaire|commentaires?\s*\(\d+\)|r[ée]pondre au commentaire|forum|publier une annonce|d[ée]poser une annonce/i,
  pro: /professionnels|entreprises|\bb2b\b|demander un devis|devis gratuit|espace pro/i,
  reserveAuxPros: /r[ée]serv[ée]e? aux professionnels|exclusivement aux professionnels|vente aux professionnels uniquement/i,
  /** Pages de vérification anti-robots (Cloudflare, DataDome, Akamai…) : leur texte n'est pas celui du site. */
  antiRobot: /v[ée]rification de s[ée]curit[ée] en cours|checking (if the site connection is secure|your browser)|just a moment\.\.\.|enable javascript and cookies to continue|attention required!? \| cloudflare|performances? et s[ée]curit[ée] par cloudflare|performance (&|and) security by cloudflare|please verify you are a human|v[ée]rifiez que vous [êe]tes (un )?humain|access denied|acc[èe]s refus[ée]|ddos protection by|captcha-delivery\.com|datadome/i,
  /** Texte d'un mur ou d'un bandeau de consentement qui masque la page. */
  murCookies: /(accepter|refuser|param[ée]trer|personnaliser|consentir).{0,300}(cookies|traceurs|partenaires)|(cookies|traceurs|partenaires).{0,300}(accepter|consentement|refuser)|abonnez-vous pour (lire|continuer)|sans accepter les cookies/is,
  messageAlcool: /l['’]abus d['’]alcool est dangereux pour la sant[ée]/i,
  prixBarre: /<(?:del|s|strike)\b[^>]*>[^<]*\d|class="[^"]*(?:compare|old-price|price--compare|was-price|regular-price|line-through)[^"]*"|-\d{1,2}\s?%|soldes|promo/i,
};

/** Allégations environnementales génériques (directive 2024/825). */
export const ALLEGATIONS_VERTES: RegExp[] = [
  /[ée]co[-\s]?responsables?/i,
  /respectueu(?:x|se)s? de l['’]environnement|respectueu(?:x|se)s? de la plan[èe]te/i,
  /neutres? en carbone|carbone? neutre|z[ée]ro carbone|neutralit[ée] carbone|climate neutral|carbon neutral/i,
  /\b100\s?%\s?(?:[ée]colo|naturel|vert|green|durable|recycl)/i,
  /[ée]cologiques?/i,
  /eco[-\s]?friendly|green(?:er)? products?/i,
  /bon(?:ne)? pour la plan[èe]te|z[ée]ro impact|impact positif/i,
  /biod[ée]gradables?/i,
  /durables?\b(?! dans le temps)/i,
];

export const CHATBOTS: { nom: string; motif: RegExp }[] = [
  { nom: "Intercom Fin", motif: /intercom/i },
  { nom: "Crisp", motif: /crisp\.chat|\$crisp/i },
  { nom: "Zendesk", motif: /zdassets|zendesk/i },
  { nom: "Tidio", motif: /tidio/i },
  { nom: "Tawk.to", motif: /tawk\.to/i },
  { nom: "Drift", motif: /drift/i },
  { nom: "HubSpot Chat", motif: /hs-scripts|hubspot.*conversations/i },
  { nom: "Botpress", motif: /botpress/i },
  { nom: "Voiceflow", motif: /voiceflow/i },
  { nom: "chatbot", motif: /chatbot|assistant virtuel|assistant ia|ai assistant/i },
];

export const PLATEFORMES: { nom: string; motif: RegExp }[] = [
  { nom: "Shopify", motif: /cdn\.shopify\.com|Shopify\.theme/ },
  { nom: "WooCommerce", motif: /woocommerce/i },
  { nom: "PrestaShop", motif: /prestashop/i },
  { nom: "WordPress", motif: /wp-content|wp-includes/ },
  { nom: "Wix", motif: /wixstatic|wix\.com/ },
  { nom: "Squarespace", motif: /squarespace/i },
  { nom: "Webflow", motif: /webflow/i },
  { nom: "Magento", motif: /magento|mage\/cookies/i },
  { nom: "Next.js", motif: /__NEXT_DATA__|\/_next\// },
  { nom: "Wizishop", motif: /wizishop/i },
];

export const PAIEMENTS: { nom: string; motif: RegExp }[] = [
  { nom: "Stripe", motif: /js\.stripe\.com/ },
  { nom: "PayPal", motif: /paypal(objects)?\.com/ },
  { nom: "Shopify Payments", motif: /shop_pay|shopify-payment/i },
  { nom: "Lyra / PayZen", motif: /payzen|lyra/i },
  { nom: "Mollie", motif: /mollie/i },
  { nom: "Alma", motif: /getalma|alma\.eu/i },
  { nom: "Paybox / Up2pay", motif: /paybox|up2pay/i },
  { nom: "Adyen", motif: /adyen/i },
];

export const HEBERGEURS: { nom: string; motif: RegExp }[] = [
  { nom: "OVHcloud", motif: /ovh/i },
  { nom: "o2switch", motif: /o2switch/i },
  { nom: "IONOS", motif: /ionos|1\s?&\s?1/i },
  { nom: "Hostinger", motif: /hostinger/i },
  { nom: "Gandi", motif: /gandi/i },
  { nom: "Scaleway", motif: /scaleway|online\.net/i },
  { nom: "Infomaniak", motif: /infomaniak/i },
  { nom: "PlanetHoster", motif: /planethoster/i },
  { nom: "LWS", motif: /\blws\b|ligne web services/i },
  { nom: "Clever Cloud", motif: /clever cloud/i },
  { nom: "Vercel", motif: /vercel/i },
  { nom: "Netlify", motif: /netlify/i },
  { nom: "Shopify", motif: /shopify/i },
  { nom: "Wix", motif: /wix\.com|wix\b/i },
  { nom: "Squarespace", motif: /squarespace/i },
  { nom: "Webflow", motif: /webflow/i },
  { nom: "Amazon Web Services", motif: /amazon web services|\baws\b/i },
  { nom: "Google Cloud", motif: /google (cloud|ireland)/i },
  { nom: "Microsoft Azure", motif: /azure/i },
  { nom: "GitHub Pages", motif: /github/i },
  { nom: "Cloudflare", motif: /cloudflare/i },
  { nom: "WordPress.com", motif: /automattic|wordpress\.com/i },
  { nom: "Hetzner", motif: /hetzner/i },
  { nom: "OVH", motif: /roubaix/i },
];
