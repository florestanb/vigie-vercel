import type { Metadata } from "next";
import { FenetreExemple } from "@/components/FenetreExemple";
import exemple from "@/lib/demo/audit-exemple.json";
import type { Audit } from "@/lib/types";

export const metadata: Metadata = {
  title: "Exemple de rapport",
  description: "Le rapport complet d'audit légal que Vigie produit, sur une boutique en ligne fictive : constats, preuves, textes de loi et sanctions encourues.",
};

/** Rapport complet d'une boutique fictive (données générées par npm run exemple), présenté dans une fenêtre. */
export default function Page() {
  return (
    <div className="conteneur page-exemple">
      <p className="surtitre">Exemple</p>
      <h1>À quoi ressemble un rapport complet</h1>
      <p className="meta">
        Voici le rapport que vous obtenez après déblocage, ici pour une boutique imaginaire. Parcourez-le dans la fenêtre : cliquez sur chaque point pour voir
        la preuve, le texte de loi et la sanction encourue.
      </p>
      <p style={{ margin: "18px 0 28px" }}>
        <a className="bouton bouton-phare" href="/#audit">
          Auditer mon site gratuitement
        </a>{" "}
        <a className="bouton bouton-ligne" href="/tarifs">
          Voir les offres
        </a>
      </p>
      <FenetreExemple audit={exemple as unknown as Audit} />
    </div>
  );
}
