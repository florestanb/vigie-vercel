import { cookies } from "next/headers";
import { COOKIE_ADMIN, DUREE_SESSION_S, adminConfigure, jetonAdmin, motDePasseValide } from "@/lib/admin";
import { autoriser, ipDe } from "@/lib/limite";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!adminConfigure()) return Response.json({ erreur: "Définissez VIGIE_ADMIN_MOTDEPASSE (12 caractères au moins) dans .env.local." }, { status: 503 });
  // Deux limites : par adresse, et une limite globale qui rend toute attaque par force brute impossible.
  if (!autoriser("connexion:" + ipDe(req), 8, 15 * 60_000) || !autoriser("connexion:global", 30, 60 * 60_000))
    return Response.json({ erreur: "Trop de tentatives. Réessayez plus tard." }, { status: 429 });
  const { motDePasse } = (await req.json().catch(() => ({}))) as { motDePasse?: string };
  if (typeof motDePasse !== "string" || !motDePasseValide(motDePasse)) return Response.json({ erreur: "Mot de passe incorrect." }, { status: 401 });
  (await cookies()).set(COOKIE_ADMIN, jetonAdmin(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DUREE_SESSION_S,
  });
  return Response.json({ ok: true });
}

export async function DELETE() {
  (await cookies()).delete(COOKIE_ADMIN);
  return Response.json({ ok: true });
}
