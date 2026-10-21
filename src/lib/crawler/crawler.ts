import type { Browser, BrowserContext, Page } from "playwright-core";
import net from "node:net";
import type { Capture, DonneesCrawl, Formulaire, Lien, PageLegale } from "../types";
import { testerAccessibilite } from "./accessibilite";
import {
  ALLEGATIONS_VERTES,
  CHATBOTS,
  HEBERGEURS,
  MOTIFS_PAGES_LEGALES,
  MOTIFS_PAGES_UTILES,
  PAIEMENTS,
  PLATEFORMES,
  RE,
} from "./patterns";
import { lancerNavigateur, navigateurDistant } from "../navigateur";
import { proxyFiltrant } from "./proxy-filtrant";
import { MOTIF_REFUS, classerCookies, classerRequetes, testerRefus } from "./refus";
import { hoteInterdit } from "./reseau";
import { CMP_SIGNATURES } from "./trackers";
import { borne } from "./borne";
import { texteDuPdf } from "./pdf-texte";
import { parcourirTunnel } from "./tunnel";

const USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 VigieAudit/0.1 (+https://github.com/florestanb/vigie)";
const MAX_PAGES_UTILES = 5;
// Une CGV complète dépasse souvent 60 000 caractères : on garde tout, jusqu'à une limite haute.
const MAX_TEXTE_PAGE_LEGALE = 200_000;
const MAX_PDF_OCTETS = 15_000_000;
const estPdf = (href: string) => /\.pdf$/i.test(new URL(href).pathname);
const DELAI_PAGE = 25_000;
const DUREE_MAX_AUDIT = 240_000;

export { cheminChromium } from "../navigateur";

/** Domaine enregistrable approximatif (exemple.fr, exemple.co.uk). */
export function domaineRacine(host: string): string {
  const parties = host.replace(/^www\./, "").split(".");
  const secondNiveau = ["co", "com", "org", "net", "gouv", "asso", "ac"];
  if (parties.length > 2 && secondNiveau.includes(parties[parties.length - 2])) return parties.slice(-3).join(".");
  return parties.slice(-2).join(".");
}

export function normaliserUrl(saisie: string): string {
  let u = saisie.trim();
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  const url = new URL(u);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Seules les adresses http(s) sont acceptées.");
  const local = /^(localhost|127\.|10\.|192\.168\.|169\.254\.|0\.|\[::1\])/.test(url.hostname) || url.hostname.endsWith(".local");
  if (local && process.env.VIGIE_AUTORISER_LOCAL !== "1") {
    throw new Error("Cette adresse ne pointe pas vers un site public.");
  }
  url.hash = "";
  return url.toString();
}

interface ExtraitPage {
  url: string;
  titre: string;
  langue: string | null;
  texte: string;
  texteComplet: string;
  html: string;
  liens: Lien[];
  formulaires: Omit<Formulaire, "page">[];
  scripts: string[];
}

// Script exécuté dans la page. Écrit en JavaScript brut (chaîne) pour échapper aux transformations
// du bundler (helpers comme __name) qui n'existent pas dans le navigateur.
const SCRIPT_EXTRACTION = `(() => {
  const estPied = (el) => !!el.closest('footer, [role="contentinfo"], #footer, .footer, [class*="footer" i], [id*="footer" i]');
  const liens = Array.from(document.querySelectorAll("a[href]")).map((a) => ({
    texte: (a.innerText || a.getAttribute("aria-label") || a.getAttribute("title") || "").trim().replace(/\\s+/g, " ").slice(0, 120),
    href: a.href,
    dansPiedDePage: estPied(a),
  }));
  const formulaires = Array.from(document.querySelectorAll("form"))
    .map((f) => {
      const champs = Array.from(f.querySelectorAll("input, textarea, select"))
        .filter((c) => !["hidden", "submit", "button"].includes(c.type))
        .map((c) => (c.type === "text" || !c.type ? c.getAttribute("name") || c.getAttribute("autocomplete") || "texte" : c.type));
      const conteneur = f.parentElement || f;
      const recherche = f.getAttribute("role") === "search" || !!f.querySelector('input[type="search"], input[name="q"], input[name="s"]');
      return { champs, texteProche: (conteneur.innerText || "").replace(/\\s+/g, " ").slice(0, 1200), recherche };
    })
    .filter((f) => f.champs.length > 0 && !(f.recherche && f.champs.length <= 2))
    .map((f) => ({ champs: f.champs, texteProche: f.texteProche }));
  return {
    titre: document.title,
    langue: document.documentElement.getAttribute("lang"),
    texte: document.body ? document.body.innerText : "",
    // Texte complet, sections repliées (accordéons) comprises, sans scripts ni styles : pour les pages légales.
    texteComplet: (() => {
      if (!document.body) return "";
      const copie = document.body.cloneNode(true);
      copie.querySelectorAll("script, style, noscript, template, svg").forEach((n) => n.remove());
      copie.querySelectorAll("p, div, li, h1, h2, h3, h4, h5, h6, br, tr, section, article, dt, dd").forEach((n) => n.append("\\n"));
      return (copie.textContent || "").replace(/[ \\t\\u00a0]+/g, " ").replace(/\\n\\s*\\n+/g, "\\n").trim();
    })(),
    liens,
    formulaires,
    scripts: Array.from(document.scripts).map((s) => s.src).filter(Boolean),
  };
})()`;

// Beaucoup de sites ne chargent leur pied de page (et donc les liens légaux) qu'au défilement.
const SCRIPT_DEFILEMENT = `(async () => {
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));
  for (let i = 0; i < 40 && window.scrollY + window.innerHeight < document.body.scrollHeight - 10; i++) {
    window.scrollBy(0, Math.max(600, window.innerHeight * 0.9));
    await pause(150);
  }
  window.scrollTo(0, document.body.scrollHeight);
  await pause(400);
})()`;

/** Adresses usuelles des pages légales (dont celles de Shopify), essayées quand aucun lien n'a été repéré. */
const ADRESSES_USUELLES: Record<PageLegale["type"], string[]> = {
  "mentions-legales": ["/mentions-legales", "/pages/mentions-legales", "/policies/legal-notice", "/mentions-legales.html", "/legal"],
  confidentialite: ["/politique-de-confidentialite", "/pages/politique-de-confidentialite", "/policies/privacy-policy", "/confidentialite"],
  cgv: ["/cgv", "/pages/cgv", "/conditions-generales-de-vente", "/pages/conditions-generales-de-vente", "/policies/terms-of-service"],
  cgu: ["/cgu", "/pages/cgu", "/policies/terms-of-service", "/conditions-generales-d-utilisation", "/pages/conditions-generales-d-utilisation"],
  cookies: ["/politique-cookies", "/pages/politique-cookies", "/cookies"],
  accessibilite: ["/accessibilite", "/pages/accessibilite", "/declaration-accessibilite"],
};

async function extrairePage(page: Page): Promise<ExtraitPage> {
  const donnees = (await page.evaluate(SCRIPT_EXTRACTION)) as Omit<ExtraitPage, "url" | "html">;
  return { ...donnees, url: page.url(), html: await page.content() };
}

const MOTIF_ACCEPTER = /^[^\p{L}\p{N}]*(tout\s+accepter(\s+et\s+(fermer|continuer))?|accepter(\s+tout|\s+et\s+(fermer|continuer)|\s+(tous\s+)?les\s+cookies)?|j['’]accepte|ok(\s+pour\s+moi)?|d['’]accord|autoriser(\s+tous(\s+les\s+cookies)?|\s+tout)?|accept(\s+all)?(\s+cookies)?|allow\s+all(\s+cookies)?|agree|i\s+agree|alle\s+akzeptieren)[^\p{L}\p{N}]*$/iu;

/** Texte du bandeau qui contient le bouton « Accepter » (conteneur de dialogue ou de consentement le plus proche). */
const SCRIPT_TEXTE_BANDEAU = `(el) => {
  const c = el.closest('[role="dialog"], [aria-modal="true"], [class*="consent" i], [id*="consent" i], [class*="cookie" i], [id*="cookie" i], [class*="cmp" i], [id*="cmp" i], [class*="privacy" i]');
  let n = c || el;
  if (!c) for (let i = 0; i < 4 && n.parentElement; i++) n = n.parentElement;
  return (n.innerText || "").slice(0, 3000);
}`;
const ALTERNATIVE_PAYANTE = /s['’]abonner|abonnez-vous|je m['’]abonne|abonnement|subscribe|sans publicit[ée]/i;

/** Le bandeau propose-t-il de s'abonner à la place d'accepter les traceurs (« mur » avec alternative payante) ? */
async function bandeauPayant(page: Page): Promise<boolean> {
  for (const frame of page.frames().slice(0, 15)) {
    const accepter = frame.locator('button, a, [role="button"]').filter({ hasText: MOTIF_ACCEPTER });
    if (!(await borne(accepter.count(), 3_000, 0)) || !(await borne(accepter.first().isVisible(), 3_000, false))) continue;
    const texte = await borne(accepter.first().evaluate(new Function(`return (${SCRIPT_TEXTE_BANDEAU})`)() as (el: Element) => string), 3_000, "");
    return ALTERNATIVE_PAYANTE.test(texte);
  }
  return false;
}

async function detecterBoutonRefus(page: Page): Promise<{ refus: boolean; accepter: boolean }> {
  const tester = async (motif: RegExp) => {
    const candidats = page.locator('button, a, [role="button"], input[type="button"], input[type="submit"]').filter({ hasText: motif });
    const n = Math.min(await borne(candidats.count(), 5_000, 0), 10);
    for (let i = 0; i < n; i++) if (await borne(candidats.nth(i).isVisible(), 3_000, false)) return true;
    // Bandeaux dans un cadre (iframe) : un cadre qui ne répond pas est ignoré au bout de 3 secondes.
    for (const frame of page.frames().slice(1, 15)) {
      const c = frame.locator('button, a, [role="button"]').filter({ hasText: motif });
      if ((await borne(c.count(), 3_000, 0)) > 0 && (await borne(c.first().isVisible(), 3_000, false))) return true;
    }
    return false;
  };
  return { refus: await tester(MOTIF_REFUS), accepter: await tester(MOTIF_ACCEPTER) };
}

/** Tous les documents que couvre un lien (« CGV et confidentialité » mène à une seule page pour deux documents). */
function typesDuLien(lien: Lien): PageLegale["type"][] {
  const parTexte = MOTIFS_PAGES_LEGALES.filter((m) => m.texte.test(lien.texte)).map((m) => m.type);
  if (parTexte.length) return parTexte;
  const t = classerLienLegal(lien);
  return t ? [t] : [];
}

function classerLienLegal(lien: Lien): PageLegale["type"] | null {
  for (const m of MOTIFS_PAGES_LEGALES) {
    if (m.texte.test(lien.texte)) return m.type;
  }
  for (const m of MOTIFS_PAGES_LEGALES) {
    try {
      if (m.url.test(new URL(lien.href).pathname)) return m.type;
    } catch {
      /* lien invalide */
    }
  }
  return null;
}

function uniques<T>(liste: T[], cle: (x: T) => string = (x) => String(x)): T[] {
  const vus = new Set<string>();
  return liste.filter((x) => (vus.has(cle(x)) ? false : (vus.add(cle(x)), true)));
}

export interface OptionsCrawl {
  onEtape?: (message: string) => void;
  /** false : pas de parcours du tunnel de commande (audits de prospection, que le site n'a pas demandés). */
  tunnel?: boolean;
}

/** Résultat du parcours : les données de l'audit, plus les captures d'écran à enregistrer à part. */
export interface ResultatCrawl extends DonneesCrawl {
  capturesBrutes: Record<string, Buffer>;
}

/**
 * Garde-fou global : au bout de DUREE_MAX_AUDIT, l'audit échoue avec un message clair, quoi qu'attende encore
 * le navigateur (fermer le navigateur ne suffit pas toujours à débloquer une opération en cours).
 */
export function crawler(urlSaisie: string, options: OptionsCrawl = {}): Promise<ResultatCrawl> {
  const etat: { navigateur: Browser | null } = { navigateur: null };
  let chrono: NodeJS.Timeout | undefined;
  const delai = new Promise<never>((_, ko) => {
    chrono = setTimeout(() => {
      etat.navigateur?.close().catch(() => {});
      ko(new Error(`Le site met trop de temps à répondre : l'audit a été interrompu au bout de ${DUREE_MAX_AUDIT / 60_000} minutes. Réessayez plus tard.`));
    }, DUREE_MAX_AUDIT);
  });
  const parcours = parcourir(urlSaisie, options, etat);
  parcours.catch(() => {}); // s'il échoue après l'expiration, personne ne l'attend plus
  return Promise.race([parcours, delai]).finally(() => clearTimeout(chrono));
}

async function parcourir(urlSaisie: string, options: OptionsCrawl, etat: { navigateur: Browser | null }): Promise<ResultatCrawl> {
  const debut = Date.now();
  const etape = options.onEtape ?? (() => {});
  const url = normaliserUrl(urlSaisie);
  const erreurs: string[] = [];

  let navigateur: Browser | null = null;
  try {
    // Tout le trafic du navigateur passe par le proxy filtrant (aucun accès au réseau interne), y compris
    // celui vers localhost, que Chromium exempte de proxy par défaut (« <-loopback> » annule l'exemption).
    // Un navigateur distant ne peut pas joindre ce proxy local : il est filtré requête par requête.
    const filtrageParRequete = !!process.env.VIGIE_PROXY || navigateurDistant();
    const proxy = navigateurDistant() ? undefined : process.env.VIGIE_PROXY ? { server: process.env.VIGIE_PROXY } : { server: await proxyFiltrant(), bypass: "<-loopback>" };
    const lance = await lancerNavigateur({ proxy });
    navigateur = lance;
    etat.navigateur = lance;
    const ouvrirContexte = async (): Promise<BrowserContext> => {
      const ctx = await lance.newContext({
        userAgent: USER_AGENT,
        locale: "fr-FR",
        timezoneId: "Europe/Paris",
        viewport: { width: 1366, height: 900 },
        extraHTTPHeaders: { "Accept-Language": "fr-FR,fr;q=0.9" },
        proxy,
      });
      if (filtrageParRequete) {
        // Proxy sortant imposé par l'hébergement ou navigateur distant : le filtre local n'est pas en place,
        // on filtre au moins chaque requête (les redirections lui échappent : préférer le proxy filtrant).
        await ctx.route("**/*", async (route) => {
          let hote = "";
          try {
            hote = new URL(route.request().url()).hostname;
          } catch {
            /* data:, blob: */
          }
          return hote && (await hoteInterdit(hote)) ? route.abort("blockedbyclient") : route.continue();
        });
      }
      return ctx;
    };
    const contexte = await ouvrirContexte();
    const capturesBrutes: Record<string, Buffer> = {};
    const captures: Capture[] = [];
    const capturer = async (p: Page, nom: string, legende: string) => {
      const image = await p.screenshot({ type: "jpeg", quality: 60, timeout: 8_000 }).catch(() => null);
      if (!image) return;
      capturesBrutes[nom] = image;
      captures.push({ nom, legende, date: new Date().toISOString() });
    };
    if (await hoteInterdit(new URL(url).hostname)) throw new Error("Cette adresse ne pointe pas vers un site public.");

    // Aucune interaction avec le bandeau n'a lieu pendant tout le parcours : chaque requête et
    // chaque cookie observés l'ont été sans consentement.
    etape("Ouverture de la page d'accueil");
    const requetes: { host: string; path: string }[] = [];
    contexte.on("request", (r) => {
      try {
        const u = new URL(r.url());
        requetes.push({ host: u.hostname, path: u.pathname });
      } catch {
        /* data:, blob: */
      }
    });
    let page = await contexte.newPage();
    // Beaucoup de sites ne répondent correctement qu'avec « www » (certificat ou serveur absent sur le domaine nu).
    const sansWww = new URL(url);
    const avecWww = sansWww.hostname.startsWith("www.") || net.isIP(sansWww.hostname) ? null : url.replace("://", "://www.");
    const reponse = await page.goto(url, { waitUntil: "domcontentloaded", timeout: DELAI_PAGE }).catch(async (e: Error) => {
      if (!avecWww || !/ERR_(SSL|CERT|CONNECTION|NAME_NOT_RESOLVED|ADDRESS_UNREACHABLE|TIMED_OUT|EMPTY_RESPONSE)/.test(e.message)) throw e;
      etape(`Nouvel essai avec ${new URL(avecWww).hostname}`);
      // Onglet neuf : l'ancien est encore occupé à afficher sa page d'erreur.
      await page.close().catch(() => {});
      page = await contexte.newPage();
      return page.goto(avecWww, { waitUntil: "domcontentloaded", timeout: DELAI_PAGE });
    });
    await page.waitForLoadState("networkidle", { timeout: 12_000 }).catch(() => {});
    await page.waitForTimeout(2500);
    const urlFinale = page.url();
    const hoteSite = new URL(urlFinale).hostname;
    const racine = domaineRacine(hoteSite);

    etape("Relevé des cookies et traceurs déposés avant consentement");
    // Le bandeau est lu avant tout défilement, tel que l'internaute le découvre.
    const { refus, accepter } = await detecterBoutonRefus(page);
    // Sans bouton de refus, le bandeau propose-t-il de s'abonner à la place ? Cas apprécié au cas par cas par la CNIL.
    const murPayant = accepter && !refus ? await bandeauPayant(page) : false;
    await page.evaluate(SCRIPT_DEFILEMENT).catch(() => {});
    await page.waitForLoadState("networkidle", { timeout: 5_000 }).catch(() => {});
    const accueil = await extrairePage(page);
    const htmlScripts = accueil.html + accueil.scripts.join(" ");
    const cmp = CMP_SIGNATURES.find((c) => c.motifs.some((m) => m.test(htmlScripts)))?.nom ?? null;

    // 2. Pages légales et pages utiles.
    const liens = uniques(accueil.liens.filter((l) => /^https?:/.test(l.href)), (l) => l.href.split("#")[0] + "|" + l.texte);
    const internes = liens.filter((l) => {
      try {
        return domaineRacine(new URL(l.href).hostname) === racine;
      } catch {
        return false;
      }
    });
    const legales = new Map<PageLegale["type"], string>();
    // Les liens de pied de page sont prioritaires. Les CGV en PDF sont souvent servies par un autre domaine (CDN) : on les suit aussi.
    const pdfExternes = liens.filter((l) => !internes.includes(l) && /^https?:/.test(l.href) && estPdf(l.href));
    for (const lien of [...internes.filter((l) => l.dansPiedDePage), ...internes, ...pdfExternes]) {
      for (const type of typesDuLien(lien)) if (!legales.has(type)) legales.set(type, lien.href.split("#")[0]);
    }
    // Les CGV/CGU hébergées chez un tiers (Shopify policies, etc.) restent sur le même domaine ; on ne suit pas les autres.

    // Faute de lien repéré, on essaie les adresses usuelles : une page qui existe mais n'est liée nulle part
    // reste un manquement (elle doit être accessible), mais pas une absence.
    const parAdresse = new Set<string>();
    for (const [type, chemins] of Object.entries(ADRESSES_USUELLES) as [PageLegale["type"], string[]][]) {
      if (legales.has(type)) continue;
      const motif = MOTIFS_PAGES_LEGALES.find((m) => m.type === type)!;
      for (const chemin of chemins) {
        const essai = new URL(chemin, urlFinale).toString();
        // Sans suivre de redirection : la cible d'une redirection échapperait au contrôle du réseau.
        const r = await contexte.request.get(essai, { timeout: 8_000, maxRedirects: 0 }).catch(() => null);
        if (!r?.ok()) continue;
        const finale = new URL(r.url());
        if (domaineRacine(finale.hostname) !== racine || finale.pathname === "/" ) continue;
        if (!motif.texte.test((await r.text().catch(() => "")).slice(0, 200_000))) continue;
        legales.set(type, finale.toString().split("#")[0]);
        parAdresse.add(finale.toString().split("#")[0]);
        break;
      }
    }

    const pagesLegales: PageLegale[] = [];
    const pagesBloquees: string[] = [];
    const pagesVisitees = [urlFinale];
    const formulaires: Formulaire[] = accueil.formulaires.map((f) => ({ ...f, page: urlFinale }));
    let texteGlobal = accueil.texte;
    // Texte des pages commerciales seules (accueil, produits…) : les pages légales parlent de tout et faussent les signaux.
    let texteCommercial = accueil.texte;
    let htmlGlobal = accueil.html;
    // Texte de chaque page visitée hors pages légales, pour retrouver une mention placée ailleurs.
    const autresPages: { url: string; texte: string }[] = [{ url: urlFinale, texte: accueil.texte }];
    const dejaVu = new Map<string, PageLegale["type"]>();

    for (const [type, href] of legales) {
      const precedent = dejaVu.get(href);
      if (precedent) {
        // Une même page sert plusieurs documents (ex. « Mentions légales et CGV »).
        const p = pagesLegales.find((x) => x.url === href);
        if (p) pagesLegales.push({ ...p, type });
        continue;
      }
      etape(`Lecture : ${href}`);
      // Document PDF : le navigateur le télécharge au lieu de l'afficher ; on lit son texte directement.
      const lirePdf = async () => {
        const r = await contexte.request.get(href, { timeout: 20_000, maxRedirects: process.env.VIGIE_PROXY ? 0 : 3 });
        const octets = await r.body();
        if (!r.ok() || octets.length > MAX_PDF_OCTETS || !/^%PDF/.test(octets.subarray(0, 5).toString("latin1"))) throw new Error("PDF illisible");
        const texte = await texteDuPdf(new Uint8Array(octets));
        pagesLegales.push({
          type,
          url: href,
          titre: decodeURIComponent(new URL(href).pathname.split("/").pop() ?? "document.pdf"),
          texte: texte.slice(0, MAX_TEXTE_PAGE_LEGALE),
          format: "pdf",
          ...(texte.length < 200 ? { nonLu: "PDF sans texte lisible (document scanné ?)" } : {}),
        });
        texteGlobal += "\n" + texte;
        pagesVisitees.push(href);
        dejaVu.set(href, type);
      };
      if (estPdf(href)) {
        await lirePdf().catch((e: Error) => erreurs.push(`Document ${href} illisible : ${e.message.split("\n")[0]}`));
        continue;
      }
      let p: Page | null = null;
      try {
        p = await contexte.newPage();
        const page = p;
        const versPdf = await page.goto(href, { waitUntil: "domcontentloaded", timeout: DELAI_PAGE }).then(
          (r) => /application\/pdf/i.test(r?.headers()["content-type"] ?? ""),
          (e: Error) => (/Download is starting/i.test(e.message) ? true : Promise.reject(e)),
        );
        if (versPdf) {
          await page.close().catch(() => {});
          await lirePdf();
          continue;
        }
        await page.waitForLoadState("networkidle", { timeout: 6_000 }).catch(() => {});
        await p.waitForLoadState("networkidle", { timeout: 6_000 }).catch(() => {});
        let ex = await extrairePage(page);
        // Vérification anti-robots : souvent levée seule en quelques secondes ; sinon la page n'a pas pu être lue.
        if (RE.antiRobot.test(ex.titre + " " + ex.texte.slice(0, 2000))) {
          await page.waitForTimeout(7_000);
          await page.waitForLoadState("networkidle", { timeout: 6_000 }).catch(() => {});
          ex = await extrairePage(page);
          if (RE.antiRobot.test(ex.titre + " " + ex.texte.slice(0, 2000))) {
            pagesBloquees.push(href);
            erreurs.push(`Page ${href} bloquée par une vérification anti-robots`);
            continue;
          }
        }
        const complet = ex.texteComplet.length > ex.texte.length ? ex.texteComplet : ex.texte;
        pagesLegales.push({ type, url: ex.url, titre: ex.titre, texte: complet.slice(0, MAX_TEXTE_PAGE_LEGALE), ...(parAdresse.has(href) ? { trouveeParAdresse: true } : {}) });
        formulaires.push(...ex.formulaires.map((f) => ({ ...f, page: ex.url })));
        texteGlobal += "\n" + ex.texte;
        pagesVisitees.push(ex.url);
        dejaVu.set(href, type);
      } catch (e) {
        erreurs.push(`Page ${href} illisible : ${(e as Error).message.split("\n")[0]}`);
      } finally {
        await p?.close().catch(() => {});
      }
    }

    // Mur de cookies ou page d'attente : toutes les pages légales affichent le même texte court, ou seulement le bandeau.
    // Leur contenu réel n'a pas été lu : on le signale au lieu d'en tirer des constats.
    const textes = new Map<string, number>();
    for (const p of pagesLegales) if (!p.format) textes.set(p.texte, (textes.get(p.texte) ?? 0) + 1);
    for (const p of pagesLegales) {
      if (p.format || p.nonLu) continue;
      const memeTexteAilleurs = (textes.get(p.texte) ?? 0) > 1 && new Set(pagesLegales.filter((x) => x.texte === p.texte).map((x) => x.url)).size > 1;
      const bandeauSeul = p.texte.length < 2500 && RE.murCookies.test(p.texte);
      if ((memeTexteAilleurs && p.texte.length < 5000) || bandeauSeul)
        p.nonLu = memeTexteAilleurs ? "toutes les pages légales affichent le même court texte (mur de cookies ou page d'attente)" : "la page n'affiche qu'un bandeau ou un mur de cookies";
    }

    // Fréquent sur Shopify : les « Conditions d'utilisation » contiennent en réalité les conditions de vente.
    const cgu = pagesLegales.find((p) => p.type === "cgu");
    if (cgu && !pagesLegales.some((p) => p.type === "cgv") && /r[ée]tractation/i.test(cgu.texte) && /livraison|commande/i.test(cgu.texte)) {
      pagesLegales.push({ ...cgu, type: "cgv" });
    }

    const utiles = uniques(
      internes
        .filter((l) => !legales.has(classerLienLegal(l) as PageLegale["type"]))
        .filter((l) => MOTIFS_PAGES_UTILES.some((m) => m.test(l.href) || m.test(l.texte)))
        .map((l) => l.href.split("#")[0])
        .filter((h) => h !== urlFinale && !pagesVisitees.includes(h)),
    ).slice(0, MAX_PAGES_UTILES);

    for (const href of utiles) {
      etape(`Exploration : ${href}`);
      try {
        const p = await contexte.newPage();
        await p.goto(href, { waitUntil: "domcontentloaded", timeout: DELAI_PAGE });
        await p.waitForTimeout(1200);
        const ex = await extrairePage(p);
        formulaires.push(...ex.formulaires.map((f) => ({ ...f, page: ex.url })));
        texteGlobal += "\n" + ex.texte;
        texteCommercial += "\n" + ex.texte;
        htmlGlobal += ex.html;
        autresPages.push({ url: ex.url, texte: ex.texte });
        pagesVisitees.push(ex.url);
        await p.close();
      } catch (e) {
        erreurs.push(`Page ${href} illisible : ${(e as Error).message.split("\n")[0]}`);
      }
    }

    const cookiesAvantConsentement = classerCookies(await contexte.cookies(), racine);
    const requetesAvantConsentement = classerRequetes(requetes, racine);

    // Relevés faits, le parcours peut désormais agir sur les pages : tests d'accessibilité sur l'accueil.
    etape("Tests automatiques d'accessibilité");
    const accessibilite = await testerAccessibilite(page);

    // 3. Signaux et identité.
    etape("Analyse des signaux du site");
    const texteLegal = pagesLegales.map((p) => p.texte).join("\n");
    const piedDePage = liens.filter((l) => l.dansPiedDePage).map((l) => l.texte).join(" | ");
    const texteIdentite = texteLegal + "\n" + accueil.texte.slice(-4000);
    const tousLesLiens = liens.map((l) => `${l.texte} ${l.href}`).join("\n");

    const sirens = uniques(
      Array.from(texteIdentite.matchAll(RE.siren)).map((m) => m[1].replace(/\D/g, "").slice(0, 9)).filter((s) => s.length === 9),
    );
    const resultat: DonneesCrawl = {
      url,
      urlFinale,
      // Une page de blocage (403) servie en HTTPS reste servie en HTTPS.
      https: urlFinale.startsWith("https://"),
      statutHttp: reponse?.status() ?? null,
      langue: accueil.langue,
      titre: accueil.titre,
      pagesVisitees,
      liens: liens.slice(0, 400),
      pagesLegales,
      formulaires: uniques(formulaires, (f) => f.champs.join(",") + f.texteProche.slice(0, 80)).slice(0, 20),
      requetesAvantConsentement,
      cookiesAvantConsentement,
      cmp,
      boutonRefus: cmp || accepter ? refus : null,
      ...(murPayant ? { murPayant: true } : {}),
      signaux: {
        panier: RE.panier.test(texteGlobal),
        paiement: PAIEMENTS.filter((p) => p.motif.test(htmlGlobal)).map((p) => p.nom),
        prix: RE.prix.test(texteGlobal),
        prixBarres: RE.prixBarre.test(htmlGlobal),
        abonnement: RE.abonnement.test(accueil.texte + tousLesLiens),
        compte: RE.compte.test(tousLesLiens) || formulaires.some((f) => f.champs.includes("password")),
        newsletter: RE.newsletter.test(texteGlobal),
        avis: RE.avis.test(accueil.texte),
        chatbot: CHATBOTS.find((c) => c.motif.test(htmlScripts))?.nom ?? null,
        plateforme: PLATEFORMES.find((p) => p.motif.test(htmlGlobal))?.nom ?? null,
        allegationsVertes: uniques(
          ALLEGATIONS_VERTES.flatMap((re) => {
            const m = texteGlobal.match(re);
            return m ? [m[0]] : [];
          }),
        ).slice(0, 8),
        // Vendeur d'alcool : au moins 4 mentions et 2 mots différents sur les pages commerciales.
        alcool: (() => {
          const mots = (texteCommercial.match(new RegExp(RE.alcool.source, "gi")) ?? []).map((m) => m.toLowerCase().replace(/s$/, ""));
          return mots.length >= 4 && new Set(mots).size >= 2;
        })(),
        messageAlcool: RE.messageAlcool.test(texteGlobal),
        marketplace: RE.marketplace.test(texteGlobal),
        contenusNumeriques: RE.contenusNumeriques.test(accueil.texte),
        blog: RE.blog.test(tousLesLiens),
        commentaires: RE.commentaires.test(texteGlobal),
        pro: RE.pro.test(accueil.texte),
        reserveAuxPros: RE.reserveAuxPros.test(texteGlobal),
        lienRetractation: liens.some((l) => RE.retractation.test(l.texte) || /retract/i.test(l.href)),
        lienResiliation: liens.some((l) => RE.resiliation.test(l.texte) || /resili/i.test(l.href)),
        lienODR: RE.odr.test(tousLesLiens + texteLegal),
        mentionAccessibilite: RE.accessibilite.test(accueil.texte + piedDePage) || legales.has("accessibilite"),
      },
      identite: {
        siren: sirens,
        tva: uniques(Array.from(texteIdentite.matchAll(RE.tva)).map((m) => m[0].replace(/\s/g, "").toUpperCase())),
        emails: uniques(Array.from(texteIdentite.matchAll(RE.email)).map((m) => m[0].toLowerCase())).filter((e) => !/\.(png|jpe?g|webp|svg)$/.test(e)).slice(0, 5),
        telephones: uniques(Array.from(texteIdentite.matchAll(RE.telephone)).map((m) => m[0])).slice(0, 5),
        rcs: RE.rcs.test(texteIdentite),
        capital: RE.capital.test(texteIdentite),
        hebergeur: (() => {
          const idx = texteLegal.search(RE.hebergeur);
          if (idx < 0) return null;
          const zone = texteLegal.slice(idx, idx + 600);
          return HEBERGEURS.find((h) => h.motif.test(zone))?.nom ?? "mentionné";
        })(),
        directeurPublication: RE.directeur.test(texteLegal + "\n" + accueil.texte.slice(-4000)),
        directeurAilleurs: RE.directeur.test(texteLegal + "\n" + accueil.texte.slice(-4000)) ? undefined : autresPages.find((x) => RE.directeur.test(x.texte))?.url,
        mediateur: RE.mediateur.test(texteLegal + tousLesLiens),
      },
      texteAccueil: accueil.texte.slice(0, 8000),
      erreurs,
      pagesBloquees,
      accessibilite,
      duree: 0,
    };
    resultat.signaux.lienODR ||= RE.odr.test(htmlGlobal);

    const memeSite = (u: string) => {
      try {
        return domaineRacine(new URL(u).hostname) === racine;
      } catch {
        return false;
      }
    };
    if (options.tunnel !== false && (resultat.signaux.panier || ["Shopify", "WooCommerce", "PrestaShop", "Magento"].includes(resultat.signaux.plateforme ?? ""))) {
      etape("Parcours du tunnel de commande (sans rien commander)");
      resultat.tunnel = await parcourirTunnel(contexte, urlFinale, liens, resultat.signaux.plateforme, memeSite, capturer);
    }
    await contexte.close().catch(() => {});

    if (resultat.boutonRefus) {
      etape("Clic sur « Tout refuser » et relevé des traceurs restants");
      const vierge = await ouvrirContexte();
      resultat.apresRefus = await testerRefus(vierge, urlFinale, racine, capturer);
      await vierge.close().catch(() => {});
    }
    resultat.captures = captures;
    resultat.duree = Date.now() - debut;
    return { ...resultat, capturesBrutes };
  } finally {
    await navigateur?.close().catch(() => {});
  }
}
