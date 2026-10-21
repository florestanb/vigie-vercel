import { accesAudit } from "@/lib/acces";
import { chargerAudit, enregistrerApprobation } from "@/lib/audit";
import { PLANS } from "@/lib/documents/plans";
import { autoriser, ipDe } from "@/lib/limite";

export const runtime = "nodejs";

/** Enregistre que le client a relu et approuvé un modèle généré, avant de le copier ou de le télécharger. */
export async function POST(req: Request) {
  const corps = (await req.json().catch(() => ({}))) as { auditId?: string; type?: string; texte?: string };
  const audit = corps.auditId ? await chargerAudit(corps.auditId) : null;
  if (!audit) return Response.json({ erreur: "Audit introuvable." }, { status: 404 });
  if (!corps.type || !(corps.type in PLANS)) return Response.json({ erreur: "Type de document inconnu." }, { status: 400 });
  if (!(await accesAudit(audit)).documents) return Response.json({ erreur: "Accès réservé." }, { status: 402 });
  if (typeof corps.texte !== "string" || !corps.texte.trim() || corps.texte.length > 200_000) return Response.json({ erreur: "Texte invalide." }, { status: 400 });
  if (!(await autoriser("approbation:" + ipDe(req), 60, 60 * 60_000))) return Response.json({ erreur: "Trop de demandes." }, { status: 429 });
  return Response.json(await enregistrerApprobation(audit.id, corps.type, corps.texte));
}
