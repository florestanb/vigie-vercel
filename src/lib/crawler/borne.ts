/**
 * Attend une opération du navigateur au plus `ms` millisecondes, puis renvoie `defaut`. Certaines opérations
 * de Playwright attendent un cadre (iframe) qui ne répond jamais : sans limite, elles bloquent l'audit.
 */
export function borne<T>(operation: Promise<T>, ms: number, defaut: T): Promise<T> {
  let chrono: NodeJS.Timeout | undefined;
  return Promise.race([
    operation.catch(() => defaut),
    new Promise<T>((ok) => (chrono = setTimeout(() => ok(defaut), ms))),
  ]).finally(() => clearTimeout(chrono));
}
