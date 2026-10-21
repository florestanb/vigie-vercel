import { estAdmin, nonAutorise } from "@/lib/admin";
import { cheminMail } from "@/lib/prospection/campagne";
import { lire } from "@/lib/stockage";

export const runtime = "nodejs";
type Params = { params: Promise<{ id: string; fichier: string }> };

const TYPES = {
  html: "text/html; charset=utf-8",
  txt: "text/plain; charset=utf-8",
  eml: "message/rfc822",
} as const;

/** Sert un mail préparé : aperçu HTML, texte brut, ou brouillon .eml à ouvrir dans la messagerie. */
export async function GET(req: Request, { params }: Params) {
  if (!(await estAdmin())) return nonAutorise();
  const { id, fichier } = await params;
  const format = (new URL(req.url).searchParams.get("format") ?? "html") as keyof typeof TYPES;
  if (!(format in TYPES)) return new Response("Format inconnu.", { status: 400 });
  try {
    const contenu = await lire(cheminMail(id, fichier, format));
    if (!contenu) throw new Error("introuvable");
    return new Response(new Uint8Array(contenu), {
      headers: {
        "content-type": TYPES[format],
        "cache-control": "no-store",
        // L'aperçu ne doit exécuter aucun script ; le brouillon se télécharge.
        "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; img-src data:",
        ...(format === "eml" ? { "content-disposition": `attachment; filename="${fichier}.eml"` } : {}),
      },
    });
  } catch {
    return new Response("Mail introuvable.", { status: 404 });
  }
}
