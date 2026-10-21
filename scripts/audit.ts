// Audit en ligne de commande, sans interface : npm run audit -- https://exemple.fr
import { lancerAudit } from "../src/lib/audit";
import { calculerScore, evaluer, trier, verdict } from "../src/lib/rules/engine";
import { restreindreDroits } from "../src/lib/donnees";
import { fermerStockage, stockageEnBase } from "../src/lib/stockage";

if (!stockageEnBase()) restreindreDroits();

const url = process.argv[2];
if (!url) {
  console.error("Usage : npm run audit -- <url>");
  process.exit(1);
}
const audit = await lancerAudit(url, (m) => console.error("·", m));
const resultats = trier(evaluer(audit.profil, audit.constatsAuto, audit.constatsIA));
const score = calculerScore(resultats);
console.log(`\n${audit.url} : ${score.note}/100 (${score.illegaux} illégaux dont ${score.critiquesIllegaux} critiques, ${score.flous} en zone de flou, ${score.recommandes} recommandations)\n`);
for (const r of resultats.filter((r) => !["conforme", "a-verifier"].includes(verdict(r)))) {
  console.log(`[${verdict(r)}] ${r.regle.titre} (${r.regle.gravite})${r.preuve ? `\n    ${r.preuve}` : ""}`);
}
console.log(`\nRapport complet : ${stockageEnBase() ? "base de données" : "data"}/audits/${audit.id}.json`);
await fermerStockage();
