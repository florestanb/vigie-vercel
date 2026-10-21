"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

/**
 * Audit en cours, partagé par tout le site : il est lancé depuis le formulaire de l'accueil, s'affiche en grand
 * par-dessus la page, et peut être réduit en une pastille pour explorer le site pendant qu'il tourne.
 * Le fournisseur vit dans la mise en page commune : il survit aux changements de page (liens internes).
 */

type Evenement =
  | { type: "debut"; estimation: number; ia: boolean }
  | { type: "etape"; message: string }
  | { type: "fin"; id: string }
  | { type: "erreur"; message: string };

type Statut = "inactif" | "en-cours" | "fini" | "erreur";

interface EtatAudit {
  statut: Statut;
  site: string;
  etapes: string[];
  debut: number;
  /** Durée estimée en secondes (envoyée par le serveur au départ). */
  estimation: number;
  ia: boolean;
  id: string | null;
  erreur: string | null;
  reduit: boolean;
}

interface ContexteAudit extends EtatAudit {
  lancer: (url: string) => void;
  reduire: () => void;
  agrandir: () => void;
  annuler: () => void;
}

const Contexte = createContext<ContexteAudit | null>(null);
export const useAudit = () => useContext(Contexte);

const INITIAL: EtatAudit = { statut: "inactif", site: "", etapes: [], debut: 0, estimation: 90, ia: false, id: null, erreur: null, reduit: false };

