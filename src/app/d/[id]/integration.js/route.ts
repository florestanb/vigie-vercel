import { chargerHeberge } from "@/lib/documents-heberges";
import { origineDe } from "@/lib/origine";

export const runtime = "nodejs";
type Params = { params: Promise<{ id: string }> };

/**
 * Script d'intégration : remplace l'élément <div data-vigie-document="…"> par le document, mis en forme par
 * la feuille de style du site du client. Le fragment est du HTML assaini (aucun script, aucun attribut d'événement).
 */
export async function GET(req: Request, { params }: Params) {
  const { id } = await params;
  const d = await chargerHeberge(id).catch(() => null);
  if (!d) return new Response("/* Document introuvable. */", { status: 404, headers: { "content-type": "text/javascript; charset=utf-8" } });
  const source = JSON.stringify(`${origineDe(req)}/d/${d.id}?format=fragment`);
  const cible = JSON.stringify(`[data-vigie-document="${d.id}"]`);
  return new Response(
    `(function () {
  var cible = document.querySelector(${cible});
  if (!cible) return;
  fetch(${source}).then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); }).then(function (html) { cible.innerHTML = html; });
})();`,
    { headers: { "content-type": "text/javascript; charset=utf-8", "cache-control": "public, max-age=300", "access-control-allow-origin": "*" } },
  );
}
