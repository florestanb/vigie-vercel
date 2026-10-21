import type { Conditions, Constat, Gravite, Profil, Regle, ResultatRegle, Verdict } from "../types";
import { CATALOGUE } from "./catalogue";
import { empreinteRegle } from "./empreinte";
import { VALIDATIONS } from "./validations";

/** Une règle s'applique quand toutes ses conditions sont remplies (les listes valent OU, `ou` aussi). */
export function conditionsRemplies(cond: Conditions, p: Profil): boolean {
  const { types, editeurs, secteurs, ou, ...booleens } = cond;
  if (types && !types.some((t) => p.types.includes(t))) return false;
  if (editeurs && !editeurs.includes(p.editeur)) return false;
  if (secteurs && !secteurs.some((s) => p.secteurs.includes(s))) return false;
  for (const [cle, attendu] of Object.entries(booleens)) {
    if (p[cle as keyof typeof booleens] !== attendu) return false;
  }
  if (ou && !ou.some((c) => conditionsRemplies(c, p))) return false;
  return true;
}

export function reglesApplicables(p: Profil, catalogue: Regle[] = CATALOGUE): Regle[] {
  // Un particulier non professionnel n'a que l'obligation d'identification minimale et le RGPD/cookies.
  return catalogue.filter((r) => conditionsRemplies(r.conditions, p));
}

/**
 * Croise le profil et les constats (vérifications automatiques puis analyse IA, qui prime).
 * Fonction pure : l'interface la rejoue quand l'utilisateur corrige le profil.
 */
export function evaluer(p: Profil, constatsAuto: Record<string, Constat>, constatsIA: Record<string, Constat> = {}): ResultatRegle[] {
  return reglesApplicables(p).flatMap((regle): ResultatRegle[] => {
    const auto = regle.check ? constatsAuto[regle.check] : undefined;
    const ia = constatsIA[regle.id];
    if (regle.obsolete) return auto?.statut === "a-retirer" ? [{ regle, ...auto }] : [];
    // L'IA lit le texte : elle précise un constat automatique, sauf quand celui-ci a établi une absence.
    const constat = auto?.statut === "manquant" && regle.verification === "auto" ? auto : (ia ?? auto);
    if (constat) return [{ regle, ...constat }];
    return [
      {
        regle,
        statut: "a-verifier",
        preuve:
          regle.verification === "declaratif"
            ? "Ne se voit pas depuis le site public : à confirmer par vous."
            : "Non vérifié automatiquement : l'analyse du texte est nécessaire.",
      },
    ];
  });
}

/**
 * Classement d'un résultat : un manquement n'est « illégal » que si l'exigence est écrite dans la loi
 * et que Vigie l'a établi avec certitude. Une exigence d'interprétation ou un indice incertain relève
 * de la zone de flou ; une bonne pratique (ou une mention obsolète à retirer) est une recommandation.
 */
export function verdict(r: ResultatRegle): Verdict {
  if (r.statut === "conforme") return "conforme";
  if (r.statut === "a-verifier") return "a-verifier";
  const nature = r.regle.nature ?? "loi";
  if (r.statut === "a-retirer" || nature === "recommandation") return "recommande";
  if (nature === "flou" || r.incertain) return "flou";
  // Écrit dans la loi et constaté avec certitude, mais pas encore validé par un avocat : on ne dit pas « illégal ».
  if (!regleValidee(r.regle.id)) return "flou";
  return "illegal";
}

/**
 * La validation juridique est exigée, sauf en développement et dans les tests qui le demandent
 * (NEXT_PUBLIC_VIGIE_SANS_VALIDATION=1, jamais en production).
 */
const validationExigee = () => process.env.NEXT_PUBLIC_VIGIE_SANS_VALIDATION !== "1" || process.env.NODE_ENV === "production";

/** La règle a été validée par un avocat, dans sa version actuelle. */
export function regleValidee(id: string): boolean {
  if (!validationExigee()) return true;
  const v = VALIDATIONS[id];
  const regle = CATALOGUE.find((x) => x.id === id);
  return !!v && !!regle && v.statut === "validee" && v.empreinte === empreinteRegle(regle);
}

/** Manquement certain à une obligation légale, présenté en zone de flou faute de validation juridique. */
export function enAttenteDeValidation(r: ResultatRegle): boolean {
  return verdict(r) === "flou" && !r.incertain && (r.regle.nature ?? "loi") === "loi" && ["manquant", "partiel"].includes(r.statut);
}

const POIDS: Record<Gravite, number> = { critique: 10, majeure: 5, mineure: 2 };
const VALEUR = { conforme: 1, partiel: 0.4, manquant: 0 } as const;

export interface Score {
  note: number; // 0 à 100
  illegaux: number;
  flous: number;
  recommandes: number;
  aVerifier: number;
  conformes: number;
  critiquesIllegaux: number;
}

/** Les recommandations n'entrent pas dans la note : elle mesure le respect de la loi et de son interprétation. */
export function calculerScore(resultats: ResultatRegle[]): Score {
  let total = 0;
  let obtenu = 0;
  const s: Score = { note: 0, illegaux: 0, flous: 0, recommandes: 0, aVerifier: 0, conformes: 0, critiquesIllegaux: 0 };
  for (const r of resultats) {
    const v = verdict(r);
    if (v === "a-verifier") s.aVerifier++;
    else if (v === "recommande") s.recommandes++;
    else {
      if (r.statut !== "a-retirer" && r.statut !== "a-verifier") {
        total += POIDS[r.regle.gravite];
        obtenu += POIDS[r.regle.gravite] * VALEUR[r.statut];
      }
      if (v === "conforme") s.conformes++;
      if (v === "flou") s.flous++;
      if (v === "illegal") {
        s.illegaux++;
        if (r.regle.gravite === "critique") s.critiquesIllegaux++;
      }
    }
  }
  s.note = total ? Math.round((obtenu / total) * 100) : 0;
  return s;
}

export const ORDRE_VERDICTS: Verdict[] = ["illegal", "flou", "recommande", "a-verifier", "conforme"];
const ORDRE_STATUT = { manquant: 0, partiel: 1, "a-retirer": 2, "a-verifier": 3, conforme: 4 } as const;
const ORDRE_GRAVITE = { critique: 0, majeure: 1, mineure: 2 } as const;

export function trier(resultats: ResultatRegle[]): ResultatRegle[] {
  return [...resultats].sort(
    (a, b) =>
      ORDRE_VERDICTS.indexOf(verdict(a)) - ORDRE_VERDICTS.indexOf(verdict(b)) ||
      ORDRE_GRAVITE[a.regle.gravite] - ORDRE_GRAVITE[b.regle.gravite] ||
      ORDRE_STATUT[a.statut] - ORDRE_STATUT[b.statut],
  );
}
