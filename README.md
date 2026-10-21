# Vigie

**Audit légal automatisé des sites web, en droit français et européen.**

On donne une URL. Vigie parcourt le site comme le ferait un contrôleur de la DGCCRF ou de la CNIL, relève ce qui manque ou est mal rédigé (mentions légales, CGV, CGU, politique de confidentialité, cookies, accessibilité…), puis rédige les textes adaptés au site lui-même.

![Accueil](docs/captures/accueil-bureau.png)

## Ce que fait Vigie

1. **Parcours du site** dans un vrai navigateur (Chromium headless) : page d'accueil (défilée jusqu'en bas pour charger le pied de page), pages légales (trouvées par leurs liens, sinon aux adresses usuelles), panier, compte, contact. Tout ce qui est chargé *avant* le moindre clic sur le bandeau cookies est enregistré (requêtes, cookies, services tiers). Puis :
   - **test du refus** : dans un navigateur vierge, clic sur « Tout refuser », rechargement, et relevé des cookies écrits et des services contactés malgré le refus (`src/lib/crawler/refus.ts`) ;
   - **tunnel de commande** : fiche produit (prix barré relevé), ajout au panier (API Shopify et WooCommerce, sinon clic), panier, page de commande, **sans jamais rien saisir, valider ni payer** ; libellé du bouton final, CGV et frais de livraison relevés (`tunnel.ts`, désactivé pour les audits de prospection) ;
   - **accessibilité** : tests automatiques axe-core (WCAG 2.1 A et AA) sur la page d'accueil (`accessibilite.ts`) ;
   - **captures d'écran** (bandeau à l'arrivée, page après refus, page de commande), gardées à côté de l'audit et reprises dans le PDF.
2. **Profil du site** : e-commerce, abonnement, comptes, newsletter, chatbot IA, avis clients, vente d'alcool, B2B ou B2C… Le profil est déduit automatiquement et corrigeable par l'utilisateur ; le rapport se recalcule instantanément.
3. **Vérification** de 93 obligations, chacune rattachée à ses sources (Légifrance, EUR-Lex) :
   - 30 contrôles automatiques et déterministes (page présente en pied de page, SIREN valide et cohérent avec le répertoire Sirene, traceurs déposés sans consentement, bouton « Tout refuser », lien de rétractation, médiateur, lien ODR obsolète…) ;
   - les autres par lecture des textes par Claude, qui répond à une question précise par obligation, preuve à l'appui.
4. **Rapport** noté sur 100, avec la preuve de chaque constat et ce que dit le texte. Chaque point est classé :
   - **Illégal** : une obligation écrite dans la loi n'est pas respectée, et Vigie l'a constaté avec certitude ;
   - **Zone de flou** : l'exigence dépend d'une interprétation (doctrine CNIL, appréciation du juge), ou le constat repose sur un indice que Vigie ne peut pas confirmer ;
   - **Recommandé** : bonne pratique ou mention obsolète à retirer, sans sanction directe (hors de la note) ;
   - **À vérifier** et **Conforme**.
