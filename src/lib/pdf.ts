import { chromium } from "playwright-core";
import { cheminChromium } from "./crawler/crawler";
import type { Marque } from "./comptes";
import type { Point } from "./historique";
import { calculerScore, evaluer, trier, verdict, enAttenteDeValidation } from "./rules/engine";
import type { Audit, ResultatRegle, Verdict } from "./types";

/**
 * Rapport complet en PDF, à transmettre (associé, agence, développeur). Le HTML est construit ici,
 * puis imprimé par un Chromium hors ligne et sans JavaScript : il n'a rien à charger.
 */

const e = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const dateLongue = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

const SECTIONS: { v: Verdict; titre: string; intro: string }[] = [
  { v: "illegal", titre: "Illégal", intro: "Une obligation écrite dans la loi n'est pas respectée, et l'audit l'a constaté avec certitude." },
  { v: "flou", titre: "Zone de flou", intro: "Exigence qui dépend d'une interprétation, ou constat tiré d'un indice : risque réel, mais pas tranché." },
  { v: "recommande", titre: "Recommandé", intro: "Bonne pratique ou mention obsolète à retirer, sans sanction directe." },
];

function constat(r: ResultatRegle): string {
  const sources = r.regle.sources.map((s) => `${e(s.texte)}${s.article ? `, ${e(s.article)}` : ""}`).join(" · ");
  return `<div class="constat">
    <div class="tete"><h3>${e(r.regle.titre)}</h3>${r.regle.risque ? `<span class="risque">${e(r.regle.risque.libelle)}</span>` : ""}</div>
    ${r.preuve ? `<p><b>Constaté :</b> ${e(r.preuve)}</p>` : ""}
    <p><b>Ce que dit le texte :</b> ${e(r.regle.exigence)}</p>
    ${r.regle.sanction ? `<p><b>Sanction encourue :</b> ${e(r.regle.sanction)}</p>` : ""}
    ${r.regle.nuance ? `<p class="nuance">${e(r.regle.nuance)}</p>` : ""}
    ${enAttenteDeValidation(r) ? `<p class="nuance">Obligation légale et manquement constaté ; règle du registre en attente de validation juridique, d'où son classement en zone de flou.</p>` : ""}
    <p class="sources">${sources}</p>
  </div>`;
}

/** En-tête du document : la marque de l'agence (marque blanche) ou Vigie. */
function entete(surtitre: string, marque?: Marque | null): string {
  if (!marque) return `<p class="meta">${e(surtitre)} Vigie</p>`;
  return `<div class="marque">${marque.logo ? `<img src="${e(marque.logo)}" alt="">` : ""}<span>${e(marque.nom)}</span></div><p class="meta">${e(surtitre)}</p>`;
}

const STYLE_MARQUE = (m?: Marque | null) => `
  .marque { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; font-weight: 700; font-size: 12pt; color: ${m?.couleur ?? "#0a0a0a"}; }
  .marque img { max-height: 36px; max-width: 160px; }
  .captures { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .captures figure { margin: 0; break-inside: avoid; border: 1px solid #e8e8ea; border-radius: 8px; overflow: hidden; }
  .captures img { width: 100%; display: block; } .captures figcaption { font-size: 8.5pt; color: #52525b; padding: 6px 8px; }`;

/** Captures d'écran prises pendant l'audit, en preuve visuelle. */
export function blocCaptures(audit: Audit, images: Record<string, Buffer>): string {
  const presentes = (audit.crawl.captures ?? []).filter((c) => images[c.nom]);
  if (!presentes.length) return "";
  return `<h2>Preuves visuelles</h2><p class="intro">Captures d'écran prises par le navigateur d'audit, à la date et l'heure indiquées.</p><div class="captures">${presentes
    .map(
      (c) =>
        `<figure><img src="data:image/jpeg;base64,${images[c.nom].toString("base64")}" alt=""><figcaption>${e(c.legende)} · ${new Date(c.date).toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}</figcaption></figure>`,
    )
    .join("")}</div>`;
}

export interface OptionsRapport {
  evolution?: { avant: Point; apres: Point } | null;
  marque?: Marque | null;
  captures?: Record<string, Buffer>;
}

export function rapportHtml(audit: Audit, { evolution, marque, captures = {} }: OptionsRapport = {}): string {
  const resultats = trier(evaluer(audit.profil, audit.constatsAuto, audit.constatsIA));
  const score = calculerScore(resultats);
  const site = new URL(audit.url).hostname.replace(/^www\./, "");
  const parVerdict = (v: Verdict) => resultats.filter((r) => verdict(r) === v);
  const aVerifier = parVerdict("a-verifier");
  const couleur = score.note >= 80 ? "#15803d" : score.note >= 50 ? "#b45309" : "#dc2626";

  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Rapport${marque ? "" : " Vigie"} · ${e(site)}</title>
<style>
  @page { size: A4; margin: 18mm 16mm 20mm; }
  body { font: 10.5pt/1.5 -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; color: #0a0a0a; margin: 0; }
  h1 { font-size: 22pt; letter-spacing: -0.02em; margin: 0 0 4px; }
  h2 { font-size: 14pt; margin: 22px 0 6px; padding-bottom: 4px; border-bottom: 2px solid #e8e8ea; }
  h3 { font-size: 11pt; margin: 0; }
  .meta { color: #52525b; font-size: 9.5pt; }
  .entete { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }
  .note { text-align: center; border: 3px solid ${couleur}; border-radius: 50%; width: 84px; height: 84px; display: flex; flex-direction: column; justify-content: center; flex: none; }
  .note b { font-size: 24pt; line-height: 1; color: ${couleur}; } .note span { font-size: 7.5pt; color: #52525b; text-transform: uppercase; }
  .chiffres { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
  .chiffres span { font-size: 9pt; font-weight: 600; padding: 2px 9px; border-radius: 99px; background: #f4f4f5; }
  .chiffres .illegal { background: #fef2f2; color: #dc2626; } .chiffres .flou { background: #fffbeb; color: #b45309; }
  .evolution { margin-top: 12px; padding: 8px 12px; border-radius: 8px; background: #f0fdf4; font-size: 9.5pt; }
  .intro { color: #52525b; font-size: 9.5pt; margin: 0 0 8px; }
  .constat { border: 1px solid #e8e8ea; border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; break-inside: avoid; }
  .constat p { margin: 5px 0 0; } .tete { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; }
  .risque { font-size: 8.5pt; font-weight: 700; color: #dc2626; background: #fef2f2; border-radius: 6px; padding: 2px 7px; white-space: nowrap; }
  .nuance { color: #52525b; font-style: italic; } .sources { color: #52525b; font-size: 8.5pt; font-family: ui-monospace, Menlo, monospace; }
  ul.liste { margin: 0; padding-left: 18px; font-size: 9.5pt; columns: 2; }
  .pied { margin-top: 24px; padding-top: 8px; border-top: 1px solid #e8e8ea; color: #52525b; font-size: 8.5pt; }
  ${STYLE_MARQUE(marque)}
</style></head><body>
<div class="entete">
  <div>
    ${entete("Rapport d'audit", marque)}
    <h1>${e(site)}</h1>
    <p class="meta">${e(audit.url)} · analysé le ${dateLongue(audit.date)}${audit.entreprise ? ` · ${e(audit.entreprise.nom)} (SIREN ${e(audit.entreprise.siren)})` : ""} · ${audit.crawl.pagesVisitees.length} pages lues</p>
    <div class="chiffres">
      <span class="illegal">${score.illegaux} ${score.illegaux > 1 ? "illégaux" : "illégal"}</span>
      <span class="flou">${score.flous} en zone de flou</span>
      <span>${score.recommandes} recommandation${score.recommandes > 1 ? "s" : ""}</span>
      <span>${score.conformes} conforme${score.conformes > 1 ? "s" : ""}</span>
    </div>
  </div>
  <div class="note"><b>${score.note}</b><span>sur 100</span></div>
</div>
${
  evolution
    ? `<p class="evolution">Depuis l'audit du ${dateLongue(evolution.avant.date)} : note ${evolution.avant.note} → <b>${evolution.apres.note}</b>, problèmes illégaux ${evolution.avant.illegaux} → <b>${evolution.apres.illegaux}</b>, zones de flou ${evolution.avant.flous} → <b>${evolution.apres.flous}</b>.</p>`
    : ""
}
${audit.resumeIA ? `<p>${e(audit.resumeIA)}</p>` : ""}
${SECTIONS.map(({ v, titre, intro }) => {
  const rs = parVerdict(v);
  return rs.length ? `<h2>${titre} (${rs.length})</h2><p class="intro">${intro}</p>${rs.map(constat).join("")}` : "";
}).join("")}
${blocCaptures(audit, captures)}
${aVerifier.length ? `<h2>À vérifier (${aVerifier.length})</h2><p class="intro">L'audit ne peut pas le voir depuis le site public : à contrôler par vous.</p><ul class="liste">${aVerifier.map((r) => `<li>${e(r.regle.titre)}</li>`).join("")}</ul>` : ""}
<p class="pied">${marque ? `Rapport établi par ${e(marque.nom)}${marque.contact ? ` (${e(marque.contact)})` : ""}, produit automatiquement par un logiciel d'aide à la conformité` : "Rapport produit automatiquement par Vigie, logiciel d'aide à la conformité"}, à partir des pages publiques du site à la date indiquée. Il ne constitue pas un avis juridique. Les sanctions indiquées sont les maximums prévus par les textes.</p>
</body></html>`;
}

export async function rapportPdf(audit: Audit, options: OptionsRapport = {}): Promise<Buffer> {
  return imprimer(rapportHtml(audit, options), `${options.marque ? e(options.marque.nom) : "Vigie"} · ${e(new URL(audit.url).hostname)}`);
}

/** Imprime un document HTML autonome dans un Chromium hors ligne et sans JavaScript. */
export async function imprimer(html: string, pied: string): Promise<Buffer> {
  const navigateur = await chromium.launch({ executablePath: cheminChromium(), headless: true, args: ["--no-sandbox"] });
  try {
    const contexte = await navigateur.newContext({ javaScriptEnabled: false, offline: true });
    const page = await contexte.newPage();
    await page.setContent(html, { waitUntil: "load" });
    return await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate: `<div style="font-size:8px;color:#71717a;width:100%;text-align:center;">${pied} · page <span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
      margin: { top: "18mm", bottom: "20mm", left: "16mm", right: "16mm" },
    });
  } finally {
    await navigateur.close();
  }
}
