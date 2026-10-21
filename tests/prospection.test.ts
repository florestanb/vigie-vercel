import { test, after, before } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { servir } from "./serveur";
import { crawler } from "../src/lib/crawler/crawler";
import { executerChecks } from "../src/lib/rules/checks";
import { CATALOGUE } from "../src/lib/rules/catalogue";
import { verdict } from "../src/lib/rules/engine";
import { profilDepuisCrawl } from "../src/lib/profil";
import { brouillonEml, redigerMail, type Expediteur } from "../src/lib/prospection/mail";
import { constatsCertains } from "../src/lib/prospection/selection";
import type { Audit } from "../src/lib/types";

process.env.VIGIE_AUTORISER_LOCAL = "1";
const CHECKS = [...new Set(CATALOGUE.map((r) => r.check).filter(Boolean) as string[])];
let audit: Audit;
let fermer: () => void;

before(async () => {
  const s = await servir(path.resolve("tests/fixtures/boutique-risquee"));
  fermer = s.fermer;
  const crawl = await crawler(s.url);
  const profil = profilDepuisCrawl(crawl, null);
  audit = {
    id: "test-prospection",
    url: crawl.urlFinale,
    date: "2026-10-13T10:00:00.000Z",
    crawl,
    profilDetecte: profil,
    profil,
    entreprise: null,
    constatsAuto: executerChecks(crawl, null, CHECKS),
    // Un constat de Claude ne doit jamais finir dans un mail de prospection.
    constatsIA: { "rgpd.finalites-bases": { statut: "manquant", preuve: "constat-de-claude" } },
    resumeIA: null,
    iaDisponible: false,
  };
});
after(() => fermer());

const EXP: Expediteur = { nom: "Camille Test", societe: "Vigie SAS", email: "camille@vigie.test", urlPublique: "https://vigie.test" };

test("seuls les manquements certains, établis automatiquement, sont retenus", () => {
  const c = constatsCertains(audit);
  assert.ok(c.length >= 3);
  assert.ok(c.every((r) => verdict(r) === "illegal" && r.regle.verification !== "declaratif"));
  assert.ok(!c.some((r) => r.preuve === "constat-de-claude"));
  assert.ok(c.some((r) => r.regle.id === "cookies.consentement-prealable"));
});

test("le mail est factuel, identifie l'expéditeur et permet de s'opposer", () => {
  const constats = constatsCertains(audit);
  const mail = redigerMail(audit, constats, "contact@boutique.test", EXP);
  assert.match(mail.objet, /obligations? légales? non respectées?/);
  for (const corps of [mail.texte, mail.html]) {
    assert.match(corps, /Camille Test/);
    assert.match(corps, /STOP/);
    assert.match(corps, /\/100/);
    assert.match(corps, /https:\/\/vigie\.test\/audit\/test-prospection/);
  }
  assert.match(mail.html, /Manquement/);
  assert.doesNotMatch(mail.html, /<script/i);
  const eml = brouillonEml(mail, EXP);
  assert.match(eml, /^From: .*<camille@vigie\.test>/m);
  assert.match(eml, /^To: contact@boutique\.test$/m);
  assert.match(eml, /^X-Unsent: 1$/m);
});

test("la version gratuite d'un rapport ne contient que les constats offerts", async () => {
  const { vueVerrouillee } = await import("../src/lib/acces");
  const vue = vueVerrouillee(audit);
  const json = JSON.stringify(vue);
  const { CONSTATS_OFFERTS } = await import("../src/lib/offres");
  assert.equal(vue.reveles.length, CONSTATS_OFFERTS);
  assert.ok(vue.masques >= 2);
  // Aucun autre constat, aucune donnée du parcours.
  const montres = new Set(vue.reveles.map((r) => r.regle.id));
  const autres = constatsCertains(audit).filter((r) => !montres.has(r.regle.id));
  assert.ok(autres.length > 0);
  for (const r of autres) assert.ok(!json.includes(r.regle.titre), `fuite : ${r.regle.titre}`);
  assert.ok(!("crawl" in vue) && !json.includes("pagesLegales"));
});
