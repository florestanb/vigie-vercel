import type { RefArticle } from "./revue";

/** Texte officiel d'un article, tel que récupéré par scripts/citations.ts (src/lib/rules/citations.json). */
export interface Citation {
  nom: string;
  num: string;
  texte: string | null;
  url: string;
  /** Version : « texte publié au JOUE » ou date de début de version Légifrance. */
  version: string | null;
  recupere: string;
  erreur?: string;
}

export const cleRef = (r: RefArticle) => `${r.type}:${r.type === "ue" ? r.celex : r.type === "code" ? r.code : r.cid}:${r.num}`;
