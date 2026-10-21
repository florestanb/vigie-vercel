import type { Regle } from "../types";

/**
 * Empreinte du contenu juridique d'une règle (exigence, conditions, sources, nature…). Elle change dès que la
 * règle change : la veille s'en sert pour alerter les abonnés, la validation pour exiger une nouvelle relecture.
 * Calcul sans dépendance (FNV-1a 64 bits), utilisable côté serveur comme dans le navigateur.
 */
export function empreinteRegle(r: Regle): string {
  const { id, domaine, titre, exigence, conditions, sources, nature, gravite, applicableDepuis, obsolete, document } = r;
  const texte = JSON.stringify({ id, domaine, titre, exigence, conditions, sources, nature, gravite, applicableDepuis, obsolete, document });
  let h = 0xcbf29ce484222325n;
  for (let i = 0; i < texte.length; i++) {
    h ^= BigInt(texte.charCodeAt(i));
    h = (h * 0x100000001b3n) & 0xffffffffffffffffn;
  }
  return h.toString(16).padStart(16, "0");
}
