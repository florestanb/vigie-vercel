// Services tiers reconnus à partir des domaines appelés et des noms de cookies.
// "exempte" : peut fonctionner sans consentement (strictement nécessaire ou mesure d'audience
// configurée selon les conditions CNIL). Le reste exige un consentement préalable.

export interface ServiceTiers {
  service: string;
  categorie: "analytics" | "publicite" | "reseau-social" | "video" | "carte" | "polices" | "cmp" | "chat" | "paiement" | "cdn" | "autre";
  domaines: string[];
  /** Noms propres au service : reconnus quel que soit le domaine (cookies « première partie » comme _ga). */
  cookies?: RegExp[];
  /** Noms trop génériques (test_cookie, fr…) : reconnus seulement s'ils viennent d'un domaine du service. */
  cookiesDuDomaine?: RegExp[];
  exempte?: boolean;
  horsUE?: boolean;
}

export const SERVICES: ServiceTiers[] = [
  { service: "Google Analytics", categorie: "analytics", domaines: ["google-analytics.com", "analytics.google.com"], cookies: [/^_ga/, /^_gid$/, /^_gat/], horsUE: true },
  { service: "Google Tag Manager", categorie: "analytics", domaines: ["googletagmanager.com"], horsUE: true },
  { service: "Google Ads / DoubleClick", categorie: "publicite", domaines: ["doubleclick.net", "googleadservices.com", "googlesyndication.com", "adservice.google.com"], cookies: [/^_gcl_/], cookiesDuDomaine: [/^IDE$/, /^test_cookie$/], horsUE: true },
  { service: "Meta Pixel", categorie: "publicite", domaines: ["connect.facebook.net", "facebook.com/tr", "facebook.net"], cookies: [/^_fbp$/, /^_fbc$/], cookiesDuDomaine: [/^fr$/], horsUE: true },
  { service: "TikTok Pixel", categorie: "publicite", domaines: ["analytics.tiktok.com"], cookies: [/^_ttp$/, /^_tt_/], horsUE: true },
  { service: "LinkedIn Insight", categorie: "publicite", domaines: ["snap.licdn.com", "px.ads.linkedin.com"], cookies: [/^li_(sugr|fat_id|gc)$/], cookiesDuDomaine: [/^li_/, /^bcookie$/, /^lidc$/], horsUE: true },
  { service: "Pinterest Tag", categorie: "publicite", domaines: ["ct.pinterest.com", "s.pinimg.com"], cookies: [/^_pin_unauth$/, /^_pinterest/], horsUE: true },
  { service: "Snapchat Pixel", categorie: "publicite", domaines: ["sc-static.net", "tr.snapchat.com"], horsUE: true },
  { service: "X (Twitter) Pixel", categorie: "publicite", domaines: ["static.ads-twitter.com", "analytics.twitter.com", "t.co"], horsUE: true },
  { service: "Microsoft Advertising / Bing", categorie: "publicite", domaines: ["bat.bing.com"], cookies: [/^_uet/], cookiesDuDomaine: [/^MUID$/], horsUE: true },
  { service: "Criteo", categorie: "publicite", domaines: ["criteo.com", "criteo.net"], cookies: [/^cto_/] },
  { service: "Taboola", categorie: "publicite", domaines: ["taboola.com"], horsUE: true },
  { service: "Outbrain", categorie: "publicite", domaines: ["outbrain.com"], horsUE: true },
  { service: "Microsoft Clarity", categorie: "analytics", domaines: ["clarity.ms"], cookies: [/^_clck$/, /^_clsk$/], cookiesDuDomaine: [/^CLID$/], horsUE: true },
  { service: "Hotjar", categorie: "analytics", domaines: ["hotjar.com", "hotjar.io"], cookies: [/^_hj/] },
  { service: "Contentsquare", categorie: "analytics", domaines: ["contentsquare.net"], cookies: [/^_cs_/] },
  { service: "Mixpanel", categorie: "analytics", domaines: ["mixpanel.com"], horsUE: true },
  { service: "Segment", categorie: "analytics", domaines: ["segment.com", "segment.io"], horsUE: true },
  { service: "Amplitude", categorie: "analytics", domaines: ["amplitude.com"], horsUE: true },
  { service: "HubSpot", categorie: "analytics", domaines: ["hs-scripts.com", "hs-analytics.net", "hubspot.com", "hsforms.net"], cookies: [/^__hs/, /^hubspotutk$/], horsUE: true },
  { service: "Matomo", categorie: "analytics", domaines: ["matomo.cloud", "matomo.org"], cookies: [/^_pk_/], exempte: true },
  { service: "Piwik PRO", categorie: "analytics", domaines: ["piwik.pro", "containers.piwik.pro"], exempte: true },
  { service: "AT Internet / Piano Analytics", categorie: "analytics", domaines: ["xiti.com", "ati-host.net", "piano.io"], cookies: [/^atuserid$/], exempte: true },
  { service: "Plausible", categorie: "analytics", domaines: ["plausible.io"], exempte: true },
  { service: "Fathom", categorie: "analytics", domaines: ["usefathom.com"], exempte: true },
  { service: "Abla / Eulerian", categorie: "analytics", domaines: ["eulerian.net"], exempte: true },
  { service: "YouTube", categorie: "video", domaines: ["youtube.com", "youtube-nocookie.com", "ytimg.com", "googlevideo.com"], cookies: [/^VISITOR_INFO/, /^YSC$/], horsUE: true },
  { service: "Vimeo", categorie: "video", domaines: ["vimeo.com", "vimeocdn.com"], cookiesDuDomaine: [/^vuid$/], horsUE: true },
  { service: "Google Maps", categorie: "carte", domaines: ["maps.googleapis.com", "maps.google.com", "maps.gstatic.com"], horsUE: true },
  { service: "Google Fonts", categorie: "polices", domaines: ["fonts.googleapis.com", "fonts.gstatic.com"], horsUE: true },
  { service: "Adobe Fonts", categorie: "polices", domaines: ["use.typekit.net", "p.typekit.net"], horsUE: true },
  { service: "Facebook (widgets)", categorie: "reseau-social", domaines: ["facebook.com/plugins", "fbcdn.net"], horsUE: true },
  { service: "Instagram (intégration)", categorie: "reseau-social", domaines: ["instagram.com", "cdninstagram.com"], horsUE: true },
  { service: "X (Twitter) widgets", categorie: "reseau-social", domaines: ["platform.twitter.com", "syndication.twitter.com"], horsUE: true },
  { service: "AddThis / ShareThis", categorie: "reseau-social", domaines: ["addthis.com", "sharethis.com"], horsUE: true },
  { service: "Intercom", categorie: "chat", domaines: ["intercom.io", "intercomcdn.com", "widget.intercom.io"], cookies: [/^intercom-/], horsUE: true },
  { service: "Crisp", categorie: "chat", domaines: ["crisp.chat"], cookies: [/^crisp-client/] },
  { service: "Zendesk", categorie: "chat", domaines: ["zdassets.com", "zendesk.com"], horsUE: true },
  { service: "Tawk.to", categorie: "chat", domaines: ["tawk.to"], horsUE: true },
  { service: "Drift", categorie: "chat", domaines: ["drift.com", "driftt.com"], horsUE: true },
  { service: "Axeptio", categorie: "cmp", domaines: ["axept.io", "axeptio.eu"], exempte: true },
  { service: "Didomi", categorie: "cmp", domaines: ["didomi.io", "privacy-center.org"], exempte: true },
  { service: "Cookiebot", categorie: "cmp", domaines: ["cookiebot.com", "consent.cookiebot.com"], exempte: true },
  { service: "OneTrust", categorie: "cmp", domaines: ["cookielaw.org", "onetrust.com"], exempte: true },
  { service: "Sirdata", categorie: "cmp", domaines: ["sddan.com", "sirdata.com"], exempte: true },
  { service: "Iubenda", categorie: "cmp", domaines: ["iubenda.com"], exempte: true },
  { service: "Usercentrics", categorie: "cmp", domaines: ["usercentrics.eu", "usercentrics.com"], exempte: true },
  { service: "Complianz", categorie: "cmp", domaines: ["complianz.io"], exempte: true },
  { service: "CookieYes", categorie: "cmp", domaines: ["cookieyes.com"], exempte: true },
  { service: "Stripe", categorie: "paiement", domaines: ["js.stripe.com", "stripe.com", "stripe.network"], exempte: true, horsUE: true },
  { service: "PayPal", categorie: "paiement", domaines: ["paypal.com", "paypalobjects.com"], exempte: true, horsUE: true },
  { service: "Shopify", categorie: "autre", domaines: ["cdn.shopify.com", "shopify.com", "shopifysvc.com"], cookies: [/^_shopify_y$/, /^_shopify_s$/, /^_shopify_sa_/], horsUE: true },
  { service: "Cloudflare", categorie: "cdn", domaines: ["cloudflare.com", "cdnjs.cloudflare.com", "cloudflareinsights.com"], cookies: [/^__cf_bm$/, /^cf_clearance$/], exempte: true },
  { service: "jsDelivr / unpkg", categorie: "cdn", domaines: ["cdn.jsdelivr.net", "unpkg.com"], exempte: true },
  { service: "Google reCAPTCHA", categorie: "autre", domaines: ["google.com/recaptcha", "recaptcha.net", "gstatic.com/recaptcha"], horsUE: true },
];

