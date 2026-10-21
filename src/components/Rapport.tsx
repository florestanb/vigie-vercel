"use client";

import { useEffect, useMemo, useState } from "react";
import { ORDRE_DOCUMENTS, PLANS } from "@/lib/documents/plans";
import { LIBELLES_EDITEUR, LIBELLES_PROFIL, LIBELLES_SECTEURS, LIBELLES_TYPES } from "@/lib/profil";
import type { Point } from "@/lib/historique";
import { OFFRES } from "@/lib/offres";
import { calculerScore, evaluer, ORDRE_VERDICTS, trier, verdict, enAttenteDeValidation } from "@/lib/rules/engine";
import type { Audit, Editeur, Profil, ResultatRegle, Secteur, SiteType, Verdict } from "@/lib/types";

export const VERDICTS: Record<Verdict, { titre: string; compteur: (n: number) => string; symbole: string; definition: string }> = {
  illegal: {
    titre: "Illégal",
    compteur: (n) => `${n} ${n > 1 ? "illégaux" : "illégal"}`,
    symbole: "✕",
    definition: "Une obligation écrite dans la loi n'est pas respectée, et Vigie l'a constaté avec certitude.",
  },
  flou: {
    titre: "Zone de flou",
    compteur: (n) => `${n} en zone de flou`,
    symbole: "!",
    definition: "Exigence qui dépend d'une interprétation (CNIL, juge) ou constat tiré d'un indice : risque réel, mais pas tranché.",
  },
  recommande: {
    titre: "Recommandé",
    compteur: (n) => `${n} recommandation${n > 1 ? "s" : ""}`,
    symbole: "+",
    definition: "Bonne pratique ou mention obsolète à retirer, sans sanction directe.",
  },
  "a-verifier": {
    titre: "À vérifier",
    compteur: (n) => `${n} à vérifier`,
    symbole: "?",
    definition: "Vigie ne peut pas le voir depuis le site public, ou la lecture des textes n'a pas été faite.",
  },
  conforme: {
    titre: "Conforme",
    compteur: (n) => `${n} conforme${n > 1 ? "s" : ""}`,
    symbole: "✓",
    definition: "L'obligation est respectée d'après ce que Vigie a pu observer.",
  },
};

export const cleProfil = (id: string) => `vigie:profil:${id}`;

