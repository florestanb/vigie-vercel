import fs from "node:fs";
import path from "node:path";

/**
 * Racine unique du stockage (audits, comptes, approbations, prospection). Elle n'est jamais servie par le
 * site : seules les routes qui contrôlent l'accès la lisent. Sur le disque, tout est réservé au compte
 * système qui fait tourner Vigie (dossiers 700, fichiers 600).
 */
export const RACINE_DONNEES = process.env.VIGIE_DONNEES?.trim()
  ? path.dirname(path.resolve(process.env.VIGIE_DONNEES.trim()))
  : path.join(process.cwd(), "data");

export const DOSSIER_AUDITS = process.env.VIGIE_DONNEES?.trim() ? path.resolve(process.env.VIGIE_DONNEES.trim()) : path.join(RACINE_DONNEES, "audits");

/** Tout fichier ou dossier créé ensuite par ce processus n'est lisible que par son propriétaire. */
export function restreindreDroits(): void {
  process.umask(0o077);
  // Les données créées avant ce réglage sont remises aux bons droits.
  const parcourir = (p: string) => {
    let st: fs.Stats;
    try {
      st = fs.lstatSync(p);
    } catch {
      return;
    }
    if (st.isSymbolicLink()) return;
    try {
      fs.chmodSync(p, st.isDirectory() ? 0o700 : 0o600);
    } catch {
      /* fichier d'un autre propriétaire : ignoré */
    }
    if (st.isDirectory()) for (const f of fs.readdirSync(p)) parcourir(path.join(p, f));
  };
  parcourir(RACINE_DONNEES);
}
