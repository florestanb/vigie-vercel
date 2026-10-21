import { abonnementActif, chargerCompte } from "@/lib/comptes";
import { chargerHeberge, titreDocument } from "@/lib/documents-heberges";
import { markdownVersHtml } from "@/lib/markdown";

export const runtime = "nodejs";
type Params = { params: Promise<{ id: string }> };

const e = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const STYLE = `
  :root { color-scheme: light dark; --texte: #18181b; --doux: #52525b; --trait: #e4e4e7; --fond: #fff; }
  @media (prefers-color-scheme: dark) { :root { --texte: #f4f4f5; --doux: #a1a1aa; --trait: #3f3f46; --fond: #18181b; } }
  body { margin: 0; background: var(--fond); color: var(--texte); font: 16px/1.6 -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; }
  main { max-width: 760px; margin: 0 auto; padding: 32px 16px 48px; }
  h1 { font-size: 30px; line-height: 1.2; } h2 { font-size: 21px; margin-top: 32px; } h3 { font-size: 17px; }
  table { width: 100%; border-collapse: collapse; display: block; overflow-x: auto; font-size: 14px; }
  th, td { border: 1px solid var(--trait); padding: 6px 10px; text-align: left; vertical-align: top; }
  a { color: inherit; } mark { background: #fef08a; color: #18181b; }
  .version { margin-top: 32px; font-size: 13px; color: var(--doux); }`;

/**
 * Document hébergé, public : c'est la page légale du site du client. Trois formes : page complète, version
 * à intégrer dans un cadre (?integre=1), ou fragment HTML pour le script d'intégration (?format=fragment).
 */
export async function GET(req: Request, { params }: Params) {
  const d = await chargerHeberge((await params).id).catch(() => null);
  if (!d) return new Response("Document introuvable.", { status: 404 });
  // Fin d'abonnement : le document reste servi 90 jours (CGV, art. 7 bis), le temps de le reprendre sur le site.
  const compte = await chargerCompte(d.compte);
  const fin = compte?.abonnement ? Date.parse(compte.abonnement.finPeriode) : 0;
  if (!compte || (!abonnementActif(compte) && Date.now() > fin + 90 * 86_400_000)) return new Response("Ce document n'est plus hébergé.", { status: 410 });
  const corps = markdownVersHtml(d.version.texte);
  const version = `<p class="version">Version approuvée par l'éditeur du site le ${new Date(d.version.approuve).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}.</p>`;
  const format = new URL(req.url).searchParams;
  const entetes = { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300", "x-robots-tag": "noindex" };
  if (format.get("format") === "fragment") {
    // Le fragment est inséré dans la page du client par le script d'intégration : lecture permise depuis tout site.
    return new Response(`<div class="vigie-document">${corps}${version}</div>`, { headers: { ...entetes, "access-control-allow-origin": "*" } });
  }
  const integre = format.get("integre") === "1";
  return new Response(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><meta name="ai-generated" content="Texte généré par un système d'IA puis relu et approuvé par l'éditeur du site (règlement (UE) 2024/1689, art. 50)"><title>${e(titreDocument(d))} · ${e(d.domaine)}</title><style>${STYLE}${integre ? " main { padding-top: 8px; }" : ""}</style></head><body><main>${corps}${version}</main></body></html>`,
    { headers: entetes },
  );
}
