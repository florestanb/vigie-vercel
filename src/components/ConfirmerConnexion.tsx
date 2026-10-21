"use client";

import { useState } from "react";

export function ConfirmerConnexion({ jeton }: { jeton: string }) {
  const [etat, setEtat] = useState<"repos" | "envoi">("repos");
  const [erreur, setErreur] = useState<string | null>(null);

  return (
    <div className="etroit page-texte connexion">
      <p className="surtitre">Mon compte</p>
      <h1 style={{ marginTop: 16 }}>Accéder à mon espace</h1>
      <div className="carte questions">
        <p className="aide" style={{ marginTop: 0 }}>Cliquez pour vous connecter et retrouver vos rapports.</p>
        <button
          className="bouton bouton-phare"
          disabled={etat === "envoi" || !jeton}
          autoFocus
          onClick={async () => {
            setEtat("envoi");
            setErreur(null);
            const r = await fetch("/api/connexion/lien", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jeton }) });
            const donnees = (await r.json().catch(() => ({}))) as { suite?: string; erreur?: string };
            if (r.ok && donnees.suite) location.href = donnees.suite;
            else {
              setErreur(donnees.erreur ?? "Connexion impossible.");
              setEtat("repos");
            }
          }}
        >
          {etat === "envoi" ? "Connexion…" : "Me connecter"}
        </button>
        {erreur && (
          <p className="erreur">
            {erreur} <a href="/connexion">Recevoir un nouveau lien</a>.
          </p>
        )}
      </div>
    </div>
  );
}
