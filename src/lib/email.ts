/**
 * Envoi des e-mails transactionnels (lien de connexion, alertes de suivi) par l'API de Resend.
 * Sans RESEND_API_KEY, en développement, le message est écrit dans la console du serveur.
 */
export interface Email {
  a: string;
  objet: string;
  texte: string;
}

export const emailConfigure = () => Boolean(process.env.RESEND_API_KEY?.trim() && process.env.VIGIE_EMAIL_EXPEDITEUR?.trim());

export async function envoyerEmail(m: Email): Promise<void> {
  if (!emailConfigure()) {
    if (process.env.NODE_ENV === "production") throw new Error("L'envoi d'e-mails n'est pas configuré (RESEND_API_KEY, VIGIE_EMAIL_EXPEDITEUR).");
    console.log(`\n[e-mail non envoyé, mode développement] À : ${m.a}\nObjet : ${m.objet}\n\n${m.texte}\n`);
    return;
  }
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ from: process.env.VIGIE_EMAIL_EXPEDITEUR, to: [m.a], subject: m.objet, text: m.texte }),
  });
  if (!r.ok) throw new Error(`Envoi de l'e-mail impossible (${r.status}).`);
}
