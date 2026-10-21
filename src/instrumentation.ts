/** Démarrage du serveur : lance la tournée hebdomadaire de suivi des sites des abonnés (côté Node uniquement). */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./instrumentation-node");
  }
}
