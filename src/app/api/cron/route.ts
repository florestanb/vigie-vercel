import { signalerErreur } from "@/lib/journal";
import { tourneeDeSuivi } from "@/lib/suivi";
import { appelInterne } from "@/lib/taches";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * Tournée planifiée (vercel.json, une fois par jour) : ménage, veille du registre, rappels, sauvegarde,
 * relance des campagnes interrompues et lancement des audits de suivi. Vercel l'appelle avec
 * « Authorization: Bearer $CRON_SECRET ».
 */
export async function GET(req: Request) {
  if (!appelInterne(req)) return new Response("Non autorisé.", { status: 401 });
  if (process.env.VIGIE_SUIVI === "0") return Response.json({ desactive: true });
  try {
    return Response.json(await tourneeDeSuivi());
  } catch (e) {
    await signalerErreur("Tournée", e);
    return Response.json({ erreur: (e as Error).message }, { status: 500 });
  }
}
