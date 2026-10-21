/**
 * Récupère le texte officiel de chaque article cité par la revue juridique (src/lib/rules/revue.ts) et l'enregistre
 * dans src/lib/rules/citations.json, avec sa source et sa date de récupération.
 *
 *   npm run citations                 textes européens (EUR-Lex, sans compte) et français si PISTE est configuré
 *   npm run citations -- --ue         textes européens seulement
 *
 * Textes français : API Légifrance de la DILA, via PISTE (https://piste.gouv.fr, compte gratuit). Créez une
 * application, abonnez-la à l'API « Légifrance », puis renseignez PISTE_CLIENT_ID et PISTE_CLIENT_SECRET.
 * Sans ces identifiants, les articles français restent marqués « non récupéré » : rien n'est inventé.
 *
 * Textes européens : version publiée au Journal officiel de l'UE (CELEX). Pour un texte modifié depuis
 * (ex. AI Act par le règlement omnibus de 2026), la version consolidée doit être vérifiée par l'avocat.
 */
import fs from "node:fs";
import path from "node:path";
import { cleRef, type Citation } from "../src/lib/rules/citations-ref";
import { REVUE, type RefArticle } from "../src/lib/rules/revue";

const SORTIE = path.resolve("src/lib/rules/citations.json");
const PISTE_OAUTH = "https://oauth.piste.gouv.fr/api/oauth/token";
const PISTE_API = "https://api.piste.gouv.fr/dila/legifrance/lf-engine-app";

const html2texte = (h: string) =>
  h
    .replace(/<(br|\/p|\/tr|\/div|\/li|\/h\d)[^>]*>/gi, "\n")
    .replace(/<\/td>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{2,}/g, "\n")
    // Une lettre ou un numéro d'énumération seul sur sa ligne (« a) », « 1. ») rejoint son texte.
    .replace(/^(\(?[a-z]{1,3}\)|\d+\.|\(\d+\))\n/gm, "$1 ")
    .trim();

// ---------- EUR-Lex ----------

const pagesUe = new Map<string, string>();
async function articleUe(celex: string, num: string): Promise<{ texte: string; url: string }> {
  const url = `https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:${celex}`;
  if (!pagesUe.has(celex)) {
    const r = await fetch(url, { headers: { "user-agent": "Vigie/registre (+https://github.com/florestanb/vigie)" } });
    if (!r.ok) throw new Error(`EUR-Lex a répondu ${r.status}`);
    pagesUe.set(celex, await r.text());
  }
  const page = pagesUe.get(celex)!;
  const debut = page.indexOf(`id="art_${num}"`);
  if (debut >= 0) {
    const suite = page.slice(debut + 10).search(/<div class="eli-subdivision" id="art_\d/);
    const fragment = page.slice(debut, suite < 0 ? undefined : debut + 10 + suite);
    return { texte: html2texte(fragment.replace(/^[^>]*>/, "")), url: `${url}#art_${num}` };
  }
  // Textes anciens (avant 2013 environ) : titres « <p>Article 5</p> » sans identifiant.
  const titre = new RegExp(`<p[^>]*>\\s*Article ${num}\\s*</p>`);
  const m = titre.exec(page);
  if (!m) throw new Error(`article ${num} introuvable dans le texte ${celex}`);
  const reste = page.slice(m.index + m[0].length);
  const fin = reste.search(/<p[^>]*>\s*(Article \d+|ANNEXE)\s*<\/p>/);
  return { texte: `Article ${num}\n` + html2texte(fin < 0 ? reste.slice(0, 20_000) : reste.slice(0, fin)), url };
}

// ---------- Légifrance (PISTE) ----------

let jeton: string | null = null;
async function piste(chemin: string, corps: object): Promise<any> {
  if (!jeton) {
    const r = await fetch(PISTE_OAUTH, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "client_credentials", client_id: process.env.PISTE_CLIENT_ID!, client_secret: process.env.PISTE_CLIENT_SECRET!, scope: "openid" }),
    });
    if (!r.ok) throw new Error(`authentification PISTE refusée (${r.status})`);
    jeton = ((await r.json()) as { access_token: string }).access_token;
  }
  const r = await fetch(`${PISTE_API}${chemin}`, { method: "POST", headers: { authorization: `Bearer ${jeton}`, "content-type": "application/json", accept: "application/json" }, body: JSON.stringify(corps) });
  if (!r.ok) throw new Error(`API Légifrance ${chemin} : ${r.status} ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

/** Identifiant LEGIARTI de l'article en vigueur, trouvé par recherche sur son numéro. */
async function idArticle(ref: Extract<RefArticle, { type: "code" | "loi" }>): Promise<string> {
  const filtres =
    ref.type === "code"
      ? [{ facette: "NOM_CODE", valeurs: [ref.code] }, { facette: "DATE_VERSION", singleDate: Date.now() }]
      : [{ facette: "TEXT_LEGAL_STATUS", valeur: "VIGUEUR" }];
  const recherche = {
    fond: ref.type === "code" ? "CODE_DATE" : "LODA_DATE",
    recherche: {
      champs: [
        { typeChamp: "NUM_ARTICLE", criteres: [{ typeRecherche: "EXACTE", valeur: ref.num, operateur: "ET" }], operateur: "ET" },
        ...(ref.type === "loi" ? [{ typeChamp: "NUM", criteres: [{ typeRecherche: "EXACTE", valeur: ref.cid, operateur: "ET" }], operateur: "ET" }] : []),
      ],
      filtres,
      pageNumber: 1,
      pageSize: 5,
      operateur: "ET",
      sort: "PERTINENCE",
      typePagination: "ARTICLE",
    },
  };
  const res = await piste("/search", recherche);
  for (const r of res.results ?? []) for (const s of r.sections ?? []) for (const x of s.extracts ?? []) if (x.num === ref.num && /^LEGIARTI/.test(x.id)) return x.id;
  throw new Error("article non trouvé par la recherche Légifrance");
}

async function articleFr(ref: Extract<RefArticle, { type: "code" | "loi" }>): Promise<{ texte: string; url: string; version: string | null }> {
  const id = await idArticle(ref);
  const { article } = await piste("/consult/getArticle", { id });
  const debut = article?.dateDebut ? new Date(article.dateDebut).toISOString().slice(0, 10) : null;
  return {
    texte: html2texte(article?.texteHtml ?? article?.texte ?? ""),
    url: `https://www.legifrance.gouv.fr/${ref.type === "code" ? "codes/article_lc" : "loda/article_lc"}/${id}`,
    version: debut ? `en vigueur depuis le ${debut}` : null,
  };
}

