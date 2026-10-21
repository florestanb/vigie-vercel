import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Même suite pour les deux modes : fichiers (par défaut) ou Postgres (DATABASE_URL=… npm test).
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vigie-stockage-"));
process.env.VIGIE_DONNEES = path.join(tmp, "audits");
const prefixe = `essais-${process.pid}-${Date.now()}`;

let s: typeof import("../src/lib/stockage");
let limite: typeof import("../src/lib/limite");

before(async () => {
  s = await import("../src/lib/stockage");
  limite = await import("../src/lib/limite");
});

after(async () => {
  await s.supprimerDossier(prefixe);
  await s.fermerStockage();
});

test("lecture, écriture, ajout de lignes et suppression", async () => {
  const cle = `${prefixe}/a/fichier.json`;
  assert.equal(await s.lire(cle), null);
  assert.deepEqual(await s.lireJson(cle, { vide: true }), { vide: true });
  await s.ecrire(cle, JSON.stringify({ n: 1 }));
  assert.deepEqual(await s.lireJson(cle, null), { n: 1 });
  await s.ecrire(cle, Buffer.from([0, 255, 1]));
  assert.deepEqual([...(await s.lire(cle))!], [0, 255, 1]);
  await s.ajouterLigne(`${prefixe}/journal.jsonl`, "un");
  await s.ajouterLigne(`${prefixe}/journal.jsonl`, "deux");
  assert.equal(await s.lireTexte(`${prefixe}/journal.jsonl`), "un\ndeux\n");
  assert.equal(await s.taille(`${prefixe}/journal.jsonl`), 8);
  await s.supprimer(cle);
  assert.equal(await s.lire(cle), null);
});

test("les clés qui sortiraient du stockage sont refusées", async () => {
  await assert.rejects(s.lire("../secret"), /invalide/);
  await assert.rejects(s.ecrire("/etc/passwd", "x"), /invalide/);
  await assert.rejects(s.lire(`${prefixe}/../../x`), /invalide/);
});

test("lister par préfixe, sans confondre % et _ avec des jokers", async () => {
  await s.ecrire(`${prefixe}/liste/a_1.json`, "1");
  await s.ecrire(`${prefixe}/liste/ab1.json`, "2");
  await s.ecrire(`${prefixe}/liste/sous/c.json`, "3");
  assert.deepEqual((await s.lister(`${prefixe}/liste/`)).map((e) => e.cle.slice(prefixe.length)), ["/liste/a_1.json", "/liste/ab1.json", "/liste/sous/c.json"]);
  assert.deepEqual((await s.lister(`${prefixe}/liste/a_`)).map((e) => e.cle.slice(prefixe.length)), ["/liste/a_1.json"]);
  assert.ok((await s.lister(`${prefixe}/liste/`)).every((e) => e.modifie instanceof Date && !isNaN(e.modifie.getTime())));
  await s.supprimerDossier(`${prefixe}/liste`);
  assert.deepEqual(await s.lister(`${prefixe}/liste/`), []);
});

test("créer si absent et retirer : un seul gagnant, même en parallèle", async () => {
  const cle = `${prefixe}/unique.json`;
  const creations = await Promise.all(Array.from({ length: 8 }, (_, i) => s.creerSiAbsent(cle, String(i))));
  assert.equal(creations.filter(Boolean).length, 1);
  const retraits = await Promise.all(Array.from({ length: 8 }, () => s.retirer(cle)));
  assert.equal(retraits.filter(Boolean).length, 1);
  assert.equal(await s.lire(cle), null);
});

test("le verrou sérialise les lire-modifier-écrire concurrents", async () => {
  const cle = `${prefixe}/compteur.json`;
  await s.ecrire(cle, "0");
  await Promise.all(
    Array.from({ length: 20 }, () =>
      s.avecVerrou(`essai:${prefixe}`, async () => {
        const n = await s.lireJson(cle, 0);
        await new Promise((r) => setTimeout(r, 2));
        await s.ecrire(cle, String(n + 1));
      }),
    ),
  );
  assert.equal(await s.lireJson(cle, 0), 20);
});

test("la limitation de débit refuse au-delà du maximum", async () => {
  const cle = `essai:${prefixe}`;
  const reponses = await Promise.all(Array.from({ length: 5 }, () => limite.autoriser(cle, 3, 60_000)));
  assert.equal(reponses.filter(Boolean).length, 3);
  assert.equal(await limite.autoriser(cle, 3, 60_000), false);
});
