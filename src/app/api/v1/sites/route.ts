import { authentifier } from "@/lib/api-v1";
import { chargerCompte } from "@/lib/comptes";
import { ajouterSiteSuivi, retirerSiteSuivi } from "@/lib/suivi";

export const runtime = "nodejs";

/** Sites suivis du compte, avec leur dernier état. */
export async function GET(req: Request) {
  const compte = await authentifier(req);
  if (compte instanceof Response) return compte;
  return Response.json({
    sites: compte.sitesSuivis.map((s) => ({ domaine: s.domaine, url: s.url, ajoute: s.ajoute, dernier: s.historique.at(-1) ?? null, historique: s.historique })),
  });
}

/** Ajoute un site suivi : { "url": "https://exemple.fr" }. Le premier audit se lance aussitôt. */
export async function POST(req: Request) {
  const compte = await authentifier(req);
  if (compte instanceof Response) return compte;
  const { url } = (await req.json().catch(() => ({}))) as { url?: string };
  try {
    await ajouterSiteSuivi(compte.id, String(url ?? ""));
    return Response.json({ sites: (await chargerCompte(compte.id))?.sitesSuivis.map((s) => s.domaine) }, { status: 201 });
  } catch (e) {
    return Response.json({ erreur: (e as Error).message }, { status: 400 });
  }
}

/** Retire un site suivi : ?domaine=exemple.fr */
export async function DELETE(req: Request) {
  const compte = await authentifier(req);
  if (compte instanceof Response) return compte;
  await retirerSiteSuivi(compte.id, new URL(req.url).searchParams.get("domaine") ?? "");
  return new Response(null, { status: 204 });
}