// ---------- Principal ----------

async function principal() {
  const ueSeulement = process.argv.includes("--ue");
  const pisteConfigure = !!(process.env.PISTE_CLIENT_ID && process.env.PISTE_CLIENT_SECRET);
  const existant: Record<string, Citation> = fs.existsSync(SORTIE) ? JSON.parse(fs.readFileSync(SORTIE, "utf8")) : {};
  const refs = new Map<string, RefArticle>();
  for (const r of Object.values(REVUE)) for (const a of r.articles) refs.set(cleRef(a), a);

  const resultat: Record<string, Citation> = { ...existant };
  let ok = 0;
  let echecs = 0;
  for (const [cle, ref] of refs) {
    const nom = ref.type === "code" ? ref.code : ref.nom;
    const base = { nom, num: ref.num, recupere: new Date().toISOString().slice(0, 10) };
    if (ref.type !== "ue" && (ueSeulement || !pisteConfigure)) {
      // On garde un texte déjà récupéré ; sinon, on le marque non récupéré.
      if (!existant[cle]?.texte) resultat[cle] = { ...base, texte: null, url: "", version: null, erreur: "non récupéré : identifiants PISTE absents" };
      continue;
    }
    try {
      const a = ref.type === "ue" ? { ...(await articleUe(ref.celex, ref.num)), version: "texte publié au JOUE" } : await articleFr(ref);
      resultat[cle] = { ...base, ...a };
      ok++;
    } catch (e) {
      resultat[cle] = { ...base, texte: existant[cle]?.texte ?? null, url: existant[cle]?.url ?? "", version: existant[cle]?.version ?? null, erreur: (e as Error).message };
      echecs++;
      console.error(`✗ ${nom}, art. ${ref.num} : ${(e as Error).message}`);
    }
  }
  fs.writeFileSync(SORTIE, JSON.stringify(Object.fromEntries(Object.entries(resultat).sort(([a], [b]) => a.localeCompare(b))), null, 1) + "\n");
  const manquants = Object.values(resultat).filter((c) => !c.texte).length;
  console.log(`${ok} article(s) récupéré(s), ${echecs} échec(s), ${manquants} sans texte sur ${refs.size}.${pisteConfigure ? "" : " Textes français : configurez PISTE_CLIENT_ID et PISTE_CLIENT_SECRET."}`);
}

principal().catch((e) => {
  console.error(e);
  process.exit(1);
});
