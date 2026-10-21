"use client";

import { useEffect, useRef, useState } from "react";

/**
 * « Comment ça marche » en motion design : quatre scènes qui rejouent l'usage réel de Vigie, dans un
 * écran de démonstration. Les scènes s'enchaînent quand la section est visible, chaque étape est
 * cliquable, et tout s'arrête pour les visiteurs qui ont demandé à réduire les animations.
 */

const DUREE_MS = 6500;
const ADRESSE = "boutique-exemple.fr";

const ETAPES = [
  { titre: "Entrez l'adresse de votre site", texte: "Aucune inscription : l'adresse suffit pour lancer l'audit gratuit." },
  { titre: "Vigie parcourt le site", texte: "Comme un contrôleur : pages légales, formulaires, cookies et services tiers chargés sans consentement." },
  { titre: "Les problèmes apparaissent", texte: "Chaque manquement avec sa preuve, le texte de loi et la sanction encourue." },
  { titre: "Débloquez, corrigez, approuvez", texte: "Le rapport complet, puis les documents générés pour votre site, à relire et approuver." },
];

function useCompteur(cible: number, dureeMs: number, delaiMs = 0) {
  const [valeur, setValeur] = useState(0);
  useEffect(() => {
    let raf = 0;
    const debut = performance.now() + delaiMs;
    const tick = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - debut) / dureeMs));
      setValeur(Math.round(cible * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cible, dureeMs, delaiMs]);
  return valeur;
}

function SceneSaisie() {
  const [texte, setTexte] = useState("");
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTexte(ADRESSE.slice(0, i));
      if (i >= ADRESSE.length) clearInterval(t);
    }, 85);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="scene scene-saisie">
      <p className="mini-marque">
        vigie<span />
      </p>
      <p className="mini-titre">Votre site est-il en règle ?</p>
      <div className="mini-champ">
        <span className="mini-texte">
          {texte || <span className="mini-placeholder">votre-site.fr</span>}
          <i className="curseur" />
        </span>
        <span className="mini-bouton">Auditer mon site</span>
        <span className="clic" aria-hidden="true" />
      </div>
      <p className="mini-lancement">
        <span className="rond" /> Audit en cours…
      </p>
    </div>
  );
}

