import { celluleCsv } from "@/lib/abonnes";
import { origineDe } from "@/lib/origine";
import { compteConnecte } from "@/lib/session";

export const runtime = "nodejs";

/** Export CSV des sites suivis et de leur dernier état (séparateur « ; », encodage UTF-8 avec BOM pour Excel). */
export async function GET(req: Request) {
  const compte = await compteConnecte();
  if (!compte) return new Response("Connectez-vous d'abord.", { status: 401 });
  const origine = origineDe(req);
  const lignes = [
    ["Site", "Note sur 100", "Manquements certains", "Évolution", "Dernier audit", "Rapport"],
    ...compte.sitesSuivis.map((s) => {
      const d = s.historique.at(-1);
      const avant = s.historique.at(-2);
      return [s.domaine, d?.note ?? "", d?.illegaux ?? "", d && avant ? d.illegaux - avant.illegaux : "", d?.date.slice(0, 10) ?? "", d ? `${origine}/audit/${d.audit}` : ""];
    }),
  ];
  return new Response("﻿" + lignes.map((l) => l.map(celluleCsv).join(";")).join("\r\n"), {
    headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="vigie-sites-${new Date().toISOString().slice(0, 10)}.csv"` },
  });
}
