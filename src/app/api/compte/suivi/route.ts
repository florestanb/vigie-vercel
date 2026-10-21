import { autoriser, ipDe } from "@/lib/limite";
import { compteConnecte } from "@/lib/session";
import { ajouterSiteSuivi, retirerSiteSuivi } from "@/lib/suivi";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const compte = await compteConnecte();
  if (!compte) return Response.json({ erreur: "Connectez-vous d'abord." }, { status: 401 });
  if (!(await autoriser("suivi:" + ipDe(req), 60, 60 * 60_000))) return Response.json({ erreur: "Trop de demandes." }, { status: 429 });
  const { site } = (await req.json().catch(() => ({}))) as { site?: string };
  try {
    await ajouterSiteSuivi(compte.id, String(site ?? ""));
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ erreur: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const compte = await compteConnecte();
  if (!compte) return Response.json({ erreur: "Connectez-vous d'abord." }, { status: 401 });
  const { domaine } = (await req.json().catch(() => ({}))) as { domaine?: string };
  await retirerSiteSuivi(compte.id, String(domaine ?? ""));
  return Response.json({ ok: true });
}
