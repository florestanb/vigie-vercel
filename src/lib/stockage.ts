import fs from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";
import { DOSSIER_AUDITS, RACINE_DONNEES } from "./donnees";

/**
 * Stockage de toutes les données de Vigie (audits, comptes, approbations, prospection…), sous forme de
 * fichiers nommés par une clé (« audits/<id>.json », « comptes/<id>.json »…).
 *
 * - Avec DATABASE_URL (ou POSTGRES_URL) : une table Postgres, partagée par toutes les instances du serveur.
 *   C'est le mode Vercel, où le disque n'est ni partagé ni conservé d'une exécution à l'autre.
 * - Sans : des fichiers dans data/, comme sur un serveur classique (développement, tests, scripts).
 */

export interface Entree {
  cle: string;
  modifie: Date;
}

const urlBase = () => (process.env.DATABASE_URL || process.env.POSTGRES_URL || "").trim();
export const stockageEnBase = () => !!urlBase();

const verifierCle = (cle: string) => {
  if (!cle || cle.startsWith("/") || cle.split("/").some((p) => p === ".." || p === ".")) throw new Error(`Clé de stockage invalide : ${cle}`);
  return cle;
};

// ---------- Postgres ----------

let client: postgres.Sql | null = null;
let schema: Promise<void> | null = null;

/** Connexion Postgres (une par instance, réutilisée d'une requête à l'autre). */
export function base(): postgres.Sql {
  // prepare: false : compatible avec les connexions mutualisées (PgBouncer de Neon, Supabase…).
  client ??= postgres(urlBase(), { max: 8, idle_timeout: 20, connect_timeout: 15, prepare: false, onnotice: () => {} });
  return client;
}

/** Crée les tables au premier usage (sans effet si elles existent). */
export function preparerBase(): Promise<void> {
  schema ??= base()
    .begin(async (tx) => {
      await tx`select pg_advisory_xact_lock(4242424242)`;
      await tx`create table if not exists vigie_donnees (
        cle text collate "C" primary key,
        contenu bytea not null,
        modifie timestamptz not null default now()
      )`;
      await tx`create table if not exists vigie_limites (cle text not null, t timestamptz not null default now())`;
      await tx`create index if not exists vigie_limites_cle_t on vigie_limites (cle, t)`;
    })
    .then(() => {})
    .catch((e) => {
      schema = null;
      throw e;
    });
  return schema;
}

async function sql(): Promise<postgres.Sql> {
  await preparerBase();
  return base();
}

const motifPrefixe = (prefixe: string) => prefixe.replace(/[\\%_]/g, (c) => `\\${c}`) + "%";

// ---------- Fichiers ----------

function chemin(cle: string): string {
  verifierCle(cle);
  // VIGIE_DONNEES peut placer les audits ailleurs que dans data/audits.
  return cle.startsWith("audits/") ? path.join(DOSSIER_AUDITS, cle.slice(7)) : path.join(RACINE_DONNEES, cle);
}

async function listerFichiers(dossier: string, prefixe: string): Promise<Entree[]> {
  const entrees: Entree[] = [];
  for (const e of await fs.readdir(dossier, { withFileTypes: true }).catch(() => [])) {
    const p = path.join(dossier, e.name);
    if (e.isDirectory()) entrees.push(...(await listerFichiers(p, `${prefixe}${e.name}/`)));
    else if (e.isFile() && !e.name.endsWith(".tmp")) entrees.push({ cle: `${prefixe}${e.name}`, modifie: (await fs.stat(p)).mtime });
  }
  return entrees;
}

// ---------- Interface commune ----------

export async function lire(cle: string): Promise<Buffer | null> {
  verifierCle(cle);
  if (stockageEnBase()) {
    const db = await sql();
    const [r] = await db`select contenu from vigie_donnees where cle = ${cle}`;
    return r ? Buffer.from(r.contenu as Uint8Array) : null;
  }
  return fs.readFile(chemin(cle)).catch(() => null);
}

export async function lireTexte(cle: string): Promise<string | null> {
  return (await lire(cle))?.toString("utf8") ?? null;
}

export async function lireJson<T>(cle: string, defaut: T): Promise<T> {
  try {
    const texte = await lireTexte(cle);
    return texte === null ? defaut : (JSON.parse(texte) as T);
  } catch {
    return defaut;
  }
}

/** Écrit (ou remplace) un fichier, de façon atomique. */
export async function ecrire(cle: string, contenu: string | Buffer): Promise<void> {
  verifierCle(cle);
  const octets = typeof contenu === "string" ? Buffer.from(contenu, "utf8") : contenu;
  if (stockageEnBase()) {
    const db = await sql();
    await db`insert into vigie_donnees (cle, contenu, modifie) values (${cle}, ${octets}, now())
      on conflict (cle) do update set contenu = excluded.contenu, modifie = now()`;
    return;
  }
  const f = chemin(cle);
  await fs.mkdir(path.dirname(f), { recursive: true });
  await fs.writeFile(`${f}.tmp`, octets);
  await fs.rename(`${f}.tmp`, f);
}

/** Crée le fichier seulement s'il n'existe pas encore. Renvoie vrai s'il a été créé. */
export async function creerSiAbsent(cle: string, contenu: string): Promise<boolean> {
  verifierCle(cle);
  if (stockageEnBase()) {
    const db = await sql();
    const r = await db`insert into vigie_donnees (cle, contenu) values (${cle}, ${Buffer.from(contenu, "utf8")}) on conflict (cle) do nothing returning cle`;
    return r.length > 0;
  }
  const f = chemin(cle);
  await fs.mkdir(path.dirname(f), { recursive: true });
  return fs.writeFile(f, contenu, { flag: "wx" }).then(
    () => true,
    () => false,
  );
}

