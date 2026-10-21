import { restreindreDroits } from "./lib/donnees";
import { serverless } from "./lib/navigateur";
import { stockageEnBase } from "./lib/stockage";
import { demarrerSuivi } from "./lib/suivi";

// Données sur disque (sans base) : réservées au compte système qui fait tourner Vigie.
if (!stockageEnBase()) restreindreDroits();
// Sur Vercel, aucun processus ne reste allumé : la tournée est appelée par la tâche planifiée (/api/cron).
if (process.env.VIGIE_SUIVI !== "0" && !serverless()) demarrerSuivi();
