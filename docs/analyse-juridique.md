# Analyse juridique de Vigie

État au 13 octobre 2026. Cette note recense ce que fait la plateforme, les règles qui s'y appliquent, les risques et ce qui a été fait pour les réduire. Elle est écrite pour être relue par un avocat : **elle ne remplace pas son avis**, et les points marqués « à faire valider » sont ceux où un professionnel doit trancher.

## 1. En bref

- **Aucune activité n'est à l'abri d'une action en justice.** Vigie peut être mise en cause par ses clients (rapport erroné), par les sites qu'elle audite (mail jugé dénigrant ou agressif), par la profession d'avocat (exercice illégal du droit) ou par une autorité (CNIL, DGCCRF). L'objectif est que chacune de ces actions ait peu de chances d'aboutir, et qu'une condamnation éventuelle soit limitée et assurée.
- **Le modèle est défendable**, à condition de rester un logiciel qui constate et fournit des modèles approuvés par le client, et de ne pas glisser vers le conseil personnalisé.
- **Trois risques sont prioritaires** : (1) le monopole des avocats sur la rédaction d'actes et la consultation, (2) la prospection par e-mail auprès de sites qui n'ont rien demandé, (3) l'exactitude des verdicts « Illégal ». Les deux premiers sont encadrés dans le code ; le troisième dépend de la relecture du registre par un juriste.
- **Avant la mise en ligne** : immatriculer une société à responsabilité limitée (SAS ou SARL), souscrire une **assurance responsabilité civile professionnelle** couvrant les erreurs et omissions d'un éditeur de logiciel, faire relire le registre et les CGV par un avocat, remplir `src/lib/editeur.ts`, vérifier la marque « Vigie » à l'INPI.

## 2. Ce que fait la plateforme, et sur quel fondement

