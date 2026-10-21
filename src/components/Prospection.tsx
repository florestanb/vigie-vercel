"use client";

import { useCallback, useEffect, useState } from "react";
import type { Campagne, Etat, Ligne } from "@/lib/prospection/campagne";

type Resume = Omit<Campagne, "lignes"> & { traites: number; mails: number; envoyes: number };

const ETATS: Record<Etat, { libelle: string; classe: string }> = {
  mail: { libelle: "Mail prêt", classe: "v-illegal" },
  "sans-adresse": { libelle: "Pas d'adresse", classe: "v-flou" },
  conforme: { libelle: "Rien de certain", classe: "v-conforme" },
  exclu: { libelle: "Exclu", classe: "v-a-verifier" },
  opposition: { libelle: "Opposé (STOP)", classe: "v-recommande" },
  "deja-contacte": { libelle: "Déjà contacté", classe: "v-a-verifier" },
  erreur: { libelle: "Erreur", classe: "v-a-verifier" },
};

const STATUTS: Record<Campagne["statut"], string> = {
  "en-cours": "En cours",
  terminee: "Terminée",
  arretee: "Arrêtée",
  interrompue: "Interrompue",
};

const dateCourte = (iso: string) => new Date(iso).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, { ...init, headers: { "content-type": "application/json", ...init?.headers } });
  const donnees = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(donnees.erreur ?? `Erreur ${r.status}`);
  return donnees as T;
}

