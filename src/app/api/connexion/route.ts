import { emailValide, normaliserEmail } from "@/lib/comptes";
import { envoyerEmail } from "@/lib/email";
import { autoriser, ipDe } from "@/lib/limite";
import { origineDe } from "@/lib/origine";
import { creerJetonConnexion } from "@/lib/session";
import { signalerErreur } from "@/lib/journal";

export const runtime = "nodejs";

/** Envoie un lien de connexion. La réponse est la même que l'adresse ait un compte ou non. */
export async function POST(req: Request) {
  const { email } = (await req.json().catch(() => ({}))) as { email?: string };
  if (typeof email !== "string" || !emailValide(email)) return Response.json({ erreur: "Adresse e-mail invalide." }, { status: 400 });
  if (!autoriser("connexion-client:" + ipDe(req), 5, 15 * 60_000) || !autoriser("connexion-email:" + normaliserEmail(email), 3, 15 * 60_000))
    return Response.json({ erreur: "Trop de demandes. Réessayez dans quelques minutes." }, { status: 429 });
  const lien = `${origineDe(req)}/api/connexion/lien?jeton=${await creerJetonConnexion(normaliserEmail(email))}`;
  try {
    await envoyerEmail({
      a: email,
      objet: "Votre lien de connexion à Vigie",
      texte: `Bonjour,\n\nPour vous connecter à Vigie, ouvrez ce lien (valable 30 minutes, utilisable une fois) :\n\n${lien}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez ce message.\n\nVigie`,
    });
  } catch (e) {
    await signalerErreur("Connexion par e-mail", e);
    return Response.json({ erreur: "L'e-mail n'a pas pu être envoyé. Réessayez plus tard." }, { status: 500 });
  }
  return Response.json({ ok: true });
}
