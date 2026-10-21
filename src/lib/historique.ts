import fs from "node:fs/promises";
import path from "node:path";
import { DOSSIER_AUDITS, RACINE_DONNEES } from "./donnees";
import { calculerScore, evaluer } from "./rules/engine";
import type { Audit } from "./types";

/**
 * Historique des audits par site : de quoi montrer la progression (« 6 problèmes → 2, note 58 → 87 »)
 * sans relire tous les audits. Un index unique, tenu à jour à chaque audit enregistré ou supprimé.
 */

export interface Point {
  id: string;
  date: string;
  note: number;
  illegaux: number;
  flous: number;
}

const FICHIER = path.join(RACINE_DONNEES, "index-audits.json");
type Index = Record<string, Point[]>;

const domaine = (url: string) => new URL(url).hostname.replace(/^www\./, "").toLowerCase();

export function pointDe(audit: Audit): Point {
  const s = calculerScore(evaluer(audit.profil, audit.constatsAuto, audit.constatsIA));
  return { id: audit.id, date: audit.date, note: s.note, illegaux: s.illegaux, flous: s.flous };
}

let ecriture: Promise<unknown> = Promise.resolve();

/** Toutes les modifications passent l'une après l'autre (un seul processus serveur). */
function modifier(f: (i: Index) => void): Promise<void> {
  const suite = ecriture.catch(() => {}).then(async () => {
    const index = await lire();
    f(index);
    await fs.mkdir(RACINE_DONNEES, { recursive: true });
    await fs.writeFile(`${FICHIER}.tmp`, JSON.stringify(index));
    await fs.rename(`${FICHIER}.tmp`, FICHIER);
  });
  ecriture = suite;
  return suite;
}

async function lire(): Promise<Index> {
  try {
    return JSON.parse(await fs.readFile(FICHIER, "utf8")) as Index;
  } catch {
    return reconstruire();
  }
}

/** Index absent ou illisible : on le refait à partir des audits présents sur le disque. */
async function reconstruire(): Promise<Index> {
  const index: Index = {};
  for (const f of await fs.readdir(DOSSIER_AUDITS).catch(() => [] as string[])) {
    if (!f.endsWith(".json")) continue;
    try {
      const a = JSON.parse(await fs.readFile(path.join(DOSSIER_AUDITS, f), "utf8")) as Audit;
      (index[domaine(a.url)] ??= []).push(pointDe(a));
    } catch {
      /* audit illisible : ignoré */
    }
  }
  for (const d of Object.keys(index)) index[d].sort((a, b) => a.date.localeCompare(b.date));
  return index;
}

export function indexerAudit(audit: Audit): Promise<void> {
  const d = domaine(audit.url);
  const p = pointDe(audit);
  return modifier((i) => {
    i[d] = [...(i[d] ?? []).filter((x) => x.id !== p.id), p].sort((a, b) => a.date.localeCompare(b.date));
  });
}

export function desindexer(ids: string[]): Promise<void> {
  if (!ids.length) return Promise.resolve();
  const retires = new Set(ids);
  return modifier((i) => {
    for (const d of Object.keys(i)) {
      i[d] = i[d].filter((p) => !retires.has(p.id));
      if (!i[d].length) delete i[d];
    }
  });
}

export async function historique(url: string): Promise<Point[]> {
  await ecriture.catch(() => {});
  return (await lire())[domaine(url)] ?? [];
}

/** L'audit précédent du même site, pour afficher l'évolution. */
export async function auditPrecedent(audit: Audit): Promise<Point | null> {
  const h = await historique(audit.url);
  const i = h.findIndex((p) => p.id === audit.id);
  const avant = (i >= 0 ? h.slice(0, i) : h.filter((p) => p.date < audit.date)).at(-1);
  return avant ?? null;
}

export async function tousLesSites(): Promise<Index> {
  await ecriture.catch(() => {});
  return lire();
}