5. **Rédaction** des documents manquants (mentions légales, confidentialité, cookies, CGV, CGU, déclaration d'accessibilité) : plan imposé, exigences et sources des seules règles applicables, faits observés sur le site, réponses de l'utilisateur. Les informations inconnues sont laissées en `[À COMPLÉTER : …]` plutôt qu'inventées, et un contrôle automatique vérifie le texte produit.

![Rapport](docs/captures/rapport-haut-bureau.png)

## Validation juridique

Chaque règle du registre a une **revue** (`src/lib/rules/revue.ts`) : les articles exacts, le champ d'application en clair (« s'applique si / ne s'applique pas si ») et les doutes à trancher. `npm run citations` récupère le texte officiel de ces articles (`src/lib/rules/citations.json`), affiché sous chaque constat (« Lire le texte officiel ») ; `npm run revue` produit [docs/revue-juridique.md](docs/revue-juridique.md), à faire relire et valider par un avocat.

**Tant qu'une règle n'est pas validée** dans `src/lib/rules/validations.ts`, un manquement n'est jamais présenté comme « Illégal » : il apparaît en zone de flou, avec la mention « en attente de validation juridique », et n'est jamais cité dans un mail de prospection. La validation porte l'empreinte de la version validée : une règle modifiée ensuite redevient « en attente ».

## Couverture juridique

Le catalogue (`src/lib/rules/catalogue.ts`) est la source unique : il alimente le moteur, la rédaction, la page publique `/registre` et [docs/registre-juridique.md](docs/registre-juridique.md). À jour au 14 octobre 2026 (articles relus un par un dans leur version en vigueur, voir [docs/verification-juridique.md](docs/verification-juridique.md)), il couvre notamment :

- **Identification** : LCEN art. 1-1 et 1-2 (après la loi SREN), Code de commerce, Code de la consommation L111-1 et suivants ;
- **Données personnelles** : RGPD (art. 12 à 22, 28, 32, 44 et s.), loi Informatique et libertés (dont l'art. 85, directives post-mortem) ;
- **Cookies** : art. 82 de la loi Informatique et libertés, lignes directrices et recommandation CNIL (refus aussi simple que l'acceptation, 13 mois, mesure d'audience exemptée) ;
- **Vente à distance** : informations précontractuelles, bouton « commande avec obligation de paiement », droit de rétractation et **bouton de rétractation en ligne** (L221-21, ordonnance du 5 janvier 2026, depuis le 19 juin 2026), garanties légales, médiation, résiliation en trois clics (L215-1-1), réparabilité (directive 2024/1799, depuis le 31 juillet 2026) ;
- **Prix et promotions** : prix de référence sur 30 jours (Omnibus), avis clients (L111-7-2), classement et contenus sponsorisés ;
- **Plateformes** : DSA, règlement P2B, obligations des places de marché ;
- **Accessibilité** : European Accessibility Act depuis le 28 juin 2025 (hors microentreprises) ; mention « Accessibilité : … conforme » et déclaration RGAA pour les seuls organismes publics et entreprises au-delà du seuil de l'art. 47 de la loi de 2005 ;
- **Environnement** : directive 2024/825 sur les allégations environnementales (depuis le 27 septembre 2026), loi AGEC ;
- **IA** : AI Act, art. 50 (transparence des chatbots et contenus générés, à partir du 2 août 2026) ;
- **Sectoriel** : alcool (loi Évin), immobilier (loi Hoguet), crédit, santé, tourisme, BTP, livre, jeux d'argent, formation, photos retouchées.

Les obligations abrogées sont signalées comme **à retirer** quand le site les affiche encore (exemple : le lien vers la plateforme européenne de règlement en ligne des litiges, fermée le 20 juillet 2025).

## Démarrer

Prérequis : Node.js 20 ou plus récent, et un Chromium (ou Chrome).

```bash
npm install
npx playwright install chromium   # ou renseigner CHROMIUM_PATH
cp .env.example .env.local        # puis ajouter ANTHROPIC_API_KEY
npm run dev                       # http://localhost:3000
```

Sans clé d'API, Vigie fonctionne en audit automatique seul : les points qui demandent une lecture des textes restent « à vérifier » et la rédaction est désactivée.

| Variable | Rôle |
|---|---|
| `ANTHROPIC_API_KEY` | Active l'analyse des textes et la rédaction par Claude. |
| `VIGIE_MODELE` | Modèle Claude utilisé (par défaut `claude-opus-5-5`). |
| `CHROMIUM_PATH` | Chemin du navigateur si Playwright ne le trouve pas. |
| `VIGIE_PROXY` | Proxy sortant imposé du navigateur d'audit (remplace le proxy filtrant : à éviter). |
| `VIGIE_PROXY_DE_CONFIANCE` | `1` derrière un proxy inverse (nginx, Caddy) : adresse client lue dans `X-Forwarded-For`. |
| `VIGIE_DONNEES` | Dossier de stockage des audits (par défaut `data/audits`). |
| `VIGIE_EXPEDITEUR_NOM`, `_SOCIETE`, `_EMAIL`, `_TEL` | Identité de l'expéditeur des mails de prospection. |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Paiement Stripe (voir « Offres payantes »). |
| `VIGIE_SECRET` | Signature des sessions client (32 caractères au moins, obligatoire en production). |
| `RESEND_API_KEY`, `VIGIE_EMAIL_EXPEDITEUR` | Envoi des liens de connexion et des alertes de suivi. |
| `VIGIE_PAIEMENT_SIMULE` | `1` pour simuler les paiements en développement. |
| `VIGIE_EMAIL_ALERTES` | Adresse qui reçoit les alertes d'erreur. |
| `VIGIE_SAUVEGARDE_CLE`, `VIGIE_SAUVEGARDE_DOSSIER` | Sauvegardes chiffrées quotidiennes de `data/`. |
| `VIGIE_ADMIN_MOTDEPASSE` | Mot de passe de l'espace privé `/prospection` (12 caractères au moins). |
| `VIGIE_URL_PUBLIQUE` | Adresse publique de Vigie, pour mettre le lien du rapport dans les mails. |
| `VIGIE_AUTORISER_LOCAL` | `1` pour autoriser l'audit d'adresses locales (tests uniquement). |
| `PISTE_CLIENT_ID`, `PISTE_CLIENT_SECRET` | API Légifrance (PISTE) : texte officiel des articles français du registre (`npm run citations`). |
| `NEXT_PUBLIC_VIGIE_SANS_VALIDATION` | `1` pour ignorer la validation juridique des règles (tests et développement ; sans effet en production). |

### Commandes utiles

```bash
npm test                              # tests de bout en bout sur deux sites témoins + API Claude simulée
npm run typecheck
npm run audit -- https://exemple.fr   # audit en ligne de commande
npm run registre                      # régénère docs/registre-juridique.md
npm run citations                     # récupère le texte officiel des articles cités (EUR-Lex ; Légifrance via PISTE)
npm run revue                         # régénère docs/revue-juridique.md, le document de validation pour l'avocat
npm run prospection -- sites.txt      # campagne de prospection sans interface (voir ci-dessous)
npm run verifier                      # ce qui manque avant la mise en production
npm run sauvegarde                    # sauvegarde chiffrée de data/ (aussi faite chaque jour automatiquement)
npm run restaurer -- fichier.vigie    # restauration dans ./data-restauree, à vérifier avant de remplacer data/
npm run exemple                       # régénère le rapport d'exemple public (/exemple)
```

### Offres payantes

L'audit est gratuit mais n'affiche que **deux constats** (`CONSTATS_OFFERTS`, les mêmes que dans le mail de prospection) : les autres sont calculés côté serveur et ne sont jamais envoyés au navigateur (la page floute du texte factice). Trois offres, définies dans `src/lib/offres.ts` (source unique pour la page `/tarifs`, le paiement, les droits et les CGV) :

| Offre | Prix | Droits |
|---|---|---|
| Audit ponctuel | 49 € | Rapport complet et documents d'un site, audits illimités pendant 30 jours |
| Site | 19 € / mois | 1 site : tout, plus suivi hebdomadaire, documents hébergés, alertes de veille |
| Agence (mise en avant) | 149 € / mois | 25 sites, marque blanche, import/export CSV, API |
| Agence+ | 299 € / mois | 100 sites, idem |

Les achats de l'ancienne grille (Audit 10 €, Mise en conformité 29 €, Suivi 89 €) restent honorés : un achat unique vaut un audit ponctuel, un ancien abonnement vaut la formule Agence (`offreDe`, `offreAbonnement`).

- **Comptes sans mot de passe** : créés au paiement avec l'e-mail saisi chez Stripe ; reconnexion par lien envoyé par e-mail (`/connexion`). Session : cookie httpOnly signé avec `VIGIE_SECRET`.
- **Paiement** : Stripe Checkout (`src/lib/paiement.ts`). Les droits sont attribués par le webhook et au retour sur le site ; l'attribution est idempotente.
- **Déblocage** : un achat débloque des sites au fil de l'eau (bouton « Débloquer ce site » dans le rapport, ou automatiquement pour le site depuis lequel on achète).
- **Lecture par Claude** : réservée aux sites débloqués (l'audit gratuit est automatique seul, sans coût d'API) ; un site débloqué peut lancer la « lecture approfondie » depuis son rapport.
- **Après l'achat** : le client revient sur son rapport débloqué et reçoit un e-mail de confirmation (une seule fois, même si le webhook et le retour sur le site arrivent tous les deux) avec un lien d'accès valable toute la durée de l'achat. Les liens reçus par e-mail mènent à une page « Me connecter » : les messageries qui analysent les liens ne les consomment pas. Deux jours avant la fin des 14 jours, un e-mail de rappel part (tournée horaire). L'espace client liste les sites débloqués avec leur dernier rapport.
- **E-mails** : envoyés par Resend en production (`RESEND_API_KEY`, `VIGIE_EMAIL_EXPEDITEUR` sur un domaine vérifié chez Resend, enregistrements SPF et DKIM en place). Sans cette configuration, en développement, ils s'affichent dans la console du serveur ; en production, la connexion par lien échoue.
- **Suivi** : les sites suivis des abonnés sont réaudités chaque semaine par une tournée lancée au démarrage du serveur (`src/instrumentation.ts`) ; e-mail d'alerte si de nouveaux manquements apparaissent.
- **Veille du registre** (`src/lib/veille.ts`) : à chaque tournée, le registre est comparé à son état précédent (`data/veille/registre.json`). Règle nouvelle, modifiée ou qui entre en application : chaque abonné reçoit la liste des sites suivis qu'elle concerne (d'après le profil de leur dernier audit), une seule fois par version de règle. Le premier passage enregistre l'état sans alerter.
- **Documents hébergés** (`src/lib/documents-heberges.ts`, routes `/d/<id>`) : un document approuvé peut être publié à une adresse fixe, intégrée au site du client par lien, cadre ou script. Seule une version approuvée (empreinte enregistrée) peut être publiée ; une nouvelle approbation remplace la version servie, à la même adresse. Quand la veille touche une règle du document, il est marqué « à mettre à jour » : la version en ligne ne change pas tant que le client n'en approuve pas une nouvelle. Servi 90 jours après la fin de l'abonnement (CGV art. 7 bis). Seules les adresses `/d/…` peuvent s'afficher dans un cadre d'un autre site.
- **Dossier de conformité** (`/api/compte/dossier?domaine=…`, `src/lib/dossier.ts`) : PDF qui retrace les audits (avec l'empreinte SHA-256 de chaque fichier d'audit), les captures, les documents approuvés et les versions hébergées.
- **Offres Agence** : marque blanche (nom, logo, couleur, contact sur les rapports et dossiers PDF, sans mention de Vigie), import CSV de sites, export CSV, clé d'API (seule son empreinte est stockée) et API JSON documentée sur `/api-docs` (`/api/v1/audits`, `/api/v1/sites`).

**Mise en service de Stripe :**

1. Renseignez `STRIPE_SECRET_KEY` (clé `sk_test_…` pour essayer, `sk_live_…` ensuite) et `VIGIE_SECRET` (32 caractères aléatoires au moins).
2. Dans le tableau de bord Stripe, **Paramètres → Moyens de paiement** : activez Cartes, Apple Pay, Google Pay, PayPal, Prélèvement SEPA, Link. Le paiement affiche automatiquement ceux qui sont activés.
3. **Développeurs → Webhooks** : ajoutez l'adresse `https://votre-domaine/api/paiement/webhook` avec les événements `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `charge.refunded` (un remboursement complet retire les accès), puis copiez le secret dans `STRIPE_WEBHOOK_SECRET`. En local : `stripe listen --forward-to localhost:3000/api/paiement/webhook`.
4. **Paramètres → Portail client** : activez la résiliation d'abonnement et l'historique des factures (bouton « Factures et paiement » du compte).
5. Pour les e-mails (liens de connexion, alertes) : `RESEND_API_KEY` et `VIGIE_EMAIL_EXPEDITEUR` (domaine vérifié chez Resend). En développement, les e-mails s'affichent dans la console.

Pour essayer tout le parcours en local sans Stripe : `VIGIE_PAIEMENT_SIMULE=1 npm run dev` (paiements simulés, jamais actifs en production).

> **Ne jamais exposer `npm run dev` sur Internet** : en mode développement, React joint aux pages des données de débogage (dont le contenu complet des audits). Seul `npm run build && npm start` doit être public.

### Pilotage et exploitation

- **Statistiques** (`/statistiques`, espace privé) : chiffre d'affaires, abonnements, audits, taux de déblocage, conversion de la prospection, erreurs récentes et contrôle « prêt pour la production ».
- **Journal des erreurs** : paiement, webhook, e-mails, suivi, sauvegardes, campagnes (`data/journal/erreurs.jsonl`), avec alerte par e-mail à `VIGIE_EMAIL_ALERTES`.
- **Sauvegardes** : chaque jour, `data/` est compressé puis chiffré (AES-256-GCM, clé dérivée de `VIGIE_SAUVEGARDE_CLE`) dans `VIGIE_SAUVEGARDE_DOSSIER` ; les 14 dernières sont gardées. Copiez ce dossier hors du serveur. Sans la phrase secrète, une sauvegarde est illisible : conservez-la ailleurs.
- **Progression** : chaque rapport complet compare le site à son audit précédent (note, problèmes illégaux, zones de flou) ; l'espace client montre la tendance de chaque site. Index : `data/index-audits.json`, reconstruit automatiquement s'il manque.
- **Rapport PDF** : bouton « Télécharger en PDF » sur tout rapport débloqué (`/api/audit/<id>/pdf`).
- **Rapport d'exemple** (`/exemple`), **pages par activité** (`/obligations/...`) et **nouvelles obligations 2025-2026** (`/nouvelles-obligations`), générés depuis le catalogue : de quoi montrer le produit et être trouvé sur Google.
- **Témoignages** : `src/lib/temoignages.ts`, vide par défaut. Uniquement de vrais clients avec leur accord écrit (un faux avis est une pratique commerciale trompeuse) ; la section n'apparaît qu'une fois la liste remplie.

### Prospection

Espace privé **`/prospection`**, protégé par le mot de passe `VIGIE_ADMIN_MOTDEPASSE` (12 caractères au moins) :

1. collez une liste de sites et lancez la campagne ; les audits s'enchaînent avec une pause entre deux sites, l'avancement s'affiche en direct ;
2. pour chaque site avec des manquements certains, un mail est préparé : aperçu, « Ouvrir dans ma messagerie », brouillon `.eml` (HTML, à ouvrir dans Mail ou Outlook), copie du texte ;
3. après l'envoi, « Marquer envoyé » : un domaine déjà contacté est ignoré par les campagnes suivantes ; « STOP reçu » ajoute l'adresse à la liste d'opposition.

Rien n'est envoyé automatiquement. Le mail ne cite que les manquements **illégaux et établis par les vérifications automatiques** (jamais une zone de flou ni un constat de Claude), avec la preuve, le texte et la sanction prévue. Un site mal lu (protection anti-robots, erreur, pied de page non chargé) est exclu ou ses constats restent « à confirmer ». Chaque mail identifie l'expéditeur, indique l'origine de l'adresse et permet de s'opposer.

La même campagne peut se lancer en ligne de commande : `npm run prospection -- sites.txt [--sans-ia] [--pause 15]`. Les données sont dans `data/prospection/<campagne>/` (`resultats.json`, `resultats.csv`, `mails/`), la liste d'opposition dans `data/prospection/opposition.txt`.

Les campagnes tournent dans le processus du serveur : il faut un serveur Node qui reste allumé (`npm start`, pas une plateforme « serverless »). Une campagne coupée par un redémarrage s'affiche « interrompue » et se reprend d'un clic.

## Déploiement sur Vercel

Cette version de Vigie est adaptée à Vercel, où aucun serveur ne reste allumé et où le disque n'est pas conservé :

| Sur un serveur classique | Sur Vercel |
|---|---|
| Données dans `data/` | Table Postgres `vigie_donnees` (Neon), créée au premier usage (`src/lib/stockage.ts`) |
| Chromium installé sur la machine | `@sparticuz/chromium`, embarqué dans les fonctions qui lancent un navigateur (`src/lib/navigateur.ts`) |
| Tournée de suivi toutes les heures dans le processus | Tâche planifiée quotidienne `vercel.json` → `/api/cron` |
| Audits de suivi et campagnes « en fond » dans le processus | Une exécution séparée par audit : `/api/interne/tache` répond aussitôt puis travaille (`after()`), et chaque étape d'une campagne lance la suivante (`src/lib/taches.ts`) |
| Limites d'usage en mémoire | Limites en base, partagées par toutes les instances ; adresse du client lue dans `x-real-ip` |
| Sauvegardes chiffrées quotidiennes sur disque | Sauvegardes de Neon (restauration à un instant donné) ; `npm run sauvegarde` exporte la base depuis votre machine |

Sans `DATABASE_URL`, tout fonctionne comme avant, sur disque : `npm run dev` et `npm test` n'ont besoin d'aucune base.

### Mise en ligne

1. **Importer le dépôt** dans Vercel (Add New → Project). Le framework Next.js est détecté ; rien à changer dans les réglages de build.
2. **Base de données** : onglet *Storage* du projet → *Create Database* → **Neon** (Postgres), région Francfort (`eu-central-1`), proche de la région des fonctions (`fra1`, dans `vercel.json`). Vercel ajoute `DATABASE_URL` aux variables du projet.
3. **Variables d'environnement** (*Settings → Environment Variables*), d'après `.env.example` :
   - obligatoires : `CRON_SECRET` et `VIGIE_SECRET` (32 caractères aléatoires chacun, par exemple `openssl rand -hex 32`), `VIGIE_URL_PUBLIQUE` (`https://votre-domaine.fr`), `ANTHROPIC_API_KEY` ;
   - paiement et e-mails : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `VIGIE_EMAIL_EXPEDITEUR` ;
   - espace privé et alertes : `VIGIE_ADMIN_MOTDEPASSE`, `VIGIE_EMAIL_ALERTES` ;
   - à ne **pas** définir : `CHROMIUM_PATH`, `VIGIE_DONNEES`, `VIGIE_PROXY_DE_CONFIANCE`, `VIGIE_PAIEMENT_SIMULE`.
4. **Déployer**, puis ouvrir `/statistiques` (espace privé) : la liste « Configuration » indique ce qui manque encore.
5. **Webhook Stripe** : `https://votre-domaine.fr/api/paiement/webhook` (événements listés plus haut).
6. **Données existantes** (facultatif) : depuis votre machine, avec la `DATABASE_URL` de Neon dans `.env.local`, `npm run migrer -- data` recopie le dossier `data/` d'une installation précédente dans la base.

### Plan Vercel et limites

- **Plan Pro conseillé** : les conditions du plan Hobby excluent l'usage commercial (Vigie encaisse des paiements). Le code reste compatible Hobby : les fonctions sont limitées à 300 secondes et la tâche planifiée ne tourne qu'une fois par jour.
- **Un audit tient en 300 secondes** : le parcours du site est plafonné à 4 minutes, la lecture par Claude ajoute environ une minute. Un site très lent peut dépasser : l'audit échoue alors avec un message clair, et une étape de campagne interrompue est notée « erreur » avant de passer au site suivant.
- **Suivi des sites** : la tournée quotidienne lance au plus 40 audits, chacun dans sa propre exécution. Sur le plan Pro, passez la planification de `vercel.json` à `0 * * * *` (toutes les heures) pour suivre davantage de sites.
- **Campagnes de prospection** : la pause entre deux sites se fait par tranches de 30 secondes au plus. Une campagne dont la chaîne d'étapes s'est interrompue est relancée par la tournée suivante, ou tout de suite avec « Reprendre ».
- **Aperçus protégés** : sur un déploiement d'aperçu protégé par Vercel Authentication, les tâches internes ont besoin de *Protection Bypass for Automation* (Settings → Deployment Protection), qui fournit `VERCEL_AUTOMATION_BYPASS_SECRET`. Le domaine de production n'est pas concerné.
- **Navigateur distant** (facultatif) : `VIGIE_NAVIGATEUR_WS=wss://…` (Browserless ou équivalent) remplace le Chromium embarqué. Le proxy filtrant local n'est alors pas joignable : le filtrage contre la SSRF se fait requête par requête, moins complet.
- **Mentions légales** : l'hébergeur à déclarer dans `src/lib/editeur.ts` est Vercel Inc. ; la politique de confidentialité doit mentionner Vercel et Neon comme sous-traitants (et les transferts hors de l'Union pour Vercel).

