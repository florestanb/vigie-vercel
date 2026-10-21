import { test } from "node:test";
import assert from "node:assert/strict";
import { CATALOGUE } from "../src/lib/rules/catalogue";
import { empreinteRegle } from "../src/lib/rules/empreinte";
import { enAttenteDeValidation, regleValidee, verdict } from "../src/lib/rules/engine";
import { REVUE } from "../src/lib/rules/revue";
import { VALIDATIONS } from "../src/lib/rules/validations";
import type { ResultatRegle } from "../src/lib/types";

/** Exécute f avec la validation juridique exigée, comme en production. */
function avecValidation(f: () => void) {
  const avant = process.env.NEXT_PUBLIC_VIGIE_SANS_VALIDATION;
  delete process.env.NEXT_PUBLIC_VIGIE_SANS_VALIDATION;
  try {
    f();
  } finally {
    if (avant !== undefined) process.env.NEXT_PUBLIC_VIGIE_SANS_VALIDATION = avant;
  }
}

const regle = CATALOGUE.find((r) => r.id === "id.directeur-publication")!;
const manquement: ResultatRegle = { regle, statut: "manquant", preuve: "Aucun directeur de la publication indiqué." };

test("sans validation par un avocat, un manquement n'est jamais présenté comme illégal", () => {
  avecValidation(() => {
    assert.equal(regleValidee(regle.id), false);
    assert.equal(verdict(manquement), "flou");
    assert.equal(enAttenteDeValidation(manquement), true);
  });
});

test("une règle validée produit « illégal » ; modifiée depuis, elle doit être revalidée", () => {
  avecValidation(() => {
    VALIDATIONS[regle.id] = { statut: "validee", par: "Me Test", le: "2026-10-14", empreinte: empreinteRegle(regle) };
    try {
      assert.equal(verdict(manquement), "illegal");
      const modifiee = { ...regle, exigence: regle.exigence + " (modifiée)" };
      VALIDATIONS[regle.id] = { ...VALIDATIONS[regle.id], empreinte: empreinteRegle(modifiee) };
      assert.equal(verdict(manquement), "flou", "l'empreinte ne correspond plus à la version actuelle");
      VALIDATIONS[regle.id] = { statut: "a-corriger", par: "Me Test", le: "2026-10-14", empreinte: empreinteRegle(regle) };
      assert.equal(verdict(manquement), "flou");
    } finally {
      delete VALIDATIONS[regle.id];
    }
  });
});

test("chaque règle du registre a sa revue juridique, avec au moins un article ou une explication", () => {
  for (const r of CATALOGUE) {
    const rev = REVUE[r.id];
    assert.ok(rev, `revue manquante : ${r.id}`);
    assert.ok(rev.articles.length || rev.doutes.length, `ni article ni explication : ${r.id}`);
  }
  for (const id of Object.keys(REVUE)) assert.ok(CATALOGUE.some((r) => r.id === id), `revue sans règle : ${id}`);
});
