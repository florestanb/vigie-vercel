import Stripe from "stripe";
import { chargerAudit } from "./audit";
import {
  ajouterDroit,
  chargerCompte,
  compteParClientStripe,
  debloquerDomaine,
  domaineDe,
  majAbonnement,
  modifierCompte,
  retenirAudit,
  revoquerPaiement,
  trouverOuCreerCompte,
  type Compte,
} from "./comptes";
import { confirmerAbonnement, confirmerAchat, origineSite } from "./emails-clients";
import { ABONNEMENTS, OFFRES, estAbonnement, type IdAbonnement, type IdOffre } from "./offres";
import { signalerErreur } from "./journal";

/**
 * Paiement par Stripe Checkout. Les moyens de paiement proposés (carte, Apple Pay, Google Pay, PayPal, SEPA,
 * Link…) se règlent dans le tableau de bord Stripe : on ne fixe pas payment_method_types, Stripe affiche
 * ceux qui sont activés et pertinents pour le client.
 *
 * Les droits sont attribués à la réception du webhook, et aussi au retour sur le site (au cas où le webhook
 * arrive après le client) : l'attribution est idempotente.
 */

let client: Stripe | null = null;

export const paiementConfigure = () => Boolean(process.env.STRIPE_SECRET_KEY?.trim());
/** Paiement simulé, pour essayer le parcours en local sans compte Stripe. Jamais en production. */
export const paiementSimule = () => process.env.VIGIE_PAIEMENT_SIMULE === "1" && process.env.NODE_ENV !== "production";

export function stripe(): Stripe {
  if (!paiementConfigure()) throw new Error("Le paiement n'est pas configuré (STRIPE_SECRET_KEY).");
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY!.trim());
  return client;
}

export interface DemandePaiement {
  offre: IdOffre;
  compte: Compte | null;
  auditId?: string;
  origine: string;
}

export async function creerSessionPaiement({ offre: id, compte, auditId, origine }: DemandePaiement): Promise<string> {
  const offre = OFFRES[id];
  const abonnement = offre.periode === "mois";
  const metadata = { offre: id, compte: compte?.id ?? "", audit: auditId ?? "", cgv: new Date().toISOString() };
  const session = await stripe().checkout.sessions.create({
    mode: abonnement ? "subscription" : "payment",
    locale: "fr",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(offre.prix * 100),
          product_data: { name: `Vigie · ${offre.nom}`, description: offre.avantages.slice(0, 3).join(" · ") },
          ...(abonnement ? { recurring: { interval: "month" as const } } : {}),
        },
      },
    ],
    ...(compte?.stripeClient
      ? { customer: compte.stripeClient, customer_update: { address: "auto" as const, name: "auto" as const } }
      : { customer_email: compte?.email, ...(abonnement ? {} : { customer_creation: "always" as const }) }),
    client_reference_id: compte?.id,
    metadata,
    ...(abonnement ? { subscription_data: { metadata } } : { invoice_creation: { enabled: true, invoice_data: { metadata } } }),
    // Clientèle professionnelle : adresse de facturation et numéro de TVA pour la facture.
    billing_address_collection: "required",
    tax_id_collection: { enabled: true },
    allow_promotion_codes: true,
    success_url: `${origine}/api/paiement/retour?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origine}/tarifs${auditId ? `?audit=${encodeURIComponent(auditId)}` : ""}`,
  });
  if (!session.url) throw new Error("Stripe n'a pas renvoyé de page de paiement.");
  return session.url;
}

/** Débloque le site de l'audit depuis lequel le client a acheté, s'il y en a un. */
async function debloquerAuditDAchat(compteId: string, auditId: string | undefined, source?: string) {
  if (!auditId) return;
  const audit = await chargerAudit(auditId).catch(() => null);
  if (!audit) return;
  await debloquerDomaine(compteId, domaineDe(audit.url), source).catch(() => {});
  await retenirAudit(compteId, domaineDe(audit.url), audit.id, audit.date);
}

/** Les e-mails ne doivent jamais faire échouer l'attribution d'un achat déjà payé. */
const sansEchec = (p: Promise<unknown>) => p.catch((e) => signalerErreur("E-mail", e, { type: "confirmation d'achat" }));

/**
 * Attribue ce qu'une session de paiement réglée a acheté. Renvoie le compte concerné.
 * Sans effet (et sans erreur) si la session n'est pas payée ou a déjà été traitée.
 */
