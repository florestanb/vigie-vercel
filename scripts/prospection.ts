// Campagne de prospection en ligne de commande (l'interface /prospection fait la même chose) :
//   npm run prospection -- sites.txt [--sans-ia] [--pause 15]
// sites.txt : une adresse par ligne (les lignes vides et celles qui commencent par # sont ignorées).
// Rien n'est envoyé : chaque mail est préparé en brouillon, à relire et envoyer depuis /prospection ou votre messagerie.
import fs from "node:fs/promises";
import { creerCampagne, executerCampagne, normaliserSites } from "../src/lib/prospection/campagne";
import { expediteurDepuisEnv } from "../src/lib/prospection/mail";
import { restreindreDroits } from "../src/lib/donnees";

restreindreDroits();

try {
  process.loadEnvFile(".env.local");
} catch {
  /* pas de fichier : variables d'environnement seules */
}

const args = process.argv.slice(2);
const iPause = args.indexOf("--pause");
const fichier = args.find((a, i) => !a.startsWith("--") && i !== iPause + 1);
if (!fichier) {
  console.error("Usage : npm run prospection -- sites.txt [--sans-ia] [--pause 15]");
  process.exit(1);
}

const manquants = Object.entries(expediteurDepuisEnv()).filter(([, v]) => typeof v === "string" && v.startsWith("[À COMPLÉTER"));
if (manquants.length)
  console.error(`⚠ Expéditeur incomplet (${manquants.map(([k]) => k).join(", ")}) : renseignez VIGIE_EXPEDITEUR_NOM, _SOCIETE et _EMAIL dans .env.local.`);

const sites = normaliserSites(await fs.readFile(fichier, "utf8"));
const id = await creerCampagne(sites, { pause: iPause >= 0 ? Number(args[iPause + 1]) : undefined, ia: !args.includes("--sans-ia") });
await executerCampagne(id, (l, rang, total) =>
  console.log(`[${rang}/${total}] ${l.site} → ${l.etat}${l.note !== undefined ? ` (${l.note}/100, ${l.manquements} manquement(s))` : ""}${l.detail ? ` : ${l.detail}` : ""}`),
);
console.log(`\nCampagne ${id} terminée. Revue et envoi : /prospection (ou data/prospection/${id}/).`);
