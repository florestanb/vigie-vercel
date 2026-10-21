"use client";

import { useEffect, useState } from "react";

type Etat = "ok" | "ko" | "flou";

/** Audit fictif joué en boucle : montre ce que fait Vigie, étape par étape. */
const ETAPES: { titre: string; detail: string; etat: Etat }[] = [
  { titre: "Mentions légales", detail: "Trouvées, SIREN vérifié au répertoire Sirene", etat: "ok" },
  { titre: "Cookies à l'arrivée", detail: "_ga et _fbp déposés avant tout choix", etat: "ko" },
  { titre: "Clic sur « Tout refuser »", detail: "Meta Pixel encore chargé après le refus", etat: "ko" },
  { titre: "Bouton de rétractation", detail: "Absent, obligatoire depuis le 19 juin 2026", etat: "ko" },
  { titre: "Bouton de commande", detail: "« Valider la commande » : formule ambiguë", etat: "flou" },
  { titre: "Accessibilité", detail: "12 images sans texte alternatif", etat: "flou" },
];
const NOTE = 54;
const PAS = 750;

const ICONES: Record<Etat, string> = { ok: "✓", ko: "✕", flou: "!" };

export function AuditEnDirect() {
  // Nombre d'étapes affichées ; au-delà de la dernière, la note s'affiche, puis tout recommence.
  const [n, setN] = useState(ETAPES.length + 1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setN(0);
    let i = 0;
    const id = setInterval(() => {
      i = i > ETAPES.length + 6 ? 0 : i + 1;
      setN(Math.min(i, ETAPES.length + 1));
    }, PAS);
    return () => clearInterval(id);
  }, []);

  const fini = n > ETAPES.length;
  return (
    <div className="direct" aria-label="Exemple d'audit d'une boutique fictive">
      <div className="direct-barre">
        <span className="direct-points" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="direct-adresse">boutique-exemple.fr</span>
        <span className="direct-tag">Exemple fictif</span>
      </div>
      <ol className="direct-liste">
        {ETAPES.map((e, i) => {
          const visible = i < n;
          const enCours = i === n - 1 && !fini && n <= ETAPES.length;
          return (
            <li key={e.titre} className={`direct-ligne${visible ? " visible" : ""}`}>
              <span className={`direct-icone ${enCours ? "en-cours" : e.etat}`} aria-hidden="true">
                {enCours ? "" : ICONES[e.etat]}
              </span>
              <span>
                <strong>{e.titre}</strong>
                <span className="direct-detail">{e.detail}</span>
              </span>
            </li>
          );
        })}
      </ol>
      <div className={`direct-note${fini ? " visible" : ""}`}>
        <span>
          <b>3</b> manquements certains · <b>2</b> zones de flou
        </span>
        <span className="direct-score">
          {NOTE}
          <small>/100</small>
        </span>
      </div>
    </div>
  );
}
