import { trouverOuCreerCompte } from "@/lib/comptes";
import { origineDe } from "@/lib/origine";
import { consommerJetonConnexion, ouvrirSession } from "@/lib/session";

export const runtime = "nodejs";

/**
 * Le lien reçu par e-mail mène d'abord à une page avec un bouton (GET sans effet) : les messageries et
 * antivirus qui « visitent » les liens pour les analyser ne consomment donc pas la connexion.
 */
export async function GET(req: Request) {
  const jeton = new URL(req.url).searchParams.get("jeton") ?? "";
  return Response.redirect(`${origineDe(req)}/connexion/lien?jeton=${encodeURIComponent(jeton)}`, 303);
}

/** Le bouton de la page confirme : la session s'ouvre et on renvoie la page de destination. */
export async function POST(req: Request) {
  const { jeton } = (await req.json().catch(() => ({}))) as { jeton?: string };
  const acces = await consommerJetonConnexion(String(jeton ?? ""));
  if (!acces) return Response.json({ erreur: "Ce lien a expiré ou a déjà servi." }, { status: 400 });
  const compte = await trouverOuCreerCompte(acces.email);
  await ouvrirSession(compte.id);
  return Response.json({ suite: acces.suite });
}
