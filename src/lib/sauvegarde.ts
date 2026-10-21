import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";
import { promisify } from "node:util";
import { RACINE_DONNEES } from "./donnees";

/**
 * Sauvegardes de data/ : un fichier unique, compressé puis chiffré (AES-256-GCM, clé dérivée de
 * VIGIE_SAUVEGARDE_CLE par scrypt). Sans la phrase secrète, une sauvegarde est illisible : elle peut
 * donc être copiée sur un stockage externe (autre disque, stockage objet, cloud).
 */

const ENTETE = Buffer.from("VIGIE-SAUV-1");
const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);
const scrypt = promisify(crypto.scrypt) as (mdp: string, sel: Buffer, longueur: number) => Promise<Buffer>;

export const dossierSauvegardes = () => path.resolve(process.env.VIGIE_SAUVEGARDE_DOSSIER?.trim() || path.join(process.cwd(), "sauvegardes"));
export const sauvegardeConfiguree = () => (process.env.VIGIE_SAUVEGARDE_CLE?.trim().length ?? 0) >= 16;
const aGarder = () => Number(process.env.VIGIE_SAUVEGARDES_A_GARDER) || 14;

async function lister(dossier: string, base = dossier): Promise<string[]> {
  const fichiers: string[] = [];
  for (const entree of await fs.readdir(dossier, { withFileTypes: true }).catch(() => [])) {
    const chemin = path.join(dossier, entree.name);
    if (entree.isDirectory()) fichiers.push(...(await lister(chemin, base)));
    else if (entree.isFile() && !entree.name.endsWith(".tmp")) fichiers.push(path.relative(base, chemin));
  }
  return fichiers;
}

export async function chiffrer(donnees: Buffer, cle: string): Promise<Buffer> {
  const sel = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const chiffreur = crypto.createCipheriv("aes-256-gcm", await scrypt(cle, sel, 32), iv);
  const corps = Buffer.concat([chiffreur.update(donnees), chiffreur.final()]);
  return Buffer.concat([ENTETE, sel, iv, chiffreur.getAuthTag(), corps]);
}

export async function dechiffrer(contenu: Buffer, cle: string): Promise<Buffer> {
  if (!contenu.subarray(0, ENTETE.length).equals(ENTETE)) throw new Error("Ce fichier n'est pas une sauvegarde Vigie.");
  let o = ENTETE.length;
  const sel = contenu.subarray(o, (o += 16));
  const iv = contenu.subarray(o, (o += 12));
  const tag = contenu.subarray(o, (o += 16));
  const dechiffreur = crypto.createDecipheriv("aes-256-gcm", await scrypt(cle, sel, 32), iv);
  dechiffreur.setAuthTag(tag);
  try {
    return Buffer.concat([dechiffreur.update(contenu.subarray(o)), dechiffreur.final()]);
  } catch {
    throw new Error("Phrase secrète incorrecte ou sauvegarde altérée.");
  }
}

/** Crée une sauvegarde de data/ et ne garde que les plus récentes. Renvoie le chemin du fichier. */
export async function creerSauvegarde(): Promise<string> {
  const cle = process.env.VIGIE_SAUVEGARDE_CLE?.trim();
  if (!cle || cle.length < 16) throw new Error("VIGIE_SAUVEGARDE_CLE (16 caractères au moins) n'est pas définie.");
  const cible = dossierSauvegardes();
  if (cible.startsWith(path.resolve(RACINE_DONNEES) + path.sep)) throw new Error("Le dossier des sauvegardes doit être en dehors de data/.");
  const fichiers: Record<string, string> = {};
  for (const rel of await lister(RACINE_DONNEES)) fichiers[rel] = (await fs.readFile(path.join(RACINE_DONNEES, rel))).toString("base64");
  const archive = await gzip(Buffer.from(JSON.stringify({ version: 1, date: new Date().toISOString(), fichiers })));
  await fs.mkdir(cible, { recursive: true });
  const nom = `vigie-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-")}.vigie`;
  const chemin = path.join(cible, nom);
  await fs.writeFile(`${chemin}.tmp`, await chiffrer(archive, cle), { mode: 0o600 });
  await fs.rename(`${chemin}.tmp`, chemin);
  // Rotation : les plus anciennes au-delà du nombre à garder sont supprimées.
  const toutes = (await fs.readdir(cible)).filter((f) => /^vigie-[\d-]+\.vigie$/.test(f)).sort();
  for (const f of toutes.slice(0, Math.max(0, toutes.length - aGarder()))) await fs.unlink(path.join(cible, f));
  return chemin;
}

/** Restaure une sauvegarde dans un dossier (par défaut un dossier neuf, jamais par-dessus data/ sans le demander). */
export async function restaurerSauvegarde(fichier: string, cle: string, destination: string): Promise<number> {
  const { fichiers } = JSON.parse((await gunzip(await dechiffrer(await fs.readFile(fichier), cle))).toString()) as { fichiers: Record<string, string> };
  const racine = path.resolve(destination);
  let n = 0;
  for (const [rel, b64] of Object.entries(fichiers)) {
    const cible = path.resolve(racine, rel);
    if (!cible.startsWith(racine + path.sep)) throw new Error(`Chemin refusé dans la sauvegarde : ${rel}`);
    await fs.mkdir(path.dirname(cible), { recursive: true, mode: 0o700 });
    await fs.writeFile(cible, Buffer.from(b64, "base64"), { mode: 0o600 });
    n++;
  }
  return n;
}

/** Date de la dernière sauvegarde, ou null. */
export async function derniereSauvegarde(): Promise<Date | null> {
  const toutes = (await fs.readdir(dossierSauvegardes()).catch(() => [] as string[])).filter((f) => f.endsWith(".vigie")).sort();
  if (!toutes.length) return null;
  return (await fs.stat(path.join(dossierSauvegardes(), toutes.at(-1)!))).mtime;
}
