import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { DOSSIER_COMPTES, chargerCompte, type Compte } from "./comptes";
import { RACINE_DONNEES } from "./donnees";

/**
 * Session client : cookie httpOnly « compte.expiration.signature », signé avec VIGIE_SECRET.
 * Aucune donnée n'est stockée côté serveur pour la session elle-même.
 */
export const COOKIE_SESSION = "vigie_session";
const DUREE_S = 30 * 24 * 3600;

let secretDev: string | null = null;

function secret(): string {
  const s = process.env.VIGIE_SECRET?.trim();
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV === "production") throw new Error("VIGIE_SECRET (32 caractères au moins) est obligatoire en production.");
  // En développement : un secret aléatoire conservé sur disque, pour garder les sessions d'un redémarrage à l'autre.
  if (!secretDev) {
    const f = path.join(RACINE_DONNEES, ".secret-dev");
    try {
      secretDev = fs.readFileSync(f, "utf8").trim();
    } catch {
      secretDev = crypto.randomBytes(32).toString("hex");
      fs.mkdirSync(path.dirname(f), { recursive: true });
      fs.writeFileSync(f, secretDev, { mode: 0o600 });
    }
  }
  return secretDev;
}

const signer = (charge: string) => crypto.createHmac("sha256", secret()).update(charge).digest("base64url");

export async function ouvrirSession(compteId: string): Promise<void> {
  const exp = Math.floor(Date.now() / 1000) + DUREE_S;
  const charge = `${compteId}.${exp}`;
  (await cookies()).set(COOKIE_SESSION, `${charge}.${signer(charge)}`, {
    httpOnly: true,
    sameSite: "lax", // « lax » : le retour depuis Stripe et le lien reçu par e-mail doivent porter la session.
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DUREE_S,
  });
}

export async function fermerSession(): Promise<void> {
  (await cookies()).delete(COOKIE_SESSION);
}

/** Compte connecté, ou null. */
export async function compteConnecte(): Promise<Compte | null> {
  const valeur = (await cookies()).get(COOKIE_SESSION)?.value;
  const [id, exp, sig] = valeur?.split(".") ?? [];
  if (!id || !exp || !sig || Number(exp) * 1000 < Date.now()) return null;
  const attendu = signer(`${id}.${exp}`);
  if (sig.length !== attendu.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(attendu))) return null;
  return chargerCompte(id);
}

// ---------- Liens de connexion par e-mail ----------

const DOSSIER_JETONS = () => path.join(DOSSIER_COMPTES, "jetons");
const empreinte = (jeton: string) => crypto.createHash("sha256").update(jeton).digest("hex");

export interface OptionsJeton {
  /** Durée de validité (30 minutes par défaut). */
  dureeMs?: number;
  /** Réutilisable jusqu'à expiration (lien d'accès de l'e-mail de confirmation), sinon à usage unique. */
  reutilisable?: boolean;
  /** Page où arriver après la connexion (chemin interne). */
  suite?: string;
}

const suiteSure = (s: unknown) => (typeof s === "string" && /^\/(?![/\\])[\w\-/?=&.%]*$/.test(s) ? s : "/compte");

/** Crée un lien de connexion. Seule l'empreinte du jeton est stockée. */
export async function creerJetonConnexion(email: string, options: OptionsJeton = {}): Promise<string> {
  const jeton = crypto.randomBytes(32).toString("base64url");
  await fs.promises.mkdir(DOSSIER_JETONS(), { recursive: true });
  await fs.promises.writeFile(
    path.join(DOSSIER_JETONS(), `${empreinte(jeton)}.json`),
    JSON.stringify({ email, exp: Date.now() + (options.dureeMs ?? 30 * 60_000), reutilisable: !!options.reutilisable, suite: suiteSure(options.suite) }),
  );
  return jeton;
}

/** Utilise un jeton : renvoie l'adresse et la page de destination s'il est valide (et le détruit s'il est à usage unique). */
export async function consommerJetonConnexion(jeton: string): Promise<{ email: string; suite: string } | null> {
  if (!/^[\w-]{20,100}$/.test(jeton)) return null;
  const f = path.join(DOSSIER_JETONS(), `${empreinte(jeton)}.json`);
  try {
    const { email, exp, reutilisable, suite } = JSON.parse(await fs.promises.readFile(f, "utf8")) as { email: string; exp: number; reutilisable?: boolean; suite?: string };
    if (exp <= Date.now()) {
      await fs.promises.unlink(f).catch(() => {});
      return null;
    }
    if (!reutilisable) await fs.promises.unlink(f);
    return { email, suite: suiteSure(suite) };
  } catch {
    return null;
  }
}

/** Supprime les jetons expirés (appelé par la tournée horaire). */
export async function purgerJetons(): Promise<void> {
  for (const f of await fs.promises.readdir(DOSSIER_JETONS()).catch(() => [] as string[])) {
    const chemin = path.join(DOSSIER_JETONS(), f);
    try {
      const { exp } = JSON.parse(await fs.promises.readFile(chemin, "utf8")) as { exp: number };
      if (exp <= Date.now()) await fs.promises.unlink(chemin);
    } catch {
      /* fichier illisible : ignoré */
    }
  }
}
