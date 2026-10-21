"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { comparerAuTexteExistant } from "@/lib/documents/conservation";
import { PLANS, type TypeDocument } from "@/lib/documents/plans";
import { markdownVersHtml } from "@/lib/markdown";
import type { Profil } from "@/lib/types";
import { cleProfil } from "./Rapport";

interface Props {
  auditId: string;
  hote: string;
  type: TypeDocument;
  initiales: Record<string, string>;
  existant: string | null;
  /** Texte actuel du document sur le site, pour vérifier qu'il est entièrement repris. */
  texteExistant: string | null;
  /** Le texte actuel dépasse ce que la rédaction peut reprendre : sa fin n'a pas été transmise. */
  tronque: boolean;
  /** Le document existe mais n'a pas pu être lu (PDF scanné…). */
  nonLu: string | null;
  /** L'abonnement permet d'héberger ce document sur Vigie. */
  hebergement: boolean;
}

function telecharger(nom: string, contenu: string, mime: string) {
  const lien = document.createElement("a");
  lien.href = URL.createObjectURL(new Blob([contenu], { type: mime }));
  lien.download = nom;
  lien.click();
  URL.revokeObjectURL(lien.href);
}

export function Redaction({ auditId, hote, type, initiales, existant, texteExistant, tronque, nonLu, hebergement }: Props) {
  const plan = PLANS[type];
  const [reponses, setReponses] = useState<Record<string, string>>(initiales);
  const [texte, setTexte] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [copie, setCopie] = useState(false);
  // L'export n'est possible qu'après approbation explicite du modèle par le client, enregistrée côté serveur.
  const [accord, setAccord] = useState(false);
  const [approbation, setApprobation] = useState<{ date: string; empreinte: string; texte: string } | null>(null);
  const approuve = approbation?.texte === texte;
  const [publie, setPublie] = useState<{ lien: string; script: string; texte: string } | null>(null);

  async function publier() {
    setErreur(null);
    try {
      const r = await fetch("/api/documents/heberger", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ auditId, type, texte }) });
      const donnees = await r.json();
      if (!r.ok) throw new Error(donnees.erreur ?? "Publication impossible.");
      setPublie({ lien: donnees.lien, script: donnees.script, texte });
    } catch (e) {
      setErreur((e as Error).message);
    }
  }
  const annulation = useRef<AbortController | null>(null);

  useEffect(() => () => annulation.current?.abort(), []);

  async function rediger() {
    setEnCours(true);
    setErreur(null);
    setTexte("");
    setAccord(false);
    let profil: Profil | undefined;
    try {
      const sauve = localStorage.getItem(cleProfil(auditId));
      if (sauve) profil = JSON.parse(sauve);
    } catch {
      /* stockage indisponible */
    }
    annulation.current = new AbortController();
    try {
      const r = await fetch("/api/documents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ auditId, type, reponses, profil }),
        signal: annulation.current.signal,
      });
      if (!r.ok || !r.body) throw new Error(await r.text());
      const lecteur = r.body.pipeThrough(new TextDecoderStream()).getReader();
      for (;;) {
        const { value, done } = await lecteur.read();
        if (done) break;
        setTexte((t) => t + value);
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setErreur((e as Error).message);
    } finally {
      setEnCours(false);
    }
  }

  const [edition, setEdition] = useState(false);
  const [pdfEnCours, setPdfEnCours] = useState(false);
  const html = useMemo(() => markdownVersHtml(texte), [texte]);
  // Le texte actuel du site a-t-il été repris en entier ? Calculé une fois la rédaction terminée.
  const conservation = useMemo(() => (texte && !enCours && texteExistant ? comparerAuTexteExistant(texteExistant, texte) : null), [texte, enCours, texteExistant]);

  async function telechargerPdf() {
    setPdfEnCours(true);
    setErreur(null);
    try {
      const r = await fetch("/api/documents/pdf", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ auditId, type, texte }) });
      if (!r.ok) throw new Error(await r.text());
      const lien = document.createElement("a");
      lien.href = URL.createObjectURL(await r.blob());
      lien.download = `${nomFichier}.pdf`;
      lien.click();
      URL.revokeObjectURL(lien.href);
    } catch (e) {
      setErreur((e as Error).message || "Le PDF n'a pas pu être produit.");
    } finally {
      setPdfEnCours(false);
    }
  }
  const controles = useMemo(() => {
    if (!texte || enCours) return [];
    const liste = plan.controles.map((c) => ({ libelle: c.libelle, ok: c.motif.test(texte) }));
    const n = (texte.match(/\[À COMPLÉTER/g) ?? []).length;
    liste.push({ libelle: n ? `${n} information${n > 1 ? "s" : ""} à compléter (surlignées) : « Modifier le texte » pour les remplir` : "Aucune information à compléter", ok: n === 0 });
    if (conservation)
      liste.push({
        libelle: conservation.retires.length
          ? `Texte actuel repris à ${Math.round(conservation.taux * 100)} % : ${conservation.retires.length} passage${conservation.retires.length > 1 ? "s" : ""} retiré${conservation.retires.length > 1 ? "s" : ""} ou réécrit${conservation.retires.length > 1 ? "s" : ""}, à vérifier`
          : "Texte actuel du site entièrement repris",
        ok: conservation.retires.length === 0,
      });
    return liste;
  }, [texte, enCours, plan, conservation]);

  async function approuver() {
    setErreur(null);
    try {
      const r = await fetch("/api/documents/approbation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ auditId, type, texte }),
      });
      const donnees = await r.json();
      if (!r.ok) throw new Error(donnees.erreur ?? "Approbation impossible.");
      setApprobation({ date: donnees.date, empreinte: donnees.empreinte, texte });
    } catch (e) {
      setErreur((e as Error).message);
    }
  }

  const nomFichier = `${plan.titre.toLowerCase().replace(/[^a-zà-ÿ0-9]+/gi, "-")}-${hote}`;

  return (
    <div className="conteneur">
      <section style={{ paddingTop: 40 }}>
        <p className="retour">
          <a href={`/audit/${auditId}`} style={{ textDecoration: "none" }}>← Rapport de {hote}</a>
        </p>
        <h1 style={{ fontSize: "clamp(30px, 4vw, 44px)", marginTop: 10 }}>{plan.titre}</h1>
        <p className="meta" style={{ maxWidth: "70ch" }}>
          {plan.description}{" "}
          {existant ? (
            <>
              Le texte actuel du site (<a href={existant} target="_blank" rel="noreferrer">voir</a>) est repris en entier : seuls les passages illégaux ou obsolètes sont remplacés, et
              chaque passage retiré vous est montré après la rédaction.
            </>
          ) : (
            "Le site n'en a pas aujourd'hui."
          )}
        </p>
        {tronque && (
          <p className="avertissement" style={{ maxWidth: "80ch" }}>
            Le texte actuel est très long : seule sa première partie peut être reprise. Vérifiez la fin du document après la rédaction.
          </p>
        )}
        {nonLu && (
          <p className="avertissement" style={{ maxWidth: "80ch" }}>
            Le document actuel n&apos;a pas pu être lu ({nonLu}) : il ne sera pas repris. Copiez-en les clauses à garder après la rédaction, avec « Modifier le texte ».
          </p>
        )}
        <p className="avertissement generation" style={{ maxWidth: "80ch", marginTop: 16 }}>
          <strong>Génération automatique.</strong> Ce document est un modèle produit par un logiciel d&apos;intelligence artificielle à partir de
          l&apos;audit et de vos réponses. Aucun juriste ne l&apos;a rédigé ni relu, et il ne constitue pas un conseil juridique. Vous le relisez,
          le complétez et l&apos;approuvez avant de le publier : sa publication relève de votre seule responsabilité.
        </p>
        {plan.modeles?.map((m) => (
          <p key={m.url} className="meta" style={{ maxWidth: "70ch" }}>
            {m.section ? `Section « ${m.section.split(" (")[0]} » : ${m.obligatoire ? "texte officiel repris mot pour mot" : "suit l'exemple publié"}` : m.obligatoire ? "Texte officiel repris mot pour mot" : "Suit l'exemple publié"} (
            <a href={m.url} target="_blank" rel="noreferrer">{m.source}</a>).
          </p>
        ))}
      </section>

      <div className="grille-redaction">
        <form
          className="carte questions"
          onSubmit={(e) => {
            e.preventDefault();
            rediger();
          }}
        >
          <h3 style={{ fontSize: 18 }}>Informations du site</h3>
          <p className="aide" style={{ marginTop: -6 }}>Pré-remplies d&apos;après l&apos;audit. Ce qui reste vide sera signalé « à compléter » dans le document.</p>
          {plan.questions.map((q) => (
            <div key={q.cle}>
              <label className="etiquette" htmlFor={q.cle}>{q.libelle}</label>
              <input id={q.cle} className="champ" value={reponses[q.cle] ?? ""} onChange={(e) => setReponses({ ...reponses, [q.cle]: e.target.value })} />
              {q.aide && <p className="aide">{q.aide}</p>}
            </div>
          ))}
          <button className="bouton bouton-phare" disabled={enCours}>
            {enCours ? "Génération en cours…" : texte ? "Générer à nouveau" : "Générer le modèle"}
          </button>
          {controles.length > 0 && (
            <ul className="controles" aria-label="Contrôles après rédaction">
              {controles.map((c) => (
                <li key={c.libelle}>
                  <span className={c.ok ? "s-conforme" : "s-partiel"} style={{ background: "none", fontWeight: 800 }}>{c.ok ? "✓" : "!"}</span> {c.libelle}
                </li>
              ))}
            </ul>
          )}
        </form>

        <div>
          {texte && !enCours && (
            <div className="barre-edition">
              <button type="button" className={`bouton ${edition ? "bouton-encre" : "bouton-ligne"}`} onClick={() => setEdition((e) => !e)}>
                {edition ? "Voir le rendu" : "Modifier le texte"}
              </button>
              <span className="aide">
                {edition ? "Format Markdown : ## pour un titre, - pour une liste. Une modification demande une nouvelle approbation." : "Remplissez les champs surlignés, ajustez une clause, puis approuvez."}
              </span>
            </div>
          )}
          {edition && texte && !enCours ? (
            <textarea className="champ editeur-document" value={texte} onChange={(e) => setTexte(e.target.value)} aria-label="Texte du document (Markdown)" spellCheck />
          ) : (
            <article className="feuille" aria-live="polite" aria-busy={enCours}>
              {texte ? <div dangerouslySetInnerHTML={{ __html: html }} /> : <p className="vide">{erreur ?? "Le modèle s'écrira ici, section par section."}</p>}
            </article>
          )}
          {conservation && conservation.retires.length > 0 && (
            <details className="carte passages-retires">
              <summary>
                <strong>
                  {conservation.retires.length} passage{conservation.retires.length > 1 ? "s" : ""} du texte actuel absent{conservation.retires.length > 1 ? "s" : ""} du nouveau document
                </strong>{" "}
                · à vérifier avant d&apos;approuver
              </summary>
              <p className="aide">
                Retirés parce qu&apos;illégaux ou obsolètes, réécrits en profondeur, ou oubliés. S&apos;il faut en garder un, ajoutez-le avec « Modifier le texte ».
              </p>
              <ol>
                {conservation.retires.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ol>
            </details>
          )}
          {erreur && texte && <p className="erreur">{erreur}</p>}
          {texte && !enCours && !approuve && (
            <div className="approbation">
              <label>
                <input type="checkbox" checked={accord} onChange={(e) => setAccord(e.target.checked)} />
                <span>
                  J&apos;ai relu ce modèle en entier et complété les informations manquantes. Je comprends qu&apos;il a été généré automatiquement,
                  sans conseil juridique, et je l&apos;approuve : sa publication relève de ma seule responsabilité.
                </span>
              </label>
              <button className="bouton bouton-phare" disabled={!accord} onClick={approuver}>
                Approuver le modèle
              </button>
            </div>
          )}
          {texte && !enCours && approuve && (
            <div className="actions">
              <button
                className="bouton bouton-encre"
                onClick={async () => {
                  await navigator.clipboard.writeText(texte);
                  setCopie(true);
                  setTimeout(() => setCopie(false), 2000);
                }}
              >
                {copie ? "Copié" : "Copier le texte"}
              </button>
              <button className="bouton bouton-ligne" onClick={telechargerPdf} disabled={pdfEnCours}>
                {pdfEnCours ? "PDF en cours…" : "Télécharger (.pdf)"}
              </button>
              <button className="bouton bouton-ligne" onClick={() => telecharger(`${nomFichier}.md`, texte, "text/markdown")}>Télécharger (.md)</button>
              <button
                className="bouton bouton-ligne"
                onClick={() => telecharger(`${nomFichier}.html`, `<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="ai-generated" content="Texte généré par un système d'IA puis relu et approuvé par l'éditeur du site (règlement (UE) 2024/1689, art. 50)"><title>${plan.titre}</title><body>${html}</body></html>`, "text/html")}
              >
                Télécharger (.html)
              </button>
            </div>
          )}
          {texte && !enCours && approuve && hebergement && (
            <div className="carte" style={{ marginTop: 14 }}>
              {publie?.texte === texte ? (
                <>
                  <p className="aide" style={{ marginTop: 0 }}>
                    <strong>Version hébergée publiée.</strong> Si ce document est déjà intégré au site, il est à jour. Sinon, collez ce code une fois dans la page correspondante :
                  </p>
                  <textarea className="champ" readOnly rows={2} value={publie.script} />
                  <p className="aide">
                    Ou faites pointer le lien du pied de page vers <a href={publie.lien} target="_blank" rel="noreferrer">{publie.lien}</a>. Codes d&apos;intégration : <a href="/compte">Mon compte</a>.
                  </p>
                </>
              ) : (
                <>
                  <p className="aide" style={{ marginTop: 0 }}>
                    Faites-le héberger par Vigie : intégré une fois au site, il sera remplacé par chaque nouvelle version que vous approuverez, par exemple quand la loi change.
                  </p>
                  <button className="bouton bouton-phare" onClick={publier}>
                    Publier la version hébergée
                  </button>
                </>
              )}
            </div>
          )}
          {texte && !enCours && approuve && approbation && (
            <p className="aide" style={{ marginTop: 10 }}>
              Approuvé par vous le {new Date(approbation.date).toLocaleString("fr-FR")} · empreinte {approbation.empreinte.slice(0, 12)}…
            </p>
          )}
          <p className="aide" style={{ marginTop: 14 }}>Modèle généré par IA à partir de l&apos;audit (règlement (UE) 2024/1689, art. 50). Vigie est un logiciel et ne fournit pas de conseil juridique.</p>
        </div>
      </div>
    </div>
  );
}
