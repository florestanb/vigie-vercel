import { PageLegale } from "@/components/PageLegale";
import { CGU } from "@/lib/textes-legaux";

export const metadata = { title: "Conditions d'utilisation" };

export default function Page() {
  return <PageLegale titre="Conditions générales d'utilisation" texte={CGU} />;
}
