"use client";

import { useState } from "react";
import type { Abonnement, Droit, Marque, SiteSuivi } from "@/lib/comptes";
import type { Point } from "@/lib/historique";
import { offreDe, type Offre } from "@/lib/offres";

const date = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

async function poster(url: string, corps?: object, methode = "POST") {
  const r = await fetch(url, { method: methode, headers: { "content-type": "application/json" }, body: corps ? JSON.stringify(corps) : undefined });
  const donnees = (await r.json().catch(() => ({}))) as { url?: string; erreur?: string; cle?: string; ajoutes?: string[]; refuses?: { site: string; raison: string }[] };
  if (!r.ok) throw new Error(donnees.erreur ?? "Opération impossible.");
  return donnees;
}

export interface DocumentHebergeVue {
  id: string;
  domaine: string;
  titre: string;
  approuve: string;
  aMettreAJour: boolean;
  /** Page de rédaction à ouvrir pour produire la nouvelle version (dernier audit du site). */
  rediger: string | null;
  codes: { lien: string; cadre: string; script: string };
}

interface Props {
  email: string;
  droits: Droit[];
  anciensDroits: number;
  abonnement: Abonnement | null;
  formule: Offre | null;
  sitesSuivis: SiteSuivi[];
  audits: Record<string, { id: string; date: string }>;
  tendances: Record<string, Point[]>;
  heberges: DocumentHebergeVue[];
  marque: Marque | null;
  api: { apercu: string; cree: string } | null;
  contact: string | null;
  facturation: boolean;
  bienvenue: boolean;
  paiement: string | null;
}

const joursRestants = (iso: string) => Math.max(0, Math.ceil((Date.parse(iso) - Date.now()) / 86_400_000));

function lireFichier(f: File, enDataUrl: boolean): Promise<string> {
  return new Promise((ok, ko) => {
    const lecteur = new FileReader();
    lecteur.onload = () => ok(String(lecteur.result));
    lecteur.onerror = () => ko(new Error("Fichier illisible."));
    if (enDataUrl) lecteur.readAsDataURL(f);
    else lecteur.readAsText(f);
  });
}

