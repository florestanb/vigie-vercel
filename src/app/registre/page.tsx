import type { Metadata } from "next";
import { CATALOGUE, DERNIERE_MISE_A_JOUR } from "@/lib/rules/catalogue";

export const metadata: Metadata = {
  title: "Registre des obligations légales d'un site web",
  description: "Toutes les obligations légales françaises et européennes qu'un site web peut avoir à respecter, avec leurs sources.",
};

const VERIF = { auto: "Automatique", ia: "Lecture IA", declaratif: "À déclarer" } as const;
const NATURE = { flou: "zone de flou", recommandation: "recommandation" } as const;

export default function Registre() {
  const domaines = [...new Set(CATALOGUE.map((r) => r.domaine))];
  return (
    <div className="conteneur page-texte">
      <p className="surtitre">Mis à jour le {new Date(DERNIERE_MISE_A_JOUR).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
      <h1 style={{ marginTop: 10 }}>Registre des obligations</h1>
      <p style={{ maxWidth: "70ch", color: "var(--texte-doux)" }}>
        {CATALOGUE.length} obligations qui pèsent sur un site web en France, issues du droit français et du droit de l&apos;Union. Chaque audit Vigie
        ne retient que celles qui s&apos;appliquent au site analysé, selon son activité.
      </p>
      {domaines.map((d) => (
        <section key={d} style={{ marginTop: 40 }}>
          <h2>{d}</h2>
          <table className="registre-table">
            <thead>
              <tr>
                <th>Obligation</th>
                <th className="col-cachee">Sources</th>
                <th className="col-cachee">Contrôle</th>
              </tr>
            </thead>
            <tbody>
              {CATALOGUE.filter((r) => r.domaine === d).map((r) => (
                <tr key={r.id} id={r.id}>
                  <td>
                    <strong>{r.titre}</strong> {r.obsolete && <span className="date-loi">obsolète</span>}
                    {r.nature && r.nature !== "loi" && <span className={`date-loi ${r.nature === "flou" ? "v-flou" : "v-recommande"}`}>{NATURE[r.nature]}</span>}
                    {r.applicableDepuis && !r.obsolete && <span className="date-loi" style={{ marginLeft: 6 }}>depuis le {new Date(r.applicableDepuis).toLocaleDateString("fr-FR")}</span>}
                    <p style={{ color: "var(--texte-doux)", marginTop: 4 }}>{r.exigence}</p>
                    {r.nuance && <p style={{ color: "var(--texte-doux)", marginTop: 4, fontStyle: "italic" }}>{r.nuance}</p>}
                  </td>
                  <td className="col-cachee">
                    <div className="sources">
                      {r.sources.map((s, i) => (
                        <a key={i} className="source" href={s.url} target="_blank" rel="noreferrer">
                          {s.texte}
                          {s.article ? `, ${s.article}` : ""}
                        </a>
                      ))}
                    </div>
                  </td>
                  <td className="col-cachee">{VERIF[r.verification]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
