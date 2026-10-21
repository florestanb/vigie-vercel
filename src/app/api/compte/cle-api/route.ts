import { creerCleApi, revoquerCleApi } from "@/lib/abonnes";
import { compteConnecte } from "@/lib/session";

export const runtime = "nodejs";

/** Crée une clé d'API (affichée une seule fois) ; une nouvelle clé remplace la précédente. */
export async function POST() {
  const compte = await compteConnecte();
  if (!compte) return Response.json({ erreur: "Connectez-vous d'abord." }, { status: 401 });
  try {
    return Response.json({ cle: await creerCleApi(compte.id) });
  } catch (e) {
    return Response.json({ erreur: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE() {
  const compte = await compteConnecte();
  if (!compte) return Response.json({ erreur: "Connectez-vous d'abord." }, { status: 401 });
  await revoquerCleApi(compte.id);
  return Response.json({ ok: true });
}