function SceneParcours() {
  const obligations = useCompteur(88, 3800, 300);
  const lignes: [string, "ok" | "ko" | "flou"][] = [
    ["Page d'accueil lue", "ok"],
    ["Mentions légales trouvées", "ok"],
    ["Conditions générales de vente", "ok"],
    ["12 traceurs chargés sans consentement", "ko"],
    ["Bandeau cookies sans « Tout refuser »", "flou"],
    ["Aucun médiateur de la consommation", "ko"],
  ];
  return (
    <div className="scene scene-parcours">
      <div className="mini-site" aria-hidden="true">
        <div className="mini-site-nav" />
        <div className="mini-site-hero" />
        <div className="mini-site-grille">
          <i />
          <i />
          <i />
        </div>
        <div className="mini-site-pied" />
        <div className="faisceau-scan" />
      </div>
      <div className="mini-journal">
        <p className="mini-compteur">
          <strong>{obligations}</strong> obligations vérifiées
        </p>
        <ul>
          {lignes.map(([l, etat], i) => (
            <li key={l} className={etat} style={{ "--d": `${0.5 + i * 0.6}s` } as React.CSSProperties}>
              <span>{etat === "ok" ? "✓" : etat === "ko" ? "✕" : "!"}</span>
              {l}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SceneRapport() {
  const note = useCompteur(58, 1600, 200);
  const r = 34;
  const tour = 2 * Math.PI * r;
  const cartes = [
    ["Aucun traceur avant consentement", "Jusqu'à 10 M€ ou 2 % du CA"],
    ["Directeur de la publication", "Jusqu'à 375 000 € d'amende"],
    ["Médiateur de la consommation", "Jusqu'à 15 000 € d'amende"],
  ];
  return (
    <div className="scene scene-rapport">
      <div className="mini-entete">
        <div>
          <p className="mini-surtitre">Rapport d&apos;audit</p>
          <p className="mini-site-nom">boutique-exemple.fr</p>
          <p className="mini-chips">
            <span className="v-illegal">4 illégaux</span>
            <span className="v-flou">3 en zone de flou</span>
          </p>
        </div>
        <div className="mini-jauge">
          <svg viewBox="0 0 84 84" width="84" height="84" aria-hidden="true">
            <circle cx="42" cy="42" r={r} fill="none" stroke="var(--gris-3)" strokeWidth="7" />
            <circle cx="42" cy="42" r={r} fill="none" stroke="var(--partiel)" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${(note / 100) * tour} ${tour}`} transform="rotate(-90 42 42)" />
          </svg>
          <strong>{note}</strong>
        </div>
      </div>
      {cartes.map(([titre, sanction], i) => (
        <div key={titre} className="mini-carte" style={{ "--d": `${0.9 + i * 0.5}s` } as React.CSSProperties}>
          <span className="pastille v-illegal">✕</span>
          <span className="mini-carte-titre">{titre}</span>
          <span className="mini-risque">{sanction}</span>
        </div>
      ))}
    </div>
  );
}

function SceneCorrection() {
  return (
    <div className="scene scene-correction">
      <div className="mini-deblocage">
        {["Formulaires sans information", "Hébergeur incomplet", "CGV sans rétractation"].map((t, i) => (
          <div key={t} className="mini-carte floue" style={{ "--d": `${0.3 + i * 0.15}s` } as React.CSSProperties}>
            <span className="pastille v-flou">!</span>
            <span className="mini-carte-titre">{t}</span>
          </div>
        ))}
        <span className="mini-cadenas" aria-hidden="true">
          🔓 Débloqué
        </span>
      </div>
      <div className="mini-document">
        <p className="mini-doc-titre">Mentions légales</p>
        {[92, 78, 85, 60].map((w, i) => (
          <i key={i} className="mini-ligne" style={{ "--w": `${w}%`, "--d": `${2 + i * 0.35}s` } as React.CSSProperties} />
        ))}
        <span className="mini-completer">[À COMPLÉTER : capital social]</span>
        <label className="mini-approuver">
          <span className="case" /> J&apos;ai relu et j&apos;approuve ce modèle
        </label>
      </div>
      <p className="mini-progres">
        Note <s>58</s> → <strong>92</strong>
      </p>
    </div>
  );
}

const SCENES = [SceneSaisie, SceneParcours, SceneRapport, SceneCorrection];

export function Demonstration() {
  const [etape, setEtape] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [visible, setVisible] = useState(false);
  const [reduit, setReduit] = useState(false);
  const section = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReduit(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    if (section.current) obs.observe(section.current);
    return () => obs.disconnect();
  }, []);

  // Enchaînement automatique, seulement quand la section est à l'écran.
  useEffect(() => {
    if (!visible || reduit) return;
    const t = setTimeout(() => {
      setEtape((e) => (e + 1) % ETAPES.length);
      setCycle((c) => c + 1);
    }, DUREE_MS);
    return () => clearTimeout(t);
  }, [etape, cycle, visible, reduit]);

  const Scene = SCENES[etape];
  return (
    <div className={`demo${visible ? " demo-active" : ""}`} ref={section}>
      <ol className="demo-etapes">
        {ETAPES.map((e, i) => (
          <li key={e.titre}>
            <button
              className={i === etape ? "actif" : ""}
              onClick={() => {
                setEtape(i);
                setCycle((c) => c + 1);
              }}
              aria-current={i === etape ? "step" : undefined}
            >
              <span className="demo-num">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <strong>{e.titre}</strong>
                <span className="demo-texte">{e.texte}</span>
              </span>
              {i === etape && visible && !reduit && <i key={cycle} className="demo-progression" style={{ animationDuration: `${DUREE_MS}ms` }} />}
            </button>
          </li>
        ))}
      </ol>
      <div className="demo-ecran" aria-hidden="true">
        <div className="fenetre-barre">
          <span className="fenetre-points">
            <i />
            <i />
            <i />
          </span>
          <span className="fenetre-adresse">vigie · démonstration</span>
        </div>
        <div className="demo-scene">{visible || reduit ? <Scene key={`${etape}-${cycle}`} /> : null}</div>
      </div>
    </div>
  );
}
