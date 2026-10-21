import { peutHeberger } from "@/lib/abonnes";
import { chargerAudit } from "@/lib/audit";
import { domaineDe } from "@/lib/comptes";
import { PLANS, type TypeDocument } from "@/lib/documents/plans";
import { codesIntegration, publierHeberge, retirerHeberge } from "@/lib/documents-heberges";
import { autoriser, ipDe } from "@/lib/limite";
import { origineDe } from "@/lib/origine";
import { compteConnecte } from "@/lib/session";

export const runtime = "nodejs";

/** Publie la version approuvée d'un document : elle devient la version servie sur le site du client. */
export async function POST(req: Request) {
  const compte = await compteConnecte();
  if (!compte) return Response.json({ erreur: "Connectez-vous d'abord." }, { status: 401 });
  const corps = (await req.json().catch(() => ({}))) as { auditId?: string; type?: string; texte?: string };
  const audit = corps.auditId ? await chargerAudit(corps.auditId) : null;
  if (!audit) return Response.json({ erreur: "Audit introuvable." }, { status: 404 });
  if (!corps.type || !(corps.type in PLANS)) return Response.json({ erreur: "Type de document inconnu." }, { status: 400 });
  if (typeof corps.texte !== "string" || !corps.texte.trim() || corps.texte.length > 200_000) return Response.json({ erreur: "Texte invalide." }, { status: 400 });
  const domaine = domaineDe(audit.url);
  if (!peutHeberger(compte, domaine)) return Response.json({ erreur: "L'hébergement des documents fait partie des abonnements." }, { status: 402 });
  if (!(await autoriser("heberger:" + ipDe(req), 60, 60 * 60_000))) return Response.json({ erreur: "Trop de demandes." }, { status: 429 });
  try {
    const d = await publierHeberge(compte.id, domaine, corps.type as TypeDocument, audit.id, corps.texte);
    return Response.json({ id: d.id, ...codesIntegration(origineDe(req), d) });
  } catch (e) {
    return Response.json({ erreur: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const compte = await compteConnecte();
  if (!compte) return Response.json({ erreur: "Connectez-vous d'abord." }, { status: 401 });
  const { id } = (await req.json().catch(() => ({}))) as { id?: string };
  await retirerHeberge(compte.id, String(id ?? "")).catch(() => {});
  return Response.json({ ok: true });
}