## Architecture

```
src/lib/crawler/     parcours du site (Playwright), détection des traceurs, des CMP et des signaux
src/lib/rules/       catalogue des obligations, contrôles automatiques, moteur de règles et score
src/lib/ia/          analyse des textes et rédaction par Claude (sortie structurée, flux)
src/lib/documents/   plans des documents à rédiger et modèles officiels
src/lib/prospection/ sélection des constats certains, mails de premier contact et campagnes
src/lib/offres.ts    offres payantes ; comptes.ts, session.ts, paiement.ts (Stripe), acces.ts (rapport verrouillé), suivi.ts
src/lib/stockage.ts  stockage des données : Postgres (DATABASE_URL) ou dossier data/ ; taches.ts : tâches longues ; navigateur.ts : Chromium
src/lib/entreprise   vérification au répertoire Sirene (recherche-entreprises.api.gouv.fr)
src/app/             interface Next.js : accueil, rapport, rédaction, registre
tests/fixtures/      deux sites témoins : une boutique « risquée » et une boutique « soignée »
```

Le moteur est une fonction pure : `evaluer(profil, constatsAuto, constatsIA)`, et `verdict(resultat)` classe chaque résultat d'après la nature de la règle (`loi`, `flou`, `recommandation`) et la fiabilité du constat (`incertain`). Le score pondère les manquements par gravité (critique 10, majeure 5, mineure 2). Les vérifications automatiques sont rejouées à chaque ouverture d'un audit, qui profite ainsi des contrôles corrigés depuis.

