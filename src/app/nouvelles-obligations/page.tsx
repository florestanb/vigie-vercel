import type { Metadata } from "next";
import { CATALOGUE, DERNIERE_MISE_A_JOUR } from "@/lib/rules/catalogue";

export const metadata: Metadata = {
  title: "Nouvelles obligations des sites web en 2025 et 2026",
  description:
    "Bouton de rétractation en ligne, transparence des chatbots (AI Act), accessibilité (EAA), allégations environnementales, droit à la réparation : ce qui a changé pour les sites web, qui est concerné et quoi faire.",
};

const dateLongue = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

/**
 * Explications par règle : qui est concerné et quoi faire. Le reste (exigence, sources, nuances, date) vient
 * du registre, source unique : une correction du registre se répercute ici.
 */
const GUIDES: Record<string, { accroche: string; qui: string; faire: string[] }> = {
  "vente.bouton-retractation": {
    accroche: "Se rétracter doit être aussi simple en ligne que commander.",
    qui: "Tout site qui vend en ligne à des particuliers un bien ou un service ouvrant droit à rétractation, quel que soit le secteur. Les ventes entre professionnels ne sont pas concernées.",
    faire: [
      "Ajouter une fonctionnalité de rétractation clairement libellée (par exemple « Se rétracter du contrat ici »), gratuite, mise en évidence et accessible pendant tout le délai de rétractation.",
      "Permettre d'identifier le contrat (nom, numéro de commande) et le moyen de recevoir la confirmation.",
      "Envoyer sans délai un accusé de réception sur support durable (e-mail) avec la date et l'heure de la rétractation.",
      "Décrire la fonctionnalité dans les CGV, à côté du formulaire type de rétractation, qui reste obligatoire.",
    ],
  },
  "ia.chatbot": {
    accroche: "Un internaute doit savoir qu'il parle à une machine.",
    qui: "Les sites qui proposent un assistant conversationnel fondé sur l'IA, surtout s'ils l'ont conçu eux-mêmes (même à partir d'un modèle tiers). L'obligation n'a pas été reportée par le règlement « omnibus » de 2026, qui a décalé d'autres parties de l'AI Act.",
    faire: [
      "Afficher dans la fenêtre du chatbot, dès le premier message, qu'il s'agit d'un assistant automatisé.",
      "Signaler comme tels les hypertrucages (images, sons ou vidéos réalistes générés par IA) et les textes générés par IA publiés pour informer le public sur des questions d'intérêt général, sauf relecture éditoriale humaine.",
      "Vérifier avec l'éditeur de l'outil ce qu'il prend en charge, s'il s'agit d'une solution prête à l'emploi.",
    ],
  },
  "env.allegations-generiques": {
    accroche: "« Éco-responsable » ne suffit plus : il faut le prouver, ou le retirer.",
    qui: "Tout site qui vante les qualités environnementales d'un produit, d'un service ou de l'entreprise.",
    faire: [
      "Retirer les mentions « biodégradable » ou « respectueux de l'environnement » des produits et emballages : elles sont déjà interdites en France.",
      "Remplacer les termes vagues (« vert », « durable », « éco-conçu ») par une performance précise et justifiée, ou les supprimer.",
      "Ne pas annoncer de neutralité carbone fondée sur la compensation, et n'afficher que des labels certifiés par un tiers ou établis par une autorité publique.",
    ],
  },
  "env.reparation": {
    accroche: "La réparation devient un droit, et prolonge la garantie.",
    qui: "Les vendeurs en ligne d'appareils électroménagers et électroniques couverts par la directive (lave-linge, réfrigérateurs, smartphones, tablettes…).",
    faire: [
      "Indiquer dans les CGV que, si le client choisit la réparation au titre de la garantie légale de conformité, la garantie est prolongée de 12 mois.",
      "Renvoyer vers les informations de réparation du fabricant.",
    ],
  },
  "a11y.conformite": {
    accroche: "Les boutiques en ligne doivent être utilisables par tous.",
    qui: "Les services de commerce électronique et les services bancaires, de transport ou de communication, sauf les microentreprises (moins de 10 salariés et 2 M€ de chiffre d'affaires ou de bilan).",
    faire: [
      "Corriger les erreurs détectables automatiquement : images sans texte alternatif, champs de formulaire sans étiquette, contrastes insuffisants, boutons sans nom.",
      "Faire réaliser un audit manuel (RGAA, qui reprend la norme EN 301 549) : les tests automatiques n'en couvrent qu'une partie.",
      "Décrire dans les conditions générales comment le service répond aux exigences d'accessibilité.",
    ],
  },
  "vente.accessibilite-cgv": {
    accroche: "Les conditions générales doivent dire comment le service est accessible.",
    qui: "Les mêmes entreprises que l'obligation d'accessibilité : commerce en ligne vers les particuliers, hors microentreprises.",
    faire: ["Ajouter aux CGV une section « Accessibilité » qui décrit le service et son niveau d'accessibilité, ou renvoyer vers une page dédiée."],
  },
  "vente.lien-rll-obsolete": {
    accroche: "Un lien obligatoire est devenu un lien mort.",
    qui: "Tous les sites marchands qui affichaient le lien vers la plateforme européenne de règlement en ligne des litiges.",
    faire: ["Retirer le lien de la plateforme RLL des CGV et du pied de page.", "Garder en revanche le nom et le site du médiateur de la consommation, toujours obligatoires."],
  },
};

