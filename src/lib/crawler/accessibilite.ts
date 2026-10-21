import fs from "node:fs";
import { createRequire } from "node:module";
import type { Page } from "playwright-core";
import type { ResultatAccessibilite } from "../types";

/**
 * Tests automatiques d'accessibilité avec axe-core (Deque, licence MPL 2.0), sur les critères WCAG 2.1 A et AA
 * (ceux que reprennent la norme EN 301 549 et le RGAA). axe ne signale que des erreurs certaines, mais
 * les tests automatiques ne couvrent qu'une partie des critères : une page sans erreur n'est pas pour autant accessible.
 */

let sources: { axe: string; locale: string } | null = null;

function chargerSources() {
  if (!sources) {
    const require = createRequire(import.meta.url);
    sources = {
      axe: fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8"),
      locale: fs.readFileSync(require.resolve("axe-core/locales/fr.json"), "utf8"),
    };
  }
  return sources;
}

// Exécuté dans la page (chaîne brute : voir SCRIPT_EXTRACTION dans crawler.ts).
const SCRIPT_TESTS = `(async () => {
  const r = await window.axe.run(document, {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
    resultTypes: ["violations"],
  });
  return {
    reussis: r.passes.length,
    violations: r.violations.map((v) => ({
      id: v.id,
      impact: v.impact || null,
      aide: v.help,
      criteres: v.tags.filter((t) => /^wcag\\d{3,4}$/.test(t)).map((t) => t.replace(/^wcag(\\d)(\\d)(\\d+)$/, "$1.$2.$3")),
      occurrences: v.nodes.length,
      exemple: ((v.nodes[0] && v.nodes[0].target) || []).join(" ").slice(0, 160),
    })),
  };
})()`;

/** Sur une page très lourde, axe peut prendre plusieurs minutes : au-delà, on renonce plutôt que de bloquer l'audit. */
const DUREE_MAX = 25_000;

export async function testerAccessibilite(page: Page): Promise<ResultatAccessibilite> {
  let chrono: NodeJS.Timeout | undefined;
  const delai = new Promise<never>((_, ko) => (chrono = setTimeout(() => ko(new Error("tests d'accessibilité trop longs sur cette page")), DUREE_MAX)));
  try {
    return await Promise.race([tester(page), delai]);
  } catch (e) {
    return { page: page.url(), violations: [], reussis: 0, erreur: (e as Error).message.split("\n")[0].slice(0, 200) };
  } finally {
    clearTimeout(chrono);
  }
}

async function tester(page: Page): Promise<ResultatAccessibilite> {
  try {
    const { axe, locale } = chargerSources();
    // evaluate échappe à la politique de sécurité (CSP) du site, contrairement à une balise <script> ajoutée.
    await page.evaluate(axe);
    await page.evaluate(`window.axe.configure({ locale: ${locale} })`);
    const r = (await page.evaluate(SCRIPT_TESTS)) as Omit<ResultatAccessibilite, "page">;
    const ordre = { critical: 0, serious: 1, moderate: 2, minor: 3 } as const;
    r.violations.sort((a, b) => (a.impact ? ordre[a.impact] : 4) - (b.impact ? ordre[b.impact] : 4) || b.occurrences - a.occurrences);
    return { page: page.url(), ...r };
  } catch (e) {
    return { page: page.url(), violations: [], reussis: 0, erreur: (e as Error).message.split("\n")[0].slice(0, 200) };
  }
}