## Sécurité

- **Stockage** : tout est dans la base Postgres (`DATABASE_URL`) ou, sans base, dans `data/` (ou le dossier parent de `VIGIE_DONNEES`), jamais servi par le site. Seules les routes qui contrôlent l'accès le lisent, et chaque nom de fichier est construit à partir d'un identifiant vérifié par motif (aucun chemin fourni par l'utilisateur). Au démarrage, Vigie se met en `umask 077` et remet `data/` en droits 700/600 : seul le compte système qui fait tourner Vigie peut lire ces fichiers. Lancez Vigie sous un utilisateur dédié, sans droits sur le reste du serveur.
- **Rapport gratuit** : les constats verrouillés ne quittent jamais le serveur (vérifié par un test).
- **SSRF** : tout le trafic du navigateur d'audit passe par un proxy filtrant local (`src/lib/crawler/proxy-filtrant.ts`) qui résout chaque nom, refuse les adresses privées, réservées ou de métadonnées cloud, puis se connecte à l'adresse vérifiée : redirections, WebSocket et « DNS rebinding » compris. Ports autorisés : 80, 443, 8080, 8443. Si `VIGIE_PROXY` impose un autre proxy, ce filtre est remplacé par un contrôle requête par requête, moins complet.
- **Accès** : espace privé par mot de passe (12 caractères au moins, comparaison en temps constant, limite par adresse et limite globale de 30 essais par heure) ; sessions client par cookie httpOnly signé ; webhook Stripe à signature vérifiée.
- **Tâches internes** : `/api/cron` et `/api/interne/tache` exigent `Authorization: Bearer $CRON_SECRET` (comparaison en temps constant).
- **Limites d'usage** : 6 audits par 10 minutes, 20 générations par heure. Sur Vercel, l'adresse du client est lue dans `x-real-ip`, posé par Vercel. Ailleurs, elle n'est lue dans `X-Forwarded-For` que derrière un proxy déclaré (`VIGIE_PROXY_DE_CONFIANCE=1`, dernière adresse de la chaîne) : sans cela, l'en-tête pourrait être falsifié.
- **En-têtes** : nosniff, `frame-ancestors 'self'`, `Referrer-Policy` (les adresses des rapports ne fuient pas vers les sites liés), HSTS en production, `no-store` et `noindex` sur l'API, le compte, l'espace privé et les rapports.
- **Mode développement** : `npm run dev` n'écoute que sur 127.0.0.1 ; il joint aux pages des données de débogage et ne doit jamais être exposé.
- Le Markdown produit par Claude est assaini (aucun HTML brut, liens http, https, mailto et internes uniquement).

## Limites connues

- **Un outil, pas un avocat.** Le catalogue a été établi avec soin et sourcé article par article, mais il doit être relu par un juriste avant toute commercialisation, puis tenu à jour (la date de dernière mise à jour est affichée partout).
- Le tunnel de commande est parcouru jusqu'à la page de commande, sans rien y saisir : un bouton final qui n'apparaît qu'après saisie des coordonnées reste « à vérifier ». Les tunnels atypiques (configurateurs, réservations) ne sont pas parcourus.
- Les tests d'accessibilité automatiques ne couvrent qu'une partie des critères RGAA : aucune erreur détectée ne vaut conformité.
- Analyse juridique de la plateforme elle-même (risques, responsabilités, points à faire valider par un avocat) : [docs/analyse-juridique.md](docs/analyse-juridique.md).
- Les pages légales de Vigie elle-même (`/mentions-legales`, `/confidentialite`, `/cgu`, `/cgv`) sont rédigées (`src/lib/textes-legaux.ts`) ; l'identité de la société, l'hébergeur et les tarifs sont à renseigner dans `src/lib/editeur.ts` avant mise en ligne. Les audits sont supprimés automatiquement après la durée de conservation annoncée (12 mois).
- Le nom « Vigie » doit être vérifié (INPI, nom de domaine) avant lancement.

Identité visuelle : [docs/identite-visuelle.md](docs/identite-visuelle.md).
