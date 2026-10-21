import type { SourceLegale } from "../types";

// Liens vers les textes consolidés (Légifrance, EUR-Lex) et les référentiels des autorités.
const LF = "https://www.legifrance.gouv.fr";
const EU = "https://eur-lex.europa.eu/eli";

export const TEXTES = {
  lcen: `${LF}/loda/id/JORFTEXT000000801164`,
  conso: `${LF}/codes/texte_lc/LEGITEXT000006069565`,
  civil: `${LF}/codes/texte_lc/LEGITEXT000006070721`,
  commerce: `${LF}/codes/texte_lc/LEGITEXT000005634379`,
  cpce: `${LF}/codes/texte_lc/LEGITEXT000006070987`,
  cmf: `${LF}/codes/texte_lc/LEGITEXT000006072026`,
  csp: `${LF}/codes/texte_lc/LEGITEXT000006072665`,
  environnement: `${LF}/codes/texte_lc/LEGITEXT000006074220`,
  assurances: `${LF}/codes/texte_lc/LEGITEXT000006073984`,
  tourisme: `${LF}/codes/texte_lc/LEGITEXT000006074073`,
  cgi: `${LF}/codes/texte_lc/LEGITEXT000006069577`,
  travail: `${LF}/codes/texte_lc/LEGITEXT000006072050`,
  cch: `${LF}/codes/texte_lc/LEGITEXT000006074096`,
  informatiqueLibertes: `${LF}/loda/id/JORFTEXT000000886460`,
  handicap2005: `${LF}/loda/id/JORFTEXT000000809647`,
  decretAccessibilite2019: `${LF}/loda/id/JORFTEXT000038811937`,
  toubon: `${LF}/loda/id/JORFTEXT000000349929`,
  arretePrix1987: `${LF}/loda/id/JORFTEXT000000874009`,
  hoguet: `${LF}/loda/id/JORFTEXT000000512228`,
  influenceurs: `${LF}/loda/id/JORFTEXT000047663185`,
  prixLivre: `${LF}/loda/id/JORFTEXT000000517179`,
  rgpd: `${EU}/reg/2016/679/oj/fra`,
  eprivacy: `${EU}/dir/2002/58/oj/fra`,
  dsa: `${EU}/reg/2022/2065/oj/fra`,
  aiAct: `${EU}/reg/2024/1689/oj/fra`,
  p2b: `${EU}/reg/2019/1150/oj/fra`,
  geoblocage: `${EU}/reg/2018/302/oj/fra`,
  eaa: `${EU}/dir/2019/882/oj/fra`,
  retractationEnLigne: `${EU}/dir/2023/2673/oj/fra`,
  omnibus: `${EU}/dir/2019/2161/oj/fra`,
  transitionVerte: `${EU}/dir/2024/825/oj/fra`,
  reparation: `${EU}/dir/2024/1799/oj/fra`,
  fin_rll: `${EU}/reg/2024/3228/oj/fra`,
  inco: `${EU}/reg/2011/1169/oj/fra`,
  gpsr: `${EU}/reg/2023/988/oj/fra`,
  dataAct: `${EU}/reg/2023/2854/oj/fra`,
  ccd2: `${EU}/dir/2023/2225/oj/fra`,
  cnilCookies: "https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies",
  cnilLignesDirectrices: `${LF}/jorf/id/JORFTEXT000042388179`,
  cnilRecommandation: `${LF}/jorf/id/JORFTEXT000042388193`,
  cnilMesure: "https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies-solutions-pour-les-outils-de-mesure-daudience",
  rgaa: "https://accessibilite.numerique.gouv.fr/",
  mediateurs: "https://www.economie.gouv.fr/mediation-conso/liste-des-mediateurs-references",
} as const;

/**
 * Articles vérifiés un par un (texte en vigueur relu via GoodLegal, base Légifrance, le 14 octobre 2026).
 * Quand une source ne cite qu'un article, son lien pointe directement sur l'article plutôt que sur le code entier.
 * Le détail de la vérification est dans docs/verification-juridique.md.
 */
const art = (id: string) => `${LF}/codes/article_lc/${id}`;
export const ARTICLES = {
  // Code de la consommation
  consoL111_1: art("LEGIARTI000044142438"),
  consoL111_4: art("LEGIARTI000044330854"),
  consoL111_7: art("LEGIARTI000049571125"),
  consoL111_7_2: art("LEGIARTI000049571119"),
  consoL111_7_3: art("LEGIARTI000049571116"),
  consoL112_1: art("LEGIARTI000032227331"),
  consoL112_1_1: art("LEGIARTI000044549592"),
  consoL121_4: art("LEGIARTI000044563107"),
  consoL132_2: art("LEGIARTI000049532070"),
  consoL213_1: art("LEGIARTI000032226994"),
  consoL215_1: art("LEGIARTI000046194176"),
  consoL215_1_1: art("LEGIARTI000046190107"),
  consoL216_1: art("LEGIARTI000044142498"),
  consoL221_5: art("LEGIARTI000044563141"),
  consoL221_13: art("LEGIARTI000044563210"),
  consoL221_14: art("LEGIARTI000032226854"),
  consoL221_21: art("LEGIARTI000053310520"),
  consoD221_5: art("LEGIARTI000053303365"),
  consoL221_28: art("LEGIARTI000044563170"),
  consoL223_1: art("LEGIARTI000051830285"),
  consoL223_2: art("LEGIARTI000051830282"),
  consoL312_5: art("LEGIARTI000032226198"),
  consoR616_1: art("LEGIARTI000032808378"),
  // Autres codes
  civil1127_1: art("LEGIARTI000032007504"),
  civil1127_2: art("LEGIARTI000032007506"),
  commerceR123_237: art("LEGIARTI000045710304"),
  commerceL441_10: art("LEGIARTI000038414392"),
  cpceL34_5: art("LEGIARTI000042155961"),
  cmfL112_12: art("LEGIARTI000035430410"),
  cspL2133_2: art("LEGIARTI000032411563"),
  envL229_68: art("LEGIARTI000043960256"),
  envL541_9_2: art("LEGIARTI000041555848"),
  cchL126_33: art("LEGIARTI000043976944"),
  travailL6352_12: art("LEGIARTI000006904409"),
} as const;

export const src =(texte: string, url: string, article?: string): SourceLegale => ({ texte, url, article });
