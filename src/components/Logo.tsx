import Link from "next/link";

/** Marque Vigie : le nom seul, suivi d'un point. */
export function Marque() {
  return (
    <Link href="/" className="marque" aria-label="Vigie, accueil">
      <span>vigie</span>
      <span className="point" aria-hidden="true" />
    </Link>
  );
}
