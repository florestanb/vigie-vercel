import { formule, sitesDepuisCsv } from "@/lib/abonnes";
import { autoriser, ipDe } from "@/lib/limite";
import { compteConnecte } from "@/lib/session";
import { ajouterSiteSuivi } from "@/lib/suivi";

export const runtime = "nodejs";

/** Ajoute aux sites suivis toutes les adresses d'un fichier CSV (offres agence), dans la limite du quota. */
export async function POST(req: Request) {
  const compte = await compteConnecte();
  if (!compte) return Response.json({ erreur: "Connectez-vous d'abord." }, { status: 401 });
  if (!formule(compte)?.api) return Response.json({ erreur: "L'import CSV fait partie des offres Agence." }, { status: 402 });
  if (!(await autoriser("import:" + ipDe(req), 10, 60 * 60_000))) return Response.json({ erreur: "Trop de demandes." }, { status: 429 });
  const { csv } = (await req.json().catch(() => ({}))) as { csv?: string };
  const sites = sitesDepuisCsv(String(csv ?? "").slice(0, 500_000));
  if (!sites.length) return Response.json({ erreur: "Aucune adresse de site trouvée dans le fichier." }, { status: 400 });
  const ajoutes: string[] = [];
  const refuses: { site: string; raison: string }[] = [];
  for (const site of sites) {
    try {
      await ajouterSiteSuivi(compte.id, site);
      ajoutes.push(site);
    } catch (e) {
      refuses.push({ site, raison: (e as Error).message });
    }
  }
  return Response.json({ ajoutes, refuses });
}