// Plateformes de gestion du consentement (CMP), détectées dans le DOM ou les scripts.
export const CMP_SIGNATURES: { nom: string; motifs: RegExp[] }[] = [
  { nom: "Axeptio", motifs: [/axeptio/i] },
  { nom: "Didomi", motifs: [/didomi/i] },
  { nom: "Cookiebot", motifs: [/cookiebot|CybotCookiebot/i] },
  { nom: "OneTrust", motifs: [/onetrust|optanon/i] },
  { nom: "tarteaucitron", motifs: [/tarteaucitron/i] },
  { nom: "Sirdata", motifs: [/sirdata|sddan/i] },
  { nom: "Iubenda", motifs: [/iubenda/i] },
  { nom: "Usercentrics", motifs: [/usercentrics/i] },
  { nom: "Complianz", motifs: [/cmplz|complianz/i] },
  { nom: "CookieYes", motifs: [/cookieyes|cky-consent/i] },
  { nom: "Cookie Notice", motifs: [/cookie-notice|cn-notice/i] },
  { nom: "Shopify Customer Privacy", motifs: [/shopify-pc__banner|privacy-banner/i] },
  { nom: "Osano", motifs: [/osano/i] },
  { nom: "Quantcast Choice", motifs: [/qc-cmp/i] },
  { nom: "TrustArc", motifs: [/trustarc|truste/i] },
  { nom: "Squarespace", motifs: [/sqs-cookie-banner|gdpr-cookie-banner/i] },
];

