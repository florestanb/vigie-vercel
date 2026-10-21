import { authentifier, auditJson } from "@/lib/api-v1";
import { chargerAudit } from "@/lib/audit";
import { accesDomaine, domaineDe } from "@/lib/comptes";
import { origineDe } from "@/lib/origine";

export const runtime = "nodejs";
type Params = { params: Promise<{ id: string }> };

/** Résultat complet d'un audit d'un site du compte. */
export async function GET(req: Request, { params }: Params) {
  const compte = await authentifier(req);
  if (compte instanceof Response) return compte;
  const audit = await chargerAudit((await params).id);
  if (!audit || !accesDomaine(compte, domaineDe(audit.url)).complet) return Response.json({ erreur: "Audit introuvable." }, { status: 404 });
  return Response.json(auditJson(audit, origineDe(req)));
}
