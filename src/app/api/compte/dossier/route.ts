import { marqueDe } from "@/lib/abonnes";
import { estAdmin } from "@/lib/admin";
import { accesDomaine } from "@/lib/comptes";
import { dossierPdf } from "@/lib/dossier";
import { hebergesDuCompte } from "@/lib/documents-heberges";
import { signalerErreur } from "@/lib/journal";
import { autoriser, ipDe } from "@/lib/limite";
import { compteConnecte } from "@/lib/session";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Dossier de conformité d'un site débloqué, en PDF : ?domaine=exemple.fr */
export async function GET(req: Request) {
  const domaine = (new URL(req.url).searchParams.get("domaine") ?? "").toLowerCase().replace(/^www\./, "");
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domaine)) return new Response("Site invalide.", { status: 400 });
  const compte = await compteConnecte();
  if (!(await estAdmin()) && !accesDomaine(compte, domaine).complet) return new Response("Accès réservé.", { status: 402 });
  if (!(await autoriser("dossier:" + ipDe(req), 20, 60 * 60_000))) return new Response("Trop de demandes.", { status: 429 });
  try {
    const documents = compte ? (await hebergesDuCompte(compte.id)).filter((d) => d.domaine === domaine) : [];
    const pdf = await dossierPdf(domaine, documents, marqueDe(compte));
    return new Response(new Uint8Array(pdf), {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="dossier-conformite-${domaine}-${new Date().toISOString().slice(0, 10)}.pdf"`,
        "cache-control": "no-store",
      },
    });
  } catch (e) {
    if (/Aucun audit|introuvable/.test((e as Error).message)) return new Response((e as Error).message, { status: 404 });
    await signalerErreur("Dossier de conformité", e, { domaine });
    return new Response("Le dossier n'a pas pu être produit.", { status: 500 });
  }
}
