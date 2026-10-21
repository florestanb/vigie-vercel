import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Connexion } from "@/components/Connexion";
import { compteConnecte } from "@/lib/session";

export const metadata: Metadata = { title: "Connexion", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ lien?: string }> }) {
  if (await compteConnecte()) redirect("/compte");
  const { lien } = await searchParams;
  return <Connexion expire={lien === "expire"} />;
}
