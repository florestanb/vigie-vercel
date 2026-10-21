"use client";

import { useEffect, useRef, useState } from "react";
import type { VueVerrouillee } from "@/lib/acces";
import type { Acces } from "@/lib/comptes";
import { OFFRES } from "@/lib/offres";
import type { Verdict } from "@/lib/types";
import { Offres } from "./Offres";
import { Constat, Jauge, VERDICTS } from "./Rapport";

// Texte factice pour le flou : les vrais constats ne sont jamais envoyés au navigateur.
const FACTICES = [
  ["Obligation d'information non respectée", "Mention attendue absente des pages lues lors du parcours du site."],
  ["Information précontractuelle incomplète", "Plusieurs éléments exigés avant la commande n'ont pas été trouvés."],
  ["Traitement de données sans information", "La collecte observée n'est accompagnée d'aucune information suffisante."],
  ["Clause ou mention à mettre à jour", "Le texte publié ne correspond plus aux exigences en vigueur."],
  ["Élément d'interface manquant", "Un dispositif imposé par la réglementation n'a pas été repéré."],
];

const pluriel = (n: number, mot: string, pl = mot + "s") => `${n} ${n > 1 ? pl : mot}`;

interface Props {
  vue: VueVerrouillee;
  acces: Acces;
  connecte: boolean;
  email: string | null;
  simule: boolean;
}

