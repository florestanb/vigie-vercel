import fs from "node:fs/promises";
import { DOSSIER_COMPTES, abonnementActif, chargerCompte, offreAbonnement, type Compte } from "./comptes";
import { tousLesSites } from "./historique";
import { ABONNEMENTS, OFFRES, offreDe } from "./offres";
import { listerCampagnes } from "./prospection/campagne";

/** Chiffres de pilotage : audits, ventes, conversion, prospection. Calculés à la demande depuis les fichiers. */
export interface Statistiques {
  periodeJours: number;
  audits: { total: number; periode: number; sites: number };
  comptes: number;
  ventes: { offre: string; nombre: number; montant: number }[];
  chiffreAffaires: { total: number; periode: number };
  abonnementsActifs: number;
  revenuMensuel: number;
  rembourses: number;
  sitesDebloques: number;
  tauxDeblocage: number;
  prospection: { mailsPrepares: number; envoyes: number; clientsIssus: number; tauxConversion: number };
}

export async function calculerStatistiques(periodeJours = 30): Promise<Statistiques> {
  const depuis = new Date(Date.now() - periodeJours * 86_400_000).toISOString();
  const index = await tousLesSites();
  const points = Object.values(index).flat();

  const comptes: Compte[] = [];
  for (const f of await fs.readdir(DOSSIER_COMPTES).catch(() => [] as string[])) {
    if (!/^[a-f0-9]{24}\.json$/.test(f)) continue;
    const c = await chargerCompte(f.slice(0, 24));
    if (c) comptes.push(c);
  }

  const droits = comptes.flatMap((c) => c.droits);
  const payes = droits.filter((d) => !d.rembourse);
  const abonnes = comptes.filter((c) => abonnementActif(c));
  const ventes = [
    { offre: OFFRES.ponctuel.nom, nombre: payes.length, montant: payes.reduce((s, d) => s + offreDe(d.offre).prix, 0) },
    ...ABONNEMENTS.map((o) => {
      const n = abonnes.filter((c) => offreAbonnement(c.abonnement!).id === o).length;
      return { offre: `${OFFRES[o].nom} (abonnés actifs, par mois)`, nombre: n, montant: n * OFFRES[o].prix };
    }),
  ];
  const debloques = new Set([...payes.flatMap((d) => d.domaines), ...comptes.flatMap((c) => c.abonnement?.domainesPeriode ?? [])]);

  const campagnes = await listerCampagnes();
  const lignes = campagnes.flatMap((c) => c.lignes);
  const contactes = new Set(lignes.filter((l) => l.envoye).map((l) => new URL(l.site).hostname.replace(/^www\./, "")));
  const clientsIssus = [...contactes].filter((d) => debloques.has(d)).length;

  return {
    periodeJours,
    audits: { total: points.length, periode: points.filter((p) => p.date >= depuis).length, sites: Object.keys(index).length },
    comptes: comptes.length,
    ventes,
    chiffreAffaires: {
      total: ventes[0].montant,
      periode: payes.filter((d) => d.achete >= depuis).reduce((s, d) => s + offreDe(d.offre).prix, 0),
    },
    abonnementsActifs: abonnes.length,
    revenuMensuel: abonnes.reduce((s, c) => s + offreAbonnement(c.abonnement!).prix, 0),
    rembourses: droits.length - payes.length,
    sitesDebloques: debloques.size,
    tauxDeblocage: Object.keys(index).length ? debloques.size / Object.keys(index).length : 0,
    prospection: {
      mailsPrepares: lignes.filter((l) => l.etat === "mail").length,
      envoyes: contactes.size,
      clientsIssus,
      tauxConversion: contactes.size ? clientsIssus / contactes.size : 0,
    },
  };
}
