import { test, after, before } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { servir } from "./serveur";
import { crawler } from "../src/lib/crawler/crawler";
import { executerChecks } from "../src/lib/rules/checks";
import { CATALOGUE } from "../src/lib/rules/catalogue";
import { calculerScore, evaluer } from "../src/lib/rules/engine";
import { profilDepuisCrawl } from "../src/lib/profil";
import type { DonneesCrawl } from "../src/lib/types";

process.env.VIGIE_AUTORISER_LOCAL = "1";
const CHECKS = [...new Set(CATALOGUE.map((r) => r.check).filter(Boolean) as string[])];
const sites: Record<string, { crawl: DonneesCrawl; fermer: () => void }> = {};

before(async () => {
  for (const nom of ["boutique-risquee", "boutique-soignee"]) {
    const { url, fermer } = await servir(path.resolve("tests/fixtures", nom));
    sites[nom] = { crawl: await crawler(url), fermer };
  }
});
after(() => Object.values(sites).forEach((s) => s.fermer()));

// Réponse du répertoire Sirene simulée : les tests n'appellent pas le réseau.
const ENTREPRISE = { siren: "552100554", nom: "ATELIER TISSAGE", formeJuridique: "SAS", trancheEffectif: "02", categorie: "PME" };

const statut = (nom: string, _id: string) => {
  const c = sites[nom].crawl;
  const e = c.identite.siren.length ? ENTREPRISE : null;
  const r = evaluer(profilDepuisCrawl(c, e), executerChecks(c, e, CHECKS));
  return { resultats: r, de: (rid: string) => r.find((x) => x.regle.id === rid)?.statut };
};

test("la boutique à risque est vue comme une boutique en ligne avec traceurs", () => {
  const p = profilDepuisCrawl(sites["boutique-risquee"].crawl, null);
  assert.ok(p.types.includes("ecommerce"));
  assert.equal(p.venteEnLigne, true);
  assert.equal(p.traceurs, true);
  assert.equal(p.reductionsPrix, true);
  assert.equal(p.allegationsEnvironnementales, true);
});

test("la boutique à risque cumule les manquements attendus", () => {
  const { de, resultats } = statut("boutique-risquee", "");
  assert.equal(de("cookies.consentement-prealable"), "manquant");
  assert.equal(de("cookies.refus-simple"), "manquant");
  assert.equal(de("rgpd.politique"), "manquant");
  assert.equal(de("id.immatriculation"), "manquant");
  assert.equal(de("id.hebergeur"), "manquant");
  assert.equal(de("vente.mediateur"), "manquant");
  assert.equal(de("vente.bouton-retractation"), "manquant");
  assert.equal(de("vente.lien-rll-obsolete"), "a-retirer");
  assert.equal(de("rgpd.formulaires"), "manquant");
  assert.equal(de("cookies.tiers-integres"), "partiel");
  assert.ok(calculerScore(resultats).note < 40, "note trop haute pour un site non conforme");
});

test("la boutique soignée passe les vérifications automatiques", () => {
  const { de, resultats } = statut("boutique-soignee", "");
  for (const id of ["id.page-mentions", "id.immatriculation", "id.hebergeur", "id.directeur-publication", "rgpd.politique", "cookies.consentement-prealable", "cookies.refus-simple", "vente.cgv", "vente.mediateur", "vente.bouton-retractation", "rgpd.formulaires"]) {
    assert.equal(de(id), "conforme", id);
  }
  assert.equal(de("vente.lien-rll-obsolete"), undefined);
  // Le serveur de test est en HTTP : seule l'absence de HTTPS doit rester en critique.
  assert.deepEqual(resultats.filter((r) => r.statut === "manquant").map((r) => r.regle.id), ["secu.https"]);
  const score = calculerScore(resultats);
  assert.ok(score.note >= 80, `note ${score.note}`);
});

test("les constats sont classés en illégal, zone de flou ou recommandation", async () => {
  const { verdict } = await import("../src/lib/rules/engine");
  const { resultats } = statut("boutique-risquee", "");
  const v = (id: string) => verdict(resultats.find((r) => r.regle.id === id)!);
  assert.equal(v("cookies.consentement-prealable"), "illegal"); // obligation légale, constat certain
  assert.equal(v("id.immatriculation"), "illegal");
  assert.equal(v("cookies.refus-simple"), "flou"); // exigence déduite de la loi par la CNIL
  assert.equal(v("cookies.tiers-integres"), "flou"); // question non tranchée en France
  assert.equal(v("vente.bouton-retractation"), "flou"); // peut se trouver dans l'espace client
  assert.equal(v("vente.lien-rll-obsolete"), "recommande");
});

test("le contrôle de clé SIREN rejette les numéros invalides", async () => {
  const { luhn } = await import("../src/lib/rules/checks");
  assert.equal(luhn("552100554"), true);
  assert.equal(luhn("552100555"), false);
});

test("le rendu Markdown neutralise le HTML et les liens dangereux", async () => {
  const { markdownVersHtml } = await import("../src/lib/markdown");
  const html = markdownVersHtml('# Titre\n\n<script>alert(1)</script>\n\n[x](javascript:alert(1)) [À COMPLÉTER : adresse]');
  assert.ok(!html.includes("<script>"));
  assert.ok(!html.includes("javascript:"));
  assert.ok(html.includes("<mark>[À COMPLÉTER : adresse]</mark>"));
});
