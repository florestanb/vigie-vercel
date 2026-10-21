"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Marque } from "./Logo";

const LIENS = [
  { href: "/", libelle: "Accueil", actif: (p: string) => p === "/" },
  { href: "/registre", libelle: "Registre", actif: (p: string) => p.startsWith("/registre") || p.startsWith("/obligations") },
  { href: "/nouvelles-obligations", libelle: "Nouveautés 2026", actif: (p: string) => p.startsWith("/nouvelles-obligations") },
  { href: "/tarifs", libelle: "Tarifs", actif: (p: string) => p.startsWith("/tarifs") },
];

/** En-tête du site : logo, quatre liens, compte et appel à l'action ; menu repliable sur mobile. */
export function Navigation({ connecte }: { connecte: boolean }) {
  const chemin = usePathname() ?? "/";
  const [ouvert, setOuvert] = useState(false);
  const [defile, setDefile] = useState(false);

  // Ombre sous l'en-tête dès que la page défile.
  useEffect(() => {
    const surDefilement = () => setDefile(window.scrollY > 8);
    surDefilement();
    window.addEventListener("scroll", surDefilement, { passive: true });
    return () => window.removeEventListener("scroll", surDefilement);
  }, []);

  // Le menu mobile se ferme au changement de page et avec Échap.
  useEffect(() => setOuvert(false), [chemin]);
  useEffect(() => {
    if (!ouvert) return;
    const echap = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false);
    window.addEventListener("keydown", echap);
    return () => window.removeEventListener("keydown", echap);
  }, [ouvert]);

  const compte = { href: "/compte", libelle: connecte ? "Mon compte" : "Connexion" };

  return (
    <header className={`entete${defile ? " defile" : ""}${ouvert ? " menu-ouvert" : ""}`}>
      <div className="conteneur">
        <Marque />

        <nav className="nav" aria-label="Navigation principale">
          {LIENS.map((l) => (
            <Link key={l.href} href={l.href} className="nav-lien" aria-current={l.actif(chemin) ? "page" : undefined}>
              {l.libelle}
            </Link>
          ))}
        </nav>

        <div className="nav-droite">
          <Link href={compte.href} className="nav-lien nav-compte" aria-current={chemin.startsWith("/compte") || chemin.startsWith("/connexion") ? "page" : undefined}>
            {connecte && <span className="nav-pastille" aria-hidden="true" />}
            {compte.libelle}
          </Link>
          <Link href="/#audit" className="bouton bouton-phare nav-action">
            Auditer mon site
            <span className="nav-fleche" aria-hidden="true">→</span>
          </Link>
          <button
            type="button"
            className="nav-burger"
            aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={ouvert}
            aria-controls="menu-mobile"
            onClick={() => setOuvert((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div id="menu-mobile" className="menu-mobile" hidden={!ouvert}>
        <nav aria-label="Navigation principale (mobile)">
          {[...LIENS, { ...compte, actif: (p: string) => p.startsWith("/compte") }].map((l, i) => (
            <Link key={l.href} href={l.href} aria-current={l.actif(chemin) ? "page" : undefined} style={{ animationDelay: `${i * 35}ms` }} onClick={() => setOuvert(false)}>
              {l.libelle}
            </Link>
          ))}
          <Link href="/#audit" className="bouton bouton-phare" onClick={() => setOuvert(false)}>
            Auditer mon site gratuitement
          </Link>
        </nav>
      </div>
    </header>
  );
}
