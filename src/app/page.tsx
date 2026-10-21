import { AuditEnDirect } from "@/components/AuditEnDirect";
import { FormulaireAudit } from "@/components/FormulaireAudit";
import { Demonstration } from "@/components/Demonstration";
import { ApercuExemple } from "@/components/FenetreExemple";
import { ACTIVITES } from "@/lib/activites";
import exemple from "@/lib/demo/audit-exemple.json";
import type { Audit } from "@/lib/types";
import { CATALOGUE, DERNIERE_MISE_A_JOUR } from "@/lib/rules/catalogue";
import { TEMOIGNAGES } from "@/lib/temoignages";

const DOMAINES = Object.entries(
  CATALOGUE.filter((r) => !r.obsolete).reduce<Record<string, number>>((acc, r) => ((acc[r.domaine] = (acc[r.domaine] ?? 0) + 1), acc), {}),
).sort((a, b) => b[1] - a[1]);

/**
 * Haut de la page d'accueil : deux versions. « nouveau » (deux colonnes, audit en direct) est affichée par défaut ;
 * pour revenir à l'ancienne, mettre HERO à "actuel". Aperçu de l'autre version sans rien changer : /?hero=actuel ou /?hero=nouveau.
 */
const HERO: "nouveau" | "actuel" = "nouveau";

const NB_OBLIGATIONS = CATALOGUE.filter((r) => !r.obsolete).length;
const NB_CONTROLES = new Set(CATALOGUE.map((r) => r.check).filter(Boolean)).size;
const MISE_A_JOUR = new Date(DERNIERE_MISE_A_JOUR).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

function HeroNouveau() {
  return (
    <section className="hero-b" id="audit">
      <div className="conteneur hero-b-grille">
        <div className="hero-b-texte">
          <a className="annonce" href="/nouvelles-obligations">
            <span className="annonce-tag">Nouveau</span>
            <span>Bouton de rétractation obligatoire depuis le 19 juin 2026</span>
            <span className="annonce-fleche" aria-hidden="true">→</span>
          </a>
          <h1>
            Contrôlez votre site <em>avant la CNIL</em>.
          </h1>
          <p className="chapo">
            Vigie fait ce que ferait un contrôleur : il refuse vos cookies, ouvre votre panier, lit vos CGV. Puis il vous dit quoi corriger, preuve et article de loi à
            l&apos;appui, et génère les documents qui manquent.
          </p>
          <FormulaireAudit />
          <div className="rassurance">
            <span>Gratuit, sans inscription</span>
            <span>Résultat en deux minutes</span>
            <a href="#exemple">Voir un rapport complet ↓</a>
          </div>
        </div>
        <AuditEnDirect />
      </div>
      <div className="conteneur">
        <dl className="hero-b-chiffres">
          <div>
            <dt>Obligations vérifiées</dt>
            <dd>{NB_OBLIGATIONS}</dd>
          </div>
          <div>
            <dt>Contrôles automatiques</dt>
            <dd>{NB_CONTROLES}</dd>
          </div>
          <div>
            <dt>Sources</dt>
            <dd className="petit">Légifrance, EUR-Lex, CNIL</dd>
          </div>
          <div>
            <dt>Registre à jour au</dt>
            <dd className="petit">{MISE_A_JOUR}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

function HeroActuel() {
  return (
    <>
      <section className="hero" id="audit">
        <div className="conteneur">
          <p className="surtitre">Registre à jour au {new Date(DERNIERE_MISE_A_JOUR).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
          <h1>Votre site est-il <em>en règle</em> ?</h1>
          <p className="chapo">
            Vigie parcourt votre site comme le ferait un contrôleur, relève les mentions légales, CGV, politiques de confidentialité et
            cookies manquants ou mal rédigés, puis génère automatiquement des modèles adaptés à votre activité, que vous relisez et approuvez.
          </p>
          <FormulaireAudit />
          <div className="rassurance">
            <span>Deux premiers problèmes gratuits, sans inscription</span>
            <span>Résultat en moins de deux minutes</span>
            <span>{CATALOGUE.filter((r) => !r.obsolete).length} obligations vérifiées, sources à l&apos;appui</span>
          </div>
          <p className="lien-exemple">
            <a href="#exemple">Voir un exemple de rapport complet ↓</a>
          </p>
        </div>
      </section>
    </>
  );
}

export default async function Accueil({ searchParams }: { searchParams: Promise<{ hero?: string }> }) {
  const demande = (await searchParams).hero;
  const variante = demande === "actuel" || demande === "nouveau" ? demande : HERO;
  return (
    <>
      {variante === "actuel" ? <HeroActuel /> : <HeroNouveau />}

      <section className="section section-exemple" id="exemple">
        <div className="conteneur">
          <div className="section-exemple-texte">
            <p className="surtitre">Exemple de rapport</p>
            <h2>Voici ce que vous obtenez.</h2>
            <p className="intro">
              Chaque problème avec la preuve relevée sur le site, le texte qui l&apos;impose et la sanction encourue. Ici, le rapport complet d&apos;une boutique
              fictive : le vôtre se lance en deux minutes, gratuitement.
            </p>
          </div>
          <ApercuExemple audit={exemple as unknown as Audit} />
        </div>
      </section>

      {TEMOIGNAGES.length > 0 && (
        <section className="section">
          <div className="conteneur temoignages">
            {TEMOIGNAGES.map((t) => (
              <figure key={t.auteur} className="carte">
                <blockquote>« {t.texte} »</blockquote>
                <figcaption>
                  <strong>{t.auteur}</strong>, {t.fonction}
                  {t.site && ` · ${t.site}`}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="section" id="comment">
        <div className="conteneur">
          <p className="surtitre">Comment ça marche</p>
          <h2 style={{ marginTop: 14 }}>De l&apos;adresse de votre site aux documents prêts à publier.</h2>
          <Demonstration />
        </div>
      </section>

      <section className="section teinte">
        <div className="conteneur">
          <h2>Ce que Vigie contrôle.</h2>
          <p className="intro">
            Le registre couvre la LCEN, le Code de la consommation, le RGPD, les règles CNIL sur les cookies, le DSA, l&apos;AI Act,
            l&apos;accessibilité et les obligations sectorielles. Il intègre les textes récents : rétractation en ligne obligatoire depuis
            le 19 juin 2026, interdiction des allégations environnementales génériques depuis le 27 septembre 2026.
          </p>
          <div className="domaines">
            {DOMAINES.map(([d, n]) => (
              <span className="puce" key={d}>
                {d} <b>{n}</b>
              </span>
            ))}
          </div>
          <p style={{ marginTop: 28 }}>
            <a href="/registre">Consulter le registre complet et ses sources →</a>
          </p>
          <p style={{ marginTop: 28 }} className="etiquette">Obligations par activité</p>
          <div className="domaines" style={{ marginTop: 8 }}>
            {ACTIVITES.map((a) => (
              <a key={a.slug} className="puce" href={`/obligations/${a.slug}`} style={{ textDecoration: "none" }}>
                {a.nom}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="conteneur">
          <div className="bandeau-honnete">
            <h3>Un outil, pas un avocat.</h3>
            <div>
              <p>
                Vigie signale ce qui manque et génère automatiquement des modèles de documents, que vous relisez, complétez et approuvez. Les textes s&apos;appuient
                sur des modèles de clauses et sur les articles cités, jamais sur des références inventées. Pour une activité réglementée ou
                un doute sérieux, faites relire par un professionnel du droit.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
