import type { NextConfig } from "next";

// En-têtes de sécurité appliqués à toutes les réponses.
const ENTETES = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Les rapports ont des adresses secrètes (/audit/<id>) : on ne les transmet pas aux sites liés.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Aucune page ne s'affiche dans un cadre d'un autre site (l'aperçu des mails, lui, est sur le même site).
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  ...(process.env.NODE_ENV === "production" ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }] : []),
];

/** Fichiers lus à l'exécution (chemins calculés) : à embarquer dans les fonctions Vercel. */
const FICHIERS_EXECUTION = [
  // Chromium compressé pour Vercel (décompressé dans /tmp au premier lancement).
  "./node_modules/@sparticuz/chromium/bin/**",
  // Tests d'accessibilité injectés dans les pages auditées.
  "./node_modules/axe-core/axe.min.js",
  "./node_modules/axe-core/locales/fr.json",
  // Lecture des CGV publiées en PDF.
  "./node_modules/pdfjs-dist/legacy/build/**",
];

const config: NextConfig = {
  // Playwright pilote un vrai navigateur, pdf.js charge son « worker » par un chemin : hors du bundle serveur.
  serverExternalPackages: ["playwright-core", "@sparticuz/chromium", "pdfjs-dist"],
  // Seules les routes qui lancent un navigateur (audit, PDF, tâches) embarquent Chromium.
  outputFileTracingIncludes: {
    "/api/audit": FICHIERS_EXECUTION,
    "/api/audit/[id]/pdf": FICHIERS_EXECUTION,
    "/api/v1/audits": FICHIERS_EXECUTION,
    "/api/compte/dossier": FICHIERS_EXECUTION,
    "/api/documents/pdf": FICHIERS_EXECUTION,
    "/api/interne/tache": FICHIERS_EXECUTION,
    "/api/cron": FICHIERS_EXECUTION,
  },
  poweredByHeader: false,
  async headers() {
    return [
      // Partout sauf les documents hébergés (/d/…), qui sont faits pour s'afficher dans le site du client.
      { source: "/:chemin((?!d/).*)", headers: ENTETES },
      {
        source: "/d/:chemin*",
        headers: [
          ...ENTETES.filter((h) => !["Content-Security-Policy", "X-Frame-Options"].includes(h.key)),
          { key: "Content-Security-Policy", value: "frame-ancestors *; base-uri 'none'; form-action 'none'; object-src 'none'; script-src 'none'" },
        ],
      },
      // Espaces privés et API : jamais en cache, jamais indexés.
      ...["/:section(api|compte|prospection|audit|connexion)/:chemin*", "/:section(compte|prospection|connexion)"].map((source) => ({
        source,
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      })),
    ];
  },
};

export default config;
