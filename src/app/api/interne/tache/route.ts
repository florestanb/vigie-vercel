import { after } from "next/server";
import { signalerErreur } from "@/lib/journal";
import { appelInterne, executerTache, type Tache } from "@/lib/taches";

export const runtime = "nodejs";
// Un audit complet (navigateur et lecture par Claude) ; limite du plan Hobby de Vercel.
export const maxDuration = 300;

/** Exécute une tâche longue (voir taches.ts) : répond aussitôt, puis travaille jusqu'à maxDuration. */
export async function POST(req: Request) {
  if (!appelInterne(req)) return new Response("Non autorisé.", { status: 401 });
  const t = (await req.json().catch(() => null)) as Tache | null;
  const valide =
    (t?.type === "suivi" && /^[a-f0-9]{24}$/.test(String(t.compte)) && typeof t.domaine === "string" && t.domaine.length < 300) ||
    (t?.type === "campagne" && /^[\w-]{4,60}$/.test(String(t.id)) && /^[a-f0-9]{16}$/.test(String(t.chaine)));
  if (!t || !valide) return Response.json({ erreur: "Tâche invalide." }, { status: 400 });
  after(() => executerTache(t).catch((e) => signalerErreur(t.type === "suivi" ? "Suivi des sites" : "Campagne de prospection", e, { ...t })));
  return Response.json({ acceptee: true }, { status: 202 });
}
