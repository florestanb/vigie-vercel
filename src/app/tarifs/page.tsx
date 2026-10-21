import type { Metadata } from "next";
import { Tarifs } from "@/components/Tarifs";
import { paiementSimule } from "@/lib/paiement";
import { compteConnecte } from "@/lib/session";

export const metadata: Metadata = {
  title: "Tarifs",
  description: "Audit complet dès 10 €, génération de tous vos documents légaux pour 29 €, suivi de 50 sites par mois pour 89 €.",
};
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ audit?: string }> }) {
  const { audit } = await searchParams;
  const compte = await compteConnecte();
  return <Tarifs audit={audit && /^[\w-]{6,40}$/.test(audit) ? audit : undefined} email={compte?.email ?? null} simule={paiementSimule()} />;
}
