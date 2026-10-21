import { formule } from "./abonnes";
import { chargerAudit } from "./audit";
import { chargerCompte, listerComptes, modifierCompte, type Compte } from "./comptes";
import type { TypeDocument } from "./documents/plans";
import { signalerMiseAJour, titreDocument, type DocumentHeberge } from "./documents-heberges";
import { envoyerEmail } from "./email";
import { origineSite } from "./emails-clients";
import { signalerErreur } from "./journal";
import { CATALOGUE } from "./rules/catalogue";
import { conditionsRemplies } from "./rules/engine";
import type { Regle } from "./types";
import { empreinteRegle } from "./rules/empreinte";
import { ecrire, lireJson } from "./stockage";

export { empreinteRegle };

/**
 * Veille : quand le registre change (nouvelle règle, règle modifiée) ou qu'une règle entre en application,
 * chaque abonné reçoit la liste des obligations qui concernent réellement ses sites suivis (d'après le profil
 * de leur dernier audit), et ses documents hébergés touchés sont marqués « à mettre à jour ».
 *
 * L'état du registre déjà connu est gardé dans veille/registre.json. Au tout premier passage, il est
 * seulement enregistré : aucune alerte n'est envoyée pour l'existant.
 */

const FICHIER = "veille/registre.json";

/** Version du calcul d'empreinte : un changement de calcul ne doit pas passer pour un changement de toutes les règles. */
const ALGO = "fnv1a-64";

interface Etat {
  algo?: string;
  date: string;
  empreintes: Record<string, string>;
}

export interface Changement {
  regle: Regle;
  nature: "nouvelle" | "modifiee" | "en-application";
  /** Clé de dédoublonnage des alertes (règle et version). */
  cle: string;
}

async function lireEtat(): Promise<Etat | null> {
  return lireJson<Etat | null>(FICHIER, null);
}

async function ecrireEtat(e: Etat): Promise<void> {
  await ecrire(FICHIER, JSON.stringify(e, null, 1));
}

/** Différences entre le registre actuel et l'état connu. */
export function changementsDepuis(etat: Etat, catalogue: Regle[] = CATALOGUE, maintenant = new Date()): Changement[] {
  const aujourdhui = maintenant.toISOString().slice(0, 10);
  const depuis = etat.date.slice(0, 10);
  const changements: Changement[] = [];
  for (const regle of catalogue) {
    const e = empreinteRegle(regle);
    const avant = etat.empreintes[regle.id];
    if (!avant) changements.push({ regle, nature: "nouvelle", cle: `${regle.id}@${e}` });
    else if (avant !== e) changements.push({ regle, nature: "modifiee", cle: `${regle.id}@${e}` });
    else if (regle.applicableDepuis && regle.applicableDepuis > depuis && regle.applicableDepuis <= aujourdhui)
      changements.push({ regle, nature: "en-application", cle: `${regle.id}@${regle.applicableDepuis}` });
  }
  // Une règle obsolète n'alerte que si elle vient de le devenir.
  return changements.filter((c) => !c.regle.obsolete || c.nature !== "nouvelle");
}

/** Documents dont le contenu dépend d'une règle (une règle d'interface de vente à distance se décrit aussi dans les CGV). */
export function documentsTouches(regle: Regle): TypeDocument[] {
  if (regle.document === "interface") return regle.domaine === "Vente à distance" ? ["cgv"] : regle.domaine === "Cookies et traceurs" ? ["cookies"] : [];
  return regle.document === "interne" ? [] : [regle.document];
}

/** Pour un compte : chaque changement et les sites suivis qu'il concerne. */
async function concernes(compte: Compte, changements: Changement[]): Promise<{ changement: Changement; domaines: string[] }[]> {
  const profils: { domaine: string; profil: NonNullable<Awaited<ReturnType<typeof chargerAudit>>>["profil"] }[] = [];
  for (const s of compte.sitesSuivis) {
    const id = s.historique.at(-1)?.audit ?? compte.audits?.[s.domaine]?.id;
    const audit = id ? await chargerAudit(id) : null;
    if (audit) profils.push({ domaine: s.domaine, profil: audit.profil });
  }
  return changements
    .filter((c) => !compte.alertesLoi?.includes(c.cle))
    .map((changement) => ({ changement, domaines: profils.filter((p) => conditionsRemplies(changement.regle.conditions, p.profil)).map((p) => p.domaine) }))
    .filter((x) => x.domaines.length);
}

