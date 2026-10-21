"use client";

import { useState } from "react";

export function Connexion({ expire }: { expire: boolean }) {
  const [email, setEmail] = useState("");
  const [etat, setEtat] = useState<"repos" | "envoi" | "envoye">("repos");
  const [erreur, setErreur] = useState<string | null>(expire ? "Ce lien a expiré ou a déjà servi. Demandez-en un nouveau." : null);

  return (
    <div className="etroit page-texte connexion">
      <p className="surtitre">Mon compte</p>
      <h1 style={{ marginTop: 16 }}>Connexion</h1>
      <p className="meta">Pas de mot de passe : recevez un lien de connexion par e-mail, à l&apos;adresse utilisée pour votre achat.</p>
      {etat === "envoye" ? (
        <div className="carte" style={{ marginTop: 24 }}>
          <h3>Vérifiez votre boîte de réception</h3>
          <p className="aide">Si un compte existe pour {email}, un lien de connexion vient d&apos;y être envoyé. Il est valable 30 minutes.</p>
        </div>
      ) : (
        <form
          className="carte questions"
          onSubmit={async (e) => {
            e.preventDefault();
            setEtat("envoi");
            setErreur(null);
            const r = await fetch("/api/connexion", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
            if (r.ok) setEtat("envoye");
            else {
              setErreur(((await r.json().catch(() => ({}))) as { erreur?: string }).erreur ?? "Envoi impossible.");
              setEtat("repos");
            }
          }}
        >
          <div>
            <label className="etiquette" htmlFor="email">Adresse e-mail</label>
            <input id="email" className="champ" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
          </div>
          <button className="bouton bouton-phare" disabled={etat === "envoi" || !email}>
            {etat === "envoi" ? "Envoi…" : "Recevoir mon lien"}
          </button>
          {erreur && <p className="erreur">{erreur}</p>}
        </form>
      )}
      <p className="aide" style={{ marginTop: 20 }}>
        Pas encore client ? <a href="/tarifs">Voir les offres</a>. Le compte est créé automatiquement au paiement.
      </p>
    </div>
  );
}
