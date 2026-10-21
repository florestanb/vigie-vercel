import { restreindreDroits } from "./lib/donnees";
import { demarrerSuivi } from "./lib/suivi";

restreindreDroits();
if (process.env.VIGIE_SUIVI !== "0") demarrerSuivi();