export function Prospection({ expediteurIncomplet }: { expediteurIncomplet: string[] }) {
  const [campagnes, setCampagnes] = useState<Resume[]>([]);
  const [choisie, setChoisie] = useState<string | null>(null);
  const [campagne, setCampagne] = useState<Campagne | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  const rafraichir = useCallback(async () => {
    try {
      const liste = await api<Resume[]>("/api/prospection");
      setCampagnes(liste);
      if (choisie) setCampagne(await api<Campagne>(`/api/prospection/${choisie}`));
    } catch (e) {
      setErreur((e as Error).message);
    }
  }, [choisie]);

  useEffect(() => {
    rafraichir();
  }, [rafraichir]);

  // Suivi en direct tant qu'une campagne tourne.
  const enCours = campagnes.some((c) => c.statut === "en-cours");
  useEffect(() => {
    if (!enCours) return;
    const t = setInterval(rafraichir, 3000);
    return () => clearInterval(t);
  }, [enCours, rafraichir]);

  return (
    <div className="conteneur prospection">
      <section className="prospection-entete">
        <div>
          <p className="surtitre">Espace privé</p>
          <h1>Prospection</h1>
          <p className="meta">Auditez une liste de sites, relisez les mails préparés et envoyez-les depuis votre messagerie. Rien ne part automatiquement.</p>
        </div>
        <a className="bouton bouton-ligne" href="/statistiques">
          Statistiques
        </a>
        <button
          className="bouton bouton-ligne"
          onClick={async () => {
            await fetch("/api/prospection/connexion", { method: "DELETE" });
            location.reload();
          }}
        >
          Se déconnecter
        </button>
      </section>

      {expediteurIncomplet.length > 0 && (
        <p className="avertissement" style={{ marginTop: 20 }}>
          Signature incomplète : renseignez {expediteurIncomplet.join(", ")} dans <code>.env.local</code>, puis relancez le serveur. Sinon les mails
          afficheront « [À COMPLÉTER] ».
        </p>
      )}
      {erreur && <p className="erreur">{erreur}</p>}

      <div className="prospection-grille">
        <aside className="lateral-prospection">
          <NouvelleCampagne
            onCreee={(id) => {
              setChoisie(id);
              rafraichir();
            }}
          />
          <div className="carte">
            <h3>Campagnes</h3>
            {campagnes.length === 0 && <p className="aide">Aucune campagne pour l&apos;instant.</p>}
            <ul className="liste-campagnes">
              {campagnes.map((c) => (
                <li key={c.id}>
                  <button className={c.id === choisie ? "actif" : ""} onClick={() => setChoisie(c.id)}>
                    <strong>{dateCourte(c.creee)}</strong>
                    <span>
                      {c.traites}/{c.sites.length} sites · {c.mails} mail{c.mails > 1 ? "s" : ""} · {c.envoyes} envoyé{c.envoyes > 1 ? "s" : ""}
                    </span>
                    <em className={`statut-${c.statut}`}>{STATUTS[c.statut]}</em>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <Opposition />
        </aside>

        <main>
          {campagne && campagne.id === choisie ? (
            <VueCampagne campagne={campagne} onChange={rafraichir} />
          ) : (
            <div className="carte vide">Choisissez une campagne, ou lancez-en une avec votre liste de sites.</div>
          )}
        </main>
      </div>
    </div>
  );
}

function NouvelleCampagne({ onCreee }: { onCreee: (id: string) => void }) {
  const [sites, setSites] = useState("");
  const [pause, setPause] = useState(15);
  const [ia, setIa] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const nombre = sites.split(/[\n,;\s]+/).filter((s) => s.trim() && !s.startsWith("#")).length;

  return (
    <form
      className="carte questions"
      onSubmit={async (e) => {
        e.preventDefault();
        setEnvoi(true);
        setErreur(null);
        try {
          const { id } = await api<{ id: string }>("/api/prospection", { method: "POST", body: JSON.stringify({ sites, pause, ia }) });
          setSites("");
          onCreee(id);
        } catch (err) {
          setErreur((err as Error).message);
        } finally {
          setEnvoi(false);
        }
      }}
    >
      <h3>Nouvelle campagne</h3>
      <div>
        <label className="etiquette" htmlFor="sites">
          Sites à auditer
        </label>
        <textarea id="sites" className="champ" rows={7} placeholder={"boutique-exemple.fr\nautre-site.com"} value={sites} onChange={(e) => setSites(e.target.value)} />
        <p className="aide">Une adresse par ligne. {nombre > 0 && `${nombre} site${nombre > 1 ? "s" : ""}, environ ${Math.ceil((nombre * (45 + pause)) / 60)} min.`}</p>
      </div>
      <div>
        <label className="etiquette" htmlFor="pause">
          Pause entre deux sites (secondes)
        </label>
        <input id="pause" className="champ" type="number" min={2} max={300} value={pause} onChange={(e) => setPause(Number(e.target.value))} />
      </div>
      <label className="bascule">
        <span>
          Lecture des textes par Claude
          <span className="aide" style={{ display: "block", marginTop: 0 }}>
            Plus lent et payant. Inutile pour les mails, qui ne citent que les constats automatiques.
          </span>
        </span>
        <input type="checkbox" checked={ia} onChange={(e) => setIa(e.target.checked)} />
      </label>
      <button className="bouton bouton-phare" disabled={envoi || nombre === 0}>
        {envoi ? "Lancement…" : "Lancer la campagne"}
      </button>
      {erreur && <p className="erreur">{erreur}</p>}
    </form>
  );
}

function VueCampagne({ campagne, onChange }: { campagne: Campagne; onChange: () => void }) {
  const [filtre, setFiltre] = useState<"a-envoyer" | "envoyes" | "tous">("a-envoyer");
  const [apercu, setApercu] = useState<string | null>(null);
  const total = campagne.sites.length;
  const traites = campagne.lignes.length;
  const lignes = [...campagne.lignes]
    .filter((l) => (filtre === "tous" ? true : filtre === "envoyes" ? !!l.envoye : l.etat === "mail" && !l.envoye))
    .sort((a, b) => (b.manquements ?? -1) - (a.manquements ?? -1));
  const compte = {
    "a-envoyer": campagne.lignes.filter((l) => l.etat === "mail" && !l.envoye).length,
    envoyes: campagne.lignes.filter((l) => l.envoye).length,
    tous: traites,
  };

  const action = async (corps: object) => {
    await api(`/api/prospection/${campagne.id}`, { method: "POST", body: JSON.stringify(corps) });
    onChange();
  };

  return (
    <div className="carte vue-campagne">
      <div className="vue-entete">
        <div>
          <h2>Campagne du {dateCourte(campagne.creee)}</h2>
          <p className="meta">
            {STATUTS[campagne.statut]} · {traites}/{total} sites audités · pause de {campagne.pause} s · {campagne.ia ? "avec" : "sans"} lecture par Claude
          </p>
        </div>
        <div className="actions" style={{ marginTop: 0 }}>
          {campagne.statut === "en-cours" && (
            <button className="bouton bouton-ligne" onClick={() => action({ action: "arreter" })}>
              Arrêter
            </button>
          )}
          {(campagne.statut === "interrompue" || campagne.statut === "arretee") && traites < total && (
            <button className="bouton bouton-phare" onClick={() => action({ action: "reprendre" })}>
              Reprendre
            </button>
          )}
        </div>
      </div>
      <div className="barre" role="progressbar" aria-valuenow={traites} aria-valuemax={total}>
        <span style={{ width: `${total ? (traites / total) * 100 : 0}%` }} />
      </div>

      <div className="filtres" role="tablist">
        {(["a-envoyer", "envoyes", "tous"] as const).map((f) => (
          <button key={f} role="tab" aria-selected={filtre === f} className={filtre === f ? "actif" : ""} onClick={() => setFiltre(f)}>
            {f === "a-envoyer" ? "À envoyer" : f === "envoyes" ? "Envoyés" : "Tous les sites"} <b>{compte[f]}</b>
          </button>
        ))}
      </div>

      {lignes.length === 0 && (
        <p className="vide" style={{ padding: "40px 0" }}>
          {campagne.statut === "en-cours" ? "Les sites s'afficheront ici au fil des audits." : "Rien dans cette liste."}
        </p>
      )}

      <ul className="lignes">
        {lignes.map((l) => (
          <LigneSite
            key={l.site}
            ligne={l}
            campagneId={campagne.id}
            ouvert={apercu === l.site}
            onApercu={() => setApercu(apercu === l.site ? null : l.site)}
            onEnvoye={(envoye) => action({ action: "envoye", site: l.site, envoye })}
            onChange={onChange}
          />
        ))}
      </ul>
    </div>
  );
}

function LigneSite({
  ligne: l,
  campagneId,
  ouvert,
  onApercu,
  onEnvoye,
  onChange,
}: {
  ligne: Ligne;
  campagneId: string;
  ouvert: boolean;
  onApercu: () => void;
  onEnvoye: (envoye: boolean) => void;
  onChange: () => void;
}) {
  const [copie, setCopie] = useState(false);
  const base = l.fichier ? `/api/prospection/${campagneId}/mail/${l.fichier}` : null;
  const etat = ETATS[l.etat];

  // Le .txt commence par « À : … » et « Objet : … », puis le corps du mail.
  const corps = async () => {
    const t = await (await fetch(`${base}?format=txt`)).text();
    return t.split("\n\n").slice(1).join("\n\n");
  };

  return (
    <li className={`ligne-site${l.envoye ? " envoye" : ""}`}>
      <div className="ligne-haut">
        <div className="ligne-site-nom">
          <a href={l.site} target="_blank" rel="noreferrer">
            {l.site.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
          </a>
          <span className={`etat ${etat.classe}`}>{etat.libelle}</span>
          {l.envoye && <span className="etat v-conforme">Envoyé le {dateCourte(l.envoye)}</span>}
        </div>
        <div className="ligne-chiffres">
          {l.note !== undefined && (
            <span>
              <b>{l.note}</b>/100
            </span>
          )}
          {l.manquements !== undefined && (
            <span>
              <b>{l.manquements}</b> manquement{(l.manquements ?? 0) > 1 ? "s" : ""}
            </span>
          )}
          {l.audit && (
            <a href={`/audit/${l.audit}`} target="_blank" rel="noreferrer">
              Rapport
            </a>
          )}
        </div>
      </div>
      {l.detail && <p className="aide">{l.detail}</p>}
      {l.destinataire && <p className="aide">À : {l.destinataire}</p>}

      {base && (
        <div className="actions">
          <button className="bouton bouton-ligne" onClick={onApercu}>
            {ouvert ? "Fermer l'aperçu" : "Aperçu"}
          </button>
          {l.destinataire && (
            <button
              className="bouton bouton-ligne"
              onClick={async () => {
                const sujet = encodeURIComponent(l.objet ?? "");
                const texte = encodeURIComponent(await corps());
                location.href = `mailto:${l.destinataire}?subject=${sujet}&body=${texte}`;
              }}
            >
              Ouvrir dans ma messagerie
            </button>
          )}
          <a className="bouton bouton-ligne" href={`${base}?format=eml`}>
            Brouillon .eml
          </a>
          <button
            className="bouton bouton-ligne"
            onClick={async () => {
              await navigator.clipboard.writeText(await corps());
              setCopie(true);
              setTimeout(() => setCopie(false), 2000);
            }}
          >
            {copie ? "Copié" : "Copier le texte"}
          </button>
          <button className={`bouton ${l.envoye ? "bouton-ligne" : "bouton-phare"}`} onClick={() => onEnvoye(!l.envoye)}>
            {l.envoye ? "Annuler « envoyé »" : "Marquer envoyé"}
          </button>
          <button
            className="bouton bouton-ligne bouton-danger"
            onClick={async () => {
              const valeur = l.destinataire ?? new URL(l.site).hostname;
              if (!confirm(`Ajouter ${valeur} à la liste d'opposition ? Plus aucun mail ne lui sera préparé.`)) return;
              await api("/api/prospection/opposition", { method: "POST", body: JSON.stringify({ valeur }) });
              onChange();
            }}
          >
            STOP reçu
          </button>
        </div>
      )}
      {ouvert && base && <iframe className="apercu-mail" src={`${base}?format=html`} sandbox="" title={`Aperçu du mail pour ${l.site}`} />}
    </li>
  );
}

function Opposition() {
  const [liste, setListe] = useState<string[]>([]);
  const [valeur, setValeur] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const charger = useCallback(() => api<string[]>("/api/prospection/opposition").then(setListe).catch(() => {}), []);
  useEffect(() => {
    charger();
  }, [charger]);

  return (
    <form
      className="carte questions"
      onSubmit={async (e) => {
        e.preventDefault();
        setErreur(null);
        try {
          await api("/api/prospection/opposition", { method: "POST", body: JSON.stringify({ valeur }) });
          setValeur("");
          charger();
        } catch (err) {
          setErreur((err as Error).message);
        }
      }}
    >
      <h3>Liste d&apos;opposition</h3>
      <p className="aide" style={{ marginTop: -6 }}>
        Ceux qui ont répondu STOP. Ils sont ignorés par toutes les campagnes ({liste.length}).
      </p>
      <div style={{ display: "flex", gap: 6 }}>
        <input className="champ" placeholder="domaine.fr ou adresse" value={valeur} onChange={(e) => setValeur(e.target.value)} aria-label="Domaine ou adresse à ajouter" />
        <button className="bouton bouton-ligne" disabled={!valeur.trim()}>
          Ajouter
        </button>
      </div>
      {erreur && <p className="erreur">{erreur}</p>}
      {liste.length > 0 && (
        <details>
          <summary className="aide">Voir la liste</summary>
          <ul className="controles">{liste.map((v) => <li key={v}>{v}</li>)}</ul>
        </details>
      )}
    </form>
  );
}
