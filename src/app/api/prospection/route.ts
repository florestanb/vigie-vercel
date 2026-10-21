import { estAdmin, nonAutorise } from "@/lib/admin";
import { creerCampagne, executerCampagne, listerCampagnes, normaliserSites } from "@/lib/prospection/campagne";
import { signalerErreur } from "@/lib/journal";

export const runtime = "nodejs";

/** Liste des campagnes (sans le détail des lignes). */
export async function GET() {
  if (!(await estAdmin())) return nonAutorise();
  const campagnes = await listerCampagnes();
  return Response.json(
    campagnes.map(({ lignes, ...c }) => ({
      ...c,
      traites: lignes.length,
      mails: lignes.filter((l) => l.etat === "mail").length,
      envoyes: lignes.filter((l) => l.envoye).length,
    })),
  );
}

/** Crée une campagne et la lance en tâche de fond dans ce processus serveur. */
export async function POST(req: Request) {
  if (!(await estAdmin())) return nonAutorise();
  const corps = (await req.json().catch(() => ({}))) as { sites?: string; pause?: number; ia?: boolean };
  try {
    const id = await creerCampagne(normaliserSites(String(corps.sites ?? "")), { pause: Number(corps.pause) || undefined, ia: corps.ia === true });
    executerCampagne(id).catch((e) => signalerErreur("Campagne de prospection", e, { campagne: id }));
    return Response.json({ id });
  } catch (e) {
    return Response.json({ erreur: (e as Error).message }, { status: 400 });
  }
}
