import { PageLegale } from "@/components/PageLegale";
import { CGV } from "@/lib/textes-legaux";

export const metadata = { title: "Conditions de vente" };

export default function Page() {
  return <PageLegale titre="Conditions générales de vente" texte={CGV} />;
}
