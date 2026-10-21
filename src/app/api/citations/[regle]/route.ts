import citations from "@/lib/rules/citations.json";
import { cleRef, type Citation } from "@/lib/rules/citations-ref";
import { REVUE } from "@/lib/rules/revue";

type Params = { params: Promise<{ regle: string }> };

/** Texte officiel des articles qui fondent une règle du registre (public, comme le registre). */
export async function GET(_req: Request, { params }: Params) {
  const revue = REVUE[(await params).regle];
  if (!revue) return Response.json({ articles: [] }, { status: 404 });
  const index = citations as Record<string, Citation>;
  return Response.json(
    {
      articles: revue.articles.map((a) => {
        const c = index[cleRef(a)];
        return { titre: `${a.type === "code" ? a.code : a.nom}, art. ${a.num}`, texte: c?.texte ?? null, url: c?.url || null, version: c?.version ?? null, recupere: c?.recupere ?? null };
      }),
    },
    { headers: { "cache-control": "public, max-age=3600" } },
  );
}
