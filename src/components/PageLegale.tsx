import { markdownVersHtml } from "@/lib/markdown";

/** Pages légales de Vigie elle-même. Les champs « [À COMPLÉTER : …] » viennent de src/lib/editeur.ts. */
export function PageLegale({ titre, texte }: { titre: string; texte: string }) {
  const incomplet = texte.includes("[À COMPLÉTER");
  return (
    <div className="etroit page-texte">
      <h1>{titre}</h1>
      {incomplet && (
        <p className="avertissement" style={{ marginBottom: 24 }}>
          Les passages surlignés sont à compléter dans <code>src/lib/editeur.ts</code> avant toute mise en ligne publique.
        </p>
      )}
      <div className="texte-legal" dangerouslySetInnerHTML={{ __html: markdownVersHtml(texte) }} />
    </div>
  );
}
