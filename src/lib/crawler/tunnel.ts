import type { BrowserContext, Page } from "playwright-core";
import type { Lien, Tunnel } from "../types";

/**
 * Parcours du tunnel de commande comme le ferait un client : une fiche produit, l'ajout au panier, le panier,
 * puis la page de commande. Le parcours s'arrête là : aucun champ n'est rempli, aucun bouton de validation
 * n'est cliqué, rien n'est jamais commandé ni payé. Le panier créé est celui d'un visiteur anonyme.
 */

const DUREE_MAX = 45_000;
const AJOUT = /^\s*(ajouter\s+au\s+panier|ajouter|add\s+to\s+(cart|bag|basket)|acheter|buy\s+now|commander)\s*$/i;
const VERS_COMMANDE = /^\s*(commander|passer\s+(la|à la|ma)\s+commande|valider\s+(mon|le)\s+panier|finaliser\s+(ma|la)\s+commande|proc[ée]der\s+au\s+paiement|paiement|checkout|check\s+out|proceed\s+to\s+checkout)\s*$/i;
const BOUTON_FINAL = /payer|paiement|commande|commander|acheter|valider|pay\b|pay now|place order|complete order|buy/i;
const CGV = /conditions\s+g[ée]n[ée]rales|\bcgv\b|terms\s+(of|and)\s+(service|sale|conditions)/i;
const LIVRAISON = /livraison|frais\s+de\s+port|exp[ée]dition|shipping/i;
const PAGE_PRODUIT = /\/(produits?|products?|p|article|boutique\/[^/]+\/[^/]+)\/[^/?#]+|\.html?$|-p-\d+|\/\d+-[a-z0-9-]+\.html/i;
const PAGE_PANIER = /\/(cart|panier|basket|bag)(\/|\?|$)/i;
const PAGE_COMMANDE = /\/(checkouts?|commande|order|paiement|caisse)(\/|\?|$)/i;

async function cliquerTexte(page: Page, motif: RegExp): Promise<string | null> {
  const candidats = page.locator('button, a, [role="button"], input[type="submit"]').filter({ hasText: motif });
  const n = Math.min(await candidats.count().catch(() => 0), 8);
  for (let i = 0; i < n; i++) {
    const c = candidats.nth(i);
    if (!(await c.isVisible().catch(() => false))) continue;
    const texte = (await c.innerText().catch(() => "")).trim().slice(0, 60);
    await c.click({ timeout: 4_000 }).catch(() => null);
    return texte || "bouton";
  }
  // Boutons <input type="submit" value="Ajouter au panier"> : leur texte est dans value.
  const inputs = page.locator('input[type="submit"], input[type="button"]');
  for (let i = 0; i < Math.min(await inputs.count().catch(() => 0), 8); i++) {
    const v = (await inputs.nth(i).getAttribute("value").catch(() => "")) ?? "";
    if (motif.test(v) && (await inputs.nth(i).isVisible().catch(() => false))) {
      await inputs.nth(i).click({ timeout: 4_000 }).catch(() => null);
      return v.trim();
    }
  }
  return null;
}

async function attendre(page: Page) {
  await page.waitForLoadState("domcontentloaded", { timeout: 10_000 }).catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 6_000 }).catch(() => {});
  await page.waitForTimeout(800);
}

const texteDe = (page: Page) => page.evaluate("document.body ? document.body.innerText : ''").catch(() => "") as Promise<string>;

/** Prix barré d'une fiche produit : le texte qui l'entoure, pour que le client vérifie le prix de référence. */
const SCRIPT_PRIX_BARRE = `(() => {
  const el = document.querySelector("del, s, strike, [class*='compare' i], [class*='old-price' i], [class*='was-price' i], [class*='regular-price' i]");
  if (!el || !/\\d/.test(el.textContent || "")) return null;
  const bloc = el.closest("[class*='price' i], [class*='prix' i]") || el.parentElement || el;
  return (bloc.innerText || bloc.textContent || "").replace(/\\s+/g, " ").trim().slice(0, 160);
})()`;

/** Produit à ajouter au panier, par l'API publique de la plateforme quand elle en a une. */
async function produitParApi(contexte: BrowserContext, origine: string, plateforme: string | null): Promise<{ page: string; ajout?: () => Promise<boolean> } | null> {
  if (plateforme === "Shopify") {
    const r = await contexte.request.get(`${origine}/products.json?limit=10`, { timeout: 8_000, maxRedirects: 0 }).catch(() => null);
    const produits = r?.ok() ? (((await r.json().catch(() => null)) as { products?: { handle: string; variants: { id: number; available?: boolean }[] }[] } | null)?.products ?? []) : [];
    const p = produits.find((x) => x.variants.some((v) => v.available !== false));
    if (!p) return null;
    const variante = p.variants.find((v) => v.available !== false)!;
    return {
      page: `${origine}/products/${p.handle}`,
      ajout: async () => {
        const a = await contexte.request.post(`${origine}/cart/add.js`, { data: { id: variante.id, quantity: 1 }, timeout: 8_000, maxRedirects: 0 }).catch(() => null);
        return !!a?.ok();
      },
    };
  }
  if (plateforme === "WooCommerce") {
    const r = await contexte.request.get(`${origine}/wp-json/wc/store/v1/products?per_page=10`, { timeout: 8_000, maxRedirects: 0 }).catch(() => null);
    const produits = r?.ok() ? (((await r.json().catch(() => null)) as { id: number; permalink: string; type: string; is_purchasable?: boolean; is_in_stock?: boolean }[] | null) ?? []) : [];
    const p = produits.find((x) => x.type === "simple" && x.is_purchasable !== false && x.is_in_stock !== false);
    if (!p) return null;
    return {
      page: p.permalink,
      ajout: async () => {
        // Sans suivre de redirection : avec VIGIE_PROXY, la cible d'une redirection échapperait au filtre du réseau.
        const a = await contexte.request.get(`${origine}/?add-to-cart=${p.id}`, { timeout: 8_000, maxRedirects: 0 }).catch(() => null);
        return !!a && a.status() < 400;
      },
    };
  }
  return null;
}

