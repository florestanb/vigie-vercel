"use client";

import { useState } from "react";
import { MOYENS_DE_PAIEMENT, OFFRES, ORDRE_OFFRES, type IdOffre } from "@/lib/offres";

/**
 * Les trois offres, l'acceptation des CGV et le départ vers le paiement. Utilisé par la page Tarifs
 * et directement dans le rapport gratuit (avec l'audit en cours, débloqué dès le paiement).
 */
export function Offres({ audit, email, simule }: { audit?: string; email: string | null; simule: boolean }) {
  const [cgv, setCgv] = useState(false);
  const [adresse, setAdresse] = useState("");
  const [enCours, setEnCours] = useState<IdOffre | null>(null);
  // L'erreur s'affiche dans la carte cliquée, sous son bouton : là où le regard se trouve.
  const [erreur, setErreur] = useState<{ offre: IdOffre; message: string } | null>(null);
  const [cgvManquante, setCgvManquante] = useState(false);

  async function choisir(offre: IdOffre) {
    if (!cgv) {
      setCgvManquante(true);
      setErreur({ offre, message: "Cochez d'abord la case d'acceptation des conditions générales de vente, au-dessus des offres." });
      const caseCgv = document.getElementById("cgv");
      caseCgv?.scrollIntoView({ behavior: "smooth", block: "center" });
      caseCgv?.focus({ preventScroll: true });
      return;
    }
    setEnCours(offre);
    setErreur(null);
    const r = await fetch("/api/paiement/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ offre, audit, cgv: true, email: adresse || undefined }),
    });
    const donnees = (await r.json().catch(() => ({}))) as { url?: string; erreur?: string };
    if (donnees.url) location.href = donnees.url;
    else {
      setErreur({ offre, message: donnees.erreur ?? "Le paiement n'a pas pu démarrer." });
      setEnCours(null);
    }
  }

  return (
    <div className="bloc-offres">
      <div className="tarifs-acceptation">
        {simule && !email && (
          <input className="champ" type="email" placeholder="E-mail (paiement simulé)" value={adresse} onChange={(e) => setAdresse(e.target.value)} aria-label="Adresse e-mail" />
        )}
        <label className={cgvManquante && !cgv ? "a-cocher" : undefined}>
          <input
            id="cgv"
            type="checkbox"
            checked={cgv}
            onChange={(e) => {
              setCgv(e.target.checked);
              if (e.target.checked) {
                setCgvManquante(false);
                setErreur(null);
              }
            }}
          />
          <span>
            Je commande pour mon activité professionnelle et j&apos;accepte les <a href="/cgv" target="_blank">conditions générales de vente</a>.
          </span>
        </label>
        {email && <p className="aide">Connecté en tant que {email}.</p>}
        {simule && <p className="aide">Mode développement : paiement simulé, aucun débit.</p>}
      </div>

      <div className="offres">
        {ORDRE_OFFRES.map((id) => {
          const o = OFFRES[id];
          return (
            <article key={id} className={`offre${o.recommandee ? " recommandee" : ""}`}>
              {o.recommandee && <p className="offre-badge">Le plus avantageux</p>}
              <h2>{o.nom}</h2>
              <p className="offre-accroche">{o.accroche}</p>
              <p className="offre-prix">
                <strong>{o.prix} €</strong>
                <span>{o.periode === "mois" ? "par mois" : "paiement unique"}</span>
              </p>
              {/* Ligne présente sur chaque carte (vide sauf l'offre mise en avant) : les boutons restent alignés. */}
              <p className="offre-economie">{o.recommandee ? `Soit ${(o.prix / o.sites).toFixed(2).replace(".", ",")} € par site, documents compris` : ""}</p>
              <div className="offre-action">
                <button className={`bouton ${o.recommandee ? "bouton-phare" : "bouton-ligne"}`} onClick={() => choisir(id)} disabled={enCours !== null}>
                  {enCours === id ? "Redirection…" : o.periode === "mois" ? "S'abonner" : "Acheter"}
                </button>
                {erreur?.offre === id && (
                  <p className="erreur offre-erreur" role="alert">
                    {erreur.message}
                  </p>
                )}
              </div>
              <ul>
                {o.avantages.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <p className="moyens-paiement">
        Paiement sécurisé par Stripe · {MOYENS_DE_PAIEMENT.join(" · ")} · Facture avec TVA
      </p>
    </div>
  );
}
