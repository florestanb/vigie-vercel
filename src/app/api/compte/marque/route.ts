import { enregistrerMarque } from "@/lib/abonnes";
import { modifierCompte } from "@/lib/comptes";
import { compteConnecte } from "@/lib/session";

export const runtime = "nodejs";

/** Marque blanche : nom, logo, couleur et contact affichés sur les rapports et dossiers PDF. */
export async function POST(req: Request) {
  const compte = await compteConnecte();
  if (!compte) return Response.json({ erreur: "Connectez-vous d'abord." }, { status: 401 });
  try {
    return Response.json(await enregistrerMarque(compte.id, (await req.json().catch(() => ({}))) as object));
  } catch (e) {
    return Response.json({ erreur: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE() {
  const compte = await compteConnecte();
  if (!compte) return Response.json({ erreur: "Connectez-vous d'abord." }, { status: 401 });
  await modifierCompte(compte.id, (c) => void delete c.marque);
  return Response.json({ ok: true });
}
