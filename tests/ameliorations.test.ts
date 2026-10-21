import { test, before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import type { Audit } from "../src/lib/types";

// Données isolées : les modules calculent leurs dossiers au chargement.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vigie-ameliorations-"));
process.env.VIGIE_DONNEES = path.join(tmp, "audits");

const exemple = JSON.parse(fs.readFileSync("src/lib/demo/audit-exemple.json", "utf8")) as Audit;
const variante = (id: string, date: string, retirer: string[] = []): Audit => ({
  ...exemple,
  id,
  date,
  constatsAuto: Object.fromEntries(
    Object.entries(exemple.constatsAuto).map(([k, c]) => [k, retirer.includes(k) ? { statut: "conforme" as const, preuve: "corrigé" } : c]),
  ),
});

let h: typeof import("../src/lib/historique");
before(async () => {
  h = await import("../src/lib/historique");
});

test("l'historique retrouve l'audit précédent d'un site et mesure la progression", async () => {
  const avant = variante("avant-0001", "2026-10-01T10:00:00.000Z");
  const apres = variante("apres-0002", "2026-10-10T10:00:00.000Z", ["traceurs-avant-consentement", "page-mentions", "siren"]);
  await h.indexerAudit(apres);
  await h.indexerAudit(avant);
  const precedent = await h.auditPrecedent(apres);
  assert.equal(precedent?.id, "avant-0001");
  assert.ok(h.pointDe(apres).illegaux < precedent!.illegaux);
  assert.ok(h.pointDe(apres).note > precedent!.note);
  assert.equal(await h.auditPrecedent(avant), null);
  await h.desindexer(["avant-0001"]);
  assert.equal(await h.auditPrecedent(apres), null);
});

test("une sauvegarde est illisible sans la phrase secrète, et la restauration refuse les chemins piégés", async () => {
  const s = await import("../src/lib/sauvegarde");
  const secret = Buffer.from("données clients");
  const chiffre = await s.chiffrer(secret, "phrase-secrete-tres-longue");
  assert.ok(!chiffre.includes(secret));
  assert.deepEqual(await s.dechiffrer(chiffre, "phrase-secrete-tres-longue"), secret);
  await assert.rejects(s.dechiffrer(chiffre, "mauvaise-phrase-secrete"));

  const piege = zlib.gzipSync(JSON.stringify({ version: 1, fichiers: { "../../evasion.txt": Buffer.from("x").toString("base64") } }));
  const fichier = path.join(tmp, "piege.vigie");
  fs.writeFileSync(fichier, await s.chiffrer(piege, "phrase-secrete-tres-longue"));
  await assert.rejects(s.restaurerSauvegarde(fichier, "phrase-secrete-tres-longue", path.join(tmp, "restaure")), /Chemin refusé/);
  assert.ok(!fs.existsSync(path.join(tmp, "..", "evasion.txt")));
});

test("chaque page par activité liste des obligations cohérentes", async () => {
  const { ACTIVITES, obligationsDe } = await import("../src/lib/activites");
  const ids = (slug: string) => obligationsDe(ACTIVITES.find((a) => a.slug === slug)!).map((r) => r.id);
  for (const a of ACTIVITES) assert.ok(obligationsDe(a).length >= 10, a.slug);
  assert.ok(ids("boutique-en-ligne").includes("vente.cgv"));
  assert.ok(!ids("site-vitrine").includes("vente.cgv"));
  assert.ok(ids("vente-alcool").includes("sect.alcool"));
  assert.ok(ids("logiciel-saas").includes("vente.resiliation-3-clics"));
});

test("le PDF échappe le contenu lu sur le site", async () => {
  const { rapportHtml } = await import("../src/lib/pdf");
  const piege = { ...exemple, resumeIA: "<script>alert(1)</script>", crawl: { ...exemple.crawl } } as Audit;
  const html = rapportHtml(piege);
  assert.ok(!html.includes("<script>alert(1)</script>"));
  assert.ok(html.includes("&lt;script&gt;"));
});
