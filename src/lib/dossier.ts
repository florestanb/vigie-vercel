import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { chargerAudit, lireCaptures, type Approbation } from "./audit";
import type { Marque } from "./comptes";
import { DOSSIER_AUDITS, RACINE_DONNEES } from "./donnees";
import { PLANS, type TypeDocument } from "./documents/plans";
import type { DocumentHeberge } from "./documents-heberges";
import { historique } from "./historique";
import { blocCaptures, imprimer } from "./pdf";
import { DERNIERE_MISE_A_JOUR } from "./rules/catalogue";
import { evaluer, trier, verdict } from "./rules/engine";

/**
 * Dossier de preuve d'un site : de quoi montrer, lors d'un contrôle de la CNIL ou de la DGCCRF, ou face à
 * un client, la démarche de mise en conformité dans le temps. Chaque audit y figure avec l'empreinte SHA-256
 * du fichier enregistré par Vigie, chaque document avec la date et l'empreinte du texte approuvé.
 */

const e = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const date = (iso: string) => new Date(iso).toLocaleString("fr-FR", { timeZone: "Europe/Paris", dateStyle: "long", timeStyle: "short" });
const titreDoc = (t: string) => PLANS[t as TypeDocument]?.titre ?? t;

async function empreinteFichier(id: string): Promise<string | null> {
  const contenu = await fs.readFile(path.join(DOSSIER_AUDITS, `${id}.json`)).catch(() => null);
  return contenu ? crypto.createHash("sha256").update(contenu).digest("hex") : null;
}

async function approbations(id: string): Promise<(Approbation & { audit: string })[]> {
  const brut = await fs.readFile(path.join(RACINE_DONNEES, "approbations", `${id}.jsonl`), "utf8").catch(() => "");
  return brut
    .split("\n")
    .filter(Boolean)
    .flatMap((l) => {
      try {
        return [{ ...(JSON.parse(l) as Approbation), audit: id }];
      } catch {
        return [];
      }
    });
}

