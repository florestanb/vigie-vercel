"use client";

import { useEffect, useRef, useState } from "react";
import { useAudit } from "./AuditEnCours";

/**
 * Champ « adresse du site » : il s'agrandit quand on clique dedans (la page s'estompe derrière), puis lance
 * l'audit, qui s'affiche en grand par-dessus la page (voir AuditEnCours).
 */
export function FormulaireAudit() {
  const audit = useAudit();
  const [url, setUrl] = useState("");
  const [agrandi, setAgrandi] = useState(false);
  const champ = useRef<HTMLInputElement>(null);
  const enCours = audit?.statut === "en-cours";

  // « Auditer » depuis le compte : l'adresse arrive pré-remplie (?site=…).
  useEffect(() => {
    const site = new URLSearchParams(location.search).get("site");
    if (site) setUrl(site);
  }, []);

  useEffect(() => {
    if (!agrandi) return;
    const echap = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setAgrandi(false);
      champ.current?.blur();
    };
    window.addEventListener("keydown", echap);
    return () => window.removeEventListener("keydown", echap);
  }, [agrandi]);

  function lancer(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return champ.current?.focus();
    setAgrandi(false);
    champ.current?.blur();
    audit?.lancer(url);
  }

  return (
    <>
      {agrandi && <div className="voile-saisie" aria-hidden="true" onMouseDown={() => setAgrandi(false)} />}
      <div className={`saisie-audit${agrandi ? " agrandi" : ""}`}>
        <form className="formulaire-url" onSubmit={lancer} role="search" aria-label="Auditer un site">
          <label htmlFor="url" className="sr-only" style={{ position: "absolute", left: -9999 }}>
            Adresse du site
          </label>
          <svg className="formulaire-loupe" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={champ}
            id="url"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder={agrandi ? "ma-boutique.fr" : "votre-site.fr"}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setAgrandi(true)}
            disabled={enCours}
          />
          <button className="bouton bouton-phare" disabled={enCours}>
            {enCours ? "Audit en cours…" : "Auditer mon site"}
          </button>
        </form>
        <div className="saisie-aide" aria-hidden={!agrandi}>
          <span>⏱ 1 à 2 minutes</span>
          <span>Gratuit, sans inscription</span>
          <span>Rien n&apos;est modifié sur votre site</span>
          <span className="saisie-touche">
            <kbd>Entrée</kbd> pour lancer · <kbd>Échap</kbd> pour fermer
          </span>
        </div>
      </div>
    </>
  );
}
