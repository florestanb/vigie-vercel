// Régénère le rapport d'exemple public (/exemple) à partir de la boutique fictive des tests :
//   npm run exemple
import fs from "node:fs";
import path from "node:path";
import { servir } from "../tests/serveur";
import { crawler } from "../src/lib/crawler/crawler";
import { CATALOGUE } from "../src/lib/rules/catalogue";
import { executerChecks } from "../src/lib/rules/checks";
import { profilDepuisCrawl } from "../src/lib/profil";
import type { Audit } from "../src/lib/types";

process.env.VIGIE_AUTORISER_LOCAL = "1";
const { url, fermer } = await servir(path.resolve("tests/fixtures/boutique-risquee"));
const crawl = await crawler(url);
fermer();
// Le site de test tourne en local : on lui donne une adresse fictive, partout dans les données.
const local = new URL(url).origin;
const brut = JSON.stringify(crawl).split(local).join("https://www.boutique-exemple.fr").split('"127.0.0.1"').join('".boutique-exemple.fr"');
const c = JSON.parse(brut);
const entreprise = null;
const profil = profilDepuisCrawl(c, entreprise);
const checks = [...new Set(CATALOGUE.map((r) => r.check).filter(Boolean) as string[])];
const audit: Audit = {
  id: "exemple",
  url: "https://www.boutique-exemple.fr/",
  date: new Date().toISOString(),
  crawl: c,
  profilDetecte: profil,
  profil,
  entreprise,
  constatsAuto: executerChecks(c, entreprise, checks),
  constatsIA: {},
  resumeIA: null,
  iaDisponible: false,
};
fs.writeFileSync("src/lib/demo/audit-exemple.json", JSON.stringify(audit));
console.log("src/lib/demo/audit-exemple.json régénéré.");
process.exit(0);
