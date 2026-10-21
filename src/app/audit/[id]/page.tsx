import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Rapport } from "@/components/Rapport";
import { RapportVerrouille } from "@/components/RapportVerrouille";
import { accesAudit, vueVerrouillee } from "@/lib/acces";
import { chargerAudit } from "@/lib/audit";
import { auditPrecedent, pointDe } from "@/lib/historique";
import { iaDisponible } from "@/lib/ia/client";
import { paiementSimule } from "@/lib/paiement";

type Params = { params: Promise<{ id: string }>; searchParams?: Promise<{ debloque?: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const audit = await chargerAudit((await params).id);
  return { title: audit ? `Audit de ${new URL(audit.url).hostname}` : "Audit introuvable", robots: { index: false } };
}

export default async function PageAudit({ params, searchParams }: Params) {
  const audit = await chargerAudit((await params).id);
  if (!audit) notFound();
  const acces = await accesAudit(audit);
  // Sans accès, seule la version réduite (un constat) est calculée et transmise au navigateur.
  if (!acces.complet)
    return (
      <RapportVerrouille
        vue={vueVerrouillee(audit)}
        acces={{ complet: false, documents: false, deblocable: acces.deblocable && { ...acces.deblocable, source: "" } }}
        connecte={!!acces.compte}
        email={acces.compte?.email ?? null}
        simule={paiementSimule()}
      />
    );
  const debloque = (await searchParams)?.debloque === "1";
  const avant = await auditPrecedent(audit);
  return (
    <Rapport
      audit={audit}
      documents={acces.documents}
      iaPossible={iaDisponible()}
      bienvenue={debloque}
      connecte={!!acces.compte}
      evolution={avant ? { avant, apres: pointDe(audit) } : null}
    />
  );
}
