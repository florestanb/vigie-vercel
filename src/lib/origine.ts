/** Adresse publique du site, pour les liens envoyés à Stripe et par e-mail. */
export function origineDe(req: Request): string {
  return process.env.VIGIE_URL_PUBLIQUE?.trim().replace(/\/$/, "") || new URL(req.url).origin;
}
