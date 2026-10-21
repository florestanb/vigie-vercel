import { evaluer, trier, verdict } from "../rules/engine";
import type { Audit, Conditions, ResultatRegle } from "../types";

/**
 * Constats qu'on peut écrire à un inconnu : illégaux au sens strict (exigence écrite dans la loi,
 * constat certain) et établis par les vérifications automatiques seules, jamais par la lecture de
 * Claude, qui peut se tromper. Les zones de flou et les points à vérifier restent dans le rapport.
 */
export function constatsCertains(audit: Audit): ResultatRegle[] {
  return trier(evaluer(audit.profil, audit.constatsAuto, {})).filter(
    (r) =>
      verdict(r) === "illegal" &&
      // Règles « à déclarer » : un contrôle automatique les éclaire (tunnel, accessibilité), sans suffire à les établir.
      r.regle.verification !== "declaratif" &&
      (audit.entreprise || !dependDeLaTaille(r.regle.conditions)),
  );
}

/**
 * Règle qui ne s'applique qu'au-delà ou en deçà d'une taille d'entreprise (accessibilité : microentreprises
 * dispensées). Sans les données du répertoire Sirene, la taille est supposée : on n'écrit pas à un inconnu
 * qu'il enfreint une règle qui ne le concerne peut-être pas.
 */
function dependDeLaTaille(c: Conditions): boolean {
  return c.microEntreprise !== undefined || c.grandeEntreprise !== undefined || !!c.ou?.some(dependDeLaTaille);
}

/**
 * Un parcours qui n'a presque rien lu (page de protection anti-robots, site en maintenance, erreur)
 * produirait de faux manquements : on ne prospecte pas un site qu'on n'a pas vraiment vu.
 */
export function motifExclusion(audit: Audit): string | null {
  const c = audit.crawl;
  if (c.statutHttp && c.statutHttp >= 400) return `le site a répondu ${c.statutHttp} (accès refusé au robot ?)`;
  if (c.texteAccueil.trim().length < 300) return "page d'accueil presque vide (protection anti-robots ou erreur ?)";
  if (c.liens.length < 5) return "trop peu de liens lus sur la page d'accueil";
  if (c.erreurs.length) return `pages illisibles pendant le parcours : ${c.erreurs[0]}`;
  return null;
}

const GENERIQUES = /^(contact|info|infos|bonjour|hello|commercial|direction|admin|boutique|shop|sav|service-?client)@/i;

/** Adresse publiée par le site, de préférence générique et sur le domaine du site. */
export function destinataire(audit: Audit): string | null {
  const hote = new URL(audit.url).hostname.replace(/^www\./, "");
  const emails = audit.crawl.identite.emails.filter((e) => !/no-?reply|ne-pas-repondre|example\.|sentry|wixpress/i.test(e));
  const surDomaine = emails.filter((e) => e.toLowerCase().endsWith("@" + hote) || e.toLowerCase().endsWith("." + hote));
  return surDomaine.find((e) => GENERIQUES.test(e)) ?? surDomaine[0] ?? emails.find((e) => GENERIQUES.test(e)) ?? emails[0] ?? null;
}
