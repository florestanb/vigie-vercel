import { accesAudit } from "@/lib/acces";
import { marqueDe } from "@/lib/abonnes";
import { chargerAudit, lireCaptures } from "@/lib/audit";
import { auditPrecedent, pointDe } from "@/lib/historique";
import { signalerErreur } from "@/lib/journal";
import { autoriser, ipDe } from "@/lib/limite";
import { rapportPdf } from "@/lib/pdf";

export const runtime = "nodejs";
export const maxDuration = 60;
type Params = { params: Promise<{ id: string }> };

/** Rapport complet en PDF : réservé aux sites débloqués. */
export async function GET(req: Request, { params }: Params) {
  const audit = await chargerAudit((await params).id);
  if (!audit) return new Response("Audit introuvable.", { status: 404 });
  const acces = await accesAudit(audit);
  if (!acces.complet) return new Response("Accès réservé.", { status: 402 });
  if (!autoriser("pdf:" + ipDe(req), 30, 60 * 60_000)) return new Response("Trop de demandes.", { status: 429 });
  try {
    const avant = await auditPrecedent(audit);
    const pdf = await rapportPdf(audit, { evolution: avant ? { avant, apres: pointDe(audit) } : null, marque: marqueDe(acces.compte), captures: await lireCaptures(audit) });
    const site = new URL(audit.url).hostname.replace(/^www\./, "").replace(/[^a-z0-9.-]/gi, "_");
    return new Response(new Uint8Array(pdf), {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="rapport-${marqueDe(acces.compte) ? "" : "vigie-"}${site}-${audit.date.slice(0, 10)}.pdf"`,
        "cache-control": "no-store",
      },
    });
  } catch (e) {
    await signalerErreur("Rapport PDF", e, { audit: audit.id });
    return new Response("Le PDF n'a pas pu être produit.", { status: 500 });
  }
}
