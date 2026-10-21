import type { Metadata } from "next";
import { ConnexionAdmin } from "@/components/ConnexionAdmin";
import { Prospection } from "@/components/Prospection";
import { adminConfigure, estAdmin } from "@/lib/admin";
import { expediteurDepuisEnv } from "@/lib/prospection/mail";

export const metadata: Metadata = { title: "Prospection", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const VARIABLES = { nom: "VIGIE_EXPEDITEUR_NOM", societe: "VIGIE_EXPEDITEUR_SOCIETE", email: "VIGIE_EXPEDITEUR_EMAIL" } as const;

export default async function Page() {
  if (!adminConfigure()) {
    return (
      <div className="etroit page-texte">
        <h1>Prospection</h1>
        <p className="avertissement">
          Cet espace est désactivé. Pour l&apos;ouvrir, ajoutez dans <code>.env.local</code> un mot de passe d&apos;au moins 12 caractères :{" "}
          <code>VIGIE_ADMIN_MOTDEPASSE=…</code>, puis relancez le serveur.
        </p>
      </div>
    );
  }
  if (!(await estAdmin())) return <ConnexionAdmin />;
  const exp = expediteurDepuisEnv();
  const incomplet = (Object.keys(VARIABLES) as (keyof typeof VARIABLES)[]).filter((k) => exp[k].startsWith("[À COMPLÉTER")).map((k) => VARIABLES[k]);
  return <Prospection expediteurIncomplet={incomplet} />;
}
