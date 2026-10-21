"use client";

import { useState } from "react";

export function ConnexionAdmin() {
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  return (
    <div className="etroit page-texte connexion">
      <p className="surtitre">Espace privé</p>
      <h1 style={{ marginTop: 16 }}>Prospection</h1>
      <form
        className="carte questions"
        onSubmit={async (e) => {
          e.preventDefault();
          setEnvoi(true);
          setErreur(null);
          const r = await fetch("/api/prospection/connexion", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ motDePasse }),
          });
          if (r.ok) location.reload();
          else {
            setErreur(((await r.json().catch(() => ({}))) as { erreur?: string }).erreur ?? "Connexion impossible.");
            setEnvoi(false);
          }
        }}
      >
        <div>
          <label className="etiquette" htmlFor="mdp">
            Mot de passe
          </label>
          <input id="mdp" className="champ" type="password" autoComplete="current-password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} autoFocus />
        </div>
        <button className="bouton bouton-phare" disabled={envoi || !motDePasse}>
          {envoi ? "Connexion…" : "Se connecter"}
        </button>
        {erreur && <p className="erreur">{erreur}</p>}
      </form>
    </div>
  );
}
