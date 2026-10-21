import { authentifier, auditJson } from "@/lib/api-v1";
import { lancerAudit } from "@/lib/audit";
import { accesDomaine, debloquerDomaine, domaineDe, retenirAudit } from "@/lib/comptes";
import { origineDe } from "@/lib/origine";
import { signalerErreur } from "@/lib/journal";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * Lance un audit : { "url": "https://exemple.fr", "ia": false }. Le site entre dans le quota du mois.
 * Réponse quand l'audit est fini (30 s à 2 min selon le site).
 */
export async function POST(req: Request) {
  const compte = await authentifier(req);
  if (compte instanceof Response) return compte;
  const { url, ia } = (await req.json().catch(() => ({}))) as { url?: string; ia?: boolean };
  let domaine: string;
  try {
    domaine = domaineDe(String(url ?? ""));
    if (!domaine.includes(".")) throw new Error();
  } catch {
    return Response.json({ erreur: "Adresse de site invalide." }, { status: 400 });
  }
  if (!accesDomaine(compte, domaine).complet) {
    try {
      await debloquerDomaine(compte.id, domaine, "abonnement");
    } catch (e) {
      return Response.json({ erreur: (e as Error).message }, { status: 402 });
    }
  }
  try {
    const audit = await lancerAudit(String(url), () => {}, { ia: ia === true });
    await retenirAudit(compte.id, domaineDe(audit.url), audit.id, audit.date);
    return Response.json(auditJson(audit, origineDe(req)), { status: 201 });
  } catch (e) {
    await signalerErreur("API : audit", e, { domaine });
    return Response.json({ erreur: (e as Error).message.split("\n")[0] }, { status: 422 });
  }
}
