import { CONSTATS_OFFERTS } from "../offres";
import { calculerScore, evaluer } from "../rules/engine";
import type { Audit, ResultatRegle } from "../types";

/** Identité de l'expéditeur : obligatoire dans un message de prospection (LCEN art. 20, CPCE art. L34-5). */
export interface Expediteur {
  nom: string;
  societe: string;
  email: string;
  telephone?: string;
  /** Adresse publique de Vigie, pour donner le lien du rapport complet. */
  urlPublique?: string;
}

export interface Mail {
  destinataire: string | null;
  objet: string;
  texte: string;
  html: string;
}

const A_COMPLETER = (quoi: string) => `[À COMPLÉTER : ${quoi}]`;

export function expediteurDepuisEnv(env: NodeJS.ProcessEnv = process.env): Expediteur {
  return {
    nom: env.VIGIE_EXPEDITEUR_NOM?.trim() || A_COMPLETER("votre nom"),
    societe: env.VIGIE_EXPEDITEUR_SOCIETE?.trim() || A_COMPLETER("raison sociale et SIREN"),
    email: env.VIGIE_EXPEDITEUR_EMAIL?.trim() || A_COMPLETER("adresse e-mail de réponse"),
    telephone: env.VIGIE_EXPEDITEUR_TEL?.trim() || undefined,
    urlPublique: env.VIGIE_URL_PUBLIQUE?.trim().replace(/\/$/, "") || undefined,
  };
}


const COULEURS = {
  encre: "#0a0a0a",
  fond: "#fafafa",
  lien: "#4338ca",
  marque: "#4338ca",
  manquant: "#dc2626",
  incomplet: "#d97706",
  conforme: "#16a34a",
  gris: "#737373",
  filet: "#e5e5e5",
};

const echapper = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const domaine = (url: string) => new URL(url).hostname.replace(/^www\./, "");
const dateFr = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const pluriel = (n: number, mot: string, pl = mot + "s") => `${n} ${n > 1 ? pl : mot}`;
const couleurNote = (n: number) => (n >= 75 ? COULEURS.conforme : n >= 50 ? COULEURS.incomplet : COULEURS.manquant);
const reference = (r: ResultatRegle) => {
  const s = r.regle.sources[0];
  return s ? { libelle: [s.texte, s.article].filter(Boolean).join(", "), url: s.url } : null;
};

/**
 * Mail de premier contact : uniquement des faits vérifiables (ce qui a été constaté, le texte qui l'impose,
 * la sanction qu'il prévoit), l'offre, et ce que la loi exige d'un message de prospection
 * (identité de l'expéditeur, origine de l'adresse, moyen simple de s'opposer).
 */
