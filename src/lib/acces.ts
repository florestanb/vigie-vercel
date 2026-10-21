import { estAdmin } from "./admin";
import { accesDomaine, domaineDe, type Acces, type Compte } from "./comptes";
import { CONSTATS_OFFERTS } from "./offres";
import { calculerScore, evaluer, trier, verdict } from "./rules/engine";
import { compteConnecte } from "./session";
import type { Audit, ResultatRegle, Verdict } from "./types";

/** Ce que la personne connectée peut voir d'un audit. L'équipe Vigie (espace privé) voit tout. */
export async function accesAudit(audit: Audit): Promise<Acces & { compte: Compte | null }> {
  const compte = await compteConnecte();
  if (await estAdmin()) return { complet: true, documents: true, compte };
  return { ...accesDomaine(compte, domaineDe(audit.url)), compte };
}

/**
 * Version gratuite d'un rapport : les premiers constats en clair (CONSTATS_OFFERTS), des compteurs, et rien d'autre.
 * C'est tout ce qui est envoyé au navigateur : les autres constats ne quittent pas le serveur,
 * le flou de la page est fait avec du texte factice.
 */
export interface VueVerrouillee {
  id: string;
  url: string;
  titre: string;
  date: string;
  entreprise: string | null;
  note: number;
  compteurs: Record<Verdict, number>;
  reveles: ResultatRegle[];
  masques: number;
  /**
   * Pour les lignes floutées : seulement la catégorie et la sanction encourue de chaque problème masqué,
   * jamais son titre ni sa preuve. On voit ce qu'on risque, pas pourquoi.
   */
  lignesMasquees: { v: Verdict; risque: string | null }[];
  /** Sanction la plus lourde encourue parmi tous les problèmes du site. */
  risqueMax: string | null;
}

export function vueVerrouillee(audit: Audit): VueVerrouillee {
  const resultats = trier(evaluer(audit.profil, audit.constatsAuto, audit.constatsIA));
  const score = calculerScore(resultats);
  // Les constats les plus parlants : les illégaux d'abord (le tri met les critiques en tête), puis les flous.
  const problemes = resultats.filter((r) => ["illegal", "flou", "recommande"].includes(verdict(r)));
  const reveles = problemes.filter((r) => verdict(r) !== "recommande").slice(0, CONSTATS_OFFERTS);
  return {
    id: audit.id,
    url: audit.url,
    titre: audit.crawl.titre || new URL(audit.url).hostname,
    date: audit.date,
    entreprise: audit.entreprise ? audit.entreprise.nom : null,
    note: score.note,
    compteurs: { illegal: score.illegaux, flou: score.flous, recommande: score.recommandes, "a-verifier": score.aVerifier, conforme: score.conformes },
    reveles,
    masques: Math.max(0, problemes.length - reveles.length),
    lignesMasquees: problemes
      .filter((r) => !reveles.includes(r))
      .slice(0, 6)
      .map((r) => ({ v: verdict(r), risque: r.regle.risque?.libelle ?? null })),
    risqueMax: [...problemes].filter((r) => r.regle.risque && r.regle.risque.plafond > 0).sort((a, b) => b.regle.risque!.plafond - a.regle.risque!.plafond)[0]?.regle.risque!.libelle ?? null,
  };
}
