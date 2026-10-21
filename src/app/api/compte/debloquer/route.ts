import { chargerAudit } from "@/lib/audit";
import { debloquerDomaine, domaineDe, retenirAudit } from "@/lib/comptes";
import { compteConnecte } from "@/lib/session";

export const runtime = "nodejs";

/** Utilise une place d'un achat en cours pour débloquer le site d'un audit. */
export async function POST(req: Request) {
  const compte = await compteConnecte();
  if (!compte) return Response.json({ erreur: "Connectez-vous d'abord." }, { status: 401 });
  const { audit: id } = (await req.json().catch(() => ({}))) as { audit?: string };
  const audit = typeof id === "string" ? await chargerAudit(id) : null;
  if (!audit) return Response.json({ erreur: "Audit introuvable." }, { status: 404 });
  try {
    const acces = await debloquerDomaine(compte.id, domaineDe(audit.url));
    await retenirAudit(compte.id, domaineDe(audit.url), audit.id, audit.date);
    return Response.json(acces);
  } catch (e) {
    return Response.json({ erreur: (e as Error).message }, { status: 400 });
  }
}
