// Recopie un dossier de données (par défaut ./data) dans la base Postgres : npm run migrer -- [dossier]
// À lancer une fois, depuis votre machine, avec DATABASE_URL (celle de Neon) dans .env.local ou l'environnement.
import path from "node:path";
import { importerDossier } from "../src/lib/sauvegarde";
import { fermerStockage, stockageEnBase } from "../src/lib/stockage";

try {
  process.loadEnvFile(".env.local");
} catch {
  /* variables d'environnement seules */
}

if (!stockageEnBase()) {
  console.error("DATABASE_URL n'est pas définie : indiquez la base de destination (dans .env.local ou l'environnement).");
  process.exit(1);
}
const source = path.resolve(process.argv[2] ?? "data");
const n = await importerDossier(source);
console.log(`${n} fichiers de ${source} recopiés dans la base.`);
await fermerStockage();
