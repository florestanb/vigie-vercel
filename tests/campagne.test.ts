import { test } from "node:test";
import assert from "node:assert/strict";
import { cheminMail, normaliserSites } from "../src/lib/prospection/campagne";

test("la liste de sites est nettoyée et dédoublonnée", () => {
  assert.deepEqual(normaliserSites("boutique.fr\n# commentaire\nhttps://autre.com, boutique.fr\n\nnimportequoi\nhttp://x.fr"), [
    "https://boutique.fr",
    "https://autre.com",
    "http://x.fr",
  ]);
});

test("un fichier de mail ne peut pas sortir du dossier de sa campagne", () => {
  assert.throws(() => cheminMail("2026-10-13-abcdef", "../../meta", "html"));
  assert.throws(() => cheminMail("../etc", "a.fr", "html"));
  assert.match(cheminMail("2026-10-13-abcdef", "boutique.fr", "eml"), /2026-10-13-abcdef\/mails\/boutique\.fr\.eml$/);
});
