/**
 * Validation juridique du registre, règle par règle, par un avocat. Tant qu'une règle n'y figure pas avec le
 * statut « validee », un manquement à cette règle n'est jamais présenté comme « Illégal » : il apparaît en zone de
 * flou, avec la mention « en attente de validation juridique », et n'est jamais cité dans un mail de prospection.
 *
 * À remplir avec l'avocat, à partir de docs/revue-juridique.md (npm run revue). Une règle modifiée après sa
 * validation doit être revalidée : la validation porte l'empreinte de la version validée (voir empreinteRegle).
 */

export interface Validation {
  statut: "validee" | "a-corriger";
  /** Nom de l'avocat ou du cabinet. */
  par: string;
  /** Date de la validation (AAAA-MM-JJ). */
  le: string;
  /** Empreinte de la règle validée (npm run revue l'affiche) : une règle modifiée depuis n'est plus validée. */
  empreinte: string;
  note?: string;
}

export const VALIDATIONS: Record<string, Validation> = {
  // Exemple : "id.directeur-publication": { statut: "validee", par: "Me X, cabinet Y", le: "2026-11-02", empreinte: "…" },
};