export function Compte(p: Props) {
  const { email, droits, anciensDroits, abonnement, formule, sitesSuivis, audits, tendances, heberges, contact, facturation, bienvenue, paiement } = p;
  const [erreur, setErreur] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [nouveauSite, setNouveauSite] = useState("");
  const [occupe, setOccupe] = useState(false);
  const [csv, setCsv] = useState("");
  const [cle, setCle] = useState<string | null>(null);
  const [marque, setMarque] = useState<Marque>(p.marque ?? { nom: "" });
  const [codeOuvert, setCodeOuvert] = useState<string | null>(null);

  const agir = async (f: () => Promise<unknown>) => {
    setOccupe(true);
    setErreur(null);
    setMessage(null);
    try {
      await f();
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setOccupe(false);
    }
  };
  const rien = !droits.length && !abonnement;
  const agence = !!formule?.marqueBlanche;

  return (
    <div className="conteneur compte">
      <section className="prospection-entete">
        <div>
          <p className="surtitre">Mon compte{formule ? ` · ${formule.nom}` : ""}</p>
          <h1>Bonjour</h1>
          <p className="meta">{email}</p>
        </div>
        <div className="actions" style={{ marginTop: 0 }}>
          {facturation && (
            <button className="bouton bouton-ligne" disabled={occupe} onClick={() => agir(async () => (location.href = (await poster("/api/compte/portail")).url!))}>
              Factures et abonnement
            </button>
          )}
          <button className="bouton bouton-ligne" onClick={() => agir(async () => (await poster("/api/connexion/deconnexion"), (location.href = "/")))}>
            Se déconnecter
          </button>
        </div>
      </section>

      {bienvenue && <p className="avertissement generation" style={{ marginTop: 20 }}><strong>Merci !</strong> {formule ? "Ajoutez vos sites à suivre ci-dessous." : "Lancez un audit depuis l'accueil : le rapport complet s'affichera pour votre site."}</p>}
      {paiement === "en-attente" && <p className="avertissement" style={{ marginTop: 20 }}>Votre paiement est en cours de validation (prélèvement SEPA par exemple). Vos accès s&apos;ouvriront dès sa confirmation.</p>}
      {erreur && <p className="erreur" role="alert">{erreur}</p>}
      {message && <p className="avertissement generation" role="status">{message}</p>}

      {abonnement && formule && (
        <section className="carte compte-tableau" style={{ marginTop: 28 }}>
          <div className="compte-tableau-tete">
            <div>
              <h3>Sites suivis</h3>
              <p className="aide" style={{ marginTop: 4 }}>
                {sitesSuivis.length} / {formule.sites} · réaudités chaque semaine · alerte en cas de nouveau manquement ou de nouvelle obligation.{" "}
                {abonnement.resilieFinPeriode ? `Résilié : actif jusqu'au ${date(abonnement.finPeriode)}.` : `Renouvellement le ${date(abonnement.finPeriode)}.`}
                {abonnement.statut === "past_due" && " Le dernier paiement a échoué : mettez à jour votre moyen de paiement."}
              </p>
            </div>
            {sitesSuivis.length > 0 && (
              <a className="bouton bouton-ligne" href="/api/compte/export">
                Exporter (CSV)
              </a>
            )}
          </div>
          <form
            style={{ display: "flex", gap: 6, marginTop: 14 }}
            onSubmit={(e) => {
              e.preventDefault();
              agir(async () => {
                await poster("/api/compte/suivi", { site: nouveauSite });
                location.reload();
              });
            }}
          >
            <input className="champ" placeholder="site-du-client.fr" value={nouveauSite} onChange={(e) => setNouveauSite(e.target.value)} aria-label="Site à suivre" />
            <button className="bouton bouton-phare" disabled={occupe || !nouveauSite.trim() || sitesSuivis.length >= formule.sites}>
              Suivre
            </button>
          </form>

          {sitesSuivis.length > 0 && (
            <div className="tableau-defilant">
              <table className="registre-table">
                <thead>
                  <tr>
                    <th>Site</th>
                    <th>Note</th>
                    <th>Manquements certains</th>
                    <th className="col-cachee">Dernier audit</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {sitesSuivis.map((s) => {
                    const dernier = s.historique.at(-1);
                    const avant = s.historique.at(-2);
                    const tendance = dernier && avant ? dernier.illegaux - avant.illegaux : 0;
                    return (
                      <tr key={s.domaine}>
                        <td><strong>{s.domaine}</strong></td>
                        <td>{dernier ? `${dernier.note}/100` : "…"}</td>
                        <td>
                          {dernier ? dernier.illegaux : "Premier audit en cours"}
                          {tendance > 0 && <span className="s-manquant"> (+{tendance})</span>}
                          {tendance < 0 && <span className="s-conforme"> ({tendance})</span>}
                        </td>
                        <td className="col-cachee">{dernier ? date(dernier.date) : ""}</td>
                        <td className="actions-ligne">
                          {dernier && <a href={`/audit/${dernier.audit}`}>Rapport</a>}
                          {dernier && <a href={`/api/compte/dossier?domaine=${encodeURIComponent(s.domaine)}`}>Dossier PDF</a>}
                          <button
                            className="lien-discret"
                            onClick={() =>
                              agir(async () => {
                                await poster("/api/compte/suivi", { domaine: s.domaine }, "DELETE");
                                location.reload();
                              })
                            }
                          >
                            Retirer
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {formule.api && (
            <details className="compte-import">
              <summary>Importer une liste de sites (CSV)</summary>
              <p className="aide">Une adresse par ligne, ou un fichier CSV : la première cellule qui ressemble à une adresse de site est retenue.</p>
              <input
                type="file"
                accept=".csv,.txt,text/csv,text/plain"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) setCsv(await lireFichier(f, false));
                }}
              />
              <textarea className="champ" rows={5} value={csv} onChange={(e) => setCsv(e.target.value)} placeholder={"client-1.fr\nclient-2.com"} style={{ marginTop: 8 }} />
              <button
                className="bouton bouton-phare"
                disabled={occupe || !csv.trim()}
                onClick={() =>
                  agir(async () => {
                    const r = await poster("/api/compte/import", { csv });
                    setCsv("");
                    setMessage(`${r.ajoutes?.length ?? 0} site(s) ajouté(s).${r.refuses?.length ? ` Non ajoutés : ${r.refuses.map((x) => `${x.site} (${x.raison})`).join(", ")}.` : ""}`);
                    setTimeout(() => location.reload(), 2500);
                  })
                }
              >
                Importer
              </button>
            </details>
          )}
        </section>
      )}

      {formule?.hebergement && (
        <section className="carte" style={{ marginTop: 20 }}>
          <h3>Documents hébergés</h3>
          <p className="aide">
            Intégrés une fois au site, ils affichent toujours la dernière version que vous avez approuvée. Quand la loi change, vous êtes prévenu : vous générez et approuvez la
            nouvelle version, et elle remplace l&apos;ancienne sur le site, sans y toucher. Pour en ajouter un : ouvrez le rapport d&apos;un site, générez le document, approuvez-le puis « Publier la version hébergée ».
          </p>
          {heberges.length === 0 ? (
            <p className="aide">Aucun document hébergé pour l&apos;instant.</p>
          ) : (
            <ul className="liste-sites">
              {heberges.map((d) => (
                <li key={d.id} style={{ flexWrap: "wrap" }}>
                  <span>
                    <strong>{d.titre}</strong> · {d.domaine}
                    <span className="aide" style={{ display: "block", marginTop: 0 }}>
                      {d.aMettreAJour ? <strong className="s-partiel">Nouvelle version à approuver (le registre a changé)</strong> : `Version approuvée le ${date(d.approuve)}`}
                    </span>
                  </span>
                  <span className="actions" style={{ marginTop: 0 }}>
                    {d.aMettreAJour && d.rediger && (
                      <a className="bouton bouton-phare" href={d.rediger}>
                        Mettre à jour
                      </a>
                    )}
                    <a href={d.codes.lien} target="_blank" rel="noreferrer">Voir</a>
                    <button className="lien-discret" onClick={() => setCodeOuvert(codeOuvert === d.id ? null : d.id)}>
                      Code d&apos;intégration
                    </button>
                    <button
                      className="lien-discret"
                      onClick={() =>
                        confirm("Retirer ce document ? Il ne s'affichera plus sur le site.") &&
                        agir(async () => {
                          await poster("/api/documents/heberger", { id: d.id }, "DELETE");
                          location.reload();
                        })
                      }
                    >
                      Retirer
                    </button>
                  </span>
                  {codeOuvert === d.id && (
                    <div style={{ width: "100%" }}>
                      <p className="etiquette">Lien direct (pied de page du site)</p>
                      <textarea className="champ" readOnly rows={1} value={d.codes.lien} />
                      <p className="etiquette" style={{ marginTop: 8 }}>Dans la page, mis en forme par votre site (recommandé)</p>
                      <textarea className="champ" readOnly rows={2} value={d.codes.script} />
                      <p className="etiquette" style={{ marginTop: 8 }}>Dans un cadre</p>
                      <textarea className="champ" readOnly rows={2} value={d.codes.cadre} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <div className="compte-grille">
        {rien && (
          <div className="carte vide">
            Aucun achat ni abonnement en cours{anciensDroits ? " (vos achats précédents ont expiré)" : ""}. <a href="/tarifs">Voir les offres</a>.
          </div>
        )}

        {droits.map((d) => {
          const o = offreDe(d.offre);
          return (
            <div className="carte" key={d.id}>
              <p className="surtitre">{o.nom}</p>
              <h3 style={{ marginTop: 12 }}>
                {d.domaines.length} / {o.sites} site{o.sites > 1 ? "s" : ""} débloqué{o.sites > 1 ? "s" : ""}
              </h3>
              <p className="aide">
                Audits illimités {o.documents ? "et génération des documents " : ""}jusqu&apos;au {date(d.expire)}{" "}
                <strong className={joursRestants(d.expire) <= 2 ? "jours-fin" : ""}>({joursRestants(d.expire) > 1 ? `encore ${joursRestants(d.expire)} jours` : "dernier jour"})</strong>.
              </p>
              {d.domaines.length > 0 && (
                <ul className="liste-sites">
                  {d.domaines.map((s) => (
                    <li key={s}>
                      <span>
                        <strong>{s}</strong>
                        {tendances[s]?.length === 2 && (
                          <span className="aide" style={{ display: "block", marginTop: 0 }}>
                            Note {tendances[s][0].note} → <strong>{tendances[s][1].note}</strong> · problèmes illégaux {tendances[s][0].illegaux} → <strong>{tendances[s][1].illegaux}</strong>
                          </span>
                        )}
                      </span>
                      <span className="actions" style={{ marginTop: 0 }}>
                        {audits[s] && (
                          <a className="bouton bouton-phare" href={`/audit/${audits[s].id}`}>
                            Rapport
                          </a>
                        )}
                        {audits[s] && <a href={`/api/compte/dossier?domaine=${encodeURIComponent(s)}`}>Dossier PDF</a>}
                        <a href={`/?site=${encodeURIComponent(s)}#audit`}>Relancer</a>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {d.domaines.length < o.sites && <p className="aide">Lancez l&apos;audit de votre site puis cliquez sur « Débloquer ce site » dans son rapport.</p>}
            </div>
          );
        })}

        {agence && (
          <div className="carte">
            <h3>Votre marque</h3>
            <p className="aide">Les rapports et dossiers PDF de vos clients portent votre nom et votre logo, sans mention de Vigie.</p>
            <form
              style={{ display: "grid", gap: 10, marginTop: 10 }}
              onSubmit={(e) => {
                e.preventDefault();
                agir(async () => {
                  await poster("/api/compte/marque", marque);
                  setMessage("Marque enregistrée.");
                });
              }}
            >
              <div>
                <label className="etiquette" htmlFor="marque-nom">Nom</label>
                <input id="marque-nom" className="champ" value={marque.nom} onChange={(e) => setMarque({ ...marque, nom: e.target.value })} placeholder="Agence Exemple" />
              </div>
              <div>
                <label className="etiquette" htmlFor="marque-contact">Contact (au pied des rapports)</label>
                <input id="marque-contact" className="champ" value={marque.contact ?? ""} onChange={(e) => setMarque({ ...marque, contact: e.target.value })} placeholder="agence-exemple.fr · 01 23 45 67 89" />
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "end" }}>
                <div style={{ flex: 1 }}>
                  <label className="etiquette" htmlFor="marque-logo">Logo (PNG, JPEG ou SVG, 200 Ko)</label>
                  <input
                    id="marque-logo"
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      if (f.size > 200_000) return setErreur("Logo trop lourd : 200 Ko au plus.");
                      const logo = await lireFichier(f, true);
                      setMarque((m) => ({ ...m, logo }));
                    }}
                  />
                </div>
                <div>
                  <label className="etiquette" htmlFor="marque-couleur">Couleur</label>
                  <input id="marque-couleur" type="color" value={marque.couleur ?? "#4338ca"} onChange={(e) => setMarque({ ...marque, couleur: e.target.value })} />
                </div>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {marque.logo && <img src={marque.logo} alt="Aperçu du logo" style={{ maxHeight: 40, maxWidth: 160 }} />}
              <button className="bouton bouton-phare" disabled={occupe || !marque.nom.trim()}>Enregistrer</button>
            </form>
          </div>
        )}

        {formule?.api && (
          <div className="carte">
            <h3>Accès par API</h3>
            <p className="aide">
              Lancez des audits et récupérez les résultats en JSON depuis vos outils. <a href="/api-docs">Documentation</a>.
            </p>
            {cle ? (
              <>
                <p className="etiquette" style={{ marginTop: 10 }}>Votre clé (elle ne sera plus affichée) :</p>
                <textarea className="champ" readOnly rows={2} value={cle} />
              </>
            ) : (
              p.api && <p className="aide">Clé active : <code>{p.api.apercu}</code>, créée le {date(p.api.cree)}.</p>
            )}
            <div className="actions">
              <button
                className="bouton bouton-ligne"
                disabled={occupe}
                onClick={() => (!p.api || confirm("Une nouvelle clé remplace l'ancienne, qui cessera de fonctionner. Continuer ?")) && agir(async () => setCle((await poster("/api/compte/cle-api")).cle ?? null))}
              >
                {p.api ? "Nouvelle clé" : "Créer une clé"}
              </button>
              {p.api && !cle && (
                <button className="lien-discret" onClick={() => agir(async () => (await poster("/api/compte/cle-api", undefined, "DELETE"), location.reload()))}>
                  Révoquer
                </button>
              )}
            </div>
          </div>
        )}

        <div className="carte aide-client">
          <h3>Besoin d&apos;aide ?</h3>
          <ul>
            <li>Pour un nouveau site : lancez son audit depuis l&apos;accueil, puis « Débloquer ce site » dans le rapport{formule ? ", ou ajoutez-le aux sites suivis" : ""}.</li>
            <li>Après une correction, relancez l&apos;audit pour vérifier.</li>
            <li>Le dossier PDF retrace l&apos;historique des audits et des documents approuvés : utile en cas de contrôle.</li>
          </ul>
          {contact ? (
            <p className="aide">
              Une question ? Écrivez-nous à <a href={`mailto:${contact}`}>{contact}</a>.
            </p>
          ) : (
            <p className="aide">Une question ? Répondez simplement à l&apos;e-mail de confirmation de votre achat.</p>
          )}
        </div>
      </div>
    </div>
  );
}