| Activité | Cadre | Appréciation |
|---|---|---|
| Lire les pages publiques d'un site, comme un internaute | Accès libre à un site public ; Code pénal art. 323-1 (accès frauduleux à un système) | Licite tant qu'aucune protection n'est contournée. Le robot s'identifie (« VigieAudit »), attend les vérifications anti-robots sans les forcer et abandonne les pages bloquées. La jurisprudence « Bluetouff » (Cass. crim., 20 mai 2015) sanctionne le maintien dans un système **contre la volonté connue** de son maître : ne jamais contourner un blocage explicite. *Recommandé : respecter le fichier robots.txt pour les audits de prospection.* |
| Cliquer sur « Tout refuser », ajouter un produit au panier, ouvrir la page de commande | Actes ordinaires d'un visiteur | Rien n'est saisi, validé ni payé (vérifié par le code et les tests). Le parcours du tunnel est **désactivé pour la prospection**, puisque ces sites n'ont rien demandé. |
| Enregistrer le texte des pages légales et des captures d'écran | RGPD (données publiées par l'éditeur : noms, e-mails) ; droit d'auteur sur les textes | Intérêt légitime, durée limitée (12 mois, purge automatique), mentionné dans la politique de confidentialité (mise à jour). Les textes ne sont réutilisés que pour l'éditeur du site lui-même. Pas d'extraction substantielle d'une base de données (CPI art. L342-1). |
| Rapport « Illégal / Zone de flou / Recommandé » | Responsabilité contractuelle (clients) ; dénigrement (C. civ. art. 1240) | Voir sections 3 et 5. |
| Modèles de documents générés par IA, approuvés par le client | Loi n° 71-1130 du 31 décembre 1971, art. 54 (monopole de la consultation juridique et de la rédaction d'actes pour autrui) | Voir section 3. **À faire valider.** |
| Documents hébergés à une adresse fixe | LCEN et DSA (règlement (UE) 2022/2065) : Vigie devient **hébergeur** de contenus fournis par ses clients | Obligations d'un hébergeur : point de contact, mécanisme de notification des contenus illicites (DSA art. 16, applicable même aux petites entreprises), retrait prompt d'un contenu manifestement illicite signalé. *À faire : une adresse ou un formulaire de signalement dédié, cité dans les CGU.* |
| Prospection par e-mail d'entreprises dont le site a été audité | CPCE art. L34-5 ; RGPD art. 6.1.f, 14 et 21 ; doctrine CNIL sur la prospection entre professionnels | Voir section 4. |
| Paiement, comptes, abonnements | Code civil, Code de commerce (B2B) | Vente réservée aux professionnels (case à cocher, CGV art. 1) : pas de droit de rétractation ni de médiateur de la consommation. Résiliation en un clic quand même. |
| IA (Claude, Anthropic) | Règlement (UE) 2024/1689 (AI Act), art. 50 ; RGPD (transfert aux États-Unis) | Information des utilisateurs en place (CGU, CGV, page de rédaction). **Ajouté** : marquage lisible par machine des textes générés (`<meta name="ai-generated">` dans l'export HTML et les documents hébergés), art. 50.2, applicable depuis le 2 août 2026. *À faire valider : la qualification de Vigie comme « fournisseur » d'un système d'IA au sens de l'art. 50.2.* Transferts : compléter le mécanisme (DPF ou clauses types) dans la politique de confidentialité. |

## 3. Le monopole du droit : le risque le plus structurant

L'article 54 de la loi de 1971 réserve aux professionnels du droit la consultation juridique et la rédaction d'actes sous seing privé **pour autrui**, à titre habituel et rémunéré. Les plateformes juridiques en ligne ont été poursuivies sur ce fondement ; d'après les sources consultées, celles qui fournissent un traitement **automatisé et standardisé**, sans conseil personnalisé, ont été relaxées (affaire demanderjustice.com notamment), mais la frontière reste discutée et je n'ai pas pu vérifier les décisions sur Légifrance.

Ce qui place Vigie du bon côté de la ligne, et qu'il faut garder :

- les rapports sont des **constats factuels** (ce qui est présent ou absent sur le site), rattachés à un registre général et public ;
- les documents sont des **modèles** que le client complète, relit et **approuve expressément** ; l'empreinte du texte approuvé est conservée cinq ans ; rien n'est publié ni hébergé sans approbation (vérifié par un test) ;
- aucune personne ne rédige ni n'adapte un document pour un client ; les CGV, les CGU et chaque page de rédaction le disent ;
- la clientèle est professionnelle.

Ce qui rapprocherait Vigie du conseil, et qu'il faut éviter :

- répondre à des questions juridiques individuelles par e-mail ou par un chatbot ;
- promettre la conformité (« votre site sera conforme ») : le site et les CGV ne le font pas, à garder ainsi ;
- laisser un collaborateur non juriste « relire » les documents d'un client.

**Recommandation** : un partenariat avec un avocat ou un cabinet, qui (1) relit et signe le registre, ce qui renforce la crédibilité, et (2) propose aux clients qui le souhaitent une relecture payante de leurs documents, facturée par lui. C'est aussi la meilleure réponse à une éventuelle réaction de la profession.

## 4. La prospection : le risque le plus visible

Le dispositif actuel est soigné : seuls les manquements **établis automatiquement et certains** sont cités, jamais une zone de flou ni une lecture par l'IA ; l'expéditeur est identifié ; l'origine de l'adresse est indiquée ; l'opposition est immédiate (« STOP ») et mémorisée ; rien ne part automatiquement.

Corrections faites pendant cette revue :

- les règles dont l'application dépend de la **taille de l'entreprise** (accessibilité : microentreprises dispensées) ne sont plus citées quand la taille n'est pas confirmée par le répertoire Sirene ;
- les règles « à déclarer » (contrôles d'appoint du tunnel ou de l'accessibilité) ne sont jamais citées ;
- le badge du mail dit **« Manquement »** et non plus « Illégal » : on décrit un constat, on ne qualifie pas pénalement le site d'un inconnu ;
- le tunnel de commande n'est pas parcouru pour ces audits.

Cadre applicable et points de vigilance :

- **Consentement** : entre professionnels, la CNIL admet la prospection par e-mail sans consentement préalable si le message est **en rapport avec la profession** du destinataire et qu'il peut s'opposer simplement. Une adresse générique d'entreprise (contact@) n'est pas une donnée personnelle ; une adresse nominative l'est (RGPD, information à donner au premier contact : faite).
- **Pratiques commerciales** : les règles sur les pratiques trompeuses s'appliquent aussi aux messages adressés à des professionnels (C. conso. art. L121-5, à faire valider). La DGCCRF a déjà mis en garde contre des sollicitations du type « mise en conformité RGPD obligatoire » au ton alarmiste. Le mail doit rester factuel, sans urgence artificielle, sans apparence officielle. Les sanctions citées sont des **maximums** légaux, présentés comme tels.
- **Dénigrement** : il suppose une divulgation à des tiers. Le mail n'est envoyé qu'au site concerné, et les rapports ne sont accessibles qu'avec leur lien secret. *Ne jamais publier ni comparer publiquement des sites nommés.*
- **Volume** : une campagne massive vers des petites entreprises attire les signalements (33700, plaintes CNIL). Prospecter d'abord les agences web, qui sont la cible commerciale prioritaire.

## 5. Responsabilité envers les clients

- Les CGV posent une **obligation de moyens**, excluent les dommages indirects et les amendes, et plafonnent la responsabilité au prix payé. Entre professionnels, c'est valable, **sauf faute lourde ou dol**, et à condition de ne pas vider de sa substance l'obligation essentielle (C. civ. art. 1170 et 1231-3). Un registre faux sur un point important et connu pourrait être qualifié de faute lourde : d'où l'importance de sa relecture et de sa mise à jour.
- Le client « Site » à 19 € par mois peut être un très petit professionnel : il reste un professionnel s'il commande pour son activité (case cochée). Les règles protectrices des consommateurs ne s'appliquent pas, mais le juge apprécie les clauses déséquilibrées entre professionnels (C. com. art. L442-1, C. civ. art. 1171 pour les contrats d'adhésion).
- **Marque blanche** : l'agence présente les rapports sous son nom à ses propres clients ; les CGV (art. 7 bis) lui laissent la responsabilité de cette présentation et rappellent qu'un rapport n'est pas un avis juridique. Le pied de chaque rapport le dit, même en marque blanche.
- **Assurance** : indispensable. Une RC professionnelle « éditeur de logiciel / prestataire informatique » couvrant les erreurs et omissions et la défense pénale.

## 6. Exactitude de ce que Vigie vérifie

### Corrections apportées au registre

| Règle | Problème | Correction |
|---|---|---|
| Toutes | **Bug** : le script de lecture des pages contenait des retours à la ligne non échappés ; chaque audit échouait dès la page d'accueil | Corrigé ; les 32 tests passent |
| Allégations environnementales | Présentées comme illégales depuis le 27 septembre 2026, alors que la **France n'a pas transposé la directive 2024/825** (projet de loi DDADUE en cours ; mise en demeure de la Commission en mai 2026). Une directive ne s'impose pas directement entre entreprises | Passée en « zone de flou », avec ce qui est déjà interdit en droit français (« biodégradable », « respectueux de l'environnement » sur les produits ; neutralité carbone sans bilan) |
| Droit à la réparation | Directive 2024/1799 **non transposée** au 31 juillet 2026 | Passée en « zone de flou », contenu précisé (prolongation de la garantie de 12 mois) |
| Refus des cookies | Citait une validation par le Conseil d'État en 2022 **introuvable** | Remplacée par les délibérations CNIL du 31 décembre 2021 (Google 150 M€, Facebook 60 M€), vérifiées |
| Chatbots (AI Act) | L'art. 50.1 vise le fournisseur du système, pas toujours le site qui l'installe | Passée en « zone de flou » ; précision que le règlement omnibus de 2026 n'a pas reporté cette obligation |
| Garantie légale | Formulation inexacte pour les biens d'occasion | Corrigée : garantie de 2 ans, défaut présumé pendant 2 ans (1 an pour l'occasion) |
| DSA (interfaces trompeuses, mineurs) | Exemption des micro et petites entreprises non signalée | Ajoutée (DSA art. 19) |
| Indice de réparabilité | Pas de mention du remplacement pour smartphones et tablettes | Ajoutée (étiquette énergie européenne depuis le 20 juin 2025) |

### Vérifié

Bouton de rétractation en ligne (ordonnance n° 2026-2 du 5 janvier 2026, applicable le 19 juin 2026) ; fermeture de la plateforme RLL (20 juillet 2025) ; European Accessibility Act (28 juin 2025, microentreprises dispensées) ; AI Act art. 50 (2 août 2026, non reporté) ; renumérotation de la LCEN par la loi SREN (art. 1-1 et 1-2) ; montants des sanctions de la LCEN, du RGPD, de l'art. 82 de la loi Informatique et Libertés, de la médiation, de la résiliation en trois clics et des pratiques trompeuses. Ces vérifications reposent en partie sur des sources secondaires (cabinets, presse spécialisée) : **les textes consolidés sur Légifrance font foi.**

### À faire valider par un juriste

- la numérotation exacte de certains articles cités : C. conso. L121-4 21° à 23°, L221-5 1° bis, D221-5 ; LCEN art. 1-1 (contenu exact après la loi SREN) ;
- l'éventuelle sanction administrative propre au défaut de fonctionnalité de rétractation (aucune n'est affichée par prudence) ;
- le classement de chaque règle en « loi » ou « zone de flou », qui décide de l'étiquette « Illégal ».

### Limites des contrôles automatiques

Elles sont affichées dans les rapports, mais il faut les connaître :

- les recherches par motifs (identité, hébergeur, médiateur) peuvent manquer une formulation inhabituelle : ces constats sont marqués incertains ;
- les traceurs sont reconnus d'après une liste (environ 60 services) : un traceur inconnu n'est pas signalé ;
- le test du refus clique sur le premier bouton de refus visible ; un bandeau très atypique peut lui échapper ;
- le tunnel de commande suit des heuristiques : il s'arrête dès qu'il quitte le site (paiement externe) ou qu'une saisie est nécessaire ;
- axe-core ne détecte que des erreurs certaines, sur une partie des critères d'accessibilité ;
- le **profil** du site (vente aux particuliers, taille de l'entreprise) est déduit, et décide des règles applicables : le client peut le corriger, et le rapport se recalcule.

**Recommandation** : avant le lancement, auditer une cinquantaine de sites réels variés (Shopify, WooCommerce, PrestaShop, sites vitrines, bandeaux Axeptio, Didomi, Cookiebot, Tarteaucitron) et comparer les constats à une vérification manuelle, pour mesurer les faux positifs, surtout sur les verdicts « Illégal ».

## 6 bis. Validation règle par règle (14 octobre 2026)

Le registre porte désormais, pour chaque règle, une revue (articles exacts, champ d'application, doutes) et un statut de validation. Aucune règle n'est encore validée : en l'état, Vigie ne présente aucun manquement comme « Illégal » et la prospection ne cite aucun constat. Le document de travail est [revue-juridique.md](revue-juridique.md) ; les textes européens y sont cités mot pour mot depuis EUR-Lex, les textes français le seront une fois l'accès PISTE configuré.

## 7. Liste de lancement

1. Immatriculer la société, remplir `src/lib/editeur.ts` (mentions légales, CGV, confidentialité de Vigie en dépendent).
2. Assurance RC professionnelle.
3. Relecture du registre, des CGV et de cette note par un avocat ; idéalement un partenariat (section 3).
4. Recherche d'antériorité de la marque « Vigie » à l'INPI (classes 9, 42 et 45) et dépôt.
5. Registre des traitements de Vigie (RGPD art. 30), contrats de sous-traitance (Anthropic, Stripe, Resend, hébergeur), mécanisme de transfert hors UE dans la politique de confidentialité.
6. Adresse ou formulaire de signalement pour les documents hébergés (DSA art. 16).
7. Campagne de tests sur sites réels (section 6).
