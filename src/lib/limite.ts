// Limitation de débit en mémoire, par adresse IP. Suffisant pour une instance unique.
const fenetres = new Map<string, number[]>();
/** Aucune adresse IP n'est gardée plus d'une heure (engagement de la politique de confidentialité). */
const CONSERVATION_MAX_MS = 60 * 60 * 1000;
let dernierMenage = 0;

function menage(maintenant: number) {
  if (maintenant - dernierMenage < 60_000) return;
  dernierMenage = maintenant;
  for (const [cle, temps] of fenetres) {
    const recents = temps.filter((t) => maintenant - t < CONSERVATION_MAX_MS);
    if (recents.length) fenetres.set(cle, recents);
    else fenetres.delete(cle);
  }
}

export function autoriser(cle: string, max: number, fenetreMs: number): boolean {
  const maintenant = Date.now();
  menage(maintenant);
  const recents = (fenetres.get(cle) ?? []).filter((t) => maintenant - t < fenetreMs);
  if (recents.length >= max) return false;
  recents.push(maintenant);
  fenetres.set(cle, recents);
  return true;
}

/**
 * Adresse du client. Derrière un proxy (VIGIE_PROXY_DE_CONFIANCE=1), c'est la dernière adresse de
 * X-Forwarded-For, ajoutée par le proxy lui-même : le client ne peut pas la falsifier. Sans proxy déclaré,
 * l'en-tête est ignoré et tous les clients partagent la même limite (prudent, jamais contournable).
 */
export function ipDe(req: Request): string {
  if (process.env.VIGIE_PROXY_DE_CONFIANCE !== "1") return "direct";
  const chaine = req.headers.get("x-forwarded-for")?.split(",").map((s) => s.trim()).filter(Boolean);
  return chaine?.at(-1) || req.headers.get("x-real-ip") || "direct";
}
