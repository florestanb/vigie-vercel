"use client";

import { Offres } from "./Offres";

const QUESTIONS: [string, string][] = [
  ["Que contient l'audit gratuit ?", "Le score de votre site, le nombre de points à corriger et les deux premiers constats en clair, avec leur preuve et le texte qui les impose."],
  [
    "Faut-il créer un compte ?",
    "Non. Votre compte est créé au paiement avec l'adresse e-mail saisie. Pour revenir plus tard, demandez un lien de connexion par e-mail : pas de mot de passe.",
  ],
  [
    "Quelle différence entre l'audit ponctuel et l'abonnement ?",
    "L'audit ponctuel couvre un site pendant 30 jours : rapport complet, audits illimités, génération des documents. L'abonnement Site fait la même chose sans limite de durée, réaudite votre site chaque semaine, héberge vos documents et vous prévient quand une nouvelle obligation vous concerne.",
  ],
  [
    "Que sont les documents hébergés ?",
    "Vous intégrez une fois vos mentions légales, CGV ou politique de confidentialité à votre site (un lien ou deux lignes de code). Quand la loi change, Vigie vous prévient : vous générez et approuvez la nouvelle version, et elle s'affiche sur votre site sans que vous ayez à y toucher. Rien n'est jamais publié sans votre approbation.",
  ],
  [
    "Je suis une agence : que m'apportent les offres Agence ?",
    "Le suivi des sites de vos clients dans un seul tableau de bord, des rapports et dossiers PDF à votre nom et à votre logo, l'import de vos sites par fichier CSV et un accès par API pour vos propres outils.",
  ],
  [
    "Les documents sont-ils rédigés par un avocat ?",
    "Non. Ce sont des modèles générés automatiquement par un logiciel d'IA à partir de l'audit et de vos réponses. Vous les relisez, les complétez et les approuvez avant de les publier.",
  ],
  ["Puis-je résilier l'abonnement ?", "Oui, à tout moment et en un clic depuis votre compte. Il reste actif jusqu'à la fin du mois payé."],
  ["Aurai-je une facture ?", "Oui, une facture est émise à chaque paiement, avec votre numéro de TVA si vous l'indiquez. Elle est disponible depuis votre compte."],
];

export function Tarifs({ audit, email, simule }: { audit?: string; email: string | null; simule: boolean }) {
  return (
    <>
      <section className="hero tarifs-hero">
        <div className="conteneur">
          <p className="surtitre">Tarifs</p>
          <h1>
            Mettez votre site <em>en règle</em>.
          </h1>
          <p className="chapo">L&apos;audit est gratuit. Payez pour voir tous les constats, générer vos documents et rester en règle quand la loi change.</p>
        </div>
      </section>

      <section className="conteneur">
        <Offres audit={audit} email={email} simule={simule} />

        <section className="section faq">
          <h2>Questions fréquentes</h2>
          <div className="faq-liste">
            {QUESTIONS.map(([q, r]) => (
              <details key={q} className="constat">
                <summary>
                  <span className="titre">{q}</span>
                </summary>
                <div className="corps" style={{ paddingLeft: 16 }}>
                  <p>{r}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </section>
    </>
  );
}
