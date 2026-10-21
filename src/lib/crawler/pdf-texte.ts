/**
 * Texte d'un document PDF (CGV ou mentions légales publiées en PDF), extrait avec pdf.js (Mozilla, licence Apache 2.0).
 * Les PDF scannés (images sans texte) renvoient un texte vide : la page est alors signalée comme non lue.
 */

const MAX_PAGES = 60;

export async function texteDuPdf(octets: Uint8Array): Promise<string> {
  // Import dynamique : pdf.js n'est chargé que lorsqu'un site publie un PDF.
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const chargement = pdfjs.getDocument({ data: octets, useSystemFonts: false, disableFontFace: true });
  const doc = await chargement.promise;
  const pages: string[] = [];
  try {
    for (let n = 1; n <= Math.min(doc.numPages, MAX_PAGES); n++) {
      const page = await doc.getPage(n);
      const contenu = await page.getTextContent();
      let ligne = "";
      const lignes: string[] = [];
      for (const item of contenu.items) {
        if (!("str" in item)) continue;
        ligne += item.str;
        if (item.hasEOL) {
          lignes.push(ligne);
          ligne = "";
        } else if (item.str && !item.str.endsWith(" ")) ligne += " ";
      }
      if (ligne.trim()) lignes.push(ligne);
      pages.push(lignes.map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean).join("\n"));
    }
  } finally {
    await chargement.destroy();
  }
  return pages.join("\n").trim();
}