export async function honorerSession(session: Stripe.Checkout.Session, origine?: string): Promise<Compte | null> {
  const paye = session.status === "complete" && (session.payment_status === "paid" || session.payment_status === "no_payment_required");
  if (!paye) return null;
  const offre = session.metadata?.offre as IdOffre | undefined;
  if (!offre || !(offre in OFFRES)) return null;

  const email = session.customer_details?.email ?? session.customer_email;
  const compte = session.client_reference_id
    ? await chargerCompte(session.client_reference_id)
    : email
      ? await trouverOuCreerCompte(email)
      : null;
  if (!compte) return null;

  const clientStripe = typeof session.customer === "string" ? session.customer : session.customer?.id;
  if (clientStripe && compte.stripeClient !== clientStripe) await modifierCompte(compte.id, (c) => void (c.stripeClient = clientStripe));

  const auditId = session.metadata?.audit || undefined;
  const site = origineSite(origine);
  if (estAbonnement(offre)) {
    const abonnementId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
    const dejaConnu = compte.abonnement?.id === abonnementId;
    if (abonnementId) await synchroniserAbonnement(await stripe().subscriptions.retrieve(abonnementId), compte.id);
    await debloquerAuditDAchat(compte.id, auditId, "abonnement");
    const maj = await chargerCompte(compte.id);
    if (!dejaConnu && maj?.abonnement) await sansEchec(confirmerAbonnement(maj, maj.abonnement, site, auditId));
  } else {
    const paiement = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
    const droit = await ajouterDroit(compte.id, session.id, "ponctuel", new Date(session.created * 1000), paiement);
    await debloquerAuditDAchat(compte.id, auditId, session.id);
    // Seulement à la première attribution : webhook et retour sur le site ne doublent pas l'e-mail.
    if (droit) await sansEchec(confirmerAchat((await chargerCompte(compte.id))!, droit, site, auditId));
  }
  return chargerCompte(compte.id);
}

/** Recopie l'état d'un abonnement Stripe dans le compte. */
export async function synchroniserAbonnement(abo: Stripe.Subscription, compteId?: string): Promise<void> {
  const clientStripe = typeof abo.customer === "string" ? abo.customer : abo.customer.id;
  const compte = compteId ? await chargerCompte(compteId) : (await chargerCompte(abo.metadata?.compte ?? "").catch(() => null)) ?? (await compteParClientStripe(clientStripe));
  if (!compte) return;
  // Depuis 2025, les périodes de facturation sont portées par les éléments de l'abonnement.
  const element = abo.items.data[0];
  if (!element) return;
  const offre = ABONNEMENTS.find((o) => o === abo.metadata?.offre);
  await majAbonnement(compte.id, {
    id: abo.id,
    ...(offre ? { offre } : {}),
    statut: abo.status,
    debutPeriode: new Date(element.current_period_start * 1000).toISOString(),
    finPeriode: new Date(element.current_period_end * 1000).toISOString(),
    resilieFinPeriode: abo.cancel_at_period_end,
  });
}

export async function traiterEvenement(ev: Stripe.Event, origine?: string): Promise<void> {
  switch (ev.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": // prélèvement SEPA : payé quelques jours plus tard
      await honorerSession(ev.data.object, origine);
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await synchroniserAbonnement(ev.data.object);
      break;
    case "charge.refunded": {
      // Remboursement complet d'un achat unique : ses accès sont retirés.
      const charge = ev.data.object;
      if (charge.amount_refunded < charge.amount) break;
      const paiement = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
      const client = typeof charge.customer === "string" ? charge.customer : charge.customer?.id;
      const compte = client ? await compteParClientStripe(client) : null;
      if (compte && paiement) await revoquerPaiement(compte.id, paiement);
      break;
    }
  }
}

/** Portail client Stripe : factures, moyen de paiement, résiliation de l'abonnement. */
export async function urlPortailClient(compte: Compte, retour: string): Promise<string> {
  if (!compte.stripeClient) throw new Error("Aucun paiement associé à ce compte.");
  const s = await stripe().billingPortal.sessions.create({ customer: compte.stripeClient, return_url: retour, locale: "fr" });
  return s.url;
}

/** Paiement simulé (développement) : attribue directement l'offre au compte, comme le ferait Stripe. */
export async function simulerPaiement(offre: IdOffre, email: string, auditId?: string, origine?: string): Promise<Compte> {
  const compte = await trouverOuCreerCompte(email);
  const id = `simule_${Date.now()}`;
  const site = origineSite(origine);
  if (estAbonnement(offre)) {
    const maintenant = new Date();
    await majAbonnement(compte.id, {
      id: `sub_simule_${offre}`,
      offre: offre as IdAbonnement,
      statut: "active",
      debutPeriode: maintenant.toISOString(),
      finPeriode: new Date(maintenant.getTime() + 30 * 86_400_000).toISOString(),
      resilieFinPeriode: false,
    });
    await debloquerAuditDAchat(compte.id, auditId, "abonnement");
    const maj = (await chargerCompte(compte.id))!;
    await sansEchec(confirmerAbonnement(maj, maj.abonnement!, site, auditId));
  } else {
    const droit = await ajouterDroit(compte.id, id, "ponctuel", new Date(), `pi_${id}`);
    await debloquerAuditDAchat(compte.id, auditId, id);
    if (droit) await sansEchec(confirmerAchat((await chargerCompte(compte.id))!, droit, site, auditId));
  }
  return (await chargerCompte(compte.id))!;
}
