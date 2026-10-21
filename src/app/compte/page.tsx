import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Compte, type DocumentHebergeVue } from "@/components/Compte";
import { formule } from "@/lib/abonnes";
import { abonnementActif, droitsActifs } from "@/lib/comptes";
import { codesIntegration, hebergesDuCompte, titreDocument } from "@/lib/documents-heberges";
import { EDITEUR } from "@/lib/editeur";
import { historique, type Point } from "@/lib/historique";
import { compteConnecte } from "@/lib/session";

export const metadata: Metadata = { title: "Mon compte", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ bienvenue?: string; paiement?: string }> }) {
  const compte = await compteConnecte();
  const { bienvenue, paiement } = await searchParams;
  if (!compte) redirect(paiement ? `/connexion?paiement=${paiement}` : "/connexion");
  const abo = abonnementActif(compte);
  const domaines = [...new Set(droitsActifs(compte).flatMap((d) => d.domaines))];
  const tendances: Record<string, Point[]> = Object.fromEntries(
    await Promise.all(domaines.map(async (d) => [d, (await historique(`https://${d}`)).slice(-2)] as const)),
  );
  const h = await headers();
  const origine = process.env.VIGIE_URL_PUBLIQUE?.trim().replace(/\/$/, "") || `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;
  const heberges: DocumentHebergeVue[] = (await hebergesDuCompte(compte.id)).map((d) => {
    const dernier = compte.sitesSuivis.find((s) => s.domaine === d.domaine)?.historique.at(-1)?.audit ?? compte.audits?.[d.domaine]?.id ?? d.version.audit;
    return {
      id: d.id,
      domaine: d.domaine,
      titre: titreDocument(d),
      approuve: d.version.approuve,
      aMettreAJour: !!d.aMettreAJour,
      rediger: dernier ? `/audit/${dernier}/document/${d.type}` : null,
      codes: codesIntegration(origine, d),
    };
  });
  return (
    <Compte
      email={compte.email}
      droits={droitsActifs(compte)}
      anciensDroits={compte.droits.length - droitsActifs(compte).length}
      abonnement={abo}
      formule={formule(compte)}
      sitesSuivis={compte.sitesSuivis}
      audits={compte.audits ?? {}}
      tendances={tendances}
      heberges={heberges}
      marque={compte.marque ?? null}
      api={compte.api ? { apercu: compte.api.apercu, cree: compte.api.cree } : null}
      contact={EDITEUR.email.startsWith("[") ? null : EDITEUR.email}
      facturation={!!compte.stripeClient}
      bienvenue={bienvenue === "1"}
      paiement={paiement ?? null}
    />
  );
}
