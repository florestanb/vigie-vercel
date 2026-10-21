/**
 * Contrôle de conservation : le texte existant du site a-t-il bien été repris dans le nouveau document ?
 * Le texte d'origine est découpé en passages ; un passage est repris si l'essentiel de ses groupes de trois mots
 * se retrouve dans le nouveau texte (une correction de quelques mots ne le compte pas comme retiré).
 * Fonction pure, utilisée dans le navigateur juste après la rédaction, et dans les tests.
 */

const normaliser = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const trigrammes = (mots: string[]) => mots.slice(0, -2).map((_, i) => `${mots[i]} ${mots[i + 1]} ${mots[i + 2]}`);

/** Passages du texte d'origine : paragraphes, les lignes trop courtes (titres, puces) étant regroupées avec la suite. */
function passages(texte: string): string[] {
  const resultat: string[] = [];
  let courant = "";
  for (const ligne of texte.split(/\n+/).map((l) => l.trim()).filter(Boolean)) {
    courant = courant ? `${courant} ${ligne}` : ligne;
    if (normaliser(courant).length >= 80) {
      resultat.push(courant);
      courant = "";
    }
  }
  if (normaliser(courant).length >= 40) resultat.push(courant);
  return [...new Set(resultat)];
}

export interface Conservation {
  /** Part du texte d'origine reprise, de 0 à 1 (pondérée par la longueur des passages). */
  taux: number;
  /** Passages d'origine absents du nouveau texte (retirés ou profondément réécrits). */
  retires: string[];
  /** Nombre de passages comparés. */
  passages: number;
}

export function comparerAuTexteExistant(existant: string, nouveau: string, seuil = 0.6): Conservation {
  const index = new Set(trigrammes(normaliser(nouveau).split(" ")));
  const liste = passages(existant);
  let total = 0;
  let repris = 0;
  const retires: string[] = [];
  for (const p of liste) {
    const t = trigrammes(normaliser(p).split(" "));
    if (!t.length) continue;
    const presents = t.filter((x) => index.has(x)).length;
    total += t.length;
    if (presents / t.length >= seuil) repris += t.length;
    else retires.push(p.length > 400 ? p.slice(0, 397) + "…" : p);
  }
  return { taux: total ? repris / total : 1, retires, passages: liste.length };
}
