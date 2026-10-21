import { origineDe } from "@/lib/origine";
import { stripe, traiterEvenement } from "@/lib/paiement";
import { signalerErreur } from "@/lib/journal";

export const runtime = "nodejs";

/** Événements Stripe (paiement réglé, abonnement créé, renouvelé ou résilié). La signature est vérifiée. */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) return new Response("Webhook non configuré.", { status: 400 });
  let evenement;
  try {
    evenement = stripe().webhooks.constructEvent(await req.text(), signature, secret);
  } catch {
    return new Response("Signature invalide.", { status: 400 });
  }
  try {
    await traiterEvenement(evenement, origineDe(req));
  } catch (e) {
    await signalerErreur("Webhook Stripe", e, { evenement: evenement.type, id: evenement.id });
    return new Response("Erreur de traitement.", { status: 500 }); // Stripe réessaiera.
  }
  return new Response("ok");
}