export function Jauge({ note }: { note: number }) {
  const r = 70;
  const tour = 2 * Math.PI * r;
  const couleur = note >= 80 ? "var(--ok)" : note >= 50 ? "var(--partiel)" : "var(--ko)";
  return (
    <div className="jauge" role="img" aria-label={`Score de conformité : ${note} sur 100`}>
      <svg viewBox="0 0 168 168" width="168" height="168">
        <circle cx="84" cy="84" r={r} fill="none" stroke="var(--trait)" strokeWidth="12" />
        <circle cx="84" cy="84" r={r} fill="none" stroke={couleur} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(note / 100) * tour} ${tour}`} transform="rotate(-90 84 84)" />
      </svg>
      <div className="jauge-texte">
        <div>
          <strong>{note}</strong>
          <span>sur 100</span>
        </div>
      </div>
    </div>
  );
}

/** Pourquoi le constat est rangé dans sa catégorie, en une phrase. */
function raison(r: ResultatRegle, v: Verdict): string | null {
  // Une recommandation d'autorité n'est pas la loi : on cite le premier texte légal.
  const s = r.regle.sources.find((x) => !/^CNIL|^DGCCRF|^Arcom/i.test(x.texte)) ?? r.regle.sources[0];
  const texte = s ? `${s.texte}${s.article ? `, ${s.article}` : ""}` : "";
  if (v === "illegal") return `Obligation écrite dans la loi (${texte}).`;
  if (enAttenteDeValidation(r))
    return `L'obligation est écrite dans la loi (${texte}) et le manquement a été constaté, mais cette règle du registre n'a pas encore été validée par un avocat : Vigie la présente donc comme une zone de flou.`;
  if (v === "flou" && r.incertain && (r.regle.nature ?? "loi") === "loi")
    return `L'obligation est légale (${texte}), mais Vigie l'a déduit d'un indice qu'il ne peut pas confirmer : vérifiez sur le site.`;
  if (v === "recommande" && r.statut === "a-retirer") return "L'obligation a disparu : la mention est devenue inutile, voire trompeuse.";
  if (v === "recommande" && !r.regle.nuance) return "Bonne pratique, sans sanction directe.";
  return null;
}

export function Constat({ r, ouvert = false }: { r: ResultatRegle; ouvert?: boolean }) {
  const v = verdict(r);
  const pourquoi = raison(r, v);
  return (
    <details className="constat" open={ouvert}>
      <summary>
        <span className={`pastille v-${v}`} aria-label={VERDICTS[v].titre}>
          {VERDICTS[v].symbole}
        </span>
        <span>
          <span className="titre">{r.regle.titre}</span>
          {r.preuve && <span className="preuve-courte">{r.preuve}</span>}
          <span className="domaine">{r.regle.domaine}</span>
        </span>
        <span className="constat-droite">
          {r.regle.risque && v !== "conforme" && v !== "a-verifier" && (
            <span className="risque" title={r.regle.sanction ?? "Sanction encourue"}>
              <small>Sanction encourue</small>
              {r.regle.risque.libelle}
            </span>
          )}
          <span className={`gravite ${r.regle.gravite}`}>{r.regle.gravite}</span>
        </span>
      </summary>
      <div className="corps">
        {(pourquoi || r.regle.nuance) && (
          <p className={`classement v-${v}`}>
            <strong>{VERDICTS[v].titre} :</strong> {[pourquoi, r.regle.nuance].filter(Boolean).join(" ")}
          </p>
        )}
        <p>{r.regle.exigence}</p>
        {r.regle.applicableDepuis && <p><span className="date-loi">Applicable depuis le {new Date(r.regle.applicableDepuis).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span></p>}
        {r.regle.sanction && <p><strong>Sanction encourue :</strong> {r.regle.sanction}</p>}
        {r.url && <p><a href={r.url} target="_blank" rel="noreferrer">Voir la page concernée ↗</a></p>}
        <div className="sources">
          {r.regle.sources.map((s, i) => (
            <a key={i} className="source" href={s.url} target="_blank" rel="noreferrer">
              {s.texte}
              {s.article ? `, ${s.article}` : ""}
            </a>
          ))}
        </div>
        <TexteOfficiel regle={r.regle.id} />
      </div>
    </details>
  );
}

type Article = { titre: string; texte: string | null; url: string | null; version: string | null; recupere: string | null };

/** Texte exact des articles qui fondent la règle, chargé à la demande. */
function TexteOfficiel({ regle }: { regle: string }) {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [etat, setEtat] = useState<"repos" | "chargement" | "erreur">("repos");
  if (!articles)
    return (
      <button
        type="button"
        className="lien-discret texte-officiel-bouton"
        disabled={etat === "chargement"}
        onClick={async () => {
          setEtat("chargement");
          try {
            const r = await fetch(`/api/citations/${encodeURIComponent(regle)}`);
            setArticles(((await r.json()) as { articles: Article[] }).articles);
          } catch {
            setEtat("erreur");
          }
        }}
      >
        {etat === "chargement" ? "Chargement…" : etat === "erreur" ? "Texte indisponible, réessayer" : "Lire le texte officiel"}
      </button>
    );
  return (
    <div className="texte-officiel">
      {articles.map((a) => (
        <div key={a.titre}>
          <p className="etiquette">
            {a.titre}
            {a.version && <span className="aide"> · {a.version}{a.recupere ? `, relevé le ${new Date(a.recupere).toLocaleDateString("fr-FR")}` : ""}</span>}
          </p>
          {a.texte ? <blockquote>{a.texte}</blockquote> : <p className="aide">Texte officiel pas encore relevé : consultez la source ci-dessus.</p>}
          {a.url && (
            <a href={a.url} target="_blank" rel="noreferrer" className="aide">
              Voir sur le site officiel ↗
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

function Approfondir({ id }: { id: string }) {
  const [etat, setEtat] = useState<"repos" | "encours" | "erreur">("repos");
  return (
    <div className="avertissement generation" style={{ marginTop: 20, display: "flex", gap: 16, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
      <span>
        <strong>Lecture approfondie disponible.</strong> Claude lit vos pages légales et précise les points « à vérifier » (environ une minute).
      </span>
      <button
        className="bouton bouton-phare"
        disabled={etat === "encours"}
        onClick={async () => {
          setEtat("encours");
          const r = await fetch(`/api/audit/${id}/analyse`, { method: "POST" });
          if (r.ok && (await r.json()).ok) location.reload();
          else setEtat("erreur");
        }}
      >
        {etat === "encours" ? "Lecture en cours…" : etat === "erreur" ? "Réessayer" : "Lancer la lecture"}
      </button>
    </div>
  );
}

interface PropsRapport {
  audit: Audit;
  documents: boolean;
  iaPossible: boolean;
  /** Retour de paiement : confirmation affichée en tête du rapport. */
  bienvenue?: boolean;
  connecte?: boolean;
  /** Comparaison avec l'audit précédent du même site. */
  evolution?: { avant: Point; apres: Point } | null;
  /** Rapport d'exemple public : pas de PDF ni de génération, un bandeau l'annonce. */
  exemple?: boolean;
}

/** « 6 → 2 problèmes illégaux, note 58 → 87 » : la preuve que les corrections ont porté. */
function Evolution({ avant, apres }: { avant: Point; apres: Point }) {
  const ligne = (libelle: string, a: number, b: number, mieux: "baisse" | "hausse") => {
    const delta = b - a;
    const bon = delta === 0 ? null : (mieux === "baisse") === delta < 0;
    return (
      <div className="evolution-ligne">
        <span>{libelle}</span>
        <strong>
          {a} → {b}
        </strong>
        {bon !== null && <em className={bon ? "mieux" : "moins-bien"}>{delta > 0 ? `+${delta}` : delta}</em>}
      </div>
    );
  };
  const progres = apres.illegaux < avant.illegaux || apres.note > avant.note;
  return (
    <section className={`evolution carte${progres ? " progres" : ""}`}>
      <p className="evolution-titre">
        {progres ? "Vos corrections portent leurs fruits." : "Évolution depuis le dernier audit."}{" "}
        <span className="aide">Comparé à l&apos;audit du {new Date(avant.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}.</span>
      </p>
      <div className="evolution-grille">
        {ligne("Note", avant.note, apres.note, "hausse")}
        {ligne("Problèmes illégaux", avant.illegaux, apres.illegaux, "baisse")}
        {ligne("Zones de flou", avant.flous, apres.flous, "baisse")}
      </div>
    </section>
  );
}

export function Rapport({ audit, documents: documentsAutorises, iaPossible, bienvenue = false, connecte = false, evolution = null, exemple = false }: PropsRapport) {
  const [profil, setProfil] = useState<Profil>(audit.profil);
  const [filtre, setFiltre] = useState<Verdict | null>(null);

  useEffect(() => {
    try {
      const sauve = localStorage.getItem(cleProfil(audit.id));
      if (sauve) setProfil(JSON.parse(sauve));
    } catch {
      /* stockage indisponible */
    }
  }, [audit.id]);

  const modifier = (p: Profil) => {
    setProfil(p);
    try {
      localStorage.setItem(cleProfil(audit.id), JSON.stringify(p));
    } catch {
      /* stockage indisponible */
    }
  };

  const resultats = useMemo(() => trier(evaluer(profil, audit.constatsAuto, audit.constatsIA)), [profil, audit]);
  const score = useMemo(() => calculerScore(resultats), [resultats]);
  const groupes = useMemo(
    () => ORDRE_VERDICTS.filter((v) => !filtre || v === filtre).map((v) => [v, resultats.filter((r) => verdict(r) === v)] as const).filter(([, rs]) => rs.length),
    [resultats, filtre],
  );

  // « À rédiger » seulement si la page n'existe pas : sinon on complète ce qui manque.
  const documents = ORDRE_DOCUMENTS.map((type) => {
    const lies = resultats.filter((r) => r.regle.document === type);
    const existe = audit.crawl.pagesLegales.some((p) => p.type === type);
    const illegaux = lies.filter((r) => verdict(r) === "illegal").length;
    const flous = lies.filter((r) => verdict(r) === "flou").length;
    const etat = !existe
      ? { libelle: "à rédiger", v: "illegal" as Verdict }
      : illegaux
        ? { libelle: `${illegaux} point${illegaux > 1 ? "s" : ""} à compléter`, v: "illegal" as Verdict }
        : flous
          ? { libelle: "à revoir", v: "flou" as Verdict }
          : { libelle: "à relire", v: "conforme" as Verdict };
    return { type, lies: lies.length, etat };
  }).filter((d) => d.lies > 0);

  const bascule = (cle: keyof typeof LIBELLES_PROFIL) => (
    <label className="bascule" key={cle}>
      <span>
        {LIBELLES_PROFIL[cle]} {profil[cle] !== audit.profil[cle] && <span className="modifie">modifié</span>}
      </span>
      <input type="checkbox" checked={profil[cle]} onChange={(e) => modifier({ ...profil, [cle]: e.target.checked })} />
    </label>
  );

  const compteurs: Record<Verdict, number> = {
    illegal: score.illegaux,
    flou: score.flous,
    recommande: score.recommandes,
    "a-verifier": score.aVerifier,
    conforme: score.conformes,
  };

  return (
    <div className="conteneur">
      <section className="rapport-entete">
        <div>
          <p className="surtitre">Rapport d&apos;audit</p>
          <h1>{audit.crawl.titre || new URL(audit.url).hostname}</h1>
          <p className="meta">
            <a href={audit.url} target="_blank" rel="noreferrer">{audit.url}</a> · analysé le{" "}
            {new Date(audit.date).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })} · {audit.crawl.pagesVisitees.length} pages lues
            {audit.entreprise && ` · ${audit.entreprise.nom} (SIREN ${audit.entreprise.siren})`}
          </p>
          <div className="compteurs" role="group" aria-label="Filtrer par catégorie">
            {ORDRE_VERDICTS.filter((v) => compteurs[v] > 0).map((v) => (
              <button key={v} className={`compteur v-${v}`} aria-pressed={filtre === v} onClick={() => setFiltre(filtre === v ? null : v)}>
                {VERDICTS[v].compteur(compteurs[v])}
              </button>
            ))}
          </div>
        </div>
        <div className="rapport-actions">
          <Jauge note={score.note} />
          {!exemple && (
            <a className="bouton bouton-ligne" href={`/api/audit/${audit.id}/pdf`}>
              Télécharger en PDF
            </a>
          )}
          {!exemple && connecte && (
            <a className="bouton bouton-ligne" href={`/api/compte/dossier?domaine=${encodeURIComponent(new URL(audit.url).hostname.replace(/^www\./, ""))}`}>
              Dossier de conformité
            </a>
          )}
        </div>
      </section>

      {exemple && (
        <p className="avertissement generation" style={{ marginTop: 20 }}>
          <strong>Exemple fictif.</strong> Voici le rapport complet que vous obtenez après déblocage, ici pour une boutique imaginaire. Cliquez sur
          chaque point pour voir la preuve relevée, le texte de loi et la sanction encourue. <a href="/#audit">Auditer mon site gratuitement →</a>
        </p>
      )}
      {bienvenue && (
        <p className="avertissement generation" style={{ marginTop: 20 }}>
          <strong>Paiement confirmé, votre rapport est débloqué.</strong> Un e-mail avec votre lien d&apos;accès vient de vous être envoyé. Retrouvez vos sites et
          vos rapports à tout moment dans <a href="/compte">votre espace</a>.
        </p>
      )}
      {!bienvenue && connecte && (
        <p className="meta" style={{ marginTop: 8 }}>
          <a href="/compte">← Mon espace</a>
        </p>
      )}
      {evolution && <Evolution avant={evolution.avant} apres={evolution.apres} />}
      {audit.resumeIA && <p className="resume">{audit.resumeIA}</p>}
      {!audit.iaDisponible && iaPossible && <Approfondir id={audit.id} />}
      {!audit.iaDisponible && !iaPossible && !exemple && (
        <p className="avertissement" style={{ marginTop: 20 }}>
          Audit automatique seul : la lecture des textes par Claude n&apos;est pas activée sur ce serveur, les points marqués « à vérifier » n&apos;ont pas été analysés.
        </p>
      )}
      {audit.iaErreur && <p className="avertissement" style={{ marginTop: 20 }}>L&apos;analyse des textes par Claude a échoué ({audit.iaErreur}). Les vérifications automatiques restent valables.</p>}
      {score.critiquesIllegaux > 0 && (
        <p className="avertissement" style={{ marginTop: 16 }}>
          <strong>{score.critiquesIllegaux} manquement{score.critiquesIllegaux > 1 ? "s" : ""} {score.critiquesIllegaux > 1 ? "illégaux" : "illégal"} et critique{score.critiquesIllegaux > 1 ? "s" : ""}</strong> : ce sont les points les plus souvent sanctionnés. Commencez par eux.
        </p>
      )}

      <div className="disposition">
        <div>
          {groupes.map(([v, rs]) => {
            const liste = rs.map((r) => <Constat key={r.regle.id} r={r} />);
            // Les points à vérifier et conformes sont repliés tant qu'on ne filtre pas dessus.
            const replie = !filtre && (v === "a-verifier" || v === "conforme");
            return (
              <section className="groupe" key={v}>
                <h2>
                  <span className={`pastille v-${v}`} aria-hidden="true">{VERDICTS[v].symbole}</span>
                  {VERDICTS[v].titre} <small>{rs.length}</small>
                </h2>
                <p className="definition">{VERDICTS[v].definition}</p>
                {replie ? (
                  <details className="a-verifier-groupe">
                    <summary>Afficher les {rs.length} points</summary>
                    {liste}
                  </details>
                ) : (
                  liste
                )}
              </section>
            );
          })}
          {!groupes.length && <p className="vide">Aucun point dans cette catégorie.</p>}
        </div>

        <aside className="lateral">
          {!exemple && (audit.crawl.captures?.length ?? 0) > 0 && (
            <div className="carte">
              <h3>Preuves visuelles</h3>
              <p className="aide" style={{ margin: "6px 0 12px" }}>Captures prises par le navigateur d&apos;audit, reprises dans le PDF.</p>
              <div className="captures-rapport">
                {audit.crawl.captures!.map((c) => (
                  <a key={c.nom} href={`/api/audit/${audit.id}/capture/${c.nom}`} target="_blank" rel="noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/api/audit/${audit.id}/capture/${c.nom}`} alt={c.legende} loading="lazy" />
                    <span>{c.legende}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
          <div className="carte">
            <h3>Documents</h3>
            <p className="aide" style={{ margin: "6px 0 12px" }}>Modèles générés automatiquement à partir de l&apos;audit, à relire et approuver : un texte existant est repris là où il est correct.</p>
            <div className="docs">
              {documents.map((d) =>
                documentsAutorises ? (
                  <a key={d.type} className="doc-lien" href={`/audit/${audit.id}/document/${d.type}`}>
                    <span>{PLANS[d.type].titre}</span>
                    <em className={`v-${d.etat.v}`} style={{ background: "none" }}>
                      {d.etat.libelle} →
                    </em>
                  </a>
                ) : (
                  <span key={d.type} className="doc-lien verrouille">
                    <span>🔒 {PLANS[d.type].titre}</span>
                    <em className={`v-${d.etat.v}`} style={{ background: "none" }}>{d.etat.libelle}</em>
                  </span>
                ),
              )}
            </div>
            {!documentsAutorises && (
              <a className="bouton bouton-phare" style={{ width: "100%", marginTop: 12 }} href={exemple ? "/tarifs" : `/tarifs?audit=${audit.id}`}>
                Générer ces documents · dès {OFFRES.site.prix} € / mois
              </a>
            )}
          </div>

          <div className="carte">
            <h3>Profil du site</h3>
            <p className="aide" style={{ margin: "6px 0 10px" }}>Déduit de l&apos;audit. Corrigez-le : les obligations se recalculent.</p>
            <label className="etiquette" htmlFor="editeur">Éditeur</label>
            <select id="editeur" className="champ" value={profil.editeur} onChange={(e) => modifier({ ...profil, editeur: e.target.value as Editeur })}>
              {Object.entries(LIBELLES_EDITEUR).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <p className="etiquette" style={{ marginTop: 14 }}>Type de site</p>
            {(Object.keys(LIBELLES_TYPES) as SiteType[]).map((t) => (
              <label className="bascule" key={t}>
                <span>{LIBELLES_TYPES[t]}</span>
                <input type="checkbox" checked={profil.types.includes(t)} onChange={(e) => modifier({ ...profil, types: e.target.checked ? [...profil.types, t] : profil.types.filter((x) => x !== t) })} />
              </label>
            ))}
            <p className="etiquette" style={{ marginTop: 14 }}>Activité</p>
            {(Object.keys(LIBELLES_PROFIL) as (keyof typeof LIBELLES_PROFIL)[]).map(bascule)}
            <p className="etiquette" style={{ marginTop: 14 }}>Secteur réglementé</p>
            {(Object.keys(LIBELLES_SECTEURS) as Secteur[]).map((s) => (
              <label className="bascule" key={s}>
                <span>{LIBELLES_SECTEURS[s]}</span>
                <input type="checkbox" checked={profil.secteurs.includes(s)} onChange={(e) => modifier({ ...profil, secteurs: e.target.checked ? [...profil.secteurs, s] : profil.secteurs.filter((x) => x !== s) })} />
              </label>
            ))}
            <button className="bouton bouton-ligne" style={{ marginTop: 14, width: "100%" }} onClick={() => modifier(audit.profil)}>
              Revenir au profil détecté
            </button>
          </div>

          <div className="carte">
            <h3>Ce que Vigie a vu</h3>
            <ul style={{ paddingLeft: 18, margin: "10px 0 0", fontSize: 14, display: "grid", gap: 6 }}>
              <li>Bandeau cookies : {audit.crawl.cmp ?? "aucun"}</li>
              <li>Services tiers avant consentement : {audit.crawl.requetesAvantConsentement.map((r) => r.service ?? r.domaine).join(", ") || "aucun"}</li>
              <li>Plateforme : {audit.crawl.signaux.plateforme ?? "non identifiée"}</li>
              <li>Paiement : {audit.crawl.signaux.paiement.join(", ") || "non détecté"}</li>
              <li>Pages légales : {audit.crawl.pagesLegales.map((p) => PLANS[p.type]?.titre ?? p.type).join(", ") || "aucune"}</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
