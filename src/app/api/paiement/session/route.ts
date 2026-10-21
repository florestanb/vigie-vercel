import { emailValide } from "@/lib/comptes";
import { autoriser, ipDe } from "@/lib/limite";
import { OFFRES, type IdOffre } from "@/lib/offres";
import { origineDe } from "@/lib/origine";
import { creerSessionPaiement, paiementConfigure, paiementSimule, simulerPaiement } from "@/lib/paiement";
import { compteConnecte, ouvrirSession } from "@/lib/session";
import { signalerErreur } from "@/lib/journal";

export const runtime = "nodejs";

/** Démarre un paiement : renvoie l'adresse de la page de paiement Stripe. */
export async function POST(req: Request) {
  const corps = (await req.json().catch(() => ({}))) as { offre?: string; audit?: string; cgv?: boolean; email?: string };
  if (!corps.offre || !(corps.offre in OFFRES)) return Response.json({ erreur: "Offre inconnue." }, { status: 400 });
  if (corps.cgv !== true) return Response.json({ erreur: "Merci d'accepter les conditions générales de vente." }, { status: 400 });
  if (!(await autoriser("paiement:" + ipDe(req), 20, 60 * 60_000))) return Response.json({ erreur: "Trop de tentatives. Réessayez plus tard." }, { status: 429 });
  const offre = corps.offre as IdOffre;
  const audit = typeof corps.audit === "string" && /^[\w-]{6,40}$/.test(corps.audit) ? corps.audit : undefined;
  const compte = await compteConnecte();
  const origine = origineDe(req);

  try {
    if (paiementSimule()) {
      const email = compte?.email ?? corps.email ?? "";
      if (!emailValide(email)) return Response.json({ erreur: "Paiement simulé : indiquez une adresse e-mail." }, { status: 400 });
      const c = await simulerPaiement(offre, email, audit, origine);
      await ouvrirSession(c.id);
      return Response.json({ url: audit ? `${origine}/audit/${audit}?debloque=1` : `${origine}/compte?bienvenue=1` });
    }
    if (!paiementConfigure()) return Response.json({ erreur: "Le paiement n'est pas encore ouvert." }, { status: 503 });
    return Response.json({ url: await creerSessionPaiement({ offre, compte, auditId: audit, origine }) });
  } catch (e) {
    await signalerErreur("Démarrage du paiement", e, { offre });
    return Response.json({ erreur: "Le paiement n'a pas pu démarrer. Réessayez dans un instant." }, { status: 500 });
  }
}
