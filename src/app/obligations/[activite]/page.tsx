import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ACTIVITES, obligationsDe } from "@/lib/activites";
import { DERNIERE_MISE_A_JOUR } from "@/lib/rules/catalogue";

type Params = { params: Promise<{ activite: string }> };

export function generateStaticParams() {
  return ACTIVITES.map((a) => ({ activite: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { activite } = await params;
  const a = ACTIVITES.find((x) => x.slug === activite);
  return a ? { title: a.titre, description: a.intro } : {};
}

export default async function Page({ params }: Params) {
  const { activite } = await params;
  const a = ACTIVITES.find((x) => x.slug === activite);
  if (!a) notFound();
  const regles = obligationsDe(a);
  const parDomaine = Object.entries(
    regles.reduce<Record<string, typeof regles>>((acc, r) => ((acc[r.domaine] ??= []).push(r), acc), {}),
  );
  const date = new Date(DERNIERE_MISE_A_JOUR).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="conteneur page-texte obligations">
      <p className="retour"><a href="/obligations">← Toutes les activités</a></p>
      <h1 style={{ marginTop: 12 }}>{a.titre}</h1>
      <p className="chapo-obligations">{a.intro}</p>
      <p className="meta">
        {regles.length} obligations selon le registre de Vigie, à jour au {date}. Les obligations exactes dépendent de votre site : l&apos;audit gratuit les
        vérifie une par une.
      </p>
      <p style={{ marginTop: 20 }}>
        <a className="bouton bouton-phare" href="/#audit">Vérifier mon site gratuitement</a>{" "}
        <a className="bouton bouton-ligne" href="/exemple">Voir un exemple de rapport</a>
      </p>

      {parDomaine.map(([domaine, rs]) => (
        <section key={domaine}>
          <h2>{domaine}</h2>
          {rs.map((r) => (
            <div key={r.id} className="obligation">
              <div className="obligation-tete">
                <h3>{r.titre}</h3>
                {r.risque && r.risque.plafond > 0 && (
                  <span className="risque">
                    <small>Sanction encourue</small>
                    {r.risque.libelle}
                  </span>
                )}
              </div>
              <p>{r.exigence}</p>
              <p className="sources">
                {r.sources.map((s, i) => (
                  <a key={i} className="source" href={s.url} target="_blank" rel="noreferrer">
                    {s.texte}
                    {s.article ? `, ${s.article}` : ""}
                  </a>
                ))}
              </p>
            </div>
          ))}
        </section>
      ))}

      <div className="carte" style={{ marginTop: 40 }}>
        <h3>Votre site respecte-t-il ces {regles.length} obligations ?</h3>
        <p className="aide">Vigie parcourt votre site comme un contrôleur et vous montre ce qui manque, preuves et textes à l&apos;appui. Gratuit, en deux minutes.</p>
        <p style={{ marginTop: 12 }}><a className="bouton bouton-phare" href="/#audit">Lancer l&apos;audit gratuit</a></p>
      </div>
    </div>
  );
}
