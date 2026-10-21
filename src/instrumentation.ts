/** Démarrage du serveur : droits des données et tournée de suivi (serveur classique, côté Node uniquement). */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./instrumentation-node");
  }
}
