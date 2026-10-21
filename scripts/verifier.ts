// Contrôle de la configuration avant mise en production : npm run verifier
try {
  process.loadEnvFile(".env.local");
} catch {
  /* variables d'environnement seules */
}
const { verifierConfiguration } = await import("../src/lib/configuration");
const points = verifierConfiguration();
for (const p of points) console.log(`${p.ok ? "✓" : p.bloquant ? "✕" : "!"} ${p.nom}${p.ok ? "" : ` : ${p.aide}`}`);
const bloquants = points.filter((p) => p.bloquant && !p.ok).length;
console.log(bloquants ? `\n${bloquants} point(s) bloquant(s) avant la mise en production.` : "\nPrêt pour la production.");
process.exit(bloquants ? 1 : 0);

export {};