export default function NouvellesObligations() {
  const regles = CATALOGUE.filter((r) => r.applicableDepuis && r.applicableDepuis >= "2025-01-01").sort((a, b) => b.applicableDepuis!.localeCompare(a.applicableDepuis!));
  return (
    <div className="conteneur page-texte obligations">
      <p className="surtitre">Mis à jour le {dateLongue(DERNIERE_MISE_A_JOUR)}</p>
      <h1 style={{ marginTop: 12 }}>Ce qui a changé pour les sites web en 2025 et 2026</h1>
      <p className="chapo-obligations">
        Rétractation en un clic, chatbots, accessibilité, écologie, réparation : {regles.length} obligations sont entrées en application en dix-huit mois. Voici, pour
        chacune, qui est concerné et quoi faire, d&apos;après le registre de Vigie et ses sources officielles.
      </p>
      <p style={{ marginTop: 20 }}>
        <a className="bouton bouton-phare" href="/#audit">Vérifier mon site gratuitement</a>{" "}
        <a className="bouton bouton-ligne" href="/registre">Tout le registre</a>
      </p>

      <nav aria-label="Sommaire" style={{ marginTop: 32 }}>
        <ol>
          {regles.map((r) => (
            <li key={r.id}>
              <a href={`#${r.id}`}>{r.titre}</a> · {dateLongue(r.applicableDepuis!)}
            </li>
          ))}
        </ol>
      </nav>

      {regles.map((r) => {
        const g = GUIDES[r.id];
        return (
          <section key={r.id} id={r.id} style={{ marginTop: 48, scrollMarginTop: 80 }}>
            <p className="date-loi">{r.obsolete ? "Supprimée le" : "Depuis le"} {dateLongue(r.applicableDepuis!)}</p>
            <h2 style={{ marginTop: 8 }}>{r.titre}</h2>
            {g && <p style={{ fontSize: 18, marginTop: 6 }}>{g.accroche}</p>}
            <p>{r.exigence}</p>
            {g && (
              <>
                <h3>Qui est concerné</h3>
                <p>{g.qui}</p>
                <h3>Quoi faire</h3>
                <ul>
                  {g.faire.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </>
            )}
            {r.nuance && (
              <p style={{ color: "var(--texte-doux)", fontStyle: "italic" }}>
                <strong>À savoir : </strong>
                {r.nuance}
              </p>
            )}
            {r.sanction && <p><strong>Sanction encourue : </strong>{r.sanction}</p>}
            <div className="sources" style={{ marginTop: 8 }}>
              {r.sources.map((s, i) => (
                <a key={i} className="source" href={s.url} target="_blank" rel="noreferrer">
                  {s.texte}
                  {s.article ? `, ${s.article}` : ""}
                </a>
              ))}
            </div>
          </section>
        );
      })}

      <section style={{ marginTop: 56 }} className="carte">
        <h2 style={{ marginTop: 0 }}>Être prévenu de la prochaine</h2>
        <p>
          Le registre de Vigie suit ces évolutions. Avec un abonnement, vous recevez une alerte quand une nouvelle obligation concerne vos sites, et vos documents hébergés
          sont mis à jour après votre approbation.
        </p>
        <a className="bouton bouton-phare" href="/tarifs">Voir les offres</a>
      </section>
      <p className="meta" style={{ marginTop: 24 }}>
        Cette page est une information générale établie à partir des textes cités. Elle ne constitue pas un conseil juridique adapté à votre situation.
      </p>
    </div>
  );
}
