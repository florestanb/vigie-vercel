import crypto from "node:crypto";
import { signalerErreur } from "./journal";

/**
 * Tâches longues (audit d'un site suivi, étape d'une campagne de prospection).
 *
 * Sur Vercel, une fonction s'arrête dès sa réponse envoyée (au plus tard à maxDuration) : on ne peut pas
 * laisser tourner un audit « en fond » dans le processus comme sur un serveur classique. Chaque tâche est
 * donc confiée à une nouvelle exécution de la route interne /api/interne/tache, qui répond aussitôt puis
 * travaille jusqu'à maxDuration (fonction after() de Next.js). Une campagne avance ainsi site par site,
 * chaque étape déclenchant la suivante.
 *
 * Hors du serveur Next.js (scripts, tests), la tâche s'exécute directement dans le processus.
 */

export type Tache = { type: "suivi"; compte: string; domaine: string } | { type: "campagne"; id: string; chaine: string };

let secretLocal: string | null = null;

/** Secret des appels internes et de la tâche planifiée : CRON_SECRET (posé aussi par Vercel pour ses crons). */
export function secretInterne(): string {
  const cron = process.env.CRON_SECRET?.trim();
  if (cron) return cron;
  const session = process.env.VIGIE_SECRET?.trim();
  if (session) return crypto.createHmac("sha256", session).update("vigie:taches-internes").digest("hex");
  // Développement sans secret : valable pour ce seul processus.
  secretLocal ??= crypto.randomBytes(32).toString("hex");
  return secretLocal;
}

/** La requête porte-t-elle le secret interne (« Authorization: Bearer … ») ? */
export function appelInterne(req: Request): boolean {
  const recu = req.headers.get("authorization")?.match(/^Bearer\s+(.+)$/)?.[1] ?? "";
  const attendu = secretInterne();
  return recu.length === attendu.length && crypto.timingSafeEqual(Buffer.from(recu), Buffer.from(attendu));
}

/** Adresse à laquelle le serveur se joint lui-même. */
export function origineInterne(): string {
  const explicite = process.env.VIGIE_URL_INTERNE?.trim();
  if (explicite) return explicite.replace(/\/$/, "");
  // Production : le domaine de production (non soumis à la protection des déploiements).
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://127.0.0.1:${process.env.PORT || 3000}`;
}

export async function executerTache(t: Tache): Promise<void> {
  // Imports différés : ces modules importent eux-mêmes celui-ci.
  if (t.type === "suivi") {
    const { auditerSiteSuivi } = await import("./suivi");
    await auditerSiteSuivi(t.compte, t.domaine);
  } else {
    const { etapeEnFond } = await import("./prospection/campagne");
    await etapeEnFond(t.id, t.chaine);
  }
}

const nomTache = (t: Tache) => (t.type === "suivi" ? "Suivi des sites" : "Campagne de prospection");

/** Lance une tâche dans une exécution séparée. Ne fait qu'attendre qu'elle soit acceptée. */
export async function declencher(t: Tache): Promise<void> {
  if (!process.env.NEXT_RUNTIME) {
    executerTache(t).catch((e) => signalerErreur(nomTache(t), e, { ...t }));
    return;
  }
  const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();
  const r = await fetch(`${origineInterne()}/api/interne/tache`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${secretInterne()}`,
      "content-type": "application/json",
      // Déploiements protégés (aperçus Vercel) : jeton « Protection Bypass for Automation ».
      ...(bypass ? { "x-vercel-protection-bypass": bypass } : {}),
    },
    body: JSON.stringify(t),
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  if (!r.ok) throw new Error(`Tâche interne refusée (${r.status}) : vérifiez CRON_SECRET et l'adresse ${origineInterne()}.`);
}

/** Comme declencher, sans faire échouer l'appelant : l'erreur va au journal. */
export function declencherSansAttendre(t: Tache): Promise<void> {
  return declencher(t).catch((e) => signalerErreur(nomTache(t), e, { ...t }));
}
