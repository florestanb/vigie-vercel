import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Redaction } from "@/components/Redaction";
import { peutHeberger } from "@/lib/abonnes";
import { accesAudit } from "@/lib/acces";
import { chargerAudit } from "@/lib/audit";
import { domaineDe } from "@/lib/comptes";
import { PLANS, type TypeDocument } from "@/lib/documents/plans";
import { MAX_TEXTE_EXISTANT } from "@/lib/ia/redaction";
import type { Audit } from "@/lib/types";

type Params = { params: Promise<{ id: string; type: string }> };

export const metadata: Metadata = { title: "Rédaction", robots: { index: false } };
export const dynamic = "force-dynamic";

/** Pré-remplit le questionnaire avec ce que l'audit a déjà trouvé. */
function valeursConnues(a: Audit): Record<string, string> {
  const e = a.entreprise;
  const c = a.crawl;
  const services = [...new Set(c.requetesAvantConsentement.map((r) => r.service).filter(Boolean))];
  return Object.fromEntries(
    Object.entries({
      raisonSociale: e?.nom,
      formeJuridique: e?.formeJuridique,
      adresse: e?.adresse,
      immatriculation: e ? `SIREN ${e.siren}` : c.identite.siren[0] ? `SIREN ${c.identite.siren[0]}` : undefined,
      tva: c.identite.tva[0],
      email: c.identite.emails[0],
      telephone: c.identite.telephones[0],
      directeur: e?.dirigeants?.[0],
      hebergeur: c.identite.hebergeur && c.identite.hebergeur !== "mentionné" ? c.identite.hebergeur : undefined,
      contactRgpd: c.identite.emails[0],
      prestataires: [...services, ...c.signaux.paiement, c.signaux.plateforme].filter(Boolean).join(", ") || undefined,
      outilConsentement: c.cmp ?? undefined,
      paiements: c.signaux.paiement.join(", ") || undefined,
    }).filter(([, v]) => v),
  ) as Record<string, string>;
}

export default async function PageDocument({ params }: Params) {
  const { id, type } = await params;
  const audit = await chargerAudit(id);
  if (!audit || !(type in PLANS)) notFound();
  const acces = await accesAudit(audit);
  if (!acces.documents) redirect(`/tarifs?audit=${audit.id}`);
  const existant = audit.crawl.pagesLegales.find((p) => p.type === type);
  return <Redaction auditId={audit.id} hote={new URL(audit.url).hostname} type={type as TypeDocument} initiales={valeursConnues(audit)} existant={existant?.url ?? null}
      texteExistant={existant && !existant.nonLu ? existant.texte.slice(0, MAX_TEXTE_EXISTANT) : null}
      tronque={(existant?.texte.length ?? 0) > MAX_TEXTE_EXISTANT}
      nonLu={existant?.nonLu ?? null}
      hebergement={peutHeberger(acces.compte, domaineDe(audit.url))} />;
}
