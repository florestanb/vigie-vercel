// Sauvegarde chiffrée de toutes les données (data/, ou la base si DATABASE_URL est défini) : npm run sauvegarde
// Restauration : npm run restaurer -- <fichier.vigie> [dossier de destination, par défaut ./data-restauree]
// (puis, pour remettre ce dossier dans la base : npm run migrer -- <dossier>)
import path from "node:path";
import { restreindreDroits } from "../src/lib/donnees";
import { creerSauvegarde, restaurerSauvegarde } from "../src/lib/sauvegarde";
import { fermerStockage, stockageEnBase } from "../src/lib/stockage";

try {
  process.loadEnvFile(".env.local");
} catch {
  /* variables d'environnement seules */
}
if (!stockageEnBase()) restreindreDroits();

const [mode, fichier, destination] = process.argv.slice(2);
if (mode === "restaurer") {
  const cle = process.env.VIGIE_SAUVEGARDE_CLE?.trim();
  if (!fichier || !cle) {
    console.error("Usage : npm run restaurer -- <fichier.vigie> [destination] (VIGIE_SAUVEGARDE_CLE requise)");
    process.exit(1);
  }
  const cible = path.resolve(destination ?? "data-restauree");
  const n = await restaurerSauvegarde(fichier, cle, cible);
  console.log(`${n} fichiers restaurés dans ${cible}. Vérifiez-les, puis remplacez data/ serveur arrêté.`);
} else {
  console.log(`Sauvegarde créée : ${await creerSauvegarde()}`);
}
await fermerStockage();
