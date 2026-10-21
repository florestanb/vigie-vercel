import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Accès à l'espace privé (prospection) : un mot de passe unique, défini dans VIGIE_ADMIN_MOTDEPASSE.
 * La session est un cookie httpOnly qui contient un jeton dérivé du mot de passe : changer le mot de passe
 * déconnecte toutes les sessions.
 */
export const COOKIE_ADMIN = "vigie_admin";
export const DUREE_SESSION_S = 7 * 24 * 3600;

const motDePasse = () => process.env.VIGIE_ADMIN_MOTDEPASSE?.trim() || null;
const empreinte = (s: string) => crypto.createHash("sha256").update(s, "utf8").digest();

export function adminConfigure(): boolean {
  return (motDePasse()?.length ?? 0) >= 12;
}

export function motDePasseValide(saisie: string): boolean {
  const attendu = motDePasse();
  if (!attendu || !adminConfigure()) return false;
  return crypto.timingSafeEqual(empreinte(saisie), empreinte(attendu));
}

export function jetonAdmin(): string {
  return crypto.createHmac("sha256", motDePasse() ?? "").update("vigie-admin-v1").digest("hex");
}

export async function estAdmin(): Promise<boolean> {
  if (!adminConfigure()) return false;
  const valeur = (await cookies()).get(COOKIE_ADMIN)?.value;
  if (!valeur) return false;
  const attendu = jetonAdmin();
  return valeur.length === attendu.length && crypto.timingSafeEqual(Buffer.from(valeur), Buffer.from(attendu));
}

/** Réponse 401 commune aux routes d'API privées. */
export const nonAutorise = () => Response.json({ erreur: "Accès réservé." }, { status: 401 });