export async function dossierHtml(domaine: string, documents: DocumentHeberge[], marque?: Marque | null): Promise<string> {
  const points = await historique(`https://${domaine}`);
  if (!points.length) throw new Error("Aucun audit de ce site.");
  const lignes = await Promise.all(points.map(async (p) => ({ ...p, empreinte: await empreinteFichier(p.id) })));
  const dernier = await chargerAudit(points.at(-1)!.id);
  if (!dernier) throw new Error("Dernier audit introuvable.");
  const captures = await lireCaptures(dernier);
  const resultats = trier(evaluer(dernier.profil, dernier.constatsAuto, dernier.constatsIA));
  const ouverts = resultats.filter((r) => ["illegal", "flou"].includes(verdict(r)));
  const approuves = (await Promise.all(points.map((p) => approbations(p.id)))).flat().sort((a, b) => a.date.localeCompare(b.date));
  const genere = new Date().toISOString();

  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Dossier de conformité · ${e(domaine)}</title><style>
  @page { size: A4; margin: 18mm 16mm 20mm; }
  body { font: 10pt/1.5 -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; color: #0a0a0a; margin: 0; }
  h1 { font-size: 21pt; margin: 0 0 4px; } h2 { font-size: 13pt; margin: 22px 0 6px; padding-bottom: 4px; border-bottom: 2px solid #e8e8ea; }
  .meta, .intro { color: #52525b; font-size: 9pt; } table { width: 100%; border-collapse: collapse; font-size: 8.5pt; }
  th, td { text-align: left; padding: 5px 6px; border-bottom: 1px solid #e8e8ea; vertical-align: top; } th { color: #52525b; font-weight: 600; }
  .hash { font-family: ui-monospace, Menlo, monospace; font-size: 7pt; word-break: break-all; color: #52525b; }
  .marque { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 12pt; color: ${marque?.couleur ?? "#0a0a0a"}; } .marque img { max-height: 36px; max-width: 160px; }
  .captures { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; } .captures figure { margin: 0; break-inside: avoid; border: 1px solid #e8e8ea; border-radius: 8px; overflow: hidden; }
  .captures img { width: 100%; display: block; } .captures figcaption { font-size: 8pt; color: #52525b; padding: 6px 8px; }
  ul { padding-left: 18px; } li { margin-bottom: 4px; }
</style></head><body>
${marque ? `<div class="marque">${marque.logo ? `<img src="${e(marque.logo)}" alt="">` : ""}<span>${e(marque.nom)}</span></div>` : `<p class="meta">Vigie</p>`}
<h1>Dossier de conformité · ${e(domaine)}</h1>
<p class="meta">Établi le ${date(genere)}${dernier.entreprise ? ` · ${e(dernier.entreprise.nom)} (SIREN ${e(dernier.entreprise.siren)})` : ""} · registre des obligations du ${new Date(DERNIERE_MISE_A_JOUR).toLocaleDateString("fr-FR")}</p>

<h2>1. Historique des audits</h2>
<p class="intro">Chaque audit lit les pages publiques du site dans un navigateur, à la date indiquée. L'empreinte SHA-256 est celle du fichier d'audit conservé : elle permet de vérifier qu'il n'a pas été modifié depuis.</p>
<table><tr><th>Date</th><th>Note</th><th>Illégal</th><th>Zone de flou</th><th>Empreinte du fichier d'audit</th></tr>
${lignes.map((l) => `<tr><td>${date(l.date)}</td><td>${l.note}/100</td><td>${l.illegaux}</td><td>${l.flous}</td><td class="hash">${e(l.empreinte ?? "fichier supprimé (durée de conservation)")}</td></tr>`).join("")}
</table>

<h2>2. État au dernier audit (${date(dernier.date)})</h2>
${ouverts.length ? `<ul>${ouverts.map((r) => `<li><b>${verdict(r) === "illegal" ? "Illégal" : "Zone de flou"} · ${e(r.regle.titre)}</b>${r.preuve ? ` : ${e(r.preuve)}` : ""}</li>`).join("")}</ul>` : "<p>Aucun manquement certain ni zone de flou relevé par les contrôles.</p>"}

${blocCaptures(dernier, captures).replace("<h2>Preuves visuelles</h2>", "<h2>3. Preuves visuelles</h2>")}

<h2>4. Documents approuvés</h2>
<p class="intro">Chaque modèle de document a été relu et approuvé par l'éditeur du site avant toute utilisation. L'empreinte est celle du texte exact approuvé.</p>
${approuves.length ? `<table><tr><th>Date d'approbation</th><th>Document</th><th>Empreinte du texte</th></tr>${approuves.map((a) => `<tr><td>${date(a.date)}</td><td>${e(titreDoc(a.type))}</td><td class="hash">${e(a.empreinte)}</td></tr>`).join("")}</table>` : "<p>Aucun document approuvé à ce jour.</p>"}
${
  documents.length
    ? `<h2>5. Documents hébergés et leurs versions</h2><table><tr><th>Document</th><th>Version</th><th>Approuvée le</th><th>Registre</th><th>Empreinte</th></tr>${documents
        .flatMap((d) => [...d.historique.map((v) => ({ d, v, actuelle: false })), { d, v: d.version, actuelle: true }])
        .map(({ d, v, actuelle }) => `<tr><td>${e(titreDoc(d.type))}</td><td>${actuelle ? "en ligne" : "remplacée"}</td><td>${date(v.approuve)}</td><td>${new Date(v.registre).toLocaleDateString("fr-FR")}</td><td class="hash">${e(v.empreinte)}</td></tr>`)
        .join("")}</table>`
    : ""
}

<h2>${documents.length ? 6 : 5}. Méthode et limites</h2>
<ul>
<li>Les contrôles automatiques portent sur ce qu'un internaute voit et ce que son navigateur reçoit : pages légales, mentions, formulaires, cookies et services tiers chargés avant tout choix, puis après un clic sur « Tout refuser », tunnel de commande jusqu'à la page de paiement exclue (rien n'est commandé), tests d'accessibilité automatiques.</li>
<li>L'espace client, les documents internes (registre des traitements, contrats) et les pratiques hors ligne ne sont pas visibles : les points correspondants sont à documenter par l'éditeur.</li>
<li>Ce dossier retrace une démarche ; il ne constitue ni un avis juridique ni une attestation de conformité.</li>
</ul>
</body></html>`;
}

export async function dossierPdf(domaine: string, documents: DocumentHeberge[], marque?: Marque | null): Promise<Buffer> {
  return imprimer(await dossierHtml(domaine, documents, marque), `${marque ? e(marque.nom) : "Vigie"} · dossier de conformité · ${e(domaine)}`);
}
