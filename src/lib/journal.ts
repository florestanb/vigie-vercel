import fs from "node:fs/promises";
import path from "node:path";
import { RACINE_DONNEES } from "./donnees";
import { envoyerEmail } from "./email";

/**
 * Journal des erreurs de production (paiement, webhook, e-mails, audits, suivi) : consultable dans
 * l'espace d'administration, et signalé par e-mail à VIGIE_EMAIL_ALERTES (au plus un e-mail par
 * type d'erreur et par heure). Aucune donnée de carte ni secret n'y est écrit : seulement le contexte
 * et le message d'erreur.
 */

const DOSSIER = path.join(RACINE_DONNEES, "journal");
const FICHIER = path.join(DOSSIER, "erreurs.jsonl");
const TAILLE_MAX = 2 * 1024 * 1024;
const derniersEnvois = new Map<string, number>();

export interface EntreeJournal {
  date: string;
  contexte: string;
  message: string;
  details?: Record<string, string>;
}

export async function signalerErreur(contexte: string, e: unknown, details?: Record<string, string>): Promise<void> {
  const message = (e instanceof Error ? e.message : String(e)).split("\n")[0].slice(0, 500);
  console.error(`[${contexte}]`, e);
  const entree: EntreeJournal = { date: new Date().toISOString(), contexte, message, ...(details ? { details } : {}) };
  try {
    await fs.mkdir(DOSSIER, { recursive: true });
    const taille = await fs.stat(FICHIER).then((s) => s.size).catch(() => 0);
    if (taille > TAILLE_MAX) await fs.rename(FICHIER, `${FICHIER}.1`);
    await fs.appendFile(FICHIER, JSON.stringify(entree) + "\n");
  } catch {
    /* le journal ne doit jamais provoquer d'erreur à son tour */
  }
  const alerte = process.env.VIGIE_EMAIL_ALERTES?.trim();
  const dernier = derniersEnvois.get(contexte) ?? 0;
  if (alerte && Date.now() - dernier > 3600_000 && contexte !== "E-mail") {
    derniersEnvois.set(contexte, Date.now());
    await envoyerEmail({
      a: alerte,
      objet: `[Vigie] Erreur : ${contexte}`,
      texte: `${entree.date}\n${contexte} : ${message}\n${details ? JSON.stringify(details, null, 2) : ""}\n\nJournal complet : espace d'administration, Statistiques.`,
    }).catch(() => {});
  }
}

export async function lireErreurs(limite = 50): Promise<EntreeJournal[]> {
  const texte = await fs.readFile(FICHIER, "utf8").catch(() => "");
  return texte
    .trim()
    .split("\n")
    .filter(Boolean)
    .slice(-limite)
    .map((l) => {
      try {
        return JSON.parse(l) as EntreeJournal;
      } catch {
        return null;
      }
    })
    .filter((x): x is EntreeJournal => x !== null)
    .reverse();
}
