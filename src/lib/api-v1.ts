import { compteParCleApi } from "./abonnes";
import { autoriser } from "./limite";
import { calculerScore, evaluer, trier, verdict } from "./rules/engine";
import type { Audit } from "./types";
import type { Compte } from "./comptes";

/**
 * API publique (offres agence) : authentification par clé (« Authorization: Bearer vg_… »), réponses JSON.
 * Documentée sur la page /api-docs.
 */

export async function authentifier(req: Request): Promise<Compte | Response> {
  const compte = await compteParCleApi(req);
  if (!compte) return Response.json({ erreur: "Clé d'API absente, invalide ou révoquée." }, { status: 401 });
  if (!autoriser("api:" + compte.id, 120, 60 * 60_000)) return Response.json({ erreur: "Limite de 120 requêtes par heure atteinte." }, { status: 429 });
  return compte;
}

/** Résultat complet d'un audit, tel que l'API le renvoie. */
export function auditJson(audit: Audit, origine: string) {
  const resultats = trier(evaluer(audit.profil, audit.constatsAuto, audit.constatsIA));
  const score = calculerScore(resultats);
  return {
    id: audit.id,
    url: audit.url,
    date: audit.date,
    rapport: `${origine}/audit/${audit.id}`,
    entreprise: audit.entreprise ? { siren: audit.entreprise.siren, nom: audit.entreprise.nom } : null,
    note: score.note,
    compteurs: { illegal: score.illegaux, flou: score.flous, recommande: score.recommandes, aVerifier: score.aVerifier, conforme: score.conformes },
    resultats: resultats.map((r) => ({
      regle: r.regle.id,
      titre: r.regle.titre,
      domaine: r.regle.domaine,
      verdict: verdict(r),
      statut: r.statut,
      gravite: r.regle.gravite,
      preuve: r.preuve ?? null,
      url: r.url ?? null,
      sanction: r.regle.sanction ?? null,
      sources: r.regle.sources,
    })),
  };
}