export async function parcourirTunnel(
  contexte: BrowserContext,
  urlFinale: string,
  liens: Lien[],
  plateforme: string | null,
  memeSite: (url: string) => boolean,
  capturer: (page: Page, nom: string, legende: string) => Promise<void>,
): Promise<Tunnel> {
  const tunnel: Tunnel = { etapes: [], panierRempli: false, commandeAtteinte: false, boutonsFinals: [], cgvSurCommande: false, fraisLivraison: false };
  const page = await contexte.newPage();
  const chrono = setTimeout(() => page.close().catch(() => {}), DUREE_MAX);
  try {
    const origine = new URL(urlFinale).origin;
    const api = await produitParApi(contexte, origine, plateforme);
    const candidat = api?.page ?? liens.find((l) => memeSite(l.href) && PAGE_PRODUIT.test(new URL(l.href).pathname) && !l.dansPiedDePage)?.href;
    if (!candidat) {
      tunnel.erreur = "Aucune fiche produit repérée depuis la page d'accueil.";
      return tunnel;
    }

    // 1. Fiche produit.
    await page.goto(candidat, { waitUntil: "domcontentloaded", timeout: 20_000 });
    await attendre(page);
    tunnel.etapes.push({ url: page.url(), action: "Fiche produit ouverte" });
    const prixBarre = (await page.evaluate(SCRIPT_PRIX_BARRE).catch(() => null)) as string | null;
    if (prixBarre) tunnel.prixBarre = { url: page.url(), texte: prixBarre };

    // 2. Ajout au panier.
    const ajoutApi = api?.ajout ? await api.ajout() : false;
    const bouton = ajoutApi ? null : await cliquerTexte(page, AJOUT);
    if (ajoutApi || bouton) {
      await attendre(page);
      tunnel.etapes.push({ url: page.url(), action: ajoutApi ? "Produit ajouté au panier" : `Clic sur « ${bouton} »` });
    }

    // 3. Panier.
    const lienPanier = liens.find((l) => memeSite(l.href) && PAGE_PANIER.test(new URL(l.href).pathname))?.href;
    const adressesPanier = [lienPanier, `${origine}/cart`, `${origine}/panier`].filter(Boolean) as string[];
    for (const adresse of adressesPanier) {
      if (PAGE_PANIER.test(new URL(page.url()).pathname)) break;
      const r = await page.goto(adresse, { waitUntil: "domcontentloaded", timeout: 15_000 }).catch(() => null);
      if (r?.ok()) await attendre(page);
    }
    let texte = await texteDe(page);
    tunnel.panierRempli = PAGE_PANIER.test(new URL(page.url()).pathname) && !/(panier|cart)\s+(est\s+)?vide|your cart is empty|aucun (produit|article)/i.test(texte);
    if (!tunnel.panierRempli) {
      tunnel.erreur = "Le panier n'a pas pu être rempli automatiquement.";
      return tunnel;
    }
    tunnel.etapes.push({ url: page.url(), action: "Panier affiché" });
    tunnel.fraisLivraison = LIVRAISON.test(texte);

    // 4. Page de commande, sans rien remplir.
    const versCommande = await cliquerTexte(page, VERS_COMMANDE);
    if (versCommande) await attendre(page);
    if (!PAGE_COMMANDE.test(new URL(page.url()).pathname)) {
      for (const adresse of [`${origine}/checkout`, `${origine}/commande`]) {
        const r = await page.goto(adresse, { waitUntil: "domcontentloaded", timeout: 15_000 }).catch(() => null);
        if (r?.ok()) {
          await attendre(page);
          break;
        }
      }
    }
    // La commande peut passer chez un prestataire de paiement : on s'arrête dès qu'on quitte le site.
    if (!memeSite(page.url()) || !PAGE_COMMANDE.test(new URL(page.url()).pathname)) {
      tunnel.erreur = memeSite(page.url()) ? "La page de commande n'a pas été atteinte." : `La commande se poursuit sur ${new URL(page.url()).hostname} : parcours arrêté.`;
      return tunnel;
    }
    tunnel.commandeAtteinte = true;
    tunnel.etapes.push({ url: page.url(), action: versCommande ? `Clic sur « ${versCommande} »` : "Page de commande ouverte" });
    await capturer(page, "commande", "Page de commande, avant toute saisie (rien n'est commandé)");
    texte = await texteDe(page);
    tunnel.fraisLivraison ||= LIVRAISON.test(texte);
    tunnel.cgvSurCommande = CGV.test(texte);
    const libelles = (await page
      .locator('button, input[type="submit"], [role="button"]')
      .evaluateAll((els) => els.map((e) => ((e as HTMLElement).innerText || (e as HTMLInputElement).value || "").trim()))
      .catch(() => [])) as string[];
    tunnel.boutonsFinals = [...new Set(libelles.filter((l) => l && l.length <= 60 && BOUTON_FINAL.test(l)))].slice(0, 6);
    return tunnel;
  } catch (e) {
    tunnel.erreur = page.isClosed() ? "Parcours interrompu (durée maximale atteinte)." : (e as Error).message.split("\n")[0].slice(0, 200);
    return tunnel;
  } finally {
    clearTimeout(chrono);
    await page.close().catch(() => {});
  }
}