/** Ajoute une ligne à la fin d'un fichier (journaux, listes). */
export async function ajouterLigne(cle: string, ligne: string): Promise<void> {
  verifierCle(cle);
  const octets = Buffer.from(ligne.endsWith("\n") ? ligne : `${ligne}\n`, "utf8");
  if (stockageEnBase()) {
    const db = await sql();
    await db`insert into vigie_donnees (cle, contenu) values (${cle}, ${octets})
      on conflict (cle) do update set contenu = vigie_donnees.contenu || excluded.contenu, modifie = now()`;
    return;
  }
  const f = chemin(cle);
  await fs.mkdir(path.dirname(f), { recursive: true });
  await fs.appendFile(f, octets);
}

export async function taille(cle: string): Promise<number> {
  verifierCle(cle);
  if (stockageEnBase()) {
    const db = await sql();
    const [r] = await db`select octet_length(contenu) as n from vigie_donnees where cle = ${cle}`;
    return r ? Number(r.n) : 0;
  }
  return fs.stat(chemin(cle)).then((s) => s.size, () => 0);
}

export async function supprimer(cle: string): Promise<void> {
  verifierCle(cle);
  if (stockageEnBase()) {
    const db = await sql();
    await db`delete from vigie_donnees where cle = ${cle}`;
    return;
  }
  await fs.unlink(chemin(cle)).catch(() => {});
}

/** Lit et supprime un fichier en une seule opération : un seul appelant l'obtient (jetons à usage unique). */
export async function retirer(cle: string): Promise<Buffer | null> {
  verifierCle(cle);
  if (stockageEnBase()) {
    const db = await sql();
    const [r] = await db`delete from vigie_donnees where cle = ${cle} returning contenu`;
    return r ? Buffer.from(r.contenu as Uint8Array) : null;
  }
  const contenu = await fs.readFile(chemin(cle)).catch(() => null);
  if (!contenu) return null;
  return fs.unlink(chemin(cle)).then(
    () => contenu,
    () => null,
  );
}

/** Supprime tous les fichiers dont la clé commence par ce préfixe (un « dossier »). */
export async function supprimerDossier(prefixe: string): Promise<void> {
  const p = verifierCle(prefixe.endsWith("/") ? prefixe : `${prefixe}/`);
  if (stockageEnBase()) {
    const db = await sql();
    await db`delete from vigie_donnees where cle like ${motifPrefixe(p)}`;
    return;
  }
  await fs.rm(chemin(p), { recursive: true, force: true });
}

/** Tous les fichiers dont la clé commence par ce préfixe (sous-dossiers compris), avec leur date de modification. */
export async function lister(prefixe: string): Promise<Entree[]> {
  if (prefixe) verifierCle(prefixe);
  if (stockageEnBase()) {
    const db = await sql();
    const lignes = await db`select cle, modifie from vigie_donnees where cle like ${motifPrefixe(prefixe)} order by cle`;
    return lignes.map((l) => ({ cle: l.cle as string, modifie: new Date(l.modifie as string) }));
  }
  if (!prefixe) {
    const tout = await listerFichiers(RACINE_DONNEES, "");
    // Audits placés hors de data/ par VIGIE_DONNEES.
    if (path.resolve(DOSSIER_AUDITS) !== path.resolve(RACINE_DONNEES, "audits")) tout.push(...(await listerFichiers(DOSSIER_AUDITS, "audits/")));
    return tout.filter((e) => !e.cle.startsWith(".")).sort((a, b) => a.cle.localeCompare(b.cle));
  }
  // Le préfixe peut s'arrêter au milieu d'un nom : on liste son dossier puis on filtre.
  const dossier = prefixe.endsWith("/") ? prefixe : prefixe.slice(0, prefixe.lastIndexOf("/") + 1);
  const entrees = await listerFichiers(dossier ? chemin(dossier) : RACINE_DONNEES, dossier);
  return entrees.filter((e) => e.cle.startsWith(prefixe)).sort((a, b) => a.cle.localeCompare(b.cle));
}

// ---------- Verrous ----------

const verrousLocaux = new Map<string, Promise<unknown>>();

/**
 * Exécute `fn` sans qu'une autre exécution sous le même nom se chevauche, y compris sur une autre instance
 * du serveur (verrou consultatif Postgres) : lire-modifier-écrire un compte ou un index reste sûr.
 */
export async function avecVerrou<T>(nom: string, fn: () => Promise<T>): Promise<T> {
  const precedent = verrousLocaux.get(nom) ?? Promise.resolve();
  const suivant = precedent
    .catch(() => {})
    .then(async () => {
      if (!stockageEnBase()) return fn();
      let resultat: T;
      const db = await sql();
      await db.begin(async (tx) => {
        await tx`select pg_advisory_xact_lock(hashtextextended(${nom}, 0))`;
        resultat = await fn();
      });
      return resultat!;
    });
  verrousLocaux.set(nom, suivant);
  try {
    return await suivant;
  } finally {
    if (verrousLocaux.get(nom) === suivant) verrousLocaux.delete(nom);
  }
}

/** Ferme la connexion à la base (fin des scripts en ligne de commande). */
export async function fermerStockage(): Promise<void> {
  await client?.end({ timeout: 5 }).catch(() => {});
  client = null;
  schema = null;
}
