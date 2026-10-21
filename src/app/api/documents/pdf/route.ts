import { accesAudit } from "@/lib/acces";
import { chargerAudit } from "@/lib/audit";
import { PLANS, type TypeDocument } from "@/lib/documents/plans";
import { estApprouve } from "@/lib/documents-heberges";
import { signalerErreur } from "@/lib/journal";
import { autoriser, ipDe } from "@/lib/limite";
import { markdownVersHtml } from "@/lib/markdown";
import { imprimer } from "@/lib/pdf";

export const runtime = "nodejs";
export const maxDuration = 60;

const e = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** PDF d'un document approuvé par le client : c'est son document, il ne porte que son contenu. */
export async function POST(req: Request) {
  const corps = (await req.json().catch(() => ({}))) as { auditId?: string; type?: string; texte?: string };
  const audit = corps.auditId ? await chargerAudit(corps.auditId) : null;
  if (!audit) return new Response("Audit introuvable.", { status: 404 });
  if (!corps.type || !(corps.type in PLANS)) return new Response("Type de document inconnu.", { status: 400 });
  if (typeof corps.texte !== "string" || !corps.texte.trim() || corps.texte.length > 300_000) return new Response("Texte invalide.", { status: 400 });
  if (!(await accesAudit(audit)).documents) return new Response("Accès réservé.", { status: 402 });
  if (!(await estApprouve(audit.id, corps.type, corps.texte))) return new Response("Approuvez d'abord cette version du document.", { status: 409 });
  if (!autoriser("doc-pdf:" + ipDe(req), 30, 60 * 60_000)) return new Response("Trop de demandes.", { status: 429 });

  const titre = PLANS[corps.type as TypeDocument].titre;
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${e(titre)}</title>
<meta name="ai-generated" content="Texte généré par un système d'IA puis relu et approuvé par l'éditeur du site (règlement (UE) 2024/1689, art. 50)">
<style>
  @page { size: A4; margin: 20mm 18mm 22mm; }
  body { font: 10.5pt/1.55 -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; color: #111; margin: 0; }
  h1 { font-size: 20pt; margin: 0 0 14px; letter-spacing: -0.01em; } h2 { font-size: 13pt; margin: 20px 0 6px; break-after: avoid; } h3 { font-size: 11pt; margin: 14px 0 4px; break-after: avoid; }
  p, li { orphans: 3; widows: 3; } ul, ol { padding-left: 20px; }
  table { width: 100%; border-collapse: collapse; font-size: 9pt; margin: 8px 0 14px; } th, td { border: 1px solid #d4d4d8; padding: 5px 7px; text-align: left; vertical-align: top; } th { background: #f4f4f5; }
  mark { background: #fef08a; } a { color: inherit; }
</style></head><body>${markdownVersHtml(corps.texte)}</body></html>`;
  try {
    const pdf = await imprimer(html, e(titre));
    return new Response(new Uint8Array(pdf), { headers: { "content-type": "application/pdf", "cache-control": "no-store" } });
  } catch (err) {
    await signalerErreur("PDF de document", err, { audit: audit.id });
    return new Response("Le PDF n'a pas pu être produit.", { status: 500 });
  }
}