const LIBELLE = { nouvelle: "Nouvelle obligation", modifiee: "Obligation modifiée", "en-application": "Entre en application" } as const;

async function alerter(compte: Compte, liste: { changement: Changement; domaines: string[] }[], documents: DocumentHeberge[]): Promise<void> {
  const origine = origineSite();
  const blocs = liste.map(({ changement: { regle, nature }, domaines }) =>
    [
      `■ ${LIBELLE[nature]}${regle.applicableDepuis ? ` (applicable depuis le ${new Date(regle.applicableDepuis).toLocaleDateString("fr-FR")})` : ""} : ${regle.titre}`,
      regle.exigence,
      `Sources : ${regle.sources.map((s) => `${s.texte}${s.article ? `, ${s.article}` : ""}`).join(" ; ")}`,
      `Vos sites concernés : ${domaines.join(", ")}`,
    ].join("\n"),
  );
  const docs = documents.length
    ? [
        "",
        "Documents hébergés à mettre à jour (la version actuelle reste en ligne tant que vous n'en approuvez pas une nouvelle) :",
        ...documents.map((d) => `- ${titreDocument(d)} de ${d.domaine}`),
        `Générez et approuvez la nouvelle version depuis votre espace : ${origine}/compte`,
      ]
    : [];
  await envoyerEmail({
    a: compte.email,
    objet: liste.length === 1 ? `Droit des sites web : ${liste[0].changement.regle.titre}` : `Droit des sites web : ${liste.length} changements concernent vos sites`,
    texte: ["Bonjour,", "", "Le registre des obligations de Vigie a évolué. Voici ce qui concerne vos sites suivis :", "", blocs.join("\n\n"), ...docs, "", `Votre espace : ${origine}/compte`, "", "L'équipe Vigie"].join("\n"),
  });
}

/** Passe de veille : compare le registre à l'état connu, alerte les abonnés concernés, enregistre le nouvel état. */
export async function passeDeVeille(maintenant = new Date()): Promise<{ changements: number; alertes: number }> {
  const etat = await lireEtat();
  const nouvelEtat: Etat = { algo: ALGO, date: maintenant.toISOString(), empreintes: Object.fromEntries(CATALOGUE.map((r) => [r.id, empreinteRegle(r)])) };
  if (!etat || etat.algo !== ALGO) {
    await ecrireEtat(nouvelEtat);
    return { changements: 0, alertes: 0 };
  }
  const changements = changementsDepuis(etat, CATALOGUE, maintenant);
  if (!changements.length) {
    // La date avance quand même : les entrées en application se mesurent depuis le dernier passage.
    await ecrireEtat(nouvelEtat);
    return { changements: 0, alertes: 0 };
  }

  // Documents hébergés touchés, tous comptes confondus.
  const parType: Partial<Record<TypeDocument, string[]>> = {};
  for (const c of changements) for (const t of documentsTouches(c.regle)) (parType[t] ??= []).push(c.regle.id);
  const marques = await signalerMiseAJour(parType);

  let alertes = 0;
  for (const id of await listerComptes()) {
    const compte = await chargerCompte(id);
    if (!compte || !formule(compte)?.suivi) continue;
    try {
      const liste = await concernes(compte, changements);
      const documents = marques.filter((d) => d.compte === compte.id);
      if (!liste.length && !documents.length) continue;
      await alerter(compte, liste, documents);
      await modifierCompte(compte.id, (c) => void (c.alertesLoi = [...new Set([...(c.alertesLoi ?? []), ...liste.map((x) => x.changement.cle)])].slice(-500)));
      alertes++;
    } catch (e) {
      await signalerErreur("Veille du registre", e, { compte: compte.id });
    }
  }
  await ecrireEtat(nouvelEtat);
  return { changements: changements.length, alertes };
}
