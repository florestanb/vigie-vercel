import { origineDe } from "@/lib/origine";
import { urlPortailClient } from "@/lib/paiement";
import { compteConnecte } from "@/lib/session";

export const runtime = "nodejs";

/** Ouvre le portail Stripe du client : factures, moyen de paiement, résiliation. */
export async function POST(req: Request) {
  const compte = await compteConnecte();
  if (!compte) return Response.json({ erreur: "Connectez-vous d'abord." }, { status: 401 });
  try {
    return Response.json({ url: await urlPortailClient(compte, `${origineDe(req)}/compte`) });
  } catch (e) {
    return Response.json({ erreur: (e as Error).message }, { status: 400 });
  }
}
