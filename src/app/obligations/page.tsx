import type { Metadata } from "next";
import { ACTIVITES, obligationsDe } from "@/lib/activites";

export const metadata: Metadata = {
  title: "Obligations légales par activité",
  description: "Les obligations légales d'un site web selon votre activité : boutique en ligne, site vitrine, SaaS, place de marché, alcool, immobilier, formation, BTP.",
};

export default function Page() {
  return (
    <div className="conteneur page-texte">
      <p className="surtitre">Par activité</p>
      <h1 style={{ marginTop: 16 }}>Ce que la loi impose à votre site</h1>
      <p className="meta" style={{ maxWidth: "62ch" }}>Choisissez votre activité : la liste des obligations qui s&apos;appliquent, avec les textes et les sanctions encourues.</p>
      <div className="activites">
        {ACTIVITES.map((a) => (
          <a key={a.slug} className="carte activite" href={`/obligations/${a.slug}`}>
            <strong>{a.nom}</strong>
            <span>{obligationsDe(a).length} obligations</span>
          </a>
        ))}
      </div>
    </div>
  );
}