export function RapportVerrouille({ vue, acces, connecte, email, simule }: Props) {
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [offresVisibles, setOffresVisibles] = useState(false);
  const refOffres = useRef<HTMLElement>(null);
  const ordre: Verdict[] = ["illegal", "flou", "recommande"];
  const total = vue.reveles.length + vue.masques;
  const site = new URL(vue.url).hostname.replace(/^www\./, "");

  // La barre du bas s'efface quand les offres sont à l'écran.
  useEffect(() => {
    if (!refOffres.current) return;
    const obs = new IntersectionObserver(([e]) => setOffresVisibles(e.isIntersecting), { threshold: 0.15 });
    obs.observe(refOffres.current);
    return () => obs.disconnect();
  }, []);

  const versOffres = () => refOffres.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  async function debloquer() {
    setEnvoi(true);
    setErreur(null);
    const r = await fetch("/api/compte/debloquer", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ audit: vue.id }) });
    if (r.ok) location.reload();
    else {
      setErreur(((await r.json().catch(() => ({}))) as { erreur?: string }).erreur ?? "Déblocage impossible.");
      setEnvoi(false);
    }
  }

  return (
    <div className="conteneur rapport-gratuit">
      <section className="rapport-entete">
        <div>
          <p className="surtitre">Rapport d&apos;audit · version gratuite</p>
          <h1>{vue.titre}</h1>
          <p className="meta">
            <a href={vue.url} target="_blank" rel="noreferrer">{vue.url}</a> · analysé le{" "}
            {new Date(vue.date).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })}
            {vue.entreprise && ` · ${vue.entreprise}`}
          </p>
          <div className="compteurs">
            {ordre.filter((v) => vue.compteurs[v] > 0).map((v) => (
              <span key={v} className={`compteur v-${v}`} style={{ cursor: "default" }}>
                {VERDICTS[v].compteur(vue.compteurs[v])}
              </span>
            ))}
          </div>
        </div>
        <Jauge note={vue.note} />
      </section>

      {total === 0 ? (
        <p className="vide">Aucun manquement relevé automatiquement sur ce site. Débloquez la lecture approfondie pour vérifier vos textes.</p>
      ) : (
        <>
          {/* 1. Le constat d'ensemble, et l'appel à débloquer, tout de suite. */}
          <section className="alerte-problemes">
            <div>
              <p className="alerte-chiffre">{pluriel(total, "problème détecté", "problèmes détectés")} sur {site}</p>
              {vue.risqueMax && (
                <p className="alerte-risque">
                  Sanction la plus lourde encourue : <strong>{vue.risqueMax.replace(/^Jusqu'à /, "jusqu'à ")}</strong>
                </p>
              )}
              <p className="alerte-detail">
                {pluriel(vue.reveles.length, "est affiché", "sont affichés")} ci-dessous.{" "}
                {vue.masques > 0 && (
                  <strong>
                    {pluriel(vue.masques, "autre reste", "autres restent")} sur votre site, verrouillé{vue.masques > 1 ? "s" : ""}.
                  </strong>
                )}
              </p>
            </div>
            {vue.masques > 0 && (
              <button className="bouton bouton-phare bouton-grand" onClick={versOffres}>
                Débloquer {vue.masques > 1 ? `les ${vue.masques} autres` : "l'autre"} →
              </button>
            )}
          </section>

          {/* 2. Les problèmes offerts, dépliés. */}
          <section className="groupe">
            <h2>
              {vue.reveles.length > 1 ? `Les ${vue.reveles.length} premiers problèmes` : "Le premier problème"} <small>offert{vue.reveles.length > 1 ? "s" : ""}</small>
            </h2>
            {vue.reveles.map((r) => (
              <Constat key={r.regle.id} r={r} ouvert />
            ))}
          </section>

          {/* 3. Ce qui reste : flouté, avec le message clair. */}
          {vue.masques > 0 && (
            <section className="groupe floute-zone">
              <h2>
                🔒 {pluriel(vue.masques, "autre problème", "autres problèmes")} <small>verrouillé{vue.masques > 1 ? "s" : ""}</small>
              </h2>
              <div className="floute-liste" aria-hidden="true">
                {vue.lignesMasquees.map((l, i) => (
                  <div className="constat factice" key={i}>
                    <div className="factice-ligne">
                      <span className={`pastille v-${l.v}`}>•</span>
                      <span className="factice-texte">
                        <span className="titre">{FACTICES[i % FACTICES.length][0]}</span>
                        <span className="preuve-courte">{FACTICES[i % FACTICES.length][1]}</span>
                      </span>
                      {l.risque && (
                        <span className="risque">
                          <small>Sanction encourue</small>
                          {l.risque}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="verrou-cta carte">
                <p className="verrou-icone" aria-hidden="true">🔒</p>
                <h3>
                  {vue.masques > 1 ? `Ces ${vue.masques} problèmes sont toujours sur votre site` : "Ce problème est toujours sur votre site"}
                </h3>
                <p className="aide">Débloquez-les pour savoir lesquels, avec la preuve relevée et le texte de loi qui s&apos;applique.</p>
                {acces.deblocable ? (
                  <button className="bouton bouton-phare" onClick={debloquer} disabled={envoi}>
                    {envoi ? "Déblocage…" : `Débloquer ce site (${pluriel(acces.deblocable.restants, "place restante", "places restantes")})`}
                  </button>
                ) : (
                  <button className="bouton bouton-phare" onClick={versOffres}>
                    Débloquer dès {OFFRES.site.prix} € / mois
                  </button>
                )}
                {erreur && <p className="erreur">{erreur}</p>}
              </div>
            </section>
          )}
        </>
      )}

      {/* 4. Les offres, dans la page : le paiement débloque directement ce rapport. */}
      {!acces.deblocable && (
        <section className="offres-rapport" id="offres" ref={refOffres}>
          <h2>Débloquez votre rapport</h2>
          <p className="chapo">
            Accès immédiat après le paiement : le rapport de {site} se débloque automatiquement.
            {!connecte && (
              <>
                {" "}
                Déjà client ? <a href="/connexion">Connectez-vous</a>.
              </>
            )}
          </p>
          <Offres audit={vue.id} email={email} simule={simule} />
        </section>
      )}

      {/* 5. Rappel permanent en bas d'écran. */}
      {vue.masques > 0 && !acces.deblocable && (
        <div className={`barre-deblocage${offresVisibles ? " cachee" : ""}`} role="region" aria-label="Débloquer le rapport">
          <span>
            🔒 <strong>{pluriel(vue.masques, "problème verrouillé", "problèmes verrouillés")}</strong> sur {site}
          </span>
          <button className="bouton bouton-phare" onClick={versOffres}>
            Débloquer dès {OFFRES.site.prix} € / mois
          </button>
        </div>
      )}
    </div>
  );
}
