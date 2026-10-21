import { accesAudit } from "@/lib/acces";
import { chargerAudit } from "@/lib/audit";
import { PLANS, type TypeDocument } from "@/lib/documents/plans";
import { iaDisponible, messageErreurIA } from "@/lib/ia/client";
import { redigerEnFlux } from "@/lib/ia/redaction";
import { autoriser, ipDe } from "@/lib/limite";
import type { Profil } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 300;

/** Rédige un document pour un audit donné et renvoie le Markdown en flux texte. */
export async function POST(req: Request) {
  const corps = (await req.json().catch(() => ({}))) as { auditId?: string; type?: string; reponses?: Record<string, string>; profil?: Profil };
  const audit = corps.auditId ? await chargerAudit(corps.auditId) : null;
  if (!audit) return new Response("Audit introuvable.", { status: 404 });
  if (!corps.type || !(corps.type in PLANS)) return new Response("Type de document inconnu.", { status: 400 });
  if (!(await accesAudit(audit)).documents) return new Response("La génération des documents fait partie de l'offre Mise en conformité.", { status: 402 });
  if (!iaDisponible()) return new Response("La rédaction nécessite une clé d'API Claude (ANTHROPIC_API_KEY) côté serveur.", { status: 503 });
  if (!autoriser("doc:" + ipDe(req), 20, 60 * 60_000)) return new Response("Trop de documents demandés. Réessayez plus tard.", { status: 429 });

  const reponses = Object.fromEntries(
    Object.entries(corps.reponses ?? {})
      .filter(([, v]) => typeof v === "string" && v.trim())
      .map(([k, v]) => [k.slice(0, 40), v.slice(0, 1000)]),
  );
  const flux = redigerEnFlux({ audit: corps.profil ? { ...audit, profil: corps.profil } : audit, type: corps.type as TypeDocument, reponses });
  const encodeur = new TextEncoder();

  const sortie = new ReadableStream<Uint8Array>({
    async start(controleur) {
      try {
        flux.on("text", (morceau) => controleur.enqueue(encodeur.encode(morceau)));
        const message = await flux.finalMessage();
        if (message.stop_reason === "refusal") controleur.enqueue(encodeur.encode("\n\n[La rédaction a été interrompue par les filtres de sécurité.]"));
        if (message.stop_reason === "max_tokens") controleur.enqueue(encodeur.encode("\n\n[Document tronqué : longueur maximale atteinte.]"));
      } catch (e) {
        controleur.enqueue(encodeur.encode(`\n\n[Erreur : ${messageErreurIA(e)}]`));
      } finally {
        controleur.close();
      }
    },
    cancel() {
      flux.abort();
    },
  });
  return new Response(sortie, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
}
