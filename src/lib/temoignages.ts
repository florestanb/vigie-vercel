/**
 * Témoignages affichés sur l'accueil. Uniquement de vrais clients, avec leur accord écrit (à conserver) :
 * inventer ou embellir un avis est une pratique commerciale trompeuse (C. conso art. L121-4, 27° et 28°).
 * Tant que la liste est vide, la section n'apparaît pas.
 */
export interface Temoignage {
  texte: string;
  auteur: string;
  fonction: string;
  site?: string;
  /** Date de l'accord écrit du client (AAAA-MM-JJ). */
  accord: string;
}

export const TEMOIGNAGES: Temoignage[] = [];