// Cookies techniques courants qui ne nécessitent pas de consentement.
export const COOKIES_TECHNIQUES: RegExp[] = [
  /^PHPSESSID$/i, /^JSESSIONID$/i, /^ASP\.NET_SessionId$/i, /^session/i, /^sess/i, /^csrf/i, /^XSRF-TOKEN$/i, /^__Host-/, /^__Secure-/,
  /^wp-wpml_current_language$/, /^wordpress_test_cookie$/, /^wp_lang$/, /^woocommerce_/, /^wp_woocommerce_session/,
  /^cart/i, /^lang$/i, /^locale$/i, /^currency$/i, /^__cf_bm$/, /^cf_clearance$/, /^AWSALB/, /^AWSELB/, /^incap_ses/, /^visid_incap/, /^nlbi_/,
  /^axeptio_/, /^didomi_token$/, /^euconsent/, /^CookieConsent$/, /^OptanonConsent$/, /^OptanonAlertBoxClosed$/, /^tarteaucitron$/, /^cmplz_/, /^cookieyes-consent$/,
  /^_shopify_essential$/, /^secure_customer_sig$/, /^localization$/, /^cart_currency$/, /^_cmp_a$/, /^keep_alive$/, /^PrestaShop-/,
];

export function identifierDomaine(host: string, chemin = ""): ServiceTiers | undefined {
  const cible = host + chemin;
  return SERVICES.find((s) => s.domaines.some((d) => (d.includes("/") ? cible.includes(d) : host === d || host.endsWith("." + d))));
}

export function identifierCookie(nom: string, domaine = ""): ServiceTiers | undefined {
  // On compare les domaines principaux : un cookie de .linkedin.com vient bien de px.ads.linkedin.com.
  const racine = (h: string) => h.replace(/^\./, "").toLowerCase().split("/")[0].split(".").slice(-2).join(".");
  const d = racine(domaine);
  const duService = (s: ServiceTiers) => !!d && s.domaines.some((x) => racine(x) === d);
  return (
    SERVICES.find((s) => s.cookies?.some((re) => re.test(nom))) ??
    SERVICES.find((s) => s.cookiesDuDomaine?.some((re) => re.test(nom)) && duService(s))
  );
}

export function estCookieTechnique(nom: string): boolean {
  return COOKIES_TECHNIQUES.some((re) => re.test(nom));
}
