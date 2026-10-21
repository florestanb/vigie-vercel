import { chargerAudit } from "./audit";
import { domaineDe, offreAbonnement, type Abonnement, type Compte, type Droit } from "./comptes";
import { EDITEUR } from "./editeur";
import { envoyerEmail } from "./email";
import { OFFRES, offreDe } from "./offres";
import { creerJetonConnexion } from "./session";

/**
 * E-mails envoyés aux clients après un achat. Chacun contient un lien d'accès direct à leur espace,
 * valable pendant toute la durée de l'achat : le client retrouve son rapport depuis n'importe quel appareil.
 */

const JOUR = 86_400_000;
const date = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const support = () => (EDITEUR.email.startsWith("[") ? "en répondant à ce message" : `à ${EDITEUR.email}`);

export function origineSite(origine?: string): string {
  return process.env.VIGIE_URL_PUBLIQUE?.trim().replace(/\/$/, "") || origine || "http://localhost:3000";
}

async function lienAcces(email: string, origine: string, suite: string, jusqua: number): Promise<string> {
  const jeton = await creerJetonConnexion(email, { dureeMs: Math.max(jusqua - Date.now(), 3600_000), reutilisable: true, suite });
  return `${origine}/api/connexion/lien?jeton=${jeton}`;
}

async function siteDeLAudit(auditId?: string): Promise<string | null> {
  if (!auditId) return null;
  const audit = await chargerAudit(auditId).catch(() => null);
  return audit ? domaineDe(audit.url) : null;
}

export async function confirmerAchat(compte: Compte, droit: Droit, origine: string, auditId?: string): Promise<void> {
  const o = offreDe(droit.offre);
  const site = await siteDeLAudit(auditId);
  const lien = await lienAcces(compte.email, origine, auditId ? `/audit/${auditId}` : "/compte", Date.parse(droit.expire));
  await envoyerEmail({
    a: compte.email,
    objet: site ? `Votre rapport complet de ${site} est débloqué` : `Votre achat Vigie · ${o.nom}`,
    texte: [
      "Bonjour,",
      "",
      `Merci pour votre achat de l'offre ${o.nom} (${o.prix} €).`,
      "",
      site ? `Le rapport complet de ${site} est débloqué :` : "Accédez à votre espace :",
      lien,
      "",
      "Ce que comprend votre achat, jusqu'au " + date(droit.expire) + " :",
      `- le rapport complet de ${o.sites > 1 ? `${o.sites} sites au plus${site ? `, dont ${site}` : ""}` : site ?? "votre site"} : tous les constats, leurs preuves et les textes qui les imposent ;`,
      "- des audits illimités sur ces sites, par exemple après chaque correction ;",
      ...(o.documents ? ["- la génération automatique de tous leurs documents (mentions légales, confidentialité, cookies, CGV, CGU), à relire et approuver ;"] : []),
      "",
      `Pour débloquer un autre site : lancez son audit sur ${origine}, puis cliquez sur « Débloquer ce site » dans le rapport.`,
      "",
      "Ce lien vous connecte directement : ne le transférez pas. Vous pouvez aussi demander un lien de connexion à tout moment sur " + `${origine}/connexion.`,
      "",
      `Une question ? Écrivez-nous ${support()}.`,
      "",
      "L'équipe Vigie",
    ].join("\n"),
  });
}

export async function confirmerAbonnement(compte: Compte, abo: Abonnement, origine: string, auditId?: string): Promise<void> {
  const o = offreAbonnement(abo);
  const lien = await lienAcces(compte.email, origine, auditId ? `/audit/${auditId}` : "/compte", Date.parse(abo.finPeriode));
  await envoyerEmail({
    a: compte.email,
    objet: `Votre abonnement Vigie · ${o.nom} est actif`,
    texte: [
      "Bonjour,",
      "",
      `Votre abonnement ${o.nom} (${o.prix} € par mois) est actif.`,
      "",
      "Accédez à votre espace :",
      lien,
      "",
      `- ${o.sites > 1 ? `${o.sites} sites suivis` : "votre site suivi"}, documents compris, et hébergés si vous le souhaitez ;`,
      "- ajoutez vos sites à suivre depuis votre espace : ils seront réaudités chaque semaine, avec une alerte en cas de nouveau manquement ou de nouvelle obligation qui vous concerne ;",
      ...(o.marqueBlanche ? ["- réglez votre marque (nom, logo) depuis votre espace : rapports et dossiers PDF porteront votre nom ;"] : []),
      `- prochain renouvellement le ${date(abo.finPeriode)} ; factures et résiliation en un clic depuis votre espace.`,
      "",
      `Une question ? Écrivez-nous ${support()}.`,
      "",
      "L'équipe Vigie",
    ].join("\n"),
  });
}

/** Rappel avant la fin des 14 jours, avec la liste des sites et la suite possible. */
export async function rappelerExpiration(compte: Compte, droit: Droit, origine: string): Promise<void> {
  const o = offreDe(droit.offre);
  const lien = await lienAcces(compte.email, origine, "/compte", Date.parse(droit.expire) + JOUR);
  await envoyerEmail({
    a: compte.email,
    objet: `Vos accès Vigie se terminent le ${date(droit.expire)}`,
    texte: [
      "Bonjour,",
      "",
      `Votre offre ${o.nom} se termine le ${date(droit.expire)}. D'ici là, pensez à relancer l'audit de vos sites pour vérifier vos corrections${o.documents ? " et à générer les documents qui vous manquent" : ""}.`,
      "",
      droit.domaines.length ? `Sites débloqués : ${droit.domaines.join(", ")}.` : "Vous n'avez encore débloqué aucun site.",
      "",
      lien,
      "",
      `Pour garder un œil sur vos sites ensuite, l'abonnement ${OFFRES.site.nom} (${OFFRES.site.prix} € par mois et par site) le réaudite chaque semaine, héberge vos documents et vous alerte en cas de nouveau problème ou de nouvelle obligation.`,
      "",
      `Une question ? Écrivez-nous ${support()}.`,
      "",
      "L'équipe Vigie",
    ].join("\n"),
  });
}
