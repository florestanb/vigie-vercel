/**
 * Génère docs/revue-juridique.md : le document de travail remis à l'avocat pour valider le registre règle par
 * règle (champ d'application, texte officiel des articles cités, doutes relevés, case de validation).
 *   npm run revue
 */
import fs from "node:fs";
import { LIBELLES_EDITEUR, LIBELLES_PROFIL, LIBELLES_SECTEURS, LIBELLES_TYPES } from "../src/lib/profil";
import { CATALOGUE, DERNIERE_MISE_A_JOUR } from "../src/lib/rules/catalogue";
import { empreinteRegle } from "../src/lib/rules/empreinte";
import { REVUE } from "../src/lib/rules/revue";
import { VALIDATIONS } from "../src/lib/rules/validations";
import type { Conditions } from "../src/lib/types";
import { cleRef, type Citation } from "../src/lib/rules/citations-ref";

const citations: Record<string, Citation> = JSON.parse(fs.readFileSync("src/lib/rules/citations.json", "utf8"));
const NATURE = { loi: "Loi (peut produire « Illégal » une fois validée)", flou: "Zone de flou", recommandation: "Recommandation" } as const;

function conditionsEnClair(c: Conditions): string {
  const parties: string[] = [];
  if (c.types) parties.push(`type de site : ${c.types.map((t) => LIBELLES_TYPES[t]).join(" ou ")}`);
  if (c.editeurs) parties.push(`éditeur : ${c.editeurs.map((e) => LIBELLES_EDITEUR[e]).join(" ou ")}`);
  if (c.secteurs) parties.push(`secteur : ${c.secteurs.map((s) => LIBELLES_SECTEURS[s]).join(" ou ")}`);
  for (const [cle, v] of Object.entries(c)) {
    if (["types", "editeurs", "secteurs", "ou"].includes(cle)) continue;
    parties.push(`${v ? "" : "NON : "}${LIBELLES_PROFIL[cle as keyof typeof LIBELLES_PROFIL]}`);
  }
  if (c.ou) parties.push(`au moins un de : ${c.ou.map((x) => `(${conditionsEnClair(x)})`).join(" ; ")}`);
  return parties.join(" ET ") || "tous les sites";
}

const citer = (t: string) => {
  const court = t.length > 3000 ? t.slice(0, 3000) + "\n[…]" : t;
  return court.split("\n").map((l) => `> ${l}`).join("\n");
};

const lignes: string[] = [
  "# Revue juridique du registre Vigie",
  "",
  `Registre du ${DERNIERE_MISE_A_JOUR}, document généré le ${new Date().toISOString().slice(0, 10)} (npm run revue). Pour chaque règle : son champ d'application, le texte officiel des articles cités quand il a pu être récupéré, les doutes relevés et une case de validation.`,
  "",
  "**Effet de la validation.** Tant qu'une règle n'est pas validée, un manquement n'est jamais présenté comme « Illégal » (il apparaît en zone de flou) et n'est jamais cité dans un mail de prospection. La validation porte sur la version de la règle identifiée par son empreinte : toute modification ultérieure demande une nouvelle validation. Les validations sont saisies dans `src/lib/rules/validations.ts`.",
  "",
];
const sansTexte = new Set<string>();
const avecDoutes = CATALOGUE.filter((r) => REVUE[r.id]?.doutes.length).length;
lignes.push(
  `| Règles | Validées | Avec doutes relevés | Sans revue |`,
  `|---|---|---|---|`,
  `| ${CATALOGUE.length} | ${CATALOGUE.filter((r) => VALIDATIONS[r.id]?.statut === "validee" && VALIDATIONS[r.id].empreinte === empreinteRegle(r)).length} | ${avecDoutes} | ${CATALOGUE.filter((r) => !REVUE[r.id]).length} |`,
  "",
);

for (const domaine of [...new Set(CATALOGUE.map((r) => r.domaine))]) {
  lignes.push(`## ${domaine}`, "");
  for (const r of CATALOGUE.filter((x) => x.domaine === domaine)) {
    const rev = REVUE[r.id];
    const v = VALIDATIONS[r.id];
    const empreinte = empreinteRegle(r);
    lignes.push(`### ${r.titre}`, "", `\`${r.id}\` · empreinte \`${empreinte}\` · ${NATURE[r.nature ?? "loi"]} · gravité ${r.gravite}${r.applicableDepuis ? ` · applicable depuis le ${r.applicableDepuis}` : ""}`, "");
    lignes.push(`**Exigence affichée aux clients.** ${r.exigence}`, "");
    if (r.nuance) lignes.push(`**Nuance affichée.** ${r.nuance}`, "");
    if (r.sanction) lignes.push(`**Sanction affichée.** ${r.sanction}`, "");
    lignes.push(`**Conditions appliquées par le logiciel.** ${conditionsEnClair(r.conditions)}`, "");
    if (!rev) {
      lignes.push("**⚠ Aucune revue rédigée pour cette règle.**", "");
    } else {
      if (rev.sApplique.length) lignes.push("**S'applique si :**", ...rev.sApplique.map((x) => `- ${x}`), "");
      if (rev.neSAppliquePas.length) lignes.push("**Ne s'applique pas si :**", ...rev.neSAppliquePas.map((x) => `- ${x}`), "");
      if (rev.doutes.length) lignes.push("**Doutes à trancher :**", ...rev.doutes.map((x) => `- ${x}`), "");
      for (const a of rev.articles) {
        const c = citations[cleRef(a)];
        const titre = `${a.type === "code" ? a.code : a.nom}, art. ${a.num}`;
        if (c?.texte) lignes.push(`**${titre}** (${c.version ?? "version non précisée"}, récupéré le ${c.recupere}${c.url ? ` : ${c.url}` : ""})`, "", citer(c.texte), "");
        else {
          sansTexte.add(titre);
          lignes.push(`**${titre}** : texte officiel non récupéré${c?.erreur ? ` (${c.erreur})` : ""}.`, "");
        }
      }
    }
    lignes.push("**Sources affichées.** " + r.sources.map((s) => `${s.texte}${s.article ? `, ${s.article}` : ""}`).join(" ; "), "");
    lignes.push(
      v
        ? `**Validation.** ${v.statut === "validee" ? "Validée" : "À corriger"} par ${v.par} le ${v.le}${v.empreinte !== empreinte ? " **(la règle a changé depuis : à revalider)**" : ""}${v.note ? `. ${v.note}` : ""}`
        : "**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________",
      "",
      "---",
      "",
    );
  }
}
lignes.push(`## Articles dont le texte officiel reste à récupérer (${sansTexte.size})`, "", ...[...sansTexte].sort().map((t) => `- ${t}`), "");
fs.writeFileSync("docs/revue-juridique.md", lignes.join("\n"));
console.log(`docs/revue-juridique.md : ${CATALOGUE.length} règles, ${avecDoutes} avec doutes, ${sansTexte.size} articles sans texte officiel.`);
