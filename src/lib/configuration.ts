import { adminConfigure } from "./admin";
import { EDITEUR } from "./editeur";
import { emailConfigure } from "./email";
import { iaDisponible } from "./ia/client";
import { paiementConfigure } from "./paiement";
import { sauvegardeConfiguree } from "./sauvegarde";

/** Ce qu'il faut régler avant d'ouvrir Vigie au public : chaque point dit ce qui manque et comment le corriger. */
export interface PointConfiguration {
  nom: string;
  ok: boolean;
  /** Bloquant : sans lui, une partie du service vendu ne fonctionne pas. */
  bloquant: boolean;
  aide: string;
}

export function verifierConfiguration(): PointConfiguration[] {
  const env = (k: string) => process.env[k]?.trim() ?? "";
  const champsEditeur = Object.entries(EDITEUR).filter(([, v]) => typeof v === "string" && v.startsWith("[À COMPLÉTER")).map(([k]) => k);
  return [
    { nom: "Paiement Stripe", ok: paiementConfigure(), bloquant: true, aide: "STRIPE_SECRET_KEY (sk_live_… en production)." },
    { nom: "Webhook Stripe", ok: !!env("STRIPE_WEBHOOK_SECRET"), bloquant: true, aide: "STRIPE_WEBHOOK_SECRET, et les événements listés dans le README." },
    { nom: "Clé live (pas de test)", ok: env("STRIPE_SECRET_KEY").startsWith("sk_live_"), bloquant: false, aide: "Une clé sk_test_ n'encaisse rien : à remplacer au lancement." },
    { nom: "Secret des sessions", ok: env("VIGIE_SECRET").length >= 32, bloquant: true, aide: "VIGIE_SECRET : 32 caractères aléatoires au moins." },
    { nom: "E-mails (Resend)", ok: emailConfigure(), bloquant: true, aide: "RESEND_API_KEY et VIGIE_EMAIL_EXPEDITEUR sur un domaine vérifié (SPF, DKIM)." },
    { nom: "IA (Claude)", ok: iaDisponible(), bloquant: true, aide: "ANTHROPIC_API_KEY : sans elle, l'offre Mise en conformité ne génère aucun document." },
    { nom: "Adresse publique", ok: env("VIGIE_URL_PUBLIQUE").startsWith("https://"), bloquant: true, aide: "VIGIE_URL_PUBLIQUE=https://… : liens des e-mails et retour de paiement." },
    { nom: "Mentions de l'éditeur", ok: !champsEditeur.length, bloquant: true, aide: champsEditeur.length ? `À remplir dans src/lib/editeur.ts : ${champsEditeur.join(", ")}.` : "Complètes." },
    { nom: "Proxy de confiance", ok: env("VIGIE_PROXY_DE_CONFIANCE") === "1", bloquant: false, aide: "VIGIE_PROXY_DE_CONFIANCE=1 derrière nginx ou Caddy, sinon limites d'usage communes à tous." },
    { nom: "Sauvegardes", ok: sauvegardeConfiguree(), bloquant: false, aide: "VIGIE_SAUVEGARDE_CLE (et VIGIE_SAUVEGARDE_DOSSIER hors du serveur, idéalement synchronisé ailleurs)." },
    { nom: "Alertes d'erreur", ok: !!env("VIGIE_EMAIL_ALERTES"), bloquant: false, aide: "VIGIE_EMAIL_ALERTES : votre adresse, pour être prévenu d'un échec de paiement ou d'e-mail." },
    { nom: "Espace privé", ok: adminConfigure(), bloquant: false, aide: "VIGIE_ADMIN_MOTDEPASSE : 12 caractères au moins." },
    { nom: "Paiement simulé désactivé", ok: env("VIGIE_PAIEMENT_SIMULE") !== "1", bloquant: true, aide: "VIGIE_PAIEMENT_SIMULE doit être vide en production." },
  ];
}
