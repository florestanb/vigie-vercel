import { lancerAudit } from "../src/lib/audit";
import { constatsCertains, motifExclusion } from "../src/lib/prospection/selection";
import type { Audit } from "../src/lib/types";

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36";
const texteDe = async (url: string) => {
  try {
    const r = await fetch(url, { headers: { "user-agent": UA, "accept-language": "fr-FR" }, redirect: "follow", signal: AbortSignal.timeout(15000) });
    return (await r.text()).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#160;/g, " ").replace(/\s+/g, " ");
  } catch {
    return "";
  }
};

// Contre-vérification indépendante : motifs larges, sur les pages retéléchargées (et non sur les données du crawler).
const MOTIFS: Record<string, RegExp> = {
  "id.directeur-publication": /directeur|directrice|responsable de (la )?publication|publication\s*:/i,
  "vente.mediateur": /m[ée]diat(eur|ion)/i,
  "id.immatriculation": /\b(siren|siret|rcs|r\.c\.s|immatricul)/i,
  "id.hebergeur": /h[ée]berg|hosting|host[ée]/i,
  "id.contact": /@[a-z0-9-]+\.[a-z]{2,}|(\+33|0)[1-9](\s?\d{2}){4}/i,
  "id.identite-editeur": /capital|si[èe]ge/i,
};

async function verifier(a: Audit) {
  const pages = a.crawl.pagesLegales.map((p) => p.url);
  const textes = await Promise.all([a.url, ...pages].map(texteDe));
  const tout = textes.join(" ");
  const sortie: string[] = [];
  for (const r of constatsCertains(a)) {
    const m = MOTIFS[r.regle.id];
    if (r.regle.id === "cookies.consentement-prealable") {
      const cookies = a.crawl.cookiesAvantConsentement.filter((k) => ["analytics", "publicite", "reseau-social"].includes(k.categorie));
      const requetes = a.crawl.requetesAvantConsentement.filter((q) => ["analytics", "publicite", "reseau-social"].includes(q.categorie));
      sortie.push(`  ${cookies.length ? "CONFIRMÉ (cookies déposés)" : "DOUTE (scripts seuls, aucun cookie)"} ${r.regle.id} | cookies : ${cookies.map((k) => k.nom).slice(0, 6).join(", ") || "aucun"} | scripts : ${requetes.map((q) => q.service ?? q.domaine).slice(0, 5).join(", ")}`);
    } else if (r.regle.id.startsWith("id.page-") || r.regle.id === "vente.cgv" || r.regle.id === "rgpd.politique") {
      const motif = { "id.page-mentions": /mentions?\s*l[ée]gales/i, "vente.cgv": /conditions\s+g[ée]n[ée]rales\s+de\s+vente|\bcgv\b/i, "rgpd.politique": /confidentialit|donn[ée]es personnelles|privacy/i }[r.regle.id];
      const html = await fetch(a.url, { headers: { "user-agent": UA } }).then((x) => x.text()).catch(() => "");
      sortie.push(`  ${motif && motif.test(html) ? "DOUTE (mot trouvé dans le HTML de l'accueil)" : "CONFIRMÉ"} ${r.regle.id} | ${r.preuve}`);
    } else if (m) {
      const trouve = tout.match(m);
      sortie.push(`  ${trouve ? `DOUTE (« ${tout.slice(Math.max(0, trouve.index! - 50), trouve.index! + 70).trim()} »)` : "CONFIRMÉ"} ${r.regle.id} | ${r.preuve}`);
    } else sortie.push(`  À VOIR ${r.regle.id} | ${r.preuve}`);
  }
  return sortie;
}

for (const site of process.argv.slice(2)) {
  try {
    const a = await lancerAudit(site, () => {}, { ia: false });
    const ex = motifExclusion(a);
    console.log(`\n### ${site} → ${a.url} | ${a.crawl.pagesLegales.map((p) => p.type).join(",")}${ex ? ` | EXCLU : ${ex}` : ""}`);
    if (!ex) for (const l of await verifier(a)) console.log(l);
  } catch (e) {
    console.log(`\n### ${site} ERREUR ${(e as Error).message.split("\n")[0].slice(0, 90)}`);
  }
}
process.exit(0);