/** Avancement d'après la dernière étape annoncée par le serveur (0 à 1). */
function avancementEtapes(etapes: string[], ia: boolean): number {
  let p = 0.02;
  let lectures = 0;
  let explorations = 0;
  for (const e of etapes) {
    if (/^Ouverture/.test(e)) p = Math.max(p, 0.05);
    else if (/^Relevé des cookies/.test(e)) p = Math.max(p, 0.14);
    else if (/^Lecture : /.test(e)) p = Math.max(p, Math.min(0.36, 0.16 + 0.04 * ++lectures));
    else if (/^Exploration : /.test(e)) p = Math.max(p, Math.min(0.5, 0.37 + 0.03 * ++explorations));
    else if (/^Tests automatiques d'accessibilité/.test(e)) p = Math.max(p, 0.53);
    else if (/^Analyse des signaux/.test(e)) p = Math.max(p, 0.58);
    else if (/^Parcours du tunnel/.test(e)) p = Math.max(p, 0.64);
    else if (/^Clic sur « Tout refuser »/.test(e)) p = Math.max(p, 0.78);
    else if (/^Vérification de l'entreprise/.test(e)) p = Math.max(p, 0.9);
    else if (/^Lecture des textes légaux par Claude/.test(e)) p = Math.max(p, 0.93);
  }
  // Avec la lecture par Claude, le parcours du site ne fait qu'un peu plus de la moitié du travail.
  return ia ? (p >= 0.93 ? 0.6 : p * 0.6) : p;
}

/** Ce que Vigie fait en ce moment, en une phrase compréhensible. */
function explication(derniere: string | undefined): string {
  if (!derniere || /^Connexion|^Ouverture|^Nouvel essai/.test(derniere)) return "Nous ouvrons votre site dans un vrai navigateur, comme un visiteur.";
  if (/^Relevé des cookies/.test(derniere)) return "Nous notons chaque cookie et chaque service tiers chargés avant que le visiteur ait fait le moindre choix.";
  if (/^Lecture : /.test(derniere)) return "Nous lisons vos pages légales : mentions, confidentialité, CGV, cookies.";
  if (/^Exploration : /.test(derniere)) return "Nous parcourons vos pages utiles : contact, boutique, compte, formulaires.";
  if (/accessibilité/.test(derniere)) return "Nous lançons les tests automatiques d'accessibilité (WCAG 2.1).";
  if (/^Analyse des signaux/.test(derniere)) return "Nous déduisons votre activité : vente en ligne, abonnements, newsletter, avis clients…";
  if (/^Parcours du tunnel/.test(derniere)) return "Nous ajoutons un produit au panier et allons jusqu'à la page de commande, sans jamais rien commander.";
  if (/Tout refuser/.test(derniere)) return "Nous cliquons sur « Tout refuser », puis vérifions qu'aucun traceur ne continue de fonctionner.";
  if (/Sirene/.test(derniere)) return "Nous vérifions votre numéro SIREN au répertoire officiel des entreprises.";
  if (/Claude/.test(derniere)) return "Nous lisons le contenu de vos textes légaux, obligation par obligation.";
  return "Nous croisons ce que nous avons vu avec les obligations du registre.";
}

const libelleDuree = (s: number) => (s >= 90 ? `${Math.round(s / 60)} min` : s >= 60 ? "1 min" : `${Math.max(5, Math.round(s / 5) * 5)} s`);

/** Avancement affiché et temps restant estimé, recalculés chaque seconde. */
function useProgression(etat: EtatAudit) {
  const [maintenant, setMaintenant] = useState(() => Date.now());
  useEffect(() => {
    if (etat.statut !== "en-cours") return;
    const id = setInterval(() => setMaintenant(Date.now()), 1000);
    return () => clearInterval(id);
  }, [etat.statut]);
  const ecoule = Math.max(0, (maintenant - etat.debut) / 1000);
  if (etat.statut === "fini") return { avancement: 1, ecoule, restant: 0, depasse: false };
  const parEtapes = avancementEtapes(etat.etapes, etat.ia);
  // Entre deux étapes, la barre continue d'avancer doucement d'après le temps estimé, sans jamais dépasser 97 %.
  const parTemps = Math.min(0.92, ecoule / etat.estimation);
  const avancement = Math.min(0.97, Math.max(parEtapes, parEtapes + (parTemps - parEtapes) * 0.35));
  const projection = avancement > 0.12 ? (ecoule / avancement) * (1 - avancement) : etat.estimation - ecoule;
  const restant = Math.max(3, (projection + (etat.estimation - ecoule)) / 2);
  return { avancement, ecoule, restant, depasse: ecoule > etat.estimation * 1.25 };
}

export function AuditProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [etat, setEtat] = useState<EtatAudit>(INITIAL);
  const annulation = useRef<AbortController | null>(null);
  const reduitRef = useRef(false);
  reduitRef.current = etat.reduit;

  const lancer = useCallback(
    async (url: string) => {
      annulation.current?.abort();
      const controle = new AbortController();
      annulation.current = controle;
      const site = url.trim().replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
      setEtat({ ...INITIAL, statut: "en-cours", site, etapes: ["Connexion au site"], debut: Date.now() });
      try {
        const reponse = await fetch("/api/audit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url }), signal: controle.signal });
        if (!reponse.body) throw new Error("Réponse vide du serveur.");
        const lecteur = reponse.body.pipeThrough(new TextDecoderStream()).getReader();
        let tampon = "";
        for (;;) {
          const { value, done } = await lecteur.read();
          if (done) break;
          tampon += value;
          const lignes = tampon.split("\n");
          tampon = lignes.pop() ?? "";
          for (const ligne of lignes.filter(Boolean)) {
            const ev = JSON.parse(ligne) as Evenement;
            if (ev.type === "debut") setEtat((e) => ({ ...e, estimation: ev.estimation, ia: ev.ia }));
            if (ev.type === "etape") setEtat((e) => ({ ...e, etapes: [...e.etapes, ev.message] }));
            if (ev.type === "erreur") throw new Error(ev.message);
            if (ev.type === "fin") {
              setEtat((e) => ({ ...e, statut: "fini", id: ev.id, etapes: [...e.etapes, "Rapport prêt"] }));
              // Audit suivi en grand : on ouvre le rapport. Réduit : la pastille propose de l'ouvrir, sans interrompre la visite.
              if (!reduitRef.current) setTimeout(() => router.push(`/audit/${ev.id}`), 700);
              return;
            }
          }
        }
        throw new Error("L'audit s'est interrompu.");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setEtat((e) => ({ ...e, statut: "erreur", erreur: (err as Error).message, reduit: false }));
      }
    },
    [router],
  );

  // Arrivé sur le rapport : le panneau a fini son travail.
  const chemin = usePathname();
  useEffect(() => {
    if (etat.id && chemin === `/audit/${etat.id}`) setEtat(INITIAL);
  }, [chemin, etat.id]);

  const reduire = useCallback(() => setEtat((e) => ({ ...e, reduit: true })), []);
  const agrandir = useCallback(() => setEtat((e) => ({ ...e, reduit: false })), []);
  const annuler = useCallback(() => {
    annulation.current?.abort();
    setEtat(INITIAL);
  }, []);

  return (
    <Contexte.Provider value={{ ...etat, lancer, reduire, agrandir, annuler }}>
      {children}
      <Affichage etat={etat} reduire={reduire} agrandir={agrandir} annuler={annuler} />
    </Contexte.Provider>
  );
}

function Affichage({ etat, reduire, agrandir, annuler }: { etat: EtatAudit; reduire: () => void; agrandir: () => void; annuler: () => void }) {
  const chemin = usePathname();
  const { avancement, ecoule, restant, depasse } = useProgression(etat);
  const pourcent = Math.round(avancement * 100);
  const actif = etat.statut !== "inactif";
  const grand = actif && !etat.reduit;
  const lienRapport = etat.id ? `/audit/${etat.id}` : null;

  // L'onglet affiche l'avancement : utile quand on lit une autre page ou un autre onglet.
  useEffect(() => {
    if (!actif) return;
    const prefixe = /^\((\d+ %|✓)\) /;
    document.title = `(${etat.statut === "fini" ? "✓" : `${pourcent} %`}) ${document.title.replace(prefixe, "")}`;
    return () => void (document.title = document.title.replace(prefixe, ""));
  }, [actif, etat.statut, pourcent]);

  // En grand : la page derrière ne défile plus, Échap réduit l'audit.
  useEffect(() => {
    if (!grand) return;
    document.body.classList.add("sans-defilement");
    const echap = (e: KeyboardEvent) => e.key === "Escape" && etat.statut === "en-cours" && reduire();
    window.addEventListener("keydown", echap);
    return () => {
      document.body.classList.remove("sans-defilement");
      window.removeEventListener("keydown", echap);
    };
  }, [grand, etat.statut, reduire]);

  // Quitter le site pendant l'audit perdrait le rapport : le navigateur demande confirmation.
  useEffect(() => {
    if (etat.statut !== "en-cours") return;
    const prevenir = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", prevenir);
    return () => window.removeEventListener("beforeunload", prevenir);
  }, [etat.statut]);

  if (!actif) return null;

  const explorer = () => {
    reduire();
    // Sur l'accueil, on descend vers la présentation des services ; ailleurs, on reste où l'on est.
    if (chemin === "/") setTimeout(() => document.getElementById("comment")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  if (!grand)
    return (
      <div className={`pastille-audit ${etat.statut}`} role="status" aria-live="polite">
        {etat.statut === "fini" && lienRapport ? (
          <Link href={lienRapport} className="pastille-corps" onClick={annuler}>
            <span className="pastille-icone ok" aria-hidden="true">✓</span>
            <span>
              <strong>Rapport de {etat.site} prêt</strong>
              <small>Voir le rapport →</small>
            </span>
          </Link>
        ) : (
          <button type="button" className="pastille-corps" onClick={agrandir}>
            <span className="pastille-anneau" style={{ "--p": pourcent } as React.CSSProperties} aria-hidden="true">
              <i />
            </span>
            <span>
              <strong>Audit de {etat.site}</strong>
              <small>{depasse ? "Presque fini…" : `${pourcent} % · encore ~${libelleDuree(restant)}`}</small>
            </span>
          </button>
        )}
      </div>
    );

  const visibles = etat.etapes.slice(-7);
  return (
    <div className="voile-audit" role="dialog" aria-modal="true" aria-labelledby="titre-audit">
      <div className="panneau-audit">
        <div className="panneau-tete">
          <div>
            <p className="panneau-surtitre">{etat.statut === "erreur" ? "L'audit n'a pas abouti" : etat.statut === "fini" ? "Audit terminé" : "Audit en cours"}</p>
            <h2 id="titre-audit">{etat.site}</h2>
          </div>
          {etat.statut === "en-cours" && (
            <div className="panneau-temps" aria-live="polite">
              <strong>{depasse ? "Presque fini…" : `~${libelleDuree(restant)}`}</strong>
              <span>{depasse ? "Le site est un peu lent à répondre" : `restantes · ${Math.round(ecoule)} s écoulées`}</span>
            </div>
          )}
        </div>

        {etat.statut === "erreur" ? (
          <>
            <p className="erreur" role="alert">{etat.erreur}</p>
            <div className="panneau-actions">
              <button type="button" className="bouton bouton-phare" onClick={annuler}>
                Réessayer avec une autre adresse
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="panneau-barre" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pourcent} aria-label="Avancement de l'audit">
              <span style={{ width: `${pourcent}%` }} />
            </div>
            <p className="panneau-pourcent">
              {pourcent} %{etat.statut === "en-cours" && <> · estimation initiale : {libelleDuree(etat.estimation)}</>}
            </p>

            <div className="panneau-grille">
              <ol className="panneau-etapes">
                {visibles.map((e, i) => {
                  const derniere = i === visibles.length - 1 && etat.statut === "en-cours";
                  return (
                    <li key={`${etat.etapes.length - visibles.length + i}-${e}`} className={derniere ? "en-cours" : ""}>
                      <span className="panneau-etape-icone" aria-hidden="true">{derniere ? "" : "✓"}</span>
                      {e.length > 70 ? e.slice(0, 67) + "…" : e}
                    </li>
                  );
                })}
              </ol>
              <div className="panneau-explication">
                <p className="etiquette">En ce moment</p>
                <p>{etat.statut === "fini" ? "Votre rapport est prêt. Il s'ouvre…" : explication(etat.etapes.at(-1))}</p>
                <p className="aide">Rien n&apos;est modifié sur votre site : Vigie le parcourt comme un visiteur.</p>
              </div>
            </div>

            <div className="panneau-actions">
              {etat.statut === "fini" && lienRapport ? (
                <Link href={lienRapport} className="bouton bouton-phare" onClick={annuler}>
                  Voir le rapport →
                </Link>
              ) : (
                <>
                  <button type="button" className="bouton bouton-phare" onClick={explorer}>
                    Explorer les services pendant l&apos;audit
                  </button>
                  <button type="button" className="lien-discret" onClick={annuler}>
                    Annuler l&apos;audit
                  </button>
                </>
              )}
            </div>
            {etat.statut === "en-cours" && <p className="aide panneau-note">L&apos;audit continue pendant que vous naviguez sur Vigie : une pastille en bas de l&apos;écran vous suit et vous prévient quand le rapport est prêt.</p>}
          </>
        )}
      </div>
    </div>
  );
}
