import { base, preparerBase, stockageEnBase } from "./stockage";

// Limitation de débit par adresse IP : en base quand elle existe (partagée entre toutes les instances du
// serveur, comme sur Vercel), sinon en mémoire (suffisant pour une instance unique).
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

function autoriserEnMemoire(cle: string, max: number, fenetreMs: number): boolean {
  const maintenant = Date.now();
  menage(maintenant);
  const recents = (fenetres.get(cle) ?? []).filter((t) => maintenant - t < fenetreMs);
  if (recents.length >= max) return false;
  recents.push(maintenant);
  fenetres.set(cle, recents);
  return true;
}

async function autoriserEnBase(cle: string, max: number, fenetreMs: number): Promise<boolean> {
  await preparerBase();
  const sql = base();
  const maintenant = Date.now();
  if (maintenant - dernierMenage > 60_000) {
    dernierMenage = maintenant;
    await sql`delete from vigie_limites where t < now() - interval '1 hour'`;
  }
  return sql.begin(async (tx) => {
    // Un verrou par clé : deux requêtes simultanées ne peuvent pas passer toutes les deux sous la limite.
    await tx`select pg_advisory_xact_lock(hashtextextended(${"limite:" + cle}, 0))`;
    const [{ n }] = await tx`select count(*)::int as n from vigie_limites where cle = ${cle} and t > now() - ${fenetreMs / 1000} * interval '1 second'`;
    if (n >= max) return false;
    await tx`insert into vigie_limites (cle) values (${cle})`;
    return true;
  });
}

export async function autoriser(cle: string, max: number, fenetreMs: number): Promise<boolean> {
  if (!stockageEnBase()) return autoriserEnMemoire(cle, max, fenetreMs);
  try {
    return await autoriserEnBase(cle, max, fenetreMs);
  } catch {
    // Base momentanément injoignable : on se rabat sur la mémoire plutôt que de tout refuser.
    return autoriserEnMemoire(cle, max, fenetreMs);
  }
}

/**
 * Adresse du client.
 * - Sur Vercel : l'en-tête x-real-ip, posé par Vercel lui-même (un client ne peut pas le falsifier).
 * - Derrière un proxy (VIGIE_PROXY_DE_CONFIANCE=1) : la dernière adresse de X-Forwarded-For, ajoutée par le
 *   proxy lui-même.
 * - Sinon, l'en-tête est ignoré et tous les clients partagent la même limite (prudent, jamais contournable).
 */
export function ipDe(req: Request): string {
  if (process.env.VERCEL === "1") return req.headers.get("x-real-ip")?.trim() || req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "direct";
  if (process.env.VIGIE_PROXY_DE_CONFIANCE !== "1") return "direct";
  const chaine = req.headers.get("x-forwarded-for")?.split(",").map((s) => s.trim()).filter(Boolean);
  return chaine?.at(-1) || req.headers.get("x-real-ip") || "direct";
}
