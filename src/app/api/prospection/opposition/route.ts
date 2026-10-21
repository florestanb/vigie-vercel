import { estAdmin, nonAutorise } from "@/lib/admin";
import { ajouterOpposition, lireOpposition } from "@/lib/prospection/campagne";

export const runtime = "nodejs";

export async function GET() {
  if (!(await estAdmin())) return nonAutorise();
  return Response.json([...(await lireOpposition())].sort());
}

/** Ajoute un domaine ou une adresse à la liste d'opposition (réponse « STOP »). */
export async function POST(req: Request) {
  if (!(await estAdmin())) return nonAutorise();
  const { valeur } = (await req.json().catch(() => ({}))) as { valeur?: string };
  try {
    await ajouterOpposition(String(valeur ?? ""));
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ erreur: (e as Error).message }, { status: 400 });
  }
}