export function redigerMail(audit: Audit, constats: ResultatRegle[], dest: string | null, exp: Expediteur): Mail {
  const site = domaine(audit.url);
  const note = calculerScore(evaluer(audit.profil, audit.constatsAuto, audit.constatsIA)).note;
  const montres = constats.slice(0, CONSTATS_OFFERTS);
  const reste = constats.length - montres.length;
  const lienRapport = exp.urlPublique ? `${exp.urlPublique}/audit/${audit.id}` : null;

  const objet = `${site} : ${pluriel(constats.length, "obligation légale non respectée", "obligations légales non respectées")} sur votre site`;

  const intro = `Nous avons analysé ${site} le ${dateFr(audit.date)} avec Vigie, notre outil d'audit légal des sites web. Il a relevé ${pluriel(constats.length, "point")} où une obligation légale n'est pas respectée. Chacun est constaté directement sur votre site, avec le texte qui l'impose.`;
  const risque =
    "Ces manquements peuvent être relevés lors d'un contrôle de la DGCCRF ou de la CNIL, ou invoqués par un client en cas de litige. Les sanctions indiquées sont les maximums prévus par les textes.";
  const offre = `Vigie peut vous remettre le rapport complet et générer automatiquement des modèles de documents adaptés à votre site (mentions légales, politique de confidentialité, gestion des cookies, CGV…), que vous relisez et validez avant publication. Si cela vous intéresse, répondez simplement à ce message.`;
  const signature = [exp.nom, exp.societe, exp.email, exp.telephone].filter(Boolean) as string[];
  const mentions = `Nous avons trouvé votre adresse sur ${site}, où elle est publiée. Elle ne sert qu'à vous proposer nos services et n'est ni vendue ni cédée. Pour ne plus être contacté, répondez « STOP » : c'est immédiat.${exp.urlPublique ? ` Vos données et vos droits : ${exp.urlPublique}/confidentialite.` : ""} Ce constat automatique ne constitue pas un avis juridique.`;

  // ---------- Version texte ----------
  const texte = [
    "Bonjour,",
    "",
    intro,
    "",
    `Note de conformité de ${site} : ${note}/100`,
    "",
    ...montres.flatMap((r, i) => {
      const ref = reference(r);
      return [
        `${i + 1}. ${r.regle.titre}`,
        r.preuve ? `   Constaté : ${r.preuve}` : null,
        ref ? `   Texte : ${ref.libelle} (${ref.url})` : null,
        r.regle.sanction ? `   Sanction : ${r.regle.sanction}` : null,
        "",
      ].filter((l): l is string => l !== null);
    }),
    ...(reste > 0 ? [`… et ${pluriel(reste, "autre point", "autres points")} dans le rapport complet.`, ""] : []),
    risque,
    "",
    offre,
    ...(lienRapport ? ["", `Rapport complet : ${lienRapport}`] : []),
    "",
    "Cordialement,",
    ...signature,
    "",
    "—",
    mentions,
  ].join("\n");

  // ---------- Version HTML (tableaux et styles en ligne : seule mise en forme fiable dans les messageries) ----------
  const c = COULEURS;
  const police = "font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;";
  const titre = police + "letter-spacing:-.02em;";
  const p = (t: string, style = "") => `<p style="margin:0 0 16px;${police}font-size:15px;line-height:1.55;color:${c.encre};${style}">${t}</p>`;

  const jauge = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;border:1px solid ${c.filet};border-radius:12px;">
  <tr><td style="padding:18px 20px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="${police}font-size:13px;color:${c.gris};text-transform:uppercase;letter-spacing:.06em;">Note de conformité · ${echapper(site)}</td>
      <td align="right" style="${titre}font-size:30px;font-weight:600;color:${couleurNote(note)};">${note}<span style="font-size:15px;color:${c.gris};">/100</span></td>
    </tr></table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;border-radius:4px;overflow:hidden;"><tr>
      ${note > 0 ? `<td width="${note}%" style="height:10px;background:${couleurNote(note)};font-size:0;line-height:0;">&nbsp;</td>` : ""}
      ${note < 100 ? `<td width="${100 - note}%" style="height:10px;background:${c.filet};font-size:0;line-height:0;">&nbsp;</td>` : ""}
    </tr></table>
    <p style="margin:12px 0 0;${police}font-size:14px;color:${c.encre};"><strong style="color:${c.manquant};">${pluriel(constats.length, "manquement certain", "manquements certains")}</strong> à la loi relevé${constats.length > 1 ? "s" : ""} automatiquement</p>
  </td></tr>
</table>`;

  const carte = (r: ResultatRegle) => {
    const ref = reference(r);
    const ligne = (libelle: string, valeur: string) =>
      `<tr><td valign="top" style="padding:3px 10px 3px 0;${police}font-size:12px;color:${c.gris};text-transform:uppercase;letter-spacing:.04em;white-space:nowrap;">${libelle}</td><td style="padding:3px 0;${police}font-size:14px;line-height:1.5;color:${c.encre};">${valeur}</td></tr>`;
    return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px;border:1px solid ${c.filet};border-radius:12px;">
  <tr><td style="padding:14px 16px;">
    <p style="margin:0 0 8px;${police}font-size:15px;font-weight:bold;color:${c.encre};">
      <span style="display:inline-block;padding:2px 8px;margin-right:6px;border-radius:99px;background:#fef2f2;color:${c.manquant};font-size:11px;letter-spacing:.05em;text-transform:uppercase;vertical-align:1px;">Manquement</span>${echapper(r.regle.titre)}
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0">
      ${r.preuve ? ligne("Constaté", echapper(r.preuve)) : ""}
      ${ref ? ligne("Texte", `<a href="${echapper(ref.url)}" style="color:${c.lien};">${echapper(ref.libelle)}</a>`) : ""}
      ${r.regle.sanction ? ligne("Sanction", `<strong>${echapper(r.regle.sanction)}</strong>`) : ""}
    </table>
  </td></tr>
</table>`;
  };

  const bouton = lienRapport
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;"><tr><td style="background:${c.marque};border-radius:99px;"><a href="${echapper(lienRapport)}" style="display:inline-block;padding:12px 22px;${police}font-size:15px;font-weight:bold;color:#fff;text-decoration:none;">Voir le rapport complet</a></td></tr></table>`
    : "";

  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${echapper(objet)}</title></head>
<body style="margin:0;padding:0;background:#ffffff;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <tr><td>
    ${p("Bonjour,")}
    ${p(echapper(intro))}
    ${jauge}
    ${montres.map(carte).join("")}
    ${reste > 0 ? p(`… et ${pluriel(reste, "autre point", "autres points")} dans le rapport complet.`, `color:${c.gris};`) : ""}
    ${p(echapper(risque))}
    ${p(echapper(offre))}
    ${bouton}
    ${p(`Cordialement,<br>${signature.map(echapper).join("<br>")}`)}
    <p style="margin:28px 0 0;padding-top:14px;border-top:1px solid ${c.filet};${police}font-size:12px;line-height:1.5;color:${c.gris};">${echapper(mentions)}</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

  return { destinataire: dest, objet, texte, html };
}

/**
 * Brouillon au format .eml : un double-clic l'ouvre dans Mail ou Outlook, prêt à relire et envoyer
 * (l'en-tête X-Unsent le marque comme non envoyé).
 */
export function brouillonEml(mail: Mail, exp: Expediteur): string {
  const frontiere = "vigie-" + Math.random().toString(36).slice(2);
  const b64 = (s: string) => Buffer.from(s, "utf8").toString("base64").replace(/.{76}/g, "$&\r\n");
  const enTete = (s: string) => `=?UTF-8?B?${Buffer.from(s, "utf8").toString("base64")}?=`;
  const de = exp.email.startsWith("[") ? "" : `From: ${enTete(`${exp.nom} (${exp.societe})`)} <${exp.email}>\r\n`;
  return (
    de +
    (mail.destinataire ? `To: ${mail.destinataire}\r\n` : "") +
    `Subject: ${enTete(mail.objet)}\r\n` +
    "X-Unsent: 1\r\n" +
    "MIME-Version: 1.0\r\n" +
    `Content-Type: multipart/alternative; boundary="${frontiere}"\r\n\r\n` +
    `--${frontiere}\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: base64\r\n\r\n${b64(mail.texte)}\r\n` +
    `--${frontiere}\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: base64\r\n\r\n${b64(mail.html)}\r\n` +
    `--${frontiere}--\r\n`
  );
}
