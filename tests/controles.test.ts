import { test, after, before } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { servir } from "./serveur";
import { crawler, type ResultatCrawl } from "../src/lib/crawler/crawler";
import { CHECKS } from "../src/lib/rules/checks";

process.env.VIGIE_AUTORISER_LOCAL = "1";
let crawl: ResultatCrawl;
let soignee: ResultatCrawl;
const fermer: (() => void)[] = [];

before(async () => {
  for (const [nom, affecter] of [
    ["boutique-tunnel", (c: ResultatCrawl) => (crawl = c)],
    ["boutique-soignee", (c: ResultatCrawl) => (soignee = c)],
  ] as const) {
    const s = await servir(path.resolve("tests/fixtures", nom));
    fermer.push(s.fermer);
    affecter(await crawler(s.url));
  }
});
after(() => fermer.forEach((f) => f()));

test("un refus non respecté est constaté avec certitude, preuve à l'appui", () => {
  assert.equal(crawl.apresRefus?.clique, true);
  assert.equal(crawl.apresRefus?.bouton, "Tout refuser");
  const r = CHECKS["traceurs-apres-refus"](crawl, null)!;
  assert.equal(r.statut, "manquant");
  assert.ok(!r.incertain);
  assert.match(r.preuve!, /_ga \(Google Analytics\)/);
  // Deux captures : le bandeau à l'arrivée, la page après le refus.
  assert.deepEqual(crawl.captures?.map((c) => c.nom).sort(), ["apres-refus", "bandeau", "commande"]);
  assert.ok(crawl.capturesBrutes["apres-refus"].length > 1000);
});

test("un refus respecté est conforme", () => {
  assert.equal(soignee.apresRefus?.clique, true);
  assert.equal(CHECKS["traceurs-apres-refus"](soignee, null)?.statut, "conforme");
});

test("le tunnel de commande est parcouru jusqu'à la commande, sans rien valider", () => {
  const t = crawl.tunnel!;
  assert.equal(t.panierRempli, true, t.erreur ?? "");
  assert.equal(t.commandeAtteinte, true, t.erreur ?? "");
  assert.deepEqual(t.boutonsFinals, ["Valider la commande"]);
  assert.equal(t.fraisLivraison, true);
  assert.equal(t.cgvSurCommande, true);
  assert.match(t.prixBarre!.texte, /9,90/);
  const bouton = CHECKS["bouton-commande"](crawl, null)!;
  assert.equal(bouton.statut, "partiel");
  assert.ok(bouton.incertain, "formule ambiguë : zone de flou, pas illégalité certaine");
  assert.equal(CHECKS["prix-reference"](crawl, null)?.statut, "a-verifier");
});

test("les erreurs d'accessibilité certaines sont relevées", () => {
  const a = crawl.accessibilite!;
  assert.equal(a.erreur, undefined);
  const image = a.violations.find((v) => v.id === "image-alt");
  assert.ok(image, "image sans alternative non détectée");
  assert.deepEqual(image.criteres, ["1.1.1"]);
  const r = CHECKS["accessibilite-auto"](crawl, null)!;
  assert.equal(r.statut, "partiel");
  assert.ok(!r.incertain);
});

test("une CGV publiée en PDF est lue, texte compris", () => {
  const cgv = crawl.pagesLegales.find((p) => p.type === "cgv");
  assert.ok(cgv, "CGV en PDF non trouvée");
  assert.equal(cgv.format, "pdf");
  assert.equal(cgv.nonLu, undefined);
  assert.match(cgv.texte, /quatorze jours/);
  assert.match(cgv.texte, /Réserve de propriété/);
});
