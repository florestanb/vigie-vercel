import { test, before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Données isolées dans un dossier temporaire (DOSSIER_COMPTES est calculé au chargement du module).
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vigie-comptes-"));
process.env.VIGIE_DONNEES = path.join(tmp, "audits");

let m: typeof import("../src/lib/comptes");
before(async () => {
  m = await import("../src/lib/comptes");
});

test("un audit ponctuel débloque un site pendant 30 jours, documents compris", async () => {
  const c = await m.trouverOuCreerCompte("Client@Exemple.fr");
  assert.equal(c.email, "client@exemple.fr");
  await m.ajouterDroit(c.id, "cs_test_1", "ponctuel");
  await m.ajouterDroit(c.id, "cs_test_1", "ponctuel"); // webhook rejoué : pas de doublon
  let compte = (await m.chargerCompte(c.id))!;
  assert.equal(compte.droits.length, 1);

  assert.equal(m.accesDomaine(compte, "a.fr").complet, false);
  assert.equal(m.accesDomaine(compte, "a.fr").deblocable?.restants, 1);
  await m.debloquerDomaine(c.id, "a.fr");
  await assert.rejects(m.debloquerDomaine(c.id, "b.fr"));
  compte = (await m.chargerCompte(c.id))!;
  assert.deepEqual(m.accesDomaine(compte, "a.fr"), { complet: true, documents: true });

  assert.equal(m.accesDomaine(compte, "a.fr", Date.now() + 29 * 86_400_000).complet, true);
  assert.equal(m.accesDomaine(compte, "a.fr", Date.now() + 31 * 86_400_000).complet, false);
});

test("un achat de l'ancienne grille reste honoré comme un audit ponctuel", async () => {
  const c = await m.trouverOuCreerCompte("ancien@exemple.fr");
  await m.modifierCompte(c.id, (x) => {
    x.droits.push({ id: "cs_ancien", offre: "documents", achete: new Date().toISOString(), expire: new Date(Date.now() + 86_400_000).toISOString(), domaines: ["ancien.fr"] });
  });
  assert.deepEqual(m.accesDomaine((await m.chargerCompte(c.id))!, "ancien.fr"), { complet: true, documents: true });
});

test("chaque formule d'abonnement a son quota de sites, remis à zéro à chaque période", async () => {
  const c = await m.trouverOuCreerCompte("agence@exemple.fr");
  const debut = new Date().toISOString();
  const fin = new Date(Date.now() + 30 * 86_400_000).toISOString();
  await m.majAbonnement(c.id, { id: "sub_0", offre: "site", statut: "active", debutPeriode: debut, finPeriode: fin, resilieFinPeriode: false });
  await m.debloquerDomaine(c.id, "un.fr", "abonnement");
  await assert.rejects(m.debloquerDomaine(c.id, "deux.fr", "abonnement"), /Quota/);
  assert.equal(m.accesDomaine((await m.chargerCompte(c.id))!, "un.fr").documents, true);

  await m.majAbonnement(c.id, { id: "sub_1", offre: "agence", statut: "active", debutPeriode: debut, finPeriode: fin, resilieFinPeriode: false });
  assert.equal(m.accesDomaine((await m.chargerCompte(c.id))!, "x.fr").deblocable?.restants, 25);
  await m.debloquerDomaine(c.id, "abo.fr", "abonnement");
  let compte = (await m.chargerCompte(c.id))!;
  assert.deepEqual(compte.abonnement?.domainesPeriode, ["abo.fr"]);
  // Nouvelle période : le quota repart de zéro.
  await m.majAbonnement(c.id, { id: "sub_1", statut: "active", debutPeriode: fin, finPeriode: fin, resilieFinPeriode: false });
  compte = (await m.chargerCompte(c.id))!;
  assert.deepEqual(compte.abonnement?.domainesPeriode, []);
  // Abonnement résilié et échu : plus d'accès.
  await m.majAbonnement(c.id, { id: "sub_1", statut: "canceled", debutPeriode: fin, finPeriode: fin, resilieFinPeriode: true });
  assert.equal(m.abonnementActif((await m.chargerCompte(c.id))!), null);
});

test("un achat n'est attribué qu'une fois, et un remboursement retire l'accès", async () => {
  const c = await m.trouverOuCreerCompte("rembourse@exemple.fr");
  const premier = await m.ajouterDroit(c.id, "cs_r", "ponctuel", new Date(), "pi_r");
  const second = await m.ajouterDroit(c.id, "cs_r", "ponctuel", new Date(), "pi_r"); // webhook + retour sur le site
  assert.ok(premier);
  assert.equal(second, null); // => un seul e-mail de confirmation
  await m.debloquerDomaine(c.id, "rembourse.fr");
  assert.equal(m.accesDomaine((await m.chargerCompte(c.id))!, "rembourse.fr").complet, true);
  assert.equal(await m.revoquerPaiement(c.id, "pi_r"), true);
  assert.equal(m.accesDomaine((await m.chargerCompte(c.id))!, "rembourse.fr").complet, false);
});

test("liens de connexion : usage unique ou réutilisable, destination toujours interne", async () => {
  const s = await import("../src/lib/session");
  const unique = await s.creerJetonConnexion("lien@exemple.fr", { suite: "/audit/abc123" });
  assert.deepEqual(await s.consommerJetonConnexion(unique), { email: "lien@exemple.fr", suite: "/audit/abc123" });
  assert.equal(await s.consommerJetonConnexion(unique), null);

  const reutilisable = await s.creerJetonConnexion("lien@exemple.fr", { reutilisable: true, dureeMs: 60_000 });
  assert.ok(await s.consommerJetonConnexion(reutilisable));
  assert.ok(await s.consommerJetonConnexion(reutilisable));

  for (const suite of ["//pirate.example", "https://pirate.example", "/\\pirate.example", "javascript:alert(1)"]) {
    const j = await s.creerJetonConnexion("lien@exemple.fr", { suite });
    assert.equal((await s.consommerJetonConnexion(j))?.suite, "/compte", suite);
  }

  const expire = await s.creerJetonConnexion("lien@exemple.fr", { dureeMs: -1 });
  assert.equal(await s.consommerJetonConnexion(expire), null);
});
