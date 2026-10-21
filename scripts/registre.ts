// Génère docs/registre-juridique.md à partir du catalogue de règles (source unique).
import fs from "node:fs";
import { CATALOGUE, DERNIERE_MISE_A_JOUR } from "../src/lib/rules/catalogue";

const domaines = [...new Set(CATALOGUE.map((r) => r.domaine))];
const conditions = (c: object): string =>
  Object.entries(c)
    .filter(([k]) => k !== "ou")
    .map(([k, v]) => `${k} = ${Array.isArray(v) ? v.join(", ") : v}`)
    .concat("ou" in c && Array.isArray(c.ou) ? [`un parmi : ${c.ou.map((o: object): string => conditions(o)).join(" | ")}`] : [])
    .join(" ; ") || "tous les sites";

const lignes = [
  "# Registre des obligations légales",
  "",
  `Généré depuis \`src/lib/rules/catalogue.ts\` (à jour au ${DERNIERE_MISE_A_JOUR}). Ne pas modifier à la main : \`npm run registre\`.`,
  "",
  `${CATALOGUE.filter((r) => !r.obsolete).length} obligations en vigueur, ${CATALOGUE.filter((r) => r.obsolete).length} obligation(s) abrogée(s) signalée(s) comme à retirer.`,
  "",
];
for (const d of domaines) {
  lignes.push(`## ${d}`, "");
  for (const r of CATALOGUE.filter((r) => r.domaine === d)) {
    lignes.push(`### ${r.titre}${r.obsolete ? " (abrogée, à retirer)" : ""}`, "");
    lignes.push(r.exigence, "");
    lignes.push(`- **Nature** : ${{ loi: "obligation légale", flou: "zone de flou", recommandation: "recommandation" }[r.nature ?? "loi"]}${r.nuance ? ` (${r.nuance})` : ""}`);
    lignes.push(`- **Gravité** : ${r.gravite} · **Vérification** : ${r.verification}${r.check ? ` (\`${r.check}\`)` : ""} · **Document** : ${r.document}`);
    lignes.push(`- **S'applique à** : ${conditions(r.conditions)}`);
    if (r.applicableDepuis) lignes.push(`- **Applicable depuis** : ${r.applicableDepuis}`);
    if (r.sanction) lignes.push(`- **Sanction** : ${r.sanction}`);
    lignes.push(`- **Sources** : ${r.sources.map((s) => `[${s.texte}${s.article ? `, ${s.article}` : ""}](${s.url})`).join(" ; ")}`, "");
  }
}
fs.mkdirSync("docs", { recursive: true });
fs.writeFileSync("docs/registre-juridique.md", lignes.join("\n"));
console.log(`docs/registre-juridique.md : ${CATALOGUE.length} règles`);
