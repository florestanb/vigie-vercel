import { PageLegale } from "@/components/PageLegale";
import { CONFIDENTIALITE } from "@/lib/textes-legaux";

export const metadata = { title: "Confidentialité et cookies" };

export default function Page() {
  return <PageLegale titre="Politique de confidentialité et cookies" texte={CONFIDENTIALITE} />;
}
