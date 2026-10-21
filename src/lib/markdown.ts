import { Marked } from "marked";

const echapper = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Le texte vient d'un modèle qui a lu des pages tierces : aucun HTML brut, seulement des liens http(s), mailto ou internes.
const md = new Marked({
  async: false,
  gfm: true,
  renderer: {
    html: ({ text }) => echapper(text),
    link({ href, tokens }) {
      const texte = this.parser.parseInline(tokens);
      if (/^\/(?![/\\])/.test(href)) return `<a href="${echapper(href)}">${texte}</a>`; // page de Vigie
      return /^(https?:|mailto:)/i.test(href) ? `<a href="${echapper(href)}" target="_blank" rel="noreferrer nofollow">${texte}</a>` : texte;
    },
    image: ({ text }) => echapper(text),
  },
});

export function markdownVersHtml(texte: string): string {
  const html = md.parse(texte) as string;
  return html.replace(/\[À COMPLÉTER[^\]]*\]/g, (m) => `<mark>${m}</mark>`);
}
