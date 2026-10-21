# Vérification juridique du registre

14 octobre 2026. J'ai relu chaque article des codes cités par `src/lib/rules/catalogue.ts` dans sa **version en vigueur**, avec GoodLegal (base Légifrance) ; pour les textes européens, j'ai utilisé EUR-Lex et des recherches ciblées. Les liens des sources pointent maintenant, quand c'est possible, sur l'article lui-même (`ARTICLES` dans `src/lib/rules/sources.ts`).

Les lois non codifiées (LCEN, loi Informatique et Libertés, loi Toubon, loi Hoguet, loi influenceurs, loi Lang) ne sont pas accessibles article par article dans GoodLegal. Leur numérotation n'a été recoupée qu'avec des sources secondaires : **à relire sur Légifrance**.

## Erreurs corrigées

| Règle | Avant | Texte en vigueur | Correction |
|---|---|---|---|
| `pub.bloctel` | Informer du droit de s'inscrire sur Bloctel | C. conso L223-1 et L223-2 (loi n° 2025-594) : **démarchage téléphonique sur consentement préalable depuis le 11 août 2026** | Règle réécrite : consentement explicite, information au recueil du numéro, sanction L242-16 (375 000 €), contrat nul |
| `plat.avis` | L121-4 21° à 23°, D111-16 à D111-19 | Avis = **L121-4 27° et 28°** ; décret = **D111-9 à D111-11** | Références corrigées ; exigences complétées (date de l'avis et de l'expérience, critères de classement, contrepartie, motifs de rejet, signalement d'un doute) |
| `vente.retractation-info` | L221-5 2° | Rétractation = **L221-5 7°** (8° frais de retour, 10° absence de droit) | Corrigé |
| `prix.personnalises` | L221-5 1° bis | **L221-5 11°** | Corrigé |
| `vente.contenus-numeriques` | L111-1 4° | Fonctionnalités et compatibilité = **L111-1 1°** | Corrigé |
| `vente.paiement-surcout` | Citait C. conso L112-4-1 | L112-4-1 vise l'avantage non monétaire, pas les frais de paiement | Source retirée ; reste CMF L112-12 |
| `sect.formation` | C. trav. L6352-1 | L6352-1 vise les qualifications des formateurs ; la mention est **L6352-12** : « Enregistrée sous le numéro… Cet enregistrement ne vaut pas agrément de l'État. » | Corrigé |
| `vente.cgv`, `vente.info-precontractuelle` | 15 000 € pour une personne morale | L242-10 : 15 000 € (personne physique), **75 000 €** (personne morale) | Corrigé |
| `vente.clauses-abusives` | 15 000 € pour une personne morale | L241-2 : **75 000 €** (personne morale) | Corrigé |
| `env.allegations-generiques` | 2 ans et 300 000 € | L132-2 : **5 ans et 750 000 € quand la pratique est commise en ligne** | Corrigé |
| `prix.reductions` | Amende administrative de 15 000 € | Aucune amende propre à L112-1-1 trouvée (L131-5 ne vise que L112-1) | Sanction remplacée par celle des pratiques trompeuses (L132-2) |
| `pub.prospection-email` | Sanction attribuée à C. conso L242-16 | Elle figure dans **CPCE L34-5** lui-même | Corrigé |
| Témoignages (`src/lib/temoignages.ts`) | L121-4 21° et 22° | 27° et 28° | Corrigé |

## Compléments

- **Bouton de rétractation** (D221-5) : libellé « renoncer au contrat ici », bouton « confirmer la rétractation », accusé de réception daté. Le contrôle automatique reconnaît désormais « renoncer au contrat » (`patterns.ts`).
- **Bouton de commande** (L221-14) : moyens de paiement et restrictions de livraison indiqués au plus tard au début de la commande ; amende L242-10.
- **Reconduction tacite** (L215-1) : lettre ou e-mail dédié, encadré apparent avec la date limite.
- **Identité de l'éditeur** (C. com. R123-237) : mention « entrepreneur individuel » ou « EI » sur le site.
- **Étapes du contrat** (C. civ. 1127-1) : le français doit figurer parmi les langues proposées.
- Sanctions ajoutées : prix TTC (L131-5), DPE dans les annonces (CCH L126-33), photos retouchées (CSP L2133-2), délais de paiement B2B (C. com. L441-16).
- **Alcool** : publicité en ligne ni intrusive ni interstitielle (CSP L3323-2 9°).
- **Crédit** : la directive 2023/2225 fait entrer le paiement fractionné dans le crédit à la consommation à partir du 20 novembre 2026 (texte de transposition à relire à cette date).

## Nouvelles obligations

| Règle | Fondement | Pour qui |
|---|---|---|
| `vente.securite-produits` | Règlement (UE) 2023/988 (GPSR), art. 19, depuis le 13 décembre 2024 | Boutiques et places de marché : fabricant, personne responsable dans l'UE, identification du produit, avertissements sur chaque fiche |
| `vente.changement-fournisseur` | Règlement (UE) 2023/2854 (Data Act), art. 23 à 31, depuis le 12 septembre 2025 | SaaS : droit de changer de fournisseur, export des données, frais de changement supprimés au 12 janvier 2027. **Concerne aussi Vigie.** |
| `env.pieces-detachees` | C. conso L111-4 | Vendeurs d'électronique et d'électroménager |
| `plat.cyberscore` | C. conso L111-7-3 | Très grandes plateformes (seuils par décret) |

## Vérifiés sans changement

C. conso L111-1, L111-7, L112-1, L112-1-1, L213-1, D213-1, L215-1-1, D215-1, L216-1, L217-3, L217-7, L221-13, L221-20, L221-21, D221-5, L221-28, L224-25-12, L241-3-1, L242-16, L312-5, L312-10, R111-2, R212-1, R221-2, L612-1, L616-1, R616-1, L641-1, D211-2 ; C. civ. 1127-1, 1127-2 ; C. com. L441-1, L441-10, D441-5 ; CPCE L34-5 ; CMF L112-12 ; CSP L1111-8, L3323-4, L3342-1, L5125-33 ; C. env. L229-68, L541-9-1, L541-9-2 ; C. tourisme L211-8, R211-3-1 ; C. assurances L512-1, R521-1, L243-2 ; CCH L126-33 ; AI Act art. 50 (2 août 2026, pas de report trouvé).

## À surveiller

- Loi sur la mode éphémère (« ultra fast-fashion ») adoptée en 2026 : obligations d'affichage et de publicité à intégrer quand le texte consolidé sera disponible.
- Transposition de la directive 2024/825 (allégations environnementales) et de la directive 2024/1799 (réparation).
