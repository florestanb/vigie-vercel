import { test, before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Données isolées dans un dossier temporaire (les dossiers sont calculés au chargement des modules).
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vigie-abonnes-"));
process.env.VIGIE_DONNEES = path.join(tmp, "audits");

let comptes: typeof import("../src/lib/comptes");
let abonnes: typeof import("../src/lib/abonnes");
let heberges: typeof import("../src/lib/documents-heberges");
let veille: typeof import("../src/lib/veille");
let audit: typeof import("../src/lib/audit");

const fin = () => new Date(Date.now() + 30 * 86_400_000).toISOString();

async function abonne(email: string, offre: "site" | "agence") {
  const c = await comptes.trouverOuCreerCompte(email);
  await comptes.majAbonnement(c.id, { id: `sub_${email}`, offre, statut: "active", debutPeriode: new Date().toISOString(), finPeriode: fin(), resilieFinPeriode: false });
  return c;
}

before(async () => {
  comptes = await import("../src/lib/comptes");
  abonnes = await import("../src/lib/abonnes");
  heberges = await import("../src/lib/documents-heberges");
  veille = await import("../src/lib/veille");
  audit = await import("../src/lib/audit");
});

test("seul un texte approuvé par le client peut être hébergé ; l'adresse reste fixe d'une version à l'autre", async () => {
  const c = await abonne("site@exemple.fr", "site");
  await assert.rejects(heberges.publierHeberge(c.id, "client.fr", "cgv", "auditAAA1", "# CGV\n\nTexte jamais approuvé."), /approuvée/);

  await audit.enregistrerApprobation("auditAAA1", "cgv", "# CGV\n\nVersion 1.");
  const v1 = await heberges.publierHeberge(c.id, "client.fr", "cgv", "auditAAA1", "# CGV\n\nVersion 1.");
  await audit.enregistrerApprobation("auditAAA1", "cgv", "# CGV\n\nVersion 2.");
  const v2 = await heberges.publierHeberge(c.id, "client.fr", "cgv", "auditAAA1", "# CGV\n\nVersion 2.");
  assert.equal(v2.id, v1.id, "le code d'intégration du client ne doit pas changer");
  assert.equal(v2.version.texte, "# CGV\n\nVersion 2.");
  assert.equal(v2.historique.length, 1);
  assert.equal("texte" in v2.historique[0], false, "l'historique ne garde que dates et empreintes");

  // Le registre change sur une règle des CGV : le document est signalé, la version en ligne ne bouge pas.
  const marques = await heberges.signalerMiseAJour({ cgv: ["vente.bouton-retractation"] });
  assert.deepEqual(marques.map((d) => d.id), [v1.id]);
  const apres = (await heberges.chargerHeberge(v1.id))!;
  assert.deepEqual(apres.aMettreAJour?.regles, ["vente.bouton-retractation"]);
  assert.equal(apres.version.texte, "# CGV\n\nVersion 2.");
});

test("l'hébergement et la marque blanche dépendent de la formule", async () => {
  const site = await abonne("petit@exemple.fr", "site");
  await comptes.debloquerDomaine(site.id, "petit.fr", "abonnement");
  assert.equal(abonnes.peutHeberger((await comptes.chargerCompte(site.id))!, "petit.fr"), true);
  assert.equal(abonnes.peutHeberger((await comptes.chargerCompte(site.id))!, "autre.fr"), false);
  await assert.rejects(abonnes.enregistrerMarque(site.id, { nom: "Moi" }), /Agence/);

  const agence = await abonne("agence@exemple.fr", "agence");
  await assert.rejects(abonnes.enregistrerMarque(agence.id, { nom: "Agence", logo: "javascript:alert(1)" }), /Logo invalide/);
  await abonnes.enregistrerMarque(agence.id, { nom: "Agence Exemple", couleur: "#123456", logo: "data:image/png;base64,iVBORw0KGgo=" });
  assert.equal(abonnes.marqueDe((await comptes.chargerCompte(agence.id))!)?.nom, "Agence Exemple");
});

test("une clé d'API authentifie son compte, n'est jamais stockée en clair, et se révoque", async () => {
  const agence = await abonne("api@exemple.fr", "agence");
  const cle = await abonnes.creerCleApi(agence.id);
  assert.match(cle, /^vg_[\w-]{30,}$/);
  const stocke = fs.readFileSync(path.join(comptes.DOSSIER_COMPTES, `${agence.id}.json`), "utf8");
  assert.ok(!stocke.includes(cle));

  const req = (k: string) => new Request("http://x/api/v1/sites", { headers: { authorization: `Bearer ${k}` } });
  assert.equal((await abonnes.compteParCleApi(req(cle)))?.id, agence.id);
  assert.equal(await abonnes.compteParCleApi(req(cle.slice(0, -2) + "xx")), null);
  await abonnes.revoquerCleApi(agence.id);
  assert.equal(await abonnes.compteParCleApi(req(cle)), null);

  const site = await abonne("sansapi@exemple.fr", "site");
  await assert.rejects(abonnes.creerCleApi(site.id), /Agence/);
});

test("l'import CSV lit les adresses de sites, et l'export neutralise les formules", () => {
  assert.deepEqual(abonnes.sitesDepuisCsv("site;client\nhttps://a.fr;Client A\n\"b.com\";B\nnimporte quoi\nc.co.uk/page"), ["https://a.fr", "b.com", "c.co.uk/page"]);
  assert.equal(abonnes.celluleCsv("=HYPERLINK(\"x\")"), "\"'=HYPERLINK(\"\"x\"\")\"");
  assert.equal(abonnes.celluleCsv(-2), "-2");
});

test("la veille détecte règles nouvelles, modifiées et entrées en application", async () => {
  const { CATALOGUE } = await import("../src/lib/rules/catalogue");
  const etat = { date: "2026-06-01T00:00:00Z", empreintes: Object.fromEntries(CATALOGUE.map((r) => [r.id, veille.empreinteRegle(r)])) };
  delete etat.empreintes["cookies.refus-respecte"];
  etat.empreintes["id.hebergeur"] = "ancienne";
  const changements = veille.changementsDepuis(etat, CATALOGUE, new Date("2026-10-13T12:00:00Z"));
  const par = Object.fromEntries(changements.map((c) => [c.regle.id, c.nature]));
  assert.equal(par["cookies.refus-respecte"], "nouvelle");
  assert.equal(par["id.hebergeur"], "modifiee");
  assert.equal(par["vente.bouton-retractation"], "en-application"); // 19 juin 2026, entre les deux passages
  assert.equal(par["a11y.conformite"], undefined); // 28 juin 2025 : déjà connue au précédent passage
  assert.deepEqual(veille.documentsTouches(CATALOGUE.find((r) => r.id === "vente.bouton-retractation")!), ["cgv"]);
});

test("le premier passage de veille enregistre l'état sans alerter personne", async () => {
  assert.deepEqual(await veille.passeDeVeille(), { changements: 0, alertes: 0 });
  assert.ok(fs.existsSync(path.join(tmp, "veille", "registre.json")));
  assert.deepEqual(await veille.passeDeVeille(), { changements: 0, alertes: 0 });
});

test("le dossier de conformité retrace audits, empreintes et approbations ; la marque blanche efface Vigie", async () => {
  const exemple = JSON.parse(fs.readFileSync(path.resolve("src/lib/demo/audit-exemple.json"), "utf8"));
  const a = { ...exemple, id: "dossierTest1", date: new Date().toISOString() };
  await audit.enregistrer(a);
  await audit.enregistrerApprobation(a.id, "mentions-legales", "# Mentions légales");
  const domaine = new URL(a.url).hostname.replace(/^www\./, "");
  const { dossierHtml } = await import("../src/lib/dossier");
  const html = await dossierHtml(domaine, []);
  assert.match(html, /Historique des audits/);
  assert.match(html, /[a-f0-9]{64}/, "empreinte SHA-256 du fichier d'audit");
  assert.match(html, /Mentions légales/);

  const marque = { nom: "Agence Exemple", contact: "agence.fr" };
  const avecMarque = await dossierHtml(domaine, [], marque);
  assert.ok(avecMarque.includes("Agence Exemple") && !avecMarque.includes("Vigie"));
  const { rapportHtml } = await import("../src/lib/pdf");
  const rapport = rapportHtml(a, { marque });
  assert.ok(rapport.includes("Rapport établi par Agence Exemple"));
  assert.ok(!/Vigie/.test(rapport), "aucune mention de Vigie en marque blanche");
});
