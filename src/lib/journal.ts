import { envoyerEmail } from "./email";
import { ajouterLigne, ecrire, lire, lireJson, lireTexte, supprimer, taille } from "./stockage";

/**
 * Journal des erreurs de production (paiement, webhook, e-mails, audits, suivi) : consultable dans
 * l'espace d'administration, et signalé par e-mail à VIGIE_EMAIL_ALERTES (au plus un e-mail par
 * type d'erreur et par heure). Aucune donnée de carte ni secret n'y est écrit : seulement le contexte
 * et le message d'erreur.
 */

const FICHIER = "journal/erreurs.jsonl";
/** Dernier e-mail d'alerte par type d'erreur : partagé entre les instances du serveur. */
const ENVOIS = "journal/derniers-envois.json";
const TAILLE_MAX = 2 * 1024 * 1024;

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
    if ((await taille(FICHIER)) > TAILLE_MAX) {
      const ancien = await lire(FICHIER);
      if (ancien) await ecrire(`${FICHIER}.1`, ancien);
      await supprimer(FICHIER);
    }
    await ajouterLigne(FICHIER, JSON.stringify(entree));
  } catch {
    /* le journal ne doit jamais provoquer d'erreur à son tour */
  }
  const alerte = process.env.VIGIE_EMAIL_ALERTES?.trim();
  const envois = await lireJson<Record<string, number>>(ENVOIS, {}).catch(() => ({}) as Record<string, number>);
  const dernier = envois[contexte] ?? 0;
  if (alerte && Date.now() - dernier > 3600_000 && contexte !== "E-mail") {
    await ecrire(ENVOIS, JSON.stringify({ ...envois, [contexte]: Date.now() })).catch(() => {});
    await envoyerEmail({
      a: alerte,
      objet: `[Vigie] Erreur : ${contexte}`,
      texte: `${entree.date}\n${contexte} : ${message}\n${details ? JSON.stringify(details, null, 2) : ""}\n\nJournal complet : espace d'administration, Statistiques.`,
    }).catch(() => {});
  }
}

export async function lireErreurs(limite = 50): Promise<EntreeJournal[]> {
  const texte = (await lireTexte(FICHIER).catch(() => null)) ?? "";
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
