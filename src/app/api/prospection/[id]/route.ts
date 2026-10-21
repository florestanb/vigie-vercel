import { estAdmin, nonAutorise } from "@/lib/admin";
import { arreterCampagne, chargerCampagne, lancerCampagne, marquerEnvoye } from "@/lib/prospection/campagne";

export const runtime = "nodejs";
type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  if (!(await estAdmin())) return nonAutorise();
  const campagne = await chargerCampagne((await params).id).catch(() => null);
  return campagne ? Response.json(campagne) : Response.json({ erreur: "Campagne introuvable." }, { status: 404 });
}

/** Actions : reprendre ou arrêter la campagne, marquer un mail comme envoyé (ou non). */
export async function POST(req: Request, { params }: Params) {
  if (!(await estAdmin())) return nonAutorise();
  const { id } = await params;
  const corps = (await req.json().catch(() => ({}))) as { action?: string; site?: string; envoye?: boolean };
  try {
    if (!(await chargerCampagne(id))) throw new Error("Campagne introuvable.");
    if (corps.action === "reprendre") await lancerCampagne(id);
    else if (corps.action === "arreter") await arreterCampagne(id);
    else if (corps.action === "envoye" && typeof corps.site === "string") await marquerEnvoye(id, corps.site, corps.envoye !== false);
    else throw new Error("Action inconnue.");
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ erreur: (e as Error).message }, { status: 400 });
  }
}
