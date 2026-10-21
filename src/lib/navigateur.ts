import fs from "node:fs";
import { chromium, type Browser, type LaunchOptions } from "playwright-core";

/**
 * Lancement de Chromium, selon l'hébergement :
 * - VIGIE_NAVIGATEUR_WS : navigateur distant (Browserless ou équivalent), joint par WebSocket ;
 * - Vercel (ou AWS Lambda) : le Chromium allégé de @sparticuz/chromium, décompressé au premier lancement ;
 * - ailleurs : un Chromium ou Chrome installé sur la machine (CHROMIUM_PATH, sinon les emplacements habituels).
 */

export const serverless = () => process.env.VERCEL === "1" || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

/** Navigateur distant : le proxy filtrant local ne lui est pas joignable, le filtrage se fait requête par requête. */
export const navigateurDistant = () => !!process.env.VIGIE_NAVIGATEUR_WS?.trim();

export function cheminChromium(): string | undefined {
  const candidats = [
    process.env.CHROMIUM_PATH,
    "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ];
  return candidats.find((c) => c && fs.existsSync(c));
}

export async function lancerNavigateur(options: Pick<LaunchOptions, "proxy"> = {}): Promise<Browser> {
  const ws = process.env.VIGIE_NAVIGATEUR_WS?.trim();
  if (ws) {
    // Serveur Playwright (« npx playwright run-server ») ou service compatible CDP (Browserless…).
    return /^wss?:\/\/.*\/(playwright|chromium\/playwright)/.test(ws) ? chromium.connect(ws, { timeout: 30_000 }) : chromium.connectOverCDP(ws, { timeout: 30_000 });
  }
  if (serverless() && !process.env.CHROMIUM_PATH) {
    const { default: sparticuz } = await import("@sparticuz/chromium");
    sparticuz.setGraphicsMode = false;
    return chromium.launch({ executablePath: await sparticuz.executablePath(), args: sparticuz.args, headless: true, ...options });
  }
  return chromium.launch({ executablePath: cheminChromium(), headless: true, args: ["--no-sandbox"], ...options });
}
