"use client";

import { useEffect, useRef, useState } from "react";
import type { Audit } from "@/lib/types";
import { Rapport } from "./Rapport";

/**
 * Le rapport d'exemple, toujours présenté dans une fenêtre (barre de navigateur, badge et filigrane
 * « Exemple ») pour qu'on ne puisse pas le confondre avec un vrai rapport.
 */
function Fenetre({ audit, hauteur, children }: { audit: Audit; hauteur?: string; children?: React.ReactNode }) {
  return (
    <div className="fenetre">
      <div className="fenetre-barre">
        <span className="fenetre-points" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="fenetre-adresse">vigie · rapport de {new URL(audit.url).hostname.replace(/^www\./, "")}</span>
        <span className="fenetre-badge">Exemple fictif</span>
      </div>
      <div className="fenetre-corps" style={hauteur ? { maxHeight: hauteur } : undefined}>
        <div className="fenetre-filigrane" aria-hidden="true" />
        <div className="fenetre-zoom">
          <Rapport audit={audit} documents={false} iaPossible={false} exemple />
        </div>
        {children}
      </div>
    </div>
  );
}

/** Aperçu sur la page d'accueil : le haut du rapport, et un bouton pour l'ouvrir en grand. */
export function ApercuExemple({ audit }: { audit: Audit }) {
  const [ouvert, setOuvert] = useState(false);
  const dialogue = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogue.current;
    if (!d) return;
    if (ouvert && !d.open) d.showModal();
    if (!ouvert && d.open) d.close();
    document.body.style.overflow = ouvert ? "hidden" : "";
  }, [ouvert]);

  return (
    <>
      <div className="apercu-exemple">
        <div className="apercu-cadre" inert>
          <Fenetre audit={audit} />
        </div>
        <div className="apercu-voile">
          <button className="bouton bouton-phare bouton-grand" onClick={() => setOuvert(true)}>
            Ouvrir l&apos;exemple complet
          </button>
          <a className="apercu-lien" href="/exemple">
            ou sur une page à part
          </a>
        </div>
      </div>

      <dialog
        ref={dialogue}
        className="modale-exemple"
        aria-label="Exemple de rapport"
        onClose={() => setOuvert(false)}
        onClick={(e) => {
          if (e.target === dialogue.current) setOuvert(false);
        }}
      >
        <div className="modale-interieur">
          <button className="modale-fermer" onClick={() => setOuvert(false)} aria-label="Fermer l'exemple">
            ✕
          </button>
          {ouvert && <Fenetre audit={audit} hauteur="calc(100vh - 120px)" />}
        </div>
      </dialog>
    </>
  );
}

/** Version complète, pour la page /exemple. */
export function FenetreExemple({ audit }: { audit: Audit }) {
  return <Fenetre audit={audit} hauteur="78vh" />;
}
