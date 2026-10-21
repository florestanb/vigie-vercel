import { PageLegale } from "@/components/PageLegale";
import { MENTIONS_LEGALES } from "@/lib/textes-legaux";

export const metadata = { title: "Mentions légales" };

export default function Page() {
  return <PageLegale titre="Mentions légales" texte={MENTIONS_LEGALES} />;
}
