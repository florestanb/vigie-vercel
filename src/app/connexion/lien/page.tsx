import type { Metadata } from "next";
import { ConfirmerConnexion } from "@/components/ConfirmerConnexion";

export const metadata: Metadata = { title: "Connexion", robots: { index: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ jeton?: string }> }) {
  const { jeton } = await searchParams;
  return <ConfirmerConnexion jeton={jeton ?? ""} />;
}
