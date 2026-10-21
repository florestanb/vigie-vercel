import { accesAudit } from "@/lib/acces";
import { chargerAudit, lireCapture } from "@/lib/audit";

export const runtime = "nodejs";
type Params = { params: Promise<{ id: string; nom: string }> };

/** Capture d'écran prise pendant l'audit : preuve visuelle, réservée aux sites débloqués. */
export async function GET(_req: Request, { params }: Params) {
  const { id, nom } = await params;
  const audit = await chargerAudit(id);
  if (!audit) return new Response("Audit introuvable.", { status: 404 });
  if (!(await accesAudit(audit)).complet) return new Response("Accès réservé.", { status: 402 });
  const image = await lireCapture(id, nom);
  if (!image) return new Response("Capture introuvable.", { status: 404 });
  return new Response(new Uint8Array(image), { headers: { "content-type": "image/jpeg", "cache-control": "private, no-store" } });
}
