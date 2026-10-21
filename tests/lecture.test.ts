import { test } from "node:test";
import assert from "node:assert/strict";
import { MOTIF_REFUS } from "../src/lib/crawler/refus";
import { MOTIFS_PAGES_LEGALES, RE } from "../src/lib/crawler/patterns";
import { comparerAuTexteExistant } from "../src/lib/documents/conservation";

test("les boutons de refus usuels sont reconnus, y compris avec flèche ou icône", () => {
  for (const t of ["Tout refuser", "Continuer sans accepter →", "✕ Continuer sans accepter", "Refuser tous les cookies", "Non, merci", "Nécessaires uniquement", "Refuser les cookies non essentiels", "Reject all", "Refuser et fermer"])
    assert.ok(MOTIF_REFUS.test(t), t);
  for (const t of ["Accepter", "Personnaliser", "Paramétrer les cookies", "En savoir plus"]) assert.ok(!MOTIF_REFUS.test(t), t);
});

test("le directeur de la publication est reconnu sous ses formes usuelles, pas un autre directeur", () => {
  for (const t of ["Directeur de la publication : Jeanne Martin", "Directrice de publication : J. Martin", "Responsable de la publication : Paul Durand", "Publication : Paul Durand", "Codirecteur de la publication"])
    assert.ok(RE.directeur.test(t), t);
  for (const t of ["Directeur général : Paul Durand", "Notre directrice commerciale vous répond", "Date de publication : 3 mars"]) assert.ok(!RE.directeur.test(t), t);
});

test("les liens légaux en anglais ou abrégés sont classés", () => {
  const types = (texte: string, url = "https://x.fr/page") =>
    MOTIFS_PAGES_LEGALES.filter((m) => m.texte.test(texte) || m.url.test(new URL(url).pathname)).map((m) => m.type);
  assert.ok(types("Legals mentions").includes("mentions-legales"));
  assert.ok(types("Legal notice").includes("mentions-legales"));
  assert.ok(types("Terms and conditions").includes("cgv"));
  assert.ok(types("Infos", "https://x.fr/pages/legal-informations").includes("mentions-legales"));
  assert.ok(types("CG", "https://x.fr/pages/generals-terms-conditions").includes("cgv"));
});

test("le contrôle de conservation repère les passages retirés, pas les corrections de détail", () => {
  const existant = [
    "Article 1 - Objet. Les présentes conditions régissent toutes les ventes conclues sur le site de la boutique.",
    "Article 2 - Réserve de propriété. Les produits restent notre propriété jusqu'au paiement complet du prix par le client.",
    "Article 3 - Litiges. Le consommateur peut recourir à la plateforme européenne RLL en cas de litige avec la boutique.",
  ].join("\n\n");
  const nouveau = [
    "## Article 1 - Objet",
    "Les présentes conditions générales régissent toutes les ventes conclues sur le site de la boutique.",
    "## Article 2 - Réserve de propriété",
    "Les produits restent notre propriété jusqu'au paiement complet du prix par le client.",
    "## Article 3 - Médiation",
    "Le consommateur peut recourir gratuitement au médiateur CM2C.",
  ].join("\n\n");
  const r = comparerAuTexteExistant(existant, nouveau);
  assert.equal(r.passages, 3);
  assert.equal(r.retires.length, 1);
  assert.match(r.retires[0], /plateforme européenne RLL/);
  assert.ok(r.taux > 0.6 && r.taux < 0.8);
});
