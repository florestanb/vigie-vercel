import type { Metadata } from "next";
import { ConnexionAdmin } from "@/components/ConnexionAdmin";
import { adminConfigure, estAdmin } from "@/lib/admin";
import { verifierConfiguration } from "@/lib/configuration";
import { lireErreurs } from "@/lib/journal";
import { derniereSauvegarde } from "@/lib/sauvegarde";
import { calculerStatistiques } from "@/lib/statistiques";

export const metadata: Metadata = { title: "Statistiques", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const euros = (n: number) => `${n.toLocaleString("fr-FR")} €`;
const pct = (x: number) => `${Math.round(x * 100)} %`;

export default async function Page() {
  if (!adminConfigure()) return <div className="etroit page-texte"><h1>Statistiques</h1><p className="avertissement">Définissez VIGIE_ADMIN_MOTDEPASSE pour ouvrir l&apos;espace privé.</p></div>;
  if (!(await estAdmin())) return <ConnexionAdmin />;
  const [s, erreurs, sauvegarde] = await Promise.all([calculerStatistiques(30), lireErreurs(30), derniereSauvegarde()]);
  const config = verifierConfiguration();
  const bloquants = config.filter((c) => c.bloquant && !c.ok).length;

  const tuile = (libelle: string, valeur: string, detail?: string) => (
    <div className="tuile">
      <span>{libelle}</span>
      <strong>{valeur}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );

  return (
    <div className="conteneur statistiques">
      <section className="prospection-entete">
        <div>
          <p className="surtitre">Espace privé</p>
          <h1>Statistiques</h1>
          <p className="meta">
            30 derniers jours, et depuis le lancement. <a href="/prospection">Prospection →</a>
          </p>
        </div>
      </section>

      <div className="tuiles">
        {tuile("Chiffre d'affaires (achats)", euros(s.chiffreAffaires.periode), `${euros(s.chiffreAffaires.total)} depuis le lancement`)}
        {tuile("Revenu mensuel (abonnements)", euros(s.revenuMensuel), `${s.abonnementsActifs} abonnement${s.abonnementsActifs > 1 ? "s" : ""} actif${s.abonnementsActifs > 1 ? "s" : ""}`)}
        {tuile("Audits lancés", String(s.audits.periode), `${s.audits.total} au total, ${s.audits.sites} sites`)}
        {tuile("Taux de déblocage", pct(s.tauxDeblocage), `${s.sitesDebloques} sites payés sur ${s.audits.sites} audités`)}
        {tuile("Comptes clients", String(s.comptes), s.rembourses ? `${s.rembourses} achat${s.rembourses > 1 ? "s" : ""} remboursé${s.rembourses > 1 ? "s" : ""}` : undefined)}
        {tuile("Prospection", pct(s.prospection.tauxConversion), `${s.prospection.clientsIssus} client${s.prospection.clientsIssus > 1 ? "s" : ""} sur ${s.prospection.envoyes} sites contactés`)}
      </div>

      <div className="stats-grille">
        <div className="carte">
          <h3>Ventes par offre</h3>
          <table className="registre-table">
            <thead><tr><th>Offre</th><th>Ventes</th><th>Montant</th></tr></thead>
            <tbody>
              {s.ventes.map((v) => (
                <tr key={v.offre}><td>{v.offre}</td><td>{v.nombre}</td><td>{euros(v.montant)}</td></tr>
              ))}
              <tr><td>Suivi (abonnements actifs)</td><td>{s.abonnementsActifs}</td><td>{euros(s.revenuMensuel)} / mois</td></tr>
            </tbody>
          </table>
          <p className="aide">{s.prospection.mailsPrepares} mails de prospection préparés, {s.prospection.envoyes} envoyés.</p>
        </div>

        <div className="carte">
          <h3>Prêt pour la production ? {bloquants ? <span className="etat v-illegal">{bloquants} bloquant{bloquants > 1 ? "s" : ""}</span> : <span className="etat v-conforme">oui</span>}</h3>
          <ul className="config-liste">
            {config.map((c) => (
              <li key={c.nom} className={c.ok ? "ok" : c.bloquant ? "bloquant" : "conseil"}>
                <span>{c.ok ? "✓" : c.bloquant ? "✕" : "!"}</span>
                <div>
                  <strong>{c.nom}</strong>
                  {!c.ok && <small>{c.aide}</small>}
                </div>
              </li>
            ))}
          </ul>
          <p className="aide">Dernière sauvegarde : {sauvegarde ? sauvegarde.toLocaleString("fr-FR") : "aucune"}.</p>
        </div>
      </div>

      <div className="carte" style={{ marginTop: 20 }}>
        <h3>Erreurs récentes</h3>
        {erreurs.length === 0 ? (
          <p className="aide">Aucune erreur enregistrée.</p>
        ) : (
          <table className="registre-table">
            <thead><tr><th>Date</th><th>Où</th><th>Message</th></tr></thead>
            <tbody>
              {erreurs.map((e, i) => (
                <tr key={i}>
                  <td style={{ whiteSpace: "nowrap" }}>{new Date(e.date).toLocaleString("fr-FR")}</td>
                  <td>{e.contexte}</td>
                  <td>{e.message}{e.details ? <small className="aide" style={{ display: "block" }}>{Object.entries(e.details).map(([k, v]) => `${k} : ${v}`).join(" · ")}</small> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
