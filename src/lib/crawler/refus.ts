import type { BrowserContext, Locator, Page } from "playwright-core";
import type { ApresRefus, CookieObserve, RequeteTierce } from "../types";
import { borne } from "./borne";
import { domaineRacine } from "./crawler";
import { estCookieTechnique, identifierCookie, identifierDomaine } from "./trackers";

/**
 * Second passage, dans un navigateur vierge : l'internaute clique sur « Tout refuser ». On relève ensuite
 * ce qui est encore écrit sur son terminal ou envoyé à des tiers, au clic puis au rechargement de la page.
 * C'est le contrôle que fait la CNIL : un refus doit être respecté, pas seulement proposé.
 */

const BORD = "[^\\p{L}\\p{N}]*";
export const MOTIF_REFUS = new RegExp(
  `^${BORD}(` +
    [
      "tout\\s+refuser(\\s+et\\s+fermer)?",
      "refuser\\s+tout",
      "tout\\s+rejeter",
      "rejeter(\\s+tout|\\s+tous\\s+les\\s+cookies)?",
      "refuser(\\s+et\\s+fermer|\\s+tous\\s+les\\s+cookies|\\s+les\\s+cookies(\\s+(non\\s+(essentiels|n[ée]cessaires)|optionnels|facultatifs))?)?",
      "je\\s+refuse",
      "non,?\\s+merci",
      "continuer\\s+sans\\s+accepter",
      "(cookies\\s+)?(strictement\\s+)?(n[ée]cessaires|essentiels)\\s+uniquement",
      "uniquement\\s+(les\\s+)?(cookies\\s+)?(strictement\\s+)?(n[ée]cessaires|essentiels)",
      "reject(\\s+all)?(\\s+cookies)?",
      "decline(\\s+all)?",
      "deny(\\s+all)?",
      "refuse(\\s+all)?",
      "only\\s+(strictly\\s+)?necessary(\\s+cookies)?",
      "nur\\s+notwendige(\\s+cookies)?",
    ].join("|") +
    `)${BORD}$`,
  "iu",
);
const SELECTEUR = 'button, a, [role="button"], input[type="button"], input[type="submit"]';

/** Premier bouton de refus visible, dans la page ou dans le cadre du bandeau. */
export async function trouverBoutonRefus(page: Page): Promise<Locator | null> {
  for (const frame of page.frames().slice(0, 15)) {
    const candidats = frame.locator(SELECTEUR).filter({ hasText: MOTIF_REFUS });
    const n = Math.min(await borne(candidats.count(), 3_000, 0), 10);
    for (let i = 0; i < n; i++) if (await borne(candidats.nth(i).isVisible(), 3_000, false)) return candidats.nth(i);
  }
  return null;
}

export function classerCookies(cookies: { name: string; domain: string; expires: number }[], racine: string): CookieObserve[] {
  const maintenant = Date.now() / 1000;
  return cookies
    .filter((c) => !estCookieTechnique(c.name))
    .map((c) => {
      const service = identifierCookie(c.name, c.domain);
      return {
        nom: c.name,
        domaine: c.domain,
        expireJours: c.expires > 0 ? Math.round((c.expires - maintenant) / 86400) : null,
        service: service?.service,
        categorie: service ? (service.exempte ? "exempte" : service.categorie) : domaineRacine(c.domain.replace(/^\./, "")) === racine ? "premiere-partie" : "inconnu",
      };
    });
}

export function classerRequetes(requetes: { host: string; path: string }[], racine: string): RequeteTierce[] {
  const vus = new Set<string>();
  return requetes
    .filter((r) => domaineRacine(r.host) !== racine)
    .map((r) => {
      const s = identifierDomaine(r.host, r.path);
      return { domaine: r.host, categorie: s ? (s.exempte ? "exempte" : s.categorie) : "autre", service: s?.service };
    })
    .filter((r) => (vus.has(r.service ?? r.domaine) ? false : (vus.add(r.service ?? r.domaine), true)));
}

const DUREE_MAX = 70_000;

export async function testerRefus(
  contexte: BrowserContext,
  url: string,
  racine: string,
  capturer: (page: Page, nom: string, legende: string) => Promise<void>,
): Promise<ApresRefus> {
  const page = await contexte.newPage();
  // Garde-fou : un site qui ne finit jamais de charger ne doit pas bloquer l'audit.
  const chrono = setTimeout(() => page.close().catch(() => {}), DUREE_MAX);
  const requetes: { host: string; path: string }[] = [];
  let ecoute = false;
  contexte.on("request", (r) => {
    if (!ecoute) return;
    try {
      const u = new URL(r.url());
      requetes.push({ host: u.hostname, path: u.pathname });
    } catch {
      /* data:, blob: */
    }
  });
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25_000 });
    await page.waitForLoadState("networkidle", { timeout: 12_000 }).catch(() => {});
    await page.waitForTimeout(2500);
    await capturer(page, "bandeau", "Page d'accueil à l'arrivée, avant toute action de l'internaute");
    const bouton = await trouverBoutonRefus(page);
    if (!bouton) return { clique: false, cookiesEcrits: [], requetes: [] };
    const libelle = ((await bouton.innerText().catch(() => "")) || (await bouton.getAttribute("value").catch(() => "")) || "Tout refuser").trim().slice(0, 60);

    const cle = (c: { name: string; domain: string }) => `${c.name}|${c.domain}`;
    const avant = new Set((await contexte.cookies()).map(cle));
    ecoute = true;
    await bouton
      .click({ timeout: 5_000 })
      .catch(() => bouton.click({ timeout: 3_000, force: true }))
      .catch(() => bouton.evaluate((el) => (el as HTMLElement).click()));
    await page.waitForLoadState("networkidle", { timeout: 6_000 }).catch(() => {});
    await page.waitForTimeout(2000);
    // Le refus doit tenir d'une page à l'autre : on recharge, comme un internaute qui poursuit sa visite.
    await page.reload({ waitUntil: "domcontentloaded", timeout: 25_000 }).catch(() => {});
    await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});
    await page.waitForTimeout(2500);
    await capturer(page, "apres-refus", `Page rechargée après un clic sur « ${libelle} »`);

    const nouveaux = (await contexte.cookies()).filter((c) => !avant.has(cle(c)));
    return { clique: true, bouton: libelle, cookiesEcrits: classerCookies(nouveaux, racine), requetes: classerRequetes(requetes, racine) };
  } catch (e) {
    return { clique: false, cookiesEcrits: [], requetes: [], erreur: page.isClosed() ? "test du refus interrompu (durée maximale atteinte)" : (e as Error).message.split("\n")[0].slice(0, 200) };
  } finally {
    clearTimeout(chrono);
    await page.close().catch(() => {});
  }
}
