import { PLANS, type TypeDocument } from "../documents/plans";
import { evaluer, reglesApplicables, verdict } from "../rules/engine";
import type { Audit } from "../types";
import { claude, MODELE, OPTIONS_REPLI } from "./client";

const SYSTEME = `Tu es le rédacteur juridique de Vigie. Tu rédiges, pour un site web précis, un projet de document légal conforme au droit français et au droit de l'Union européenne en vigueur au ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}.

Règles de rédaction :
- Tu suis le plan fourni, dans l'ordre, avec des titres Markdown (## pour les sections). Quand un texte existant est fourni, le plan sert à vérifier que rien ne manque : tu gardes toutes les sections existantes, même celles que le plan ne prévoit pas.
- Quand un modèle officiel est fourni, il prime sur le plan : tu respectes ses formulations et la consigne qui l'accompagne.
- Chaque exigence de la liste fournie doit être couverte. Tu n'ajoutes pas d'obligations inventées.
- Tu ne cites que des articles présents dans la liste des sources fournie. Jamais de numéro d'article de mémoire.
- Tu utilises les faits observés sur le site (services tiers réellement détectés, hébergeur, moyens de paiement…) et les réponses de l'utilisateur. Quand une information manque, tu écris [À COMPLÉTER : description précise] au lieu de l'inventer.
- Tu ne recopies pas les clauses illégales ou abusives du texte existant ; tu peux reprendre ce qui est correct.
- Style : français clair, phrases courtes, vouvoiement du lecteur, aucun jargon inutile. Tableaux Markdown quand ils aident (finalités, cookies).
- Tu ne mets ni préambule ni commentaire hors du document : la réponse est le document, qui commence par un titre de niveau 1.
- Dernière ligne : « Dernière mise à jour : [date du jour] ».`;

/** Texte existant transmis en entier (environ 40 000 mots) : au-delà, la fin serait perdue, et l'interface le signale. */
export const MAX_TEXTE_EXISTANT = 160_000;

export interface DemandeRedaction {
  audit: Audit;
  type: TypeDocument;
  reponses: Record<string, string>;
}

function consignes({ audit, type, reponses }: DemandeRedaction): string {
  const plan = PLANS[type];
  const exigences = reglesApplicables(audit.profil)
    .filter((r) => r.document === type || (type === "cgv" && r.document === "interface" && r.domaine === "Vente à distance"))
    .map((r) => `- ${r.titre} : ${r.exigence}\n  Sources : ${r.sources.map((s) => `${s.texte}${s.article ? `, ${s.article}` : ""}`).join(" ; ")}`)
    .join("\n");
  const existant = audit.crawl.pagesLegales.find((p) => p.type === type);
  // Un document existant se complète : on signale seulement ce qui ne va pas.
  const aCorriger = existant
    ? evaluer(audit.profil, audit.constatsAuto, audit.constatsIA)
        .filter((r) => r.regle.document === type && ["illegal", "flou"].includes(verdict(r)))
        .map((r) => `- ${r.regle.titre}${r.preuve ? ` : ${r.preuve}` : ""}`)
    : [];
  const c = audit.crawl;
  const faits = {
    site: c.urlFinale,
    titre: c.titre,
    profil: audit.profil,
    entreprise: audit.entreprise,
    identiteRelevee: c.identite,
    servicesTiers: [...new Set(c.requetesAvantConsentement.map((r) => r.service ?? r.domaine))],
    cookies: c.cookiesAvantConsentement.map((k) => ({ nom: k.nom, service: k.service, dureeJours: k.expireJours })),
    outilConsentement: c.cmp,
    paiement: c.signaux.paiement,
    plateforme: c.signaux.plateforme,
    formulaires: c.formulaires.map((f) => ({ page: f.page, champs: f.champs })),
  };
  return [
    `<document>${plan.titre}</document>`,
    `<plan>\n${plan.sections.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n</plan>`,
    `<exigences>\n${exigences}\n</exigences>`,
    ...(plan.modeles ?? []).map(blocModele),
    `<faits_observes>\n${JSON.stringify(faits, null, 1)}\n</faits_observes>`,
    `<reponses_utilisateur>\n${JSON.stringify(reponses, null, 1)}\n</reponses_utilisateur>`,
    existant
      ? `<consigne>Le site a déjà ce document. Conserve-le EN ENTIER :
- chaque section, clause, information et coordonnée existante est reprise, y compris ce que le plan ne prévoit pas (sous son titre d'origine, à l'endroit le plus logique) ;
- un passage correct est recopié mot pour mot, sans reformulation ni résumé ;
- tu ne retires que ce qui est illégal ou obsolète (clause abusive, lien vers la plateforme RLL fermée…), en le remplaçant par la version conforme ;
- tu ajoutes ce qui manque, dans la section qui convient.
Le client comparera ton texte à l'original : tout passage disparu sans raison est une erreur.${aCorriger.length ? `\nPoints relevés par l'audit :\n${aCorriger.join("\n")}` : ""}</consigne>`
      : "",
    existant ? `<texte_existant url="${existant.url}">\n${existant.texte.slice(0, MAX_TEXTE_EXISTANT)}\n</texte_existant>` : "<texte_existant>aucun</texte_existant>",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function blocModele(m: NonNullable<(typeof PLANS)[TypeDocument]["modeles"]>[number]): string {
  const ou = m.section ? `la section « ${m.section} »` : "le document";
  const consigne = m.obligatoire
    ? `Texte officiel imposé pour ${ou} : reproduis-le mot pour mot, dans le même ordre. Remplace seulement les passages entre crochets (par les faits connus, ou par [À COMPLÉTER : …]) et, s'il y a des appels numérotés comme (1), remplace chacun par le passage que ses instructions prévoient pour ce site, ou supprime-le si aucun cas ne s'applique. Les instructions elles-mêmes ne figurent pas dans le document.${m.section ? " Tu peux ajouter après le texte officiel ce que le plan prévoit d'autre pour cette section (exceptions…)." : " N'ajoute aucune section."}`
    : `Exemple publié par l'autorité : rédige ${ou} en le suivant au plus près, en remplaçant les crochets et en ne gardant que les mentions qui s'appliquent au site.`;
  return `<modele_officiel source="${m.source}" url="${m.url}">\n${consigne}${m.consigne ? `\n${m.consigne}` : ""}\n\n${m.texte}\n</modele_officiel>`;
}

/** Rédaction en flux : le texte arrive au fur et à mesure dans l'interface. */
export function redigerEnFlux(demande: DemandeRedaction) {
  return claude().beta.messages.stream({
    model: MODELE,
    max_tokens: 64000,
    ...OPTIONS_REPLI,
    output_config: { effort: "medium" },
    system: [{ type: "text", text: SYSTEME }],
    messages: [{ role: "user", content: consignes(demande) }],
  });
}

export function controlerDocument(type: TypeDocument, texte: string): { libelle: string; ok: boolean }[] {
  const controles = PLANS[type].controles.map((c) => ({ libelle: c.libelle, ok: c.motif.test(texte) }));
  const aCompleter = (texte.match(/\[À COMPLÉTER/g) ?? []).length;
  controles.push({ libelle: aCompleter ? `${aCompleter} information(s) à compléter` : "Aucune information manquante", ok: aCompleter === 0 });
  return controles;
}
