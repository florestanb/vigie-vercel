import { origineDe } from "@/lib/origine";
import { honorerSession, stripe } from "@/lib/paiement";
import { ouvrirSession } from "@/lib/session";
import { signalerErreur } from "@/lib/journal";

export const runtime = "nodejs";

/**
 * Retour de Stripe après paiement : attribue l'achat (si le webhook n'est pas encore passé), connecte
 * l'acheteur à son compte, puis le ramène sur son rapport ou sur son compte.
 */
export async function GET(req: Request) {
  const origine = origineDe(req);
  const id = new URL(req.url).searchParams.get("session_id") ?? "";
  if (!/^cs_[\w]+$/.test(id)) return Response.redirect(`${origine}/tarifs`, 303);
  try {
    const session = await stripe().checkout.sessions.retrieve(id);
    // Le lien de retour ne sert à se connecter que dans les 24 heures qui suivent le paiement.
    const recent = Date.now() - session.created * 1000 < 24 * 3600_000;
    const compte = recent ? await honorerSession(session, origine) : null;
    if (!compte) return Response.redirect(`${origine}/compte?paiement=en-attente`, 303);
    await ouvrirSession(compte.id);
    const audit = session.metadata?.audit;
    return Response.redirect(audit ? `${origine}/audit/${audit}?debloque=1` : `${origine}/compte?bienvenue=1`, 303);
  } catch (e) {
    await signalerErreur("Retour de paiement", e, { session: id });
    return Response.redirect(`${origine}/compte?paiement=erreur`, 303);
  }
}
