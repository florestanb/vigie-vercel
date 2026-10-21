import dns from "node:dns/promises";
import net from "node:net";

/**
 * Protection contre la SSRF : Vigie ne doit jamais aller lire une adresse du réseau interne du serveur
 * (localhost, réseau privé, métadonnées du fournisseur cloud…), même si on lui donne un nom de domaine
 * qui y pointe. Chaque requête du navigateur d'audit est vérifiée.
 */

function estPrivee(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 0 || a === 10 || a === 127 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) || (a === 192 && b === 0) || (a === 198 && (b === 18 || b === 19)) || a >= 224
    );
  }
  const v6 = ip.toLowerCase();
  if (v6 === "::" || v6 === "::1") return true;
  const mappe = v6.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mappe) return estPrivee(mappe[1]);
  return /^(fc|fd|fe8|fe9|fea|feb|ff)/.test(v6);
}

/** Adresse IP qu'un audit ne doit jamais joindre (sauf tests en local). */
export function adresseInterdite(ip: string): boolean {
  return process.env.VIGIE_AUTORISER_LOCAL !== "1" && estPrivee(ip);
}

const cache = new Map<string, { prive: boolean; expire: number }>();

/** Vrai si le nom d'hôte est (ou résout vers) une adresse non publique. En cas de doute, on bloque. */
export async function hoteInterdit(hote: string): Promise<boolean> {
  if (process.env.VIGIE_AUTORISER_LOCAL === "1") return false;
  const h = hote.replace(/^\[|\]$/g, "").toLowerCase();
  if (net.isIP(h)) return estPrivee(h);
  if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local") || h.endsWith(".internal") || !h.includes(".")) return true;
  const connu = cache.get(h);
  if (connu && connu.expire > Date.now()) return connu.prive;
  let prive: boolean;
  try {
    const adresses = await dns.lookup(h, { all: true, verbatim: true });
    prive = !adresses.length || adresses.some((a) => estPrivee(a.address));
  } catch {
    prive = false; // nom introuvable : le navigateur échouera de lui-même
  }
  cache.set(h, { prive, expire: Date.now() + 5 * 60_000 });
  return prive;
}
