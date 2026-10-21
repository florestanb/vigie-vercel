import { accesAudit } from "@/lib/acces";
import { approfondirAudit, chargerAudit } from "@/lib/audit";
import { autoriser, ipDe } from "@/lib/limite";

export const runtime = "nodejs";
export const maxDuration = 300;
type Params = { params: Promise<{ id: string }> };

/** Lecture approfondie des textes par Claude, pour un site débloqué. */
export async function POST(req: Request, { params }: Params) {
  const audit = await chargerAudit((await params).id);
  if (!audit) return Response.json({ erreur: "Audit introuvable." }, { status: 404 });
  if (!(await accesAudit(audit)).complet) return Response.json({ erreur: "Accès réservé." }, { status: 402 });
  if (!autoriser("analyse:" + ipDe(req), 10, 60 * 60_000)) return Response.json({ erreur: "Trop de demandes." }, { status: 429 });
  const resultat = await approfondirAudit(audit.id);
  return Response.json({ ok: !resultat?.iaErreur, erreur: resultat?.iaErreur });
}
