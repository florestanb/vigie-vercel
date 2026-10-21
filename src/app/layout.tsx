import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { AuditProvider } from "@/components/AuditEnCours";
import { Navigation } from "@/components/Navigation";
import { compteConnecte } from "@/lib/session";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Vigie, la conformité légale de votre site", template: "%s · Vigie" },
  description:
    "Vigie parcourt votre site, relève les mentions légales, CGV, politiques de confidentialité et cookies manquants ou mal rédigés, puis génère automatiquement des modèles de documents adaptés à votre activité.",
  icons: { icon: "/favicon.svg" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const connecte = !!(await compteConnecte().catch(() => null));
  return (
    <html lang="fr" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <AuditProvider>
        <Navigation connecte={connecte} />
        <main>{children}</main>
        <footer className="pied">
          <div className="conteneur">
            <p>Vigie est un logiciel d&apos;aide à la conformité, pas un cabinet d&apos;avocats.</p>
            <nav aria-label="Informations légales">
              <Link href="/mentions-legales">Mentions légales</Link>
              <Link href="/confidentialite">Confidentialité et cookies</Link>
              <Link href="/cgu">CGU</Link>
              <Link href="/cgv">CGV</Link>
              <Link href="/obligations">Obligations par activité</Link>
              <Link href="/exemple">Exemple de rapport</Link>
              <Link href="/nouvelles-obligations">Nouvelles obligations</Link>
              <Link href="/api-docs">API</Link>
            </nav>
          </div>
        </footer>
        </AuditProvider>
      </body>
    </html>
  );
}
