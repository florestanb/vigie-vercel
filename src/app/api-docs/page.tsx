import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Vigie",
  description: "Lancer des audits de conformité et récupérer leurs résultats en JSON depuis vos propres outils (offres Agence).",
};

const EXEMPLE_AUDIT = `curl -X POST https://vigie.example/api/v1/audits \\
  -H "Authorization: Bearer vg_votre_cle" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://client.fr"}'`;

const EXEMPLE_REPONSE = `{
  "id": "Xk3…",
  "url": "https://client.fr/",
  "date": "2026-10-13T09:12:44.000Z",
  "rapport": "https://vigie.example/audit/Xk3…",
  "note": 62,
  "compteurs": { "illegal": 3, "flou": 4, "recommande": 1, "aVerifier": 12, "conforme": 21 },
  "resultats": [
    {
      "regle": "cookies.refus-respecte",
      "titre": "Le refus est respecté",
      "verdict": "illegal",
      "statut": "manquant",
      "preuve": "Après un clic sur « Tout refuser », des cookies de suivi ont quand même été déposés : _ga (Google Analytics).",
      "sources": [{ "texte": "Loi Informatique et Libertés", "article": "art. 82", "url": "https://…" }]
    }
  ]
}`;

const ROUTES: [string, string, string][] = [
  ["POST", "/api/v1/audits", "Lance un audit : { \"url\": \"…\", \"ia\": false }. Le site entre dans le quota du mois. Réponse à la fin de l'audit (30 s à 2 min)."],
  ["GET", "/api/v1/audits/{id}", "Résultat complet d'un audit d'un de vos sites."],
  ["GET", "/api/v1/sites", "Vos sites suivis, avec leur historique (note, manquements certains, audit)."],
  ["POST", "/api/v1/sites", "Ajoute un site suivi : { \"url\": \"…\" }. Il sera réaudité chaque semaine."],
  ["DELETE", "/api/v1/sites?domaine=…", "Retire un site suivi."],
];

export default function DocumentationApi() {
  return (
    <div className="conteneur page-texte">
      <p className="surtitre">Offres Agence</p>
      <h1 style={{ marginTop: 10 }}>API</h1>
      <p style={{ maxWidth: "70ch", color: "var(--texte-doux)" }}>
        Lancez des audits et récupérez les constats en JSON depuis vos outils : tableau de bord d&apos;agence, CRM, intégration continue avant mise en ligne d&apos;un
        site. Créez votre clé depuis <a href="/compte">Mon compte</a>.
      </p>

      <h2 style={{ marginTop: 36 }}>Authentification</h2>
      <p>
        Chaque requête porte l&apos;en-tête <code>Authorization: Bearer vg_…</code>. La clé n&apos;est affichée qu&apos;à sa création ; une nouvelle clé remplace l&apos;ancienne.
        Limite : 120 requêtes par heure.
      </p>

      <h2 style={{ marginTop: 36 }}>Routes</h2>
      <table className="registre-table">
        <thead>
          <tr>
            <th>Méthode</th>
            <th>Adresse</th>
            <th>Rôle</th>
          </tr>
        </thead>
        <tbody>
          {ROUTES.map(([m, a, r]) => (
            <tr key={m + a}>
              <td><code>{m}</code></td>
              <td><code>{a}</code></td>
              <td>{r}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: 36 }}>Exemple</h2>
      <pre className="bloc-code">{EXEMPLE_AUDIT}</pre>
      <pre className="bloc-code">{EXEMPLE_REPONSE}</pre>

      <h2 style={{ marginTop: 36 }}>Verdicts</h2>
      <ul>
        <li><code>illegal</code> : obligation écrite dans la loi, manquement établi avec certitude.</li>
        <li><code>flou</code> : exigence d&apos;interprétation, ou constat tiré d&apos;un indice.</li>
        <li><code>recommande</code> : bonne pratique ou mention obsolète à retirer.</li>
        <li><code>a-verifier</code> : non visible depuis le site public.</li>
        <li><code>conforme</code>.</li>
      </ul>
      <p className="meta" style={{ marginTop: 24 }}>Les résultats sont des constats automatisés ; ils ne constituent pas un avis juridique.</p>
    </div>
  );
}
