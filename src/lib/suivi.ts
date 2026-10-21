import fs from "node:fs/promises";
import { lancerAudit } from "./audit";
import { DOSSIER_COMPTES, abonnementActif, offreAbonnement, chargerCompte, debloquerDomaine, domaineDe, modifierCompte, type Compte } from "./comptes";
import { envoyerEmail } from "./email";
import { origineSite, rappelerExpiration } from "./emails-clients";
import { creerSauvegarde, derniereSauvegarde, sauvegardeConfiguree } from "./sauvegarde";
import { purgerJetons } from "./session";
import { constatsCertains } from "./prospection/selection";
import { calculerScore, evaluer } from "./rules/engine";
import { signalerErreur } from "./journal";
import { passeDeVeille } from "./veille";

/**
 * Suivi des sites pour les abonnés : chaque site suivi est réaudité automatiquement chaque semaine ;
 * si de nouveaux manquements certains apparaissent, l'abonné reçoit une alerte par e-mail.
 * Chaque site suivi compte dans le quota mensuel de l'abonnement.
 */

const INTERVALLE_JOURS = 7;
const MAX_HISTORIQUE = 26;

export async function ajouterSiteSuivi(compteId: string, saisie: string): Promise<void> {
  const compte = await chargerCompte(compteId);
  const abo = compte && abonnementActif(compte);
  if (!compte || !abo) throw new Error("Le suivi est réservé aux abonnés.");
  const quota = offreAbonnement(abo).sites;
  const url = /^https?:\/\//i.test(saisie.trim()) ? saisie.trim() : `https://${saisie.trim()}`;
  const domaine = domaineDe(url);
  if (!domaine.includes(".")) throw new Error("Adresse de site invalide.");
  if (compte.sitesSuivis.some((s) => s.domaine === domaine)) return;
  if (compte.sitesSuivis.length >= quota) throw new Error(quota > 1 ? `${quota} sites suivis au plus avec votre formule.` : "Votre formule couvre un site : passez à l'offre Agence pour en suivre plusieurs.");
  await debloquerDomaine(compteId, domaine, "abonnement");
  await modifierCompte(compteId, (c) => void c.sitesSuivis.push({ domaine, url, ajoute: new Date().toISOString(), historique: [] }));
  auditerSiteSuivi(compteId, domaine).catch((e) => signalerErreur("Suivi des sites", e, { domaine }));
}

export async function retirerSiteSuivi(compteId: string, domaine: string): Promise<void> {
  await modifierCompte(compteId, (c) => void (c.sitesSuivis = c.sitesSuivis.filter((s) => s.domaine !== domaine)));
}

export async function auditerSiteSuivi(compteId: string, domaine: string): Promise<void> {
  const compte = await chargerCompte(compteId);
  const site = compte?.sitesSuivis.find((s) => s.domaine === domaine);
  if (!compte || !site || !abonnementActif(compte)) return;
  // Nouvelle période : le site reprend une place dans le quota du mois (sauf s'il est plein).
  await debloquerDomaine(compteId, domaine, "abonnement").catch(() => {});
  const audit = await lancerAudit(site.url, () => {}, { ia: false });
  const score = calculerScore(evaluer(audit.profil, audit.constatsAuto, audit.constatsIA));
  const certains = constatsCertains(audit);
  const precedent = site.historique.at(-1);
  await modifierCompte(compteId, (c) => {
    const s = c.sitesSuivis.find((x) => x.domaine === domaine);
    if (!s) return;
    s.historique.push({ audit: audit.id, date: audit.date, note: score.note, illegaux: certains.length });
    s.historique = s.historique.slice(-MAX_HISTORIQUE);
  });
  if (precedent && certains.length > precedent.illegaux) await alerter(compte, domaine, audit.id, certains.length - precedent.illegaux, certains.map((r) => r.regle.titre));
}

async function alerter(compte: Compte, domaine: string, auditId: string, nouveaux: number, titres: string[]) {
  const lien = `${process.env.VIGIE_URL_PUBLIQUE?.trim().replace(/\/$/, "") ?? ""}/audit/${auditId}`;
  await envoyerEmail({
    a: compte.email,
    objet: `${domaine} : ${nouveaux} nouveau${nouveaux > 1 ? "x" : ""} manquement${nouveaux > 1 ? "s" : ""} détecté${nouveaux > 1 ? "s" : ""}`,
    texte: `Bonjour,\n\nLe suivi hebdomadaire de ${domaine} a relevé ${nouveaux} manquement${nouveaux > 1 ? "s" : ""} de plus que lors du précédent audit.\n\nPoints relevés :\n${titres.map((t) => `- ${t}`).join("\n")}\n\nRapport complet : ${lien}\n\nVigie`,
  }).catch((e) => signalerErreur("E-mail", e, { type: "alerte de suivi" }));
}

/** Passe en revue les abonnés et réaudite les sites dont le dernier audit date de plus d'une semaine. */
export async function tourneeDeSuivi(): Promise<void> {
  const limite = Date.now() - INTERVALLE_JOURS * 86_400_000;
  await purgerJetons();
  // Veille du registre : alertes « nouvelle obligation » et documents hébergés à mettre à jour.
  await passeDeVeille().catch((e) => signalerErreur("Veille du registre", e));
  // Sauvegarde quotidienne, si une phrase secrète est configurée.
  if (sauvegardeConfiguree()) {
    const derniere = await derniereSauvegarde();
    if (!derniere || Date.now() - derniere.getTime() > 23 * 3600_000) await creerSauvegarde().catch((e) => signalerErreur("Sauvegarde", e));
  }
  for (const f of await fs.readdir(DOSSIER_COMPTES).catch(() => [] as string[])) {
    if (!/^[a-f0-9]{24}\.json$/.test(f)) continue;
    const compte = await chargerCompte(f.slice(0, 24));
    if (!compte) continue;
    await rappels(compte);
    if (!abonnementActif(compte)) continue;
    for (const s of compte.sitesSuivis) {
      const dernier = s.historique.at(-1);
      if (dernier && Date.parse(dernier.date) > limite) continue;
      await auditerSiteSuivi(compte.id, s.domaine).catch((e) => signalerErreur("Suivi des sites", e, { domaine: s.domaine }));
    }
  }
}

/** Deux jours avant la fin d'un achat de 14 jours : un e-mail de rappel, une seule fois. */
async function rappels(compte: Compte): Promise<void> {
  const maintenant = Date.now();
  for (const d of compte.droits) {
    const reste = Date.parse(d.expire) - maintenant;
    if (d.rembourse || d.rappelEnvoye || reste <= 0 || reste > 2 * 86_400_000) continue;
    await modifierCompte(compte.id, (c) => {
      const x = c.droits.find((y) => y.id === d.id);
      if (x) x.rappelEnvoye = true;
    });
    await rappelerExpiration(compte, d, origineSite()).catch((e) => signalerErreur("E-mail", e, { type: "rappel d'expiration" }));
  }
}

/** Lance la tournée toutes les heures dans le processus serveur (appelé une fois au démarrage). */
export function demarrerSuivi(): void {
  const g = globalThis as { __vigieSuivi?: NodeJS.Timeout };
  if (g.__vigieSuivi) return;
  let enCours = false;
  const tour = async () => {
    if (enCours) return;
    enCours = true;
    try {
      await tourneeDeSuivi();
    } finally {
      enCours = false;
    }
  };
  g.__vigieSuivi = setInterval(tour, 3600_000);
  setTimeout(tour, 60_000);
}
