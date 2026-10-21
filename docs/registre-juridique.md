# Registre des obligations légales

Généré depuis `src/lib/rules/catalogue.ts` (à jour au 2026-10-14). Ne pas modifier à la main : `npm run registre`.

92 obligations en vigueur, 1 obligation(s) abrogée(s) signalée(s) comme à retirer.

## Identification de l'éditeur

### Page « Mentions légales » accessible

Les informations d'identification de l'éditeur et de l'hébergeur doivent être « facilement, directement et en permanence » accessibles, en pratique via un lien présent sur toutes les pages (pied de page).

- **Nature** : obligation légale
- **Gravité** : critique · **Vérification** : auto (`page-mentions`) · **Document** : mentions-legales
- **S'applique à** : tous les sites
- **Sanction** : 1 an d'emprisonnement et 75 000 € d'amende (375 000 € pour une personne morale), LCEN art. 1-2.
- **Sources** : [LCEN (loi n° 2004-575), modifiée par la loi SREN n° 2024-449, art. 1-1 (ex-art. 6-III)](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164)

### Identité complète de l'éditeur

Personne morale : dénomination ou raison sociale, forme juridique, adresse du siège, montant du capital social. Personne physique : nom, prénoms, domicile (un particulier non professionnel peut ne communiquer que les coordonnées de son hébergeur). Entrepreneur individuel : une dénomination qui incorpore son nom, précédée ou suivie des mots « entrepreneur individuel » ou des initiales « EI ».

- **Nature** : obligation légale
- **Gravité** : critique · **Vérification** : ia (`identite-editeur`) · **Document** : mentions-legales
- **S'applique à** : editeurs = societe, entrepreneur-individuel, association, public
- **Sanction** : LCEN art. 1-2 ; amende de 4e classe pour l'absence des mentions du Code de commerce.
- **Sources** : [LCEN, art. 1-1, I et II](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164) ; [Code de commerce, art. R123-237, 3° et 9° et avant-dernier alinéa](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000045710304)

### Adresse e-mail et téléphone de contact

L'éditeur indique une adresse de courrier électronique et un numéro de téléphone permettant de le contacter rapidement et de communiquer directement avec lui.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : auto (`contact`) · **Document** : mentions-legales
- **S'applique à** : un parmi : editeurs = societe, entrepreneur-individuel, association, public | venteEnLigne = true
- **Sanction** : 1 an d'emprisonnement et 75 000 € d'amende (375 000 € pour une personne morale), LCEN art. 1-2.
- **Sources** : [LCEN, art. 1-1 et art. 19](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164) ; [Code de la consommation, art. R111-1 et L221-5](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069565)

### Numéro d'immatriculation (SIREN, RCS ou RNE)

Pour une entreprise assujettie aux formalités d'inscription au RCS ou au registre national des entreprises : le numéro d'inscription (SIREN suivi de la mention RCS et de la ville du greffe pour une société commerciale).

- **Nature** : obligation légale
- **Gravité** : critique · **Vérification** : auto (`siren`) · **Document** : mentions-legales
- **S'applique à** : editeurs = societe, entrepreneur-individuel
- **Sanction** : 1 an d'emprisonnement et 75 000 € d'amende (375 000 € pour une personne morale), LCEN art. 1-2.
- **Sources** : [LCEN, art. 1-1](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164) ; [Code de commerce, art. R123-237, avant-dernier alinéa (mentions à faire figurer sur le site internet)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000045710304)

### Numéro de TVA intracommunautaire

Si l'activité est assujettie à la TVA : le numéro individuel d'identification à la TVA.

- **Nature** : obligation légale (Seulement si l'entreprise est assujettie à la TVA (pas en franchise en base).)
- **Gravité** : mineure · **Vérification** : auto (`tva`) · **Document** : mentions-legales
- **S'applique à** : editeurs = societe, entrepreneur-individuel ; un parmi : venteEnLigne = true | b2b = true | b2c = true
- **Sources** : [LCEN, art. 19](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164) ; [Code général des impôts, art. 286 ter](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069577)

### Directeur de la publication

Le nom du directeur ou du codirecteur de la publication et, le cas échéant, celui du responsable de la rédaction.

- **Nature** : obligation légale (Concerne tous les sites, pas seulement la presse. Pour une société ou une association, c'est de droit son représentant légal (président, gérant) : il suffit d'ajouter une ligne « Directeur de la publication : Prénom Nom ».)
- **Gravité** : majeure · **Vérification** : auto (`directeur-publication`) · **Document** : mentions-legales
- **S'applique à** : editeurs = societe, entrepreneur-individuel, association, public
- **Sanction** : 1 an d'emprisonnement et 75 000 € d'amende (375 000 € pour une personne morale), LCEN art. 1-2.
- **Sources** : [LCEN, art. 1-1, I, 3°](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164)

### Identité de l'hébergeur

Le nom, la dénomination ou la raison sociale, l'adresse et le numéro de téléphone de l'hébergeur du site.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : auto (`hebergeur`) · **Document** : mentions-legales
- **S'applique à** : tous les sites
- **Sanction** : 1 an d'emprisonnement et 75 000 € d'amende (375 000 € pour une personne morale), LCEN art. 1-2.
- **Sources** : [LCEN, art. 1-1, I, 4°](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164)

### Mentions des professions réglementées

Pour une profession réglementée : la référence aux règles professionnelles applicables, le titre professionnel, l'État membre où il a été octroyé, le nom de l'ordre ou de l'organisme professionnel d'inscription.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : mentions-legales
- **S'applique à** : secteurs = profession-reglementee
- **Sources** : [LCEN, art. 19](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164) ; [Code de la consommation, art. R111-2](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069565)

### Autorisation d'exercer, si l'activité y est soumise

Si l'activité est soumise à autorisation (agrément, carte professionnelle, immatriculation ORIAS, Atout France…) : le nom et l'adresse de l'autorité qui l'a délivrée.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : mentions-legales
- **S'applique à** : secteurs = immobilier, credit-assurance, tourisme, jeux-argent, sante
- **Sources** : [LCEN, art. 19](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164) ; [Code de la consommation, art. R111-2](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069565)

## Données personnelles

### Politique de confidentialité accessible

Dès qu'il collecte des données personnelles (formulaire, compte, commande, newsletter, mesure d'audience), le site fournit une information concise, transparente et aisément accessible sur les traitements, en pratique une page dédiée liée depuis toutes les pages et depuis chaque formulaire.

- **Nature** : obligation légale
- **Gravité** : critique · **Vérification** : auto (`page-confidentialite`) · **Document** : confidentialite
- **S'applique à** : un parmi : collecteDonnees = true | traceurs = true
- **Sanction** : Jusqu'à 20 M€ ou 4 % du chiffre d'affaires mondial (RGPD art. 83) ; amendes CNIL en procédure simplifiée jusqu'à 20 000 €.
- **Sources** : [RGPD, art. 12 et 13](https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra) ; [Loi Informatique et Libertés, art. 48](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000886460)

### Identité et coordonnées du responsable de traitement

La politique indique qui est responsable du traitement et comment le contacter (et, le cas échéant, son représentant dans l'UE).

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : confidentialite
- **S'applique à** : un parmi : collecteDonnees = true | traceurs = true
- **Sanction** : Amende administrative jusqu'à 20 M€ ou 4 % du chiffre d'affaires mondial (RGPD art. 83.5).
- **Sources** : [RGPD, art. 13.1.a](https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra)

### Coordonnées du délégué à la protection des données

Si un DPO a été désigné (obligatoire pour les organismes publics et pour les suivis réguliers à grande échelle ou les données sensibles à grande échelle) : ses coordonnées.

- **Nature** : zone de flou (Un délégué n'est obligatoire que dans certains cas (organisme public, suivi régulier à grande échelle, données sensibles à grande échelle) : cela s'apprécie selon l'activité.)
- **Gravité** : majeure · **Vérification** : ia · **Document** : confidentialite
- **S'applique à** : un parmi : editeurs = public | grandeEntreprise = true | secteurs = sante
- **Sources** : [RGPD, art. 13.1.b et 37](https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra)

### Finalités et bases légales de chaque traitement

Pour chaque traitement : à quoi servent les données et sur quelle base légale (contrat, consentement, obligation légale, intérêt légitime, en précisant lequel).

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : confidentialite
- **S'applique à** : un parmi : collecteDonnees = true | traceurs = true
- **Sanction** : Amende administrative jusqu'à 20 M€ ou 4 % du chiffre d'affaires mondial (RGPD art. 83.5).
- **Sources** : [RGPD, art. 6 et 13.1.c-d](https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra)

### Destinataires et sous-traitants

Les destinataires ou catégories de destinataires des données (prestataires techniques, outils d'analyse, paiement, envoi d'e-mails…).

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : confidentialite
- **S'applique à** : un parmi : collecteDonnees = true | traceurs = true
- **Sanction** : Amende administrative jusqu'à 20 M€ ou 4 % du chiffre d'affaires mondial (RGPD art. 83.5).
- **Sources** : [RGPD, art. 13.1.e](https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra)

### Transferts hors Union européenne

Si des données sont transférées hors de l'UE (outils américains notamment) : le pays, le mécanisme d'encadrement (décision d'adéquation dont le Data Privacy Framework, clauses contractuelles types…) et le moyen d'en obtenir une copie.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : confidentialite
- **S'applique à** : un parmi : collecteDonnees = true | traceurs = true
- **Sanction** : Amende administrative jusqu'à 20 M€ ou 4 % du chiffre d'affaires mondial (RGPD art. 83.5).
- **Sources** : [RGPD, art. 13.1.f et 44 à 49](https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra)

### Durées de conservation

La durée de conservation de chaque catégorie de données, ou les critères qui la déterminent.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : confidentialite
- **S'applique à** : un parmi : collecteDonnees = true | traceurs = true
- **Sanction** : Amende administrative jusqu'à 20 M€ ou 4 % du chiffre d'affaires mondial (RGPD art. 83.5).
- **Sources** : [RGPD, art. 5.1.e et 13.2.a](https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra)

### Droits des personnes et modalités d'exercice

Droits d'accès, rectification, effacement, limitation, portabilité, opposition, retrait du consentement à tout moment, avec un moyen concret de les exercer.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : confidentialite
- **S'applique à** : un parmi : collecteDonnees = true | traceurs = true
- **Sanction** : Amende administrative jusqu'à 20 M€ ou 4 % du chiffre d'affaires mondial (RGPD art. 83.5).
- **Sources** : [RGPD, art. 13.2.b-c et 15 à 22](https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra)

### Directives relatives au sort des données après le décès

Spécificité française : le droit de définir des directives sur la conservation, l'effacement et la communication des données après le décès.

- **Nature** : obligation légale
- **Gravité** : mineure · **Vérification** : ia · **Document** : confidentialite
- **S'applique à** : un parmi : collecteDonnees = true | traceurs = true
- **Sources** : [Loi Informatique et Libertés, art. 85](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000886460)

### Droit de réclamation auprès de la CNIL

Le droit d'introduire une réclamation auprès d'une autorité de contrôle, la CNIL en France.

- **Nature** : obligation légale
- **Gravité** : mineure · **Vérification** : ia · **Document** : confidentialite
- **S'applique à** : un parmi : collecteDonnees = true | traceurs = true
- **Sanction** : Amende administrative jusqu'à 20 M€ ou 4 % du chiffre d'affaires mondial (RGPD art. 83.5).
- **Sources** : [RGPD, art. 13.2.d et 77](https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra)

### Caractère obligatoire ou facultatif des données

Si la fourniture des données conditionne un contrat ou est obligatoire : le préciser et indiquer les conséquences d'un refus (souvent via des astérisques sur le formulaire).

- **Nature** : obligation légale
- **Gravité** : mineure · **Vérification** : ia · **Document** : confidentialite
- **S'applique à** : collecteDonnees = true
- **Sanction** : Amende administrative jusqu'à 20 M€ ou 4 % du chiffre d'affaires mondial (RGPD art. 83.5).
- **Sources** : [RGPD, art. 13.2.e](https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra)

### Profilage et décisions automatisées

En cas de décision entièrement automatisée ou de profilage produisant des effets significatifs : son existence, la logique sous-jacente et ses conséquences.

- **Nature** : zone de flou (Ne s'impose que si le site fait réellement du profilage ou prend des décisions automatisées, ce qui ne se voit pas toujours depuis l'extérieur.)
- **Gravité** : mineure · **Vérification** : ia · **Document** : confidentialite
- **S'applique à** : un parmi : publicite = true | chatbotIA = true | secteurs = credit-assurance
- **Sources** : [RGPD, art. 13.2.f et 22](https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra)

### Information au point de collecte (formulaires)

Chaque formulaire porte une mention d'information courte (responsable, finalité, droits) avec un lien vers la politique de confidentialité, et distingue les champs obligatoires.

- **Nature** : obligation légale (Un lien vers la politique de confidentialité à côté du formulaire suffit ; ce qui est interdit, c'est de collecter sans aucune information.)
- **Gravité** : majeure · **Vérification** : auto (`formulaires-mention`) · **Document** : interface
- **S'applique à** : collecteDonnees = true
- **Sanction** : Amende administrative jusqu'à 20 M€ ou 4 % du chiffre d'affaires mondial (RGPD art. 83.5).
- **Sources** : [RGPD, art. 12 et 13](https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra) ; [CNIL, modèles de mentions d'information](https://www.cnil.fr/fr/modeles/mention)

### Consentement des mineurs de moins de 15 ans

Pour un service en ligne proposé directement à des mineurs et fondé sur le consentement : en dessous de 15 ans, consentement conjoint du mineur et du titulaire de l'autorité parentale, et information rédigée en termes clairs pour un enfant.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : confidentialite
- **S'applique à** : mineurs = true ; collecteDonnees = true
- **Sources** : [RGPD, art. 8 et 12](https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra) ; [Loi Informatique et Libertés, art. 45](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000886460)

### Représentant dans l'Union

Un éditeur établi hors UE qui cible des personnes dans l'UE désigne par écrit un représentant dans l'Union et l'indique.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : confidentialite
- **S'applique à** : horsUE = true ; collecteDonnees = true
- **Sources** : [RGPD, art. 3.2 et 27](https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra)

### Registre des activités de traitement

Tenir un registre des traitements (non publié). L'exemption des moins de 250 salariés ne joue pas pour les traitements non occasionnels, comme la gestion des clients ou la prospection.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : declaratif · **Document** : interne
- **S'applique à** : collecteDonnees = true
- **Sources** : [RGPD, art. 30](https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra)

### Contrats avec les sous-traitants

Un contrat conforme à l'article 28 (DPA) avec chaque prestataire qui traite des données pour le compte de l'éditeur : hébergeur, outil d'e-mailing, CRM, analytics…

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : declaratif · **Document** : interne
- **S'applique à** : collecteDonnees = true
- **Sources** : [RGPD, art. 28](https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra)

### Procédure de violation de données

Documenter les violations de données et notifier la CNIL sous 72 heures en cas de risque pour les personnes.

- **Nature** : obligation légale
- **Gravité** : mineure · **Vérification** : declaratif · **Document** : interne
- **S'applique à** : collecteDonnees = true
- **Sources** : [RGPD, art. 33 et 34](https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra)

## Sécurité

### Chiffrement HTTPS

Les pages, et a fortiori les formulaires et espaces de compte, sont servies en HTTPS. La CNIL considère le TLS comme une mesure de sécurité élémentaire.

- **Nature** : zone de flou (Aucun texte n'impose HTTPS nommément : c'est la CNIL qui le tient pour la mesure de sécurité minimale exigée par l'article 32 du RGPD dès qu'un site collecte des données.)
- **Gravité** : critique · **Vérification** : auto (`https`) · **Document** : interface
- **S'applique à** : tous les sites
- **Sanction** : Amende administrative jusqu'à 10 M€ ou 2 % du chiffre d'affaires mondial (RGPD art. 83.4).
- **Sources** : [RGPD, art. 32](https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra) ; [CNIL, guide de la sécurité des données](https://www.cnil.fr/fr/securite-des-donnees)

## Cookies et traceurs

### Aucun traceur non essentiel avant consentement

Les cookies et traceurs non strictement nécessaires (publicité, réseaux sociaux, la plupart des outils de mesure d'audience) ne sont déposés ni lus avant que l'internaute ait consenti.

- **Nature** : obligation légale
- **Gravité** : critique · **Vérification** : auto (`traceurs-avant-consentement`) · **Document** : interface
- **S'applique à** : tous les sites
- **Sanction** : Amende administrative de la CNIL jusqu'à 10 M€ ou 2 % du chiffre d'affaires mondial (loi Informatique et Libertés, art. 20) ; jusqu'à 20 000 € en procédure simplifiée.
- **Sources** : [Loi Informatique et Libertés, art. 82](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000886460) ; [Directive ePrivacy 2002/58/CE, art. 5.3](https://eur-lex.europa.eu/eli/dir/2002/58/oj/fra) ; [CNIL, lignes directrices du 17 septembre 2020](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000042388179)

### Contenus tiers chargés avant consentement

Les intégrations qui transmettent l'adresse IP à un tiers (vidéos YouTube, cartes Google, polices Google Fonts, boutons sociaux) sont soit hébergées localement, soit bloquées jusqu'au consentement.

- **Nature** : zone de flou (Transmettre l'adresse IP à Google Fonts ou Google Maps sans consentement a été jugé illégal en Allemagne (tribunal de Munich, 2022) ; la CNIL ne l'a pas sanctionné à ce jour. Le risque est réel mais la question n'est pas tranchée en France.)
- **Gravité** : majeure · **Vérification** : auto (`integrations-tierces`) · **Document** : interface
- **S'applique à** : tous les sites
- **Sources** : [RGPD, art. 6 et 44](https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra) ; [Loi Informatique et Libertés, art. 82](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000886460)

### Bandeau de consentement

Si des traceurs soumis à consentement sont utilisés : un mécanisme de recueil du consentement libre, spécifique, éclairé et univoque, qui liste les finalités et permet de choisir.

- **Nature** : obligation légale
- **Gravité** : critique · **Vérification** : auto (`cmp`) · **Document** : interface
- **S'applique à** : traceurs = true
- **Sanction** : Amende administrative de la CNIL jusqu'à 10 M€ ou 2 % du chiffre d'affaires mondial (loi Informatique et Libertés, art. 20).
- **Sources** : [Loi Informatique et Libertés, art. 82](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000886460) ; [RGPD, art. 4.11 et 7](https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra) ; [CNIL, recommandation du 17 septembre 2020](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000042388193)

### Refuser aussi simplement qu'accepter

Le bandeau propose, au même niveau et avec la même visibilité que « Tout accepter », un moyen de tout refuser (bouton « Tout refuser » ou équivalent). Fermer le bandeau ou continuer à naviguer ne vaut pas consentement.

- **Nature** : zone de flou (La loi exige un consentement libre ; la CNIL en déduit que refuser doit être aussi simple qu'accepter, et sanctionne régulièrement ce point. Un bouton « Gérer les cookies » qui renvoie à un second écran ne suffit pas.)
- **Gravité** : critique · **Vérification** : auto (`bouton-refus`) · **Document** : interface
- **S'applique à** : traceurs = true
- **Sanction** : Sanctionné par la CNIL sur le fondement de l'art. 82, jusqu'à 10 M€ ou 2 % du chiffre d'affaires mondial (délibérations du 31 décembre 2021 : 150 M€ contre Google, 60 M€ contre Facebook, pour ce seul motif).
- **Sources** : [CNIL, lignes directrices et recommandation de 2020](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies) ; [RGPD, art. 7.3](https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra)

### Le refus est respecté

Après un clic sur « Tout refuser », aucun traceur soumis à consentement n'est déposé ni lu, ni sur la page en cours ni lors de la suite de la navigation. Un bandeau qui propose de refuser mais laisse les traceurs fonctionner ne recueille aucun consentement valable.

- **Nature** : obligation légale (Vigie clique sur le bouton de refus dans un navigateur vierge, recharge la page, puis relève les cookies et les services contactés. Des requêtes sans cookie (« mode consentement » de Google) restent une zone de flou.)
- **Gravité** : critique · **Vérification** : auto (`traceurs-apres-refus`) · **Document** : interface
- **S'applique à** : traceurs = true
- **Sanction** : Amende administrative de la CNIL jusqu'à 10 M€ ou 2 % du chiffre d'affaires mondial (loi Informatique et Libertés, art. 20) ; jusqu'à 20 000 € en procédure simplifiée.
- **Sources** : [Loi Informatique et Libertés, art. 82](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000886460) ; [Directive ePrivacy 2002/58/CE, art. 5.3](https://eur-lex.europa.eu/eli/dir/2002/58/oj/fra) ; [CNIL, lignes directrices du 17 septembre 2020](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000042388179)

### Durée de vie des traceurs et du choix

Durée de vie des traceurs limitée à 13 mois au plus (recommandation CNIL) ; le choix de l'internaute est conservé et redemandé à intervalle raisonnable (6 mois recommandés).

- **Nature** : recommandation (La limite de 13 mois vient d'une recommandation de la CNIL, pas d'un texte de loi.)
- **Gravité** : mineure · **Vérification** : auto (`duree-cookies`) · **Document** : cookies
- **S'applique à** : traceurs = true
- **Sources** : [CNIL, recommandation du 17 septembre 2020](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000042388193)

### Information sur les traceurs

Une information accessible sur chaque finalité, l'identité des tiers qui déposent des traceurs, la durée de conservation et la possibilité de retirer son consentement aussi facilement qu'on l'a donné (lien permanent « Gérer mes cookies »).

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : cookies
- **S'applique à** : traceurs = true
- **Sanction** : Amende administrative de la CNIL jusqu'à 10 M€ ou 2 % du chiffre d'affaires mondial (loi Informatique et Libertés, art. 20).
- **Sources** : [CNIL, lignes directrices du 17 septembre 2020](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000042388179) ; [RGPD, art. 7.3](https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra)

### Mesure d'audience exemptée correctement configurée

Un outil de mesure d'audience n'est dispensé de consentement que s'il respecte les conditions CNIL : finalité strictement limitée, données anonymes agrégées, pas de recoupement, traceurs de 13 mois maximum, données conservées 25 mois. Google Analytics ne remplit pas ces conditions.

- **Nature** : zone de flou (Les conditions de l'exemption sont fixées par la CNIL. Un outil non exempté chargé sans consentement est déjà relevé, comme manquement certain, au point « Aucun traceur non essentiel avant consentement ».)
- **Gravité** : majeure · **Vérification** : auto (`mesure-audience`) · **Document** : cookies
- **S'applique à** : traceurs = true
- **Sanction** : Amende administrative de la CNIL jusqu'à 10 M€ ou 2 % du chiffre d'affaires mondial (loi Informatique et Libertés, art. 20).
- **Sources** : [Loi Informatique et Libertés, art. 82](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000886460) ; [CNIL, solutions pour la mesure d'audience](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies-solutions-pour-les-outils-de-mesure-daudience)

## Vente à distance

### Conditions générales de vente accessibles

Des conditions générales de vente accessibles avant la commande, téléchargeables et imprimables, que le client accepte expressément. Entre professionnels, les CGV sont le socle de la négociation et doivent être communiquées sur demande.

- **Nature** : obligation légale
- **Gravité** : critique · **Vérification** : auto (`page-cgv`) · **Document** : cgv
- **S'applique à** : venteEnLigne = true
- **Sanction** : Amende administrative jusqu'à 15 000 € pour une personne physique et 75 000 € pour une personne morale par manquement aux obligations d'information (C. conso art. L242-10, qui vise L221-5 et L221-11).
- **Sources** : [Code civil, art. 1119 et 1127-1](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006070721) ; [Code de la consommation, art. L221-5 et L221-11](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069565) ; [Code de commerce, art. L441-1](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000005634379)

### Informations précontractuelles

Avant la commande : caractéristiques essentielles, prix total TTC et frais de livraison, délai ou date de livraison, identité et coordonnées du vendeur, modalités de paiement et d'exécution, garanties légales, durée du contrat et conditions de résiliation, fonctionnalité et interopérabilité des contenus numériques.

- **Nature** : obligation légale
- **Gravité** : critique · **Vérification** : ia · **Document** : cgv
- **S'applique à** : venteEnLigne = true ; b2c = true
- **Sanction** : Amende administrative jusqu'à 15 000 € pour une personne physique et 75 000 € pour une personne morale (C. conso art. L242-10).
- **Sources** : [Code de la consommation, art. L111-1, R111-1, R221-2](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069565) ; [Code de la consommation, art. L221-5](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044563141)

### Droit de rétractation de 14 jours et formulaire type

Les conditions, le délai (14 jours) et les modalités d'exercice du droit de rétractation, le formulaire type de rétractation, qui supporte les frais de retour, ou l'absence de droit de rétractation et sa raison (biens personnalisés, contenus numériques exécutés…).

- **Nature** : obligation légale (Certains contrats sont exclus du droit de rétractation (art. L221-28), par exemple les activités de loisirs fournies à une date déterminée : à vérifier selon ce que vend le site.)
- **Gravité** : critique · **Vérification** : ia · **Document** : cgv
- **S'applique à** : venteEnLigne = true ; b2c = true
- **Sanction** : À défaut d'information, le délai de rétractation est prolongé de 12 mois (C. conso art. L221-20).
- **Sources** : [Code de la consommation, art. L221-5, I, 7°, 8° et 10°](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044563141) ; [Code de la consommation, art. L221-18 à L221-28 (exclusions : art. L221-28)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044563170) ; [Code de la consommation, art. R221-1 et annexe (formulaire type)](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069565)

### Fonctionnalité de rétractation en ligne

Depuis le 19 juin 2026, tout contrat conclu à distance via une interface en ligne doit pouvoir être rétracté en ligne par une fonctionnalité gratuite, visible, directement et facilement accessible pendant tout le délai, libellée « renoncer au contrat ici » ou par une formule analogue dénuée d'ambiguïté. Elle permet de donner son nom, d'identifier le contrat et d'indiquer où recevoir l'accusé de réception, puis de valider par un bouton « confirmer la rétractation » (ou formule analogue). Le professionnel envoie ensuite un accusé de réception sur support durable mentionnant le contenu de la déclaration, sa date et son heure.

- **Nature** : obligation légale (Ne concerne que les contrats ouvrant droit à rétractation (voir les exclusions de l'art. L221-28).)
- **Gravité** : critique · **Vérification** : auto (`lien-retractation`) · **Document** : interface
- **S'applique à** : venteEnLigne = true ; b2c = true
- **Applicable depuis** : 2026-06-19
- **Sources** : [Directive (UE) 2023/2673, art. 11 bis de la directive 2011/83/UE](https://eur-lex.europa.eu/eli/dir/2023/2673/oj/fra) ; [Code de la consommation, issu de l'ordonnance n° 2026-2 du 5 janvier 2026, art. L221-21, dernier alinéa](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053310520) ; [Code de la consommation, issu du décret n° 2026-3 du 5 janvier 2026, art. D221-5](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053303365)

### Bouton « Commande avec obligation de paiement »

Le bouton qui finalise la commande porte la mention « commande avec obligation de paiement » ou une formule analogue dénuée d'ambiguïté. Le client peut vérifier le détail de sa commande et son prix total et corriger ses erreurs avant de confirmer (double clic). Les moyens de paiement acceptés et les éventuelles restrictions de livraison sont indiqués au plus tard au début du processus de commande.

- **Nature** : obligation légale (La directive 2011/83/UE (considérant 39) cite « commander maintenant » ou « confirmer » parmi les formules ambiguës ; « Payer » ou « Acheter » sont admis. Vigie lit le bouton en parcourant le tunnel de commande, sans jamais commander.)
- **Gravité** : majeure · **Vérification** : declaratif (`bouton-commande`) · **Document** : interface
- **S'applique à** : venteEnLigne = true ; b2c = true
- **Sanction** : Le contrat n'est valablement conclu que si le client a pu vérifier sa commande avant de la confirmer (C. civ. art. 1127-2) ; amende administrative jusqu'à 75 000 € pour une personne morale (C. conso art. L242-10, qui vise L221-14).
- **Sources** : [Code de la consommation, art. L221-14](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032226854) ; [Code civil, art. 1127-2](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032007506)

### Confirmation de commande sur support durable

Une confirmation du contrat, reprenant toutes les informations précontractuelles et le formulaire de rétractation, envoyée sur support durable (e-mail) au plus tard à la livraison.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : declaratif · **Document** : interne
- **S'applique à** : venteEnLigne = true ; b2c = true
- **Sanction** : Amende administrative jusqu'à 75 000 € pour une personne morale (C. conso art. L242-10).
- **Sources** : [Code de la consommation, art. L221-13](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044563210)

### Garantie légale de conformité et garantie des vices cachés

Les CGV reproduisent les informations sur la garantie légale de conformité (2 ans ; défaut présumé exister à la livraison pendant 2 ans, 1 an pour les biens d'occasion ; mises à jour des biens comportant des éléments numériques), la garantie des vices cachés et, le cas échéant, la garantie commerciale, sous la forme de l'encadré prévu par décret.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : cgv
- **S'applique à** : venteEnLigne = true ; b2c = true
- **Sources** : [Code de la consommation, art. L217-3 et s., L224-25-12 et s., D211-2](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069565) ; [Code civil, art. 1641 à 1649](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006070721)

### Délai de livraison et transfert des risques

La date ou le délai de livraison (à défaut, 30 jours au plus), les conséquences d'un retard et le transfert des risques à la prise de possession par le consommateur.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : cgv
- **S'applique à** : venteEnLigne = true ; b2c = true
- **Sources** : [Code de la consommation, art. L216-1 à L216-4](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044142498)

### Médiateur de la consommation

Le professionnel adhère à un médiateur de la consommation référencé et communique ses coordonnées (nom, site internet) sur son site et dans ses CGV.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : auto (`mediateur`) · **Document** : cgv
- **S'applique à** : b2c = true ; un parmi : venteEnLigne = true | types = vitrine
- **Sanction** : Amende administrative jusqu'à 3 000 € pour une personne physique et 15 000 € pour une personne morale (art. L641-1).
- **Sources** : [Code de la consommation, art. L612-1 et L616-1](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069565) ; [Code de la consommation, art. R616-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032808378) ; [Liste des médiateurs référencés](https://www.economie.gouv.fr/mediation-conso/liste-des-mediateurs-references)

### Lien vers la plateforme européenne RLL à retirer (abrogée, à retirer)

La plateforme européenne de règlement en ligne des litiges (ec.europa.eu/consumers/odr) a fermé le 20 juillet 2025 et l'obligation d'y renvoyer a disparu. Un lien encore présent est un lien mort à retirer des CGV et du pied de page.

- **Nature** : obligation légale
- **Gravité** : mineure · **Vérification** : auto (`lien-odr`) · **Document** : cgv
- **S'applique à** : tous les sites
- **Applicable depuis** : 2025-07-20
- **Sources** : [Règlement (UE) 2024/3228 abrogeant le règlement (UE) n° 524/2013](https://eur-lex.europa.eu/eli/reg/2024/3228/oj/fra)

### Pas de discrimination géographique dans l'UE

Pas de blocage ni de redirection forcée, ni de conditions générales d'accès différentes selon la nationalité ou le lieu de résidence d'un client de l'UE, sauf justification légale (livraison possible à retirer sur place).

- **Nature** : obligation légale
- **Gravité** : mineure · **Vérification** : ia · **Document** : cgv
- **S'applique à** : venteEnLigne = true
- **Sources** : [Règlement (UE) 2018/302 « géoblocage », art. 3 à 5](https://eur-lex.europa.eu/eli/reg/2018/302/oj/fra)

### Fiche produit : fabricant, identification et avertissements de sécurité

Depuis le 13 décembre 2024, chaque offre en ligne d'un produit de consommation indique de façon claire et visible : le nom ou la marque du fabricant et ses adresses postale et électronique ; si le fabricant est établi hors de l'Union, la personne responsable dans l'Union et ses coordonnées ; les éléments permettant d'identifier le produit (image, type, référence) ; les avertissements et informations de sécurité qui doivent figurer sur le produit ou sa notice, en français.

- **Nature** : obligation légale (Ne concerne que la vente de biens (pas les services ni les contenus numériques). Sur une place de marché, la plateforme doit permettre aux vendeurs d'afficher ces informations (art. 22).)
- **Gravité** : majeure · **Vérification** : declaratif · **Document** : interface
- **S'applique à** : venteEnLigne = true ; b2c = true ; types = ecommerce, marketplace
- **Applicable depuis** : 2024-12-13
- **Sources** : [Règlement (UE) 2023/988 relatif à la sécurité générale des produits (GPSR), art. 19](https://eur-lex.europa.eu/eli/reg/2023/988/oj/fra)

## Contrats en ligne

### Archivage des contrats de 120 € ou plus

Pour une commande de 120 € TTC ou plus, le professionnel conserve l'écrit du contrat pendant 10 ans et en garantit l'accès au consommateur ; les CGV indiquent ces modalités d'archivage.

- **Nature** : obligation légale
- **Gravité** : mineure · **Vérification** : ia · **Document** : cgv
- **S'applique à** : venteEnLigne = true ; b2c = true
- **Sources** : [Code de la consommation, art. L213-1 et D213-1 (seuil de 120 €)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032226994) ; [Code civil, art. 1127-1, 4°](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032007504)

### Étapes de conclusion du contrat électronique

Les différentes étapes à suivre pour conclure le contrat, les moyens de corriger les erreurs de saisie, les langues proposées (dont obligatoirement le français) et les règles professionnelles auxquelles le vendeur se soumet ; les conditions contractuelles sont mises à disposition d'une manière qui permet de les conserver et de les reproduire.

- **Nature** : obligation légale
- **Gravité** : mineure · **Vérification** : ia · **Document** : cgv
- **S'applique à** : venteEnLigne = true
- **Sources** : [Code civil, art. 1127-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032007504)

### Absence de clauses abusives

Les conditions ne contiennent pas de clauses abusives (liste noire et liste grise), par exemple exclure toute responsabilité du vendeur, imposer une juridiction éloignée au consommateur ou se réserver de modifier unilatéralement le prix.

- **Nature** : zone de flou (Hors des clauses listées par décret (art. R212-1 et R212-2), le caractère abusif d'une clause est apprécié par le juge au cas par cas.)
- **Gravité** : majeure · **Vérification** : ia · **Document** : cgv
- **S'applique à** : b2c = true ; un parmi : venteEnLigne = true | comptesUtilisateurs = true
- **Sanction** : Clause réputée non écrite ; pour les clauses de la liste noire (art. R212-1), amende administrative jusqu'à 15 000 € pour une personne physique et 75 000 € pour une personne morale (art. L241-2).
- **Sources** : [Code de la consommation, art. L212-1, R212-1 et R212-2](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069565)

### CGV entre professionnels : délais et pénalités de retard

Pour une clientèle professionnelle : conditions de règlement, délais de paiement (60 jours ou 45 jours fin de mois au plus), taux des pénalités de retard et indemnité forfaitaire de 40 € pour frais de recouvrement.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : cgv
- **S'applique à** : b2b = true ; venteEnLigne = true
- **Sanction** : Amende administrative jusqu'à 75 000 € (personne physique) ou 2 M€ (personne morale) pour les délais de paiement et l'absence des mentions sur les pénalités (C. com. art. L441-16).
- **Sources** : [Code de commerce, art. L441-1 et D441-5](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000005634379) ; [Code de commerce, art. L441-10](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038414392)

### Information sur la reconduction des abonnements

Pour un contrat de prestation de services à reconduction tacite, le consommateur est informé par lettre nominative ou courrier électronique dédiés, 1 à 3 mois avant le terme, de sa faculté de ne pas reconduire, avec un encadré apparent indiquant la date limite ; à défaut, il peut résilier gratuitement à tout moment après la reconduction. Les conditions de résiliation figurent dans les conditions générales.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : cgv
- **S'applique à** : abonnements = true ; b2c = true
- **Sources** : [Code de la consommation, art. L215-1 à L215-4](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000046194176)

### Résiliation en ligne « en trois clics »

Quand un contrat peut être conclu par voie électronique, il doit pouvoir être résilié de la même façon via une fonctionnalité gratuite, directement et facilement accessible (mention « résilier votre contrat »), avec confirmation de la résiliation sur support durable.

- **Nature** : obligation légale
- **Gravité** : critique · **Vérification** : auto (`lien-resiliation`) · **Document** : interface
- **S'applique à** : abonnements = true ; b2c = true
- **Applicable depuis** : 2023-06-01
- **Sanction** : Amende administrative jusqu'à 15 000 € pour une personne physique et 75 000 € pour une personne morale (art. L241-3-1).
- **Sources** : [Code de la consommation, art. L215-1-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000046190107) ; [Code de la consommation, art. D215-1 à D215-3 (mention « résilier votre contrat », pas de création de compte imposée)](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069565)

### Contenus et services numériques

Information sur la fonctionnalité, la compatibilité et l'interopérabilité, les mises à jour fournies et la garantie légale de conformité des contenus et services numériques ; si l'exécution commence avant la fin du délai, accord exprès et renoncement au droit de rétractation.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : cgv
- **S'applique à** : contenusNumeriques = true ; b2c = true
- **Sources** : [Code de la consommation, art. L111-1, 1°](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044142438) ; [Code de la consommation, art. L221-28 13° et L224-25-12 et s.](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069565)

### Logiciel en ligne (SaaS) : droit de changer de fournisseur

Depuis le 12 septembre 2025, le fournisseur d'un service de traitement de données (cloud, SaaS) prévoit dans un contrat écrit le droit du client de changer de fournisseur ou de passer sur ses propres serveurs : préavis de deux mois au plus, période de transition de 30 jours en principe, export de toutes les données exportables dans un format structuré et couramment utilisé, effacement après la transition, information sur les frais de changement. Ces frais doivent être réduits aux coûts réels, puis supprimés à partir du 12 janvier 2027.

- **Nature** : zone de flou (Tout logiciel en ligne n'est pas un « service de traitement de données » au sens du Data Act : cela dépend du service. S'applique aux clients professionnels comme aux particuliers. Les services en grande partie développés sur mesure pour un client, ou fournis en version d'essai, bénéficient d'allègements (art. 31).)
- **Gravité** : majeure · **Vérification** : ia · **Document** : cgv
- **S'applique à** : types = saas
- **Applicable depuis** : 2025-09-12
- **Sources** : [Règlement (UE) 2023/2854 « Data Act », art. 23 à 31](https://eur-lex.europa.eu/eli/reg/2023/2854/oj/fra)

## Prix et promotions

### Pas de frais supplémentaires selon le moyen de paiement

Aucun surcoût ne peut être appliqué au consommateur pour l'utilisation d'une carte de paiement grand public ou d'un virement ou prélèvement SEPA.

- **Nature** : obligation légale
- **Gravité** : mineure · **Vérification** : ia · **Document** : cgv
- **S'applique à** : venteEnLigne = true ; b2c = true
- **Sources** : [Code monétaire et financier, art. L112-12](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000035430410)

### Prix affichés TTC, frais en sus indiqués

Les prix proposés aux consommateurs sont indiqués toutes taxes comprises, en euros, avec les frais de livraison ou leur mode de calcul ; prix à l'unité de mesure pour les produits concernés.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : interface
- **S'applique à** : venteEnLigne = true ; b2c = true
- **Sanction** : Amende administrative jusqu'à 3 000 € pour une personne physique et 15 000 € pour une personne morale (C. conso art. L131-5).
- **Sources** : [Code de la consommation, art. L112-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032227331) ; [Arrêté du 3 décembre 1987 relatif à l'information du consommateur sur les prix](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000874009)

### Prix de référence des réductions

Toute annonce de réduction de prix indique le prix antérieur pratiqué, à savoir le prix le plus bas pratiqué envers tous les consommateurs au cours des 30 derniers jours précédant la réduction (en cas de réductions successives, le prix d'avant la première réduction).

- **Nature** : obligation légale (Vigie relève les prix barrés affichés, mais ne connaît pas l'historique des prix : seul le vendeur peut vérifier le prix des 30 derniers jours.)
- **Gravité** : majeure · **Vérification** : declaratif (`prix-reference`) · **Document** : interface
- **S'applique à** : reductionsPrix = true
- **Sanction** : Le code ne prévoit pas d'amende administrative propre à l'art. L112-1-1 ; un prix de référence fictif est poursuivi comme pratique commerciale trompeuse : 2 ans d'emprisonnement et 300 000 € d'amende, portés à 5 ans et 750 000 € quand elle est commise en ligne (C. conso art. L132-2).
- **Sources** : [Code de la consommation, art. L112-1-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044549592) ; [Directive (UE) 2019/2161 « Omnibus »](https://eur-lex.europa.eu/eli/dir/2019/2161/oj/fra)

### Prix personnalisés par algorithme

Si le prix est personnalisé sur la base d'une prise de décision automatisée, le consommateur en est informé.

- **Nature** : obligation légale
- **Gravité** : mineure · **Vérification** : declaratif · **Document** : cgv
- **S'applique à** : venteEnLigne = true ; b2c = true ; publicite = true
- **Sources** : [Code de la consommation, art. L221-5, I, 11°](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044563141) ; [Directive (UE) 2019/2161](https://eur-lex.europa.eu/eli/dir/2019/2161/oj/fra)

## Accessibilité

### Informations d'accessibilité du service dans les conditions générales

Les services de commerce électronique couverts par l'European Accessibility Act indiquent dans leurs conditions générales, ou un document équivalent, comment le service satisfait aux exigences d'accessibilité.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : cgv
- **S'applique à** : venteEnLigne = true ; b2c = true ; microEntreprise = false
- **Applicable depuis** : 2025-06-28
- **Sources** : [Directive (UE) 2019/882, annexe V](https://eur-lex.europa.eu/eli/dir/2019/882/oj/fra) ; [Loi n° 2005-102 modifiée par l'ordonnance n° 2023-859, art. 47](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000809647)

### Mention « Accessibilité : non / partiellement / totalement conforme »

Les organismes publics et les entreprises dont le chiffre d'affaires dépasse le seuil fixé par décret (250 M€) affichent sur leur page d'accueil leur état de conformité, renvoient à une déclaration d'accessibilité et publient un schéma pluriannuel.

- **Nature** : obligation légale (Cette mention ne concerne pas les autres entreprises : pour elles, l'European Accessibility Act impose l'accessibilité du service et une information dans les conditions générales, pas cette mention.)
- **Gravité** : majeure · **Vérification** : auto (`mention-accessibilite`) · **Document** : accessibilite
- **S'applique à** : un parmi : editeurs = public | grandeEntreprise = true
- **Sources** : [Loi n° 2005-102, art. 47](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000809647) ; [Décret n° 2019-768, art. 3 à 5](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000038811937) ; [Référentiel RGAA](https://accessibilite.numerique.gouv.fr/)

### Conformité aux exigences d'accessibilité (RGAA / EN 301 549)

Depuis le 28 juin 2025, les services de commerce électronique et les services numériques des entreprises qui ne sont pas des microentreprises doivent être accessibles aux personnes handicapées (European Accessibility Act).

- **Nature** : obligation légale (Les microentreprises (moins de 10 salariés et 2 M€ de chiffre d'affaires ou de bilan) qui fournissent des services en sont dispensées. Vigie lance les tests automatiques d'axe-core (WCAG 2.1 A et AA, socle de la norme EN 301 549) sur la page d'accueil : ils détectent des erreurs certaines, mais ne couvrent qu'une partie des critères.)
- **Gravité** : majeure · **Vérification** : declaratif (`accessibilite-auto`) · **Document** : interface
- **S'applique à** : un parmi : editeurs = public | grandeEntreprise = true | venteEnLigne = true ; b2c = true ; microEntreprise = false
- **Applicable depuis** : 2025-06-28
- **Sources** : [Directive (UE) 2019/882 « EAA »](https://eur-lex.europa.eu/eli/dir/2019/882/oj/fra) ; [Loi n° 2005-102, modifiée par l'ordonnance n° 2023-859 du 6 septembre 2023](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000809647)

## Plateformes et contenus

### Conditions générales d'utilisation

Pour un service qui héberge des contenus fournis par ses utilisateurs (avis, annonces, messages, fichiers) ou met en relation : des CGU claires qui fixent les règles d'usage, les restrictions imposées aux contenus et la procédure de modération (y compris les outils automatisés et le traitement des réclamations).

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : auto (`page-cgu`) · **Document** : cgu
- **S'applique à** : un parmi : contenusUtilisateurs = true | types = saas, marketplace, communaute
- **Applicable depuis** : 2024-02-17
- **Sources** : [Règlement (UE) 2022/2065 « DSA », art. 14](https://eur-lex.europa.eu/eli/reg/2022/2065/oj/fra) ; [Code civil, art. 1119](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006070721)

### Point de contact unique pour les utilisateurs et les autorités

Les fournisseurs de services intermédiaires (hébergement de contenus de tiers inclus) publient un point de contact électronique, facilement accessible, et les langues utilisables.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : cgu
- **S'applique à** : contenusUtilisateurs = true
- **Applicable depuis** : 2024-02-17
- **Sources** : [DSA, art. 11 et 12](https://eur-lex.europa.eu/eli/reg/2022/2065/oj/fra)

### Mécanisme de signalement des contenus illicites

Un dispositif facile d'accès permettant à toute personne de signaler un contenu illicite, avec accusé de réception, décision motivée et information des personnes concernées.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : interface
- **S'applique à** : contenusUtilisateurs = true
- **Applicable depuis** : 2024-02-17
- **Sources** : [DSA, art. 16 et 17](https://eur-lex.europa.eu/eli/reg/2022/2065/oj/fra) ; [LCEN, art. 6](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164)

### Transparence des plateformes en ligne

Les plateformes de mise en relation indiquent les critères de classement des offres, l'existence d'une relation capitalistique ou d'une rémunération influant sur le classement, la qualité du vendeur (professionnel ou particulier) et les droits qui en découlent.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : cgu
- **S'applique à** : types = marketplace
- **Sources** : [Code de la consommation, art. L111-7 (places de marché et comparateurs)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000049571125) ; [Code de la consommation, art. L121-4, 25° (classement payé non signalé)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044563107) ; [Règlement (UE) 2019/1150 « P2B », art. 3 et 5](https://eur-lex.europa.eu/eli/reg/2019/1150/oj/fra) ; [DSA, art. 27 et 30](https://eur-lex.europa.eu/eli/reg/2022/2065/oj/fra)

### Conditions pour les vendeurs professionnels (P2B)

Conditions générales destinées aux entreprises utilisatrices : motifs de suspension, préavis de 30 jours avant modification, système interne de traitement des plaintes, médiateurs désignés.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : cgu
- **S'applique à** : types = marketplace
- **Sources** : [Règlement (UE) 2019/1150 « P2B », art. 3, 4, 11 et 12](https://eur-lex.europa.eu/eli/reg/2019/1150/oj/fra)

### Fiabilité des avis en ligne

Le site qui publie des avis indique, à proximité des avis, s'ils font l'objet d'une procédure de contrôle, la date de chaque avis et de l'expérience concernée, et les critères de classement (dont l'ordre chronologique) ; dans une rubrique dédiée, l'existence ou non d'une contrepartie au dépôt d'un avis, le délai de publication et de conservation, les caractéristiques du contrôle et les motifs de rejet. Il offre aux professionnels concernés une fonctionnalité gratuite pour signaler un doute sur l'authenticité d'un avis. Affirmer que des avis sont vérifiés sans l'avoir fait, publier ou commander de faux avis sont des pratiques trompeuses.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : interface
- **S'applique à** : avisClients = true
- **Sanction** : Faux avis ou vérification affichée mais inexistante : pratique commerciale trompeuse, jusqu'à 5 ans et 750 000 € quand elle est commise en ligne (C. conso art. L132-2).
- **Sources** : [Code de la consommation, art. L111-7-2](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000049571119) ; [Code de la consommation, art. D111-9 à D111-11](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069565) ; [Code de la consommation, art. L121-4, 27° et 28°](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044563107)

### Pas d'interface trompeuse (dark patterns)

L'interface ne doit pas tromper ou manipuler l'utilisateur : options préselectionnées, désabonnement plus difficile que l'abonnement, sollicitations répétées, choix mis en avant de façon déséquilibrée.

- **Nature** : zone de flou (La notion d'interface trompeuse est récente et appréciée au cas par cas. L'article 25 du DSA ne vise pas les micro et petites entreprises (art. 19), mais l'interdiction des pratiques commerciales trompeuses s'applique à tous.)
- **Gravité** : mineure · **Vérification** : declaratif · **Document** : interface
- **S'applique à** : un parmi : types = marketplace, communaute | venteEnLigne = true
- **Sources** : [DSA, art. 25](https://eur-lex.europa.eu/eli/reg/2022/2065/oj/fra) ; [Code de la consommation, art. L121-1 à L121-4](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069565)

### Protection des mineurs sur les plateformes

Les plateformes accessibles aux mineurs garantissent un niveau élevé de protection et n'affichent pas de publicité ciblée fondée sur le profilage d'un mineur.

- **Nature** : obligation légale (Les plateformes exploitées par des micro ou petites entreprises (moins de 50 salariés et 10 M€ de chiffre d'affaires) ne sont pas visées (DSA art. 19).)
- **Gravité** : majeure · **Vérification** : declaratif · **Document** : cgu
- **S'applique à** : mineurs = true ; contenusUtilisateurs = true
- **Sources** : [DSA, art. 28](https://eur-lex.europa.eu/eli/reg/2022/2065/oj/fra)

### Audit de cybersécurité affiché (« cyberscore »)

Les plateformes en ligne, moteurs de recherche, comparateurs et messageries dont l'activité dépasse les seuils fixés par décret font réaliser un audit de cybersécurité par un prestataire qualifié par l'ANSSI et en présentent le résultat aux consommateurs, de façon lisible, avec un système d'information coloriel.

- **Nature** : zone de flou (Ne concerne que les très grands services (seuils d'audience fixés par décret) ; les critères et la présentation sont fixés par arrêté.)
- **Gravité** : mineure · **Vérification** : declaratif · **Document** : interface
- **S'applique à** : grandeEntreprise = true ; un parmi : types = marketplace, communaute | contenusUtilisateurs = true
- **Sources** : [Code de la consommation, art. L111-7-3](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000049571116)

## Prospection et publicité

### Consentement à la prospection par e-mail

La prospection commerciale par e-mail ou SMS vers des particuliers exige leur consentement préalable (case non précochée), sauf pour des produits analogues vendus à un client existant qui a pu s'y opposer ; chaque message comporte un lien de désinscription.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : interface
- **S'applique à** : newsletter = true
- **Sanction** : Amende administrative prononcée par la DGCCRF jusqu'à 75 000 € (personne physique) ou 375 000 € (personne morale), CPCE art. L34-5 ; la CNIL est aussi compétente.
- **Sources** : [Code des postes et des communications électroniques, art. L34-5](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000042155961)

### Démarchage téléphonique : consentement préalable

Depuis le 11 août 2026, il est interdit de démarcher par téléphone un consommateur qui n'y a pas consenti au préalable (consentement libre, spécifique, éclairé, univoque, révocable, par un acte positif clair, dont le professionnel doit apporter la preuve), sauf dans le cadre d'un contrat en cours. Quand le site recueille un numéro de téléphone, il informe le consommateur que toute sollicitation commerciale par téléphone suppose son consentement préalable ; un contrat conclu à cette occasion le mentionne. Le renvoi à Bloctel ne suffit plus.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : ia · **Document** : interface
- **S'applique à** : collecteDonnees = true ; b2c = true
- **Applicable depuis** : 2026-08-11
- **Sanction** : Amende administrative jusqu'à 75 000 € (personne physique) ou 375 000 € (personne morale), C. conso art. L242-16 ; un contrat conclu à la suite d'un démarchage illicite est nul.
- **Sources** : [Code de la consommation, issu de la loi n° 2025-594 du 30 juin 2025, art. L223-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000051830285) ; [Code de la consommation, art. L223-2](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000051830282)

### Publicité et contenus sponsorisés identifiables

Toute publicité, y compris un contenu sponsorisé ou un lien d'affiliation, doit être clairement identifiable comme telle et l'annonceur identifiable.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : declaratif · **Document** : interface
- **S'applique à** : publicite = true
- **Sources** : [LCEN, art. 20](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164) ; [Code de la consommation, art. L121-4, 11°](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044563107) ; [DSA, art. 26](https://eur-lex.europa.eu/eli/reg/2022/2065/oj/fra)

### Influence commerciale

Les contenus d'influence commerciale portent la mention « publicité » ou « collaboration commerciale » et, le cas échéant, « image retouchée » ou « image virtuelle ».

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : declaratif · **Document** : interface
- **S'applique à** : publicite = true ; types = media, communaute
- **Sources** : [Loi n° 2023-451 du 9 juin 2023, art. 5](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000047663185)

## Environnement

### Allégations environnementales génériques interdites

Les allégations environnementales doivent être précises, vérifiables et justifiées. Sont déjà interdites en France : « biodégradable », « respectueux de l'environnement » ou toute mention équivalente sur un produit ou un emballage, la mention « recyclé » sans le pourcentage de matière recyclée, et toute allégation de neutralité carbone sans bilan d'émissions publié. La directive 2024/825, applicable depuis le 27 septembre 2026, interdit en plus les allégations génériques sans performance reconnue, la neutralité fondée sur la compensation et les labels non certifiés.

- **Nature** : zone de flou (La France n'a pas encore transposé la directive 2024/825 (projet de loi DDADUE en cours d'examen au 13 octobre 2026) : une directive ne s'impose pas directement entre entreprises, et la DGCCRF a indiqué attendre la transposition pour contrôler les nouvelles règles. Les juges interprètent toutefois déjà le droit français à sa lumière, et les interdictions du Code de l'environnement s'appliquent.)
- **Gravité** : critique · **Vérification** : auto (`allegations-vertes`) · **Document** : interface
- **S'applique à** : allegationsEnvironnementales = true
- **Applicable depuis** : 2026-09-27
- **Sanction** : Pratique commerciale trompeuse : 2 ans d'emprisonnement et 300 000 € d'amende, portés à 5 ans et 750 000 € quand elle est commise en ligne ; l'amende peut atteindre 80 % des dépenses de la publicité en cas d'allégation environnementale (C. conso art. L132-2).
- **Sources** : [Directive (UE) 2024/825 « transition verte »](https://eur-lex.europa.eu/eli/dir/2024/825/oj/fra) ; [Code de la consommation, art. L121-2 et L121-4](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069565) ; [Code de l'environnement, art. L229-68 (neutralité carbone)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043960256) ; [Code de l'environnement, art. L541-9-1 (« biodégradable », « respectueux de l'environnement », pourcentage de matière recyclée)](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006074220)

### Indice de réparabilité ou de durabilité

Pour les équipements électriques et électroniques concernés (ordinateurs, téléviseurs, lave-linge…), informer sans frais le consommateur, au moment de l'achat, de l'indice de réparabilité ou de durabilité, y compris en ligne, et mettre à sa disposition les paramètres qui ont permis de l'établir.

- **Nature** : obligation légale (Pour les smartphones et tablettes, l'étiquette énergie européenne (avec sa classe de réparabilité) remplace l'indice français depuis le 20 juin 2025 (règlement (UE) 2023/1669).)
- **Gravité** : majeure · **Vérification** : declaratif · **Document** : interface
- **S'applique à** : secteurs = electronique-electromenager ; venteEnLigne = true
- **Sources** : [Code de l'environnement, art. L541-9-2](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000041555848)

### Disponibilité des pièces détachées

Le vendeur informe le consommateur, de manière lisible avant la conclusion du contrat, de la disponibilité ou de la non-disponibilité des pièces détachées indispensables à l'utilisation du bien et, le cas échéant, de la période ou de la date jusqu'à laquelle elles sont disponibles ; l'information est confirmée par écrit lors de l'achat. Pour les équipements électriques et électroniques et l'ameublement, à défaut d'information du fabricant, les pièces sont réputées non disponibles.

- **Nature** : obligation légale
- **Gravité** : mineure · **Vérification** : declaratif · **Document** : interface
- **S'applique à** : secteurs = electronique-electromenager ; venteEnLigne = true ; b2c = true
- **Sources** : [Code de la consommation, art. L111-4](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044330854)

### Information sur la réparation

Pour les biens couverts par la directive « droit à la réparation » : informer de l'obligation de réparation du fabricant et, quand le consommateur choisit la réparation au titre de la garantie légale, de la prolongation de cette garantie de 12 mois.

- **Nature** : zone de flou (La directive devait être transposée au 31 juillet 2026 ; la France ne l'a pas encore fait au 13 octobre 2026. Les obligations pèsent surtout sur les fabricants ; pour le vendeur, l'anticiper dans les CGV est une précaution.)
- **Gravité** : mineure · **Vérification** : declaratif · **Document** : cgv
- **S'applique à** : secteurs = electronique-electromenager ; venteEnLigne = true
- **Applicable depuis** : 2026-07-31
- **Sources** : [Directive (UE) 2024/1799, art. 5, 6 et 16](https://eur-lex.europa.eu/eli/dir/2024/1799/oj/fra)

## Intelligence artificielle

### Information sur l'interaction avec une IA

Les personnes qui échangent avec un système d'IA (chatbot, assistant) sont informées qu'elles interagissent avec une IA, sauf évidence ; les contenus générés ou manipulés par IA (hypertrucages, textes d'information) sont signalés comme tels.

- **Nature** : zone de flou (L'article 50.1 vise le fournisseur du système d'IA : un site qui conçoit son propre assistant (même sur un modèle tiers) l'est ; un site qui installe un outil prêt à l'emploi peut ne pas l'être. Le report d'une partie de l'AI Act (règlement « omnibus » de 2026) ne concerne pas cette obligation.)
- **Gravité** : majeure · **Vérification** : ia · **Document** : interface
- **S'applique à** : chatbotIA = true
- **Applicable depuis** : 2026-08-02
- **Sources** : [Règlement (UE) 2024/1689 « AI Act », art. 50](https://eur-lex.europa.eu/eli/reg/2024/1689/oj/fra)

## Langue

### Offre et conditions en français

La présentation des biens et services, les modes d'emploi, les garanties et les conditions contractuelles proposés à des consommateurs en France sont rédigés en français (les traductions sont permises en plus).

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : auto (`langue`) · **Document** : interface
- **S'applique à** : b2c = true
- **Sources** : [Loi n° 94-665 « Toubon », art. 2](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000349929)

## Sectoriel

### Alcool : message sanitaire et interdiction de vente aux mineurs

Toute publicité pour des boissons alcooliques porte un message sanitaire précisant que l'abus d'alcool est dangereux pour la santé (formule d'usage : « L'abus d'alcool est dangereux pour la santé, à consommer avec modération ») et se limite aux mentions objectives autorisées ; en ligne, elle n'est ni intrusive ni interstitielle et est exclue des sites destinés à la jeunesse ou édités par des clubs et fédérations sportives. La vente aux mineurs est interdite : le vendeur exige la preuve de la majorité.

- **Nature** : obligation légale
- **Gravité** : critique · **Vérification** : auto (`message-alcool`) · **Document** : interface
- **S'applique à** : secteurs = alcool
- **Sources** : [Code de la santé publique, art. L3323-2 9°, L3323-4 et L3342-1](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006072665)

### Denrées alimentaires vendues à distance

Les informations obligatoires (dénomination, liste des ingrédients, allergènes, quantité, conditions de conservation, origine si requise) sont disponibles avant l'achat, sur la fiche produit.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : declaratif · **Document** : interface
- **S'applique à** : secteurs = alimentaire ; venteEnLigne = true
- **Sources** : [Règlement (UE) n° 1169/2011 « INCO », art. 9 et 14](https://eur-lex.europa.eu/eli/reg/2011/1169/oj/fra)

### Immobilier : honoraires, carte professionnelle, DPE

Les agents immobiliers affichent leurs barèmes d'honoraires TTC sur leur site, leur numéro de carte professionnelle et sa préfecture ou CCI de délivrance, leur garant ; les annonces mentionnent la classe énergie et climat (DPE).

- **Nature** : obligation légale
- **Gravité** : critique · **Vérification** : declaratif · **Document** : mentions-legales
- **S'applique à** : secteurs = immobilier
- **Sanction** : Absence des classes énergie et climat dans une annonce : amende administrative jusqu'à 3 000 € (personne physique) ou 15 000 € (personne morale), CCH art. L126-33.
- **Sources** : [Loi n° 70-9 « Hoguet »](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000512228) ; [Arrêté du 10 janvier 2017 relatif à l'information sur les prix des prestations des agents immobiliers](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000033860733) ; [Code de la construction et de l'habitation, art. L126-33](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043976944)

### Crédit et assurance : ORIAS et mentions de publicité

Les intermédiaires indiquent leur numéro d'immatriculation ORIAS ; la publicité pour un crédit à la consommation comporte les mentions obligatoires (TAEG en exemple représentatif, « Un crédit vous engage et doit être remboursé… »).

- **Nature** : obligation légale (La directive (UE) 2023/2225 s'applique à partir du 20 novembre 2026 : elle fait entrer dans le crédit à la consommation les crédits gratuits ou à frais négligeables remboursables en moins de trois mois, comme le paiement fractionné (« payez en 3 ou 4 fois »). Un site marchand qui le met en avant devra alors porter les mentions de publicité du crédit. Vérifier le texte de transposition sur Légifrance à cette date.)
- **Gravité** : critique · **Vérification** : declaratif · **Document** : mentions-legales
- **S'applique à** : secteurs = credit-assurance
- **Sources** : [Code de la consommation, art. L312-5 à L312-10](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032226198) ; [Code des assurances, art. L512-1 et R521-1](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006073984) ; [Directive (UE) 2023/2225 (crédit à la consommation)](https://eur-lex.europa.eu/eli/dir/2023/2225/oj/fra)

### Santé : hébergement HDS et règles de vente en ligne

Les données de santé confiées à un prestataire sont hébergées chez un hébergeur certifié HDS ; la vente en ligne de médicaments est réservée aux pharmacies autorisées et soumise à des mentions précises (logo commun européen, lien vers l'ARS).

- **Nature** : obligation légale
- **Gravité** : critique · **Vérification** : declaratif · **Document** : interne
- **S'applique à** : secteurs = sante
- **Sources** : [Code de la santé publique, art. L1111-8, L5125-33 et s.](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006072665)

### Voyages et séjours : immatriculation et formulaire d'information

Les opérateurs de voyages indiquent leur immatriculation Atout France, leur garantie financière et fournissent le formulaire d'information standard avant la vente d'un forfait.

- **Nature** : obligation légale
- **Gravité** : critique · **Vérification** : declaratif · **Document** : cgv
- **S'applique à** : secteurs = tourisme
- **Sources** : [Code du tourisme, art. L211-8, L211-18 et R211-3-1](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006074073)

### Artisans et BTP : assurance professionnelle

Les artisans soumis à une assurance obligatoire (décennale notamment) indiquent l'assurance souscrite, les coordonnées de l'assureur et la couverture géographique sur leurs devis et factures. Les reprendre sur le site est une bonne pratique.

- **Nature** : recommandation (La loi vise les devis et factures, pas le site : l'absence de ces mentions sur le site n'est pas un manquement.)
- **Gravité** : mineure · **Vérification** : declaratif · **Document** : mentions-legales
- **S'applique à** : secteurs = btp-artisan
- **Sources** : [Loi n° 96-603 du 5 juillet 1996, art. 22-2](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000193678) ; [Code des assurances, art. L243-2](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006073984)

### Livres : prix unique et frais de port minimum

Prix de vente fixé par l'éditeur (remise de 5 % au plus) ; pour la vente en ligne de livres neufs livrés, frais de livraison minimum de 3 € TTC en dessous de 35 € d'achat.

- **Nature** : obligation légale
- **Gravité** : majeure · **Vérification** : declaratif · **Document** : cgv
- **S'applique à** : secteurs = livre ; venteEnLigne = true
- **Sources** : [Loi n° 81-766 « Lang », art. 1](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000517179)

### Jeux d'argent : agrément et mise en garde

Seuls les opérateurs agréés par l'ANJ peuvent proposer des jeux d'argent en ligne ; les communications portent un message de mise en garde et l'interdiction aux mineurs.

- **Nature** : obligation légale
- **Gravité** : critique · **Vérification** : declaratif · **Document** : interface
- **S'applique à** : secteurs = jeux-argent
- **Sources** : [Loi n° 2010-476 du 12 mai 2010](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000022204510)

### Formation professionnelle : déclaration d'activité

Quand un organisme de formation fait état de sa déclaration d'activité, c'est uniquement sous la forme : « Enregistrée sous le numéro … Cet enregistrement ne vaut pas agrément de l'État. » La certification Qualiopi, si elle est obtenue, peut être indiquée.

- **Nature** : obligation légale
- **Gravité** : mineure · **Vérification** : declaratif · **Document** : mentions-legales
- **S'applique à** : secteurs = formation
- **Sources** : [Code du travail, art. L6352-12](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006904409) ; [Code du travail, art. L6351-1 et R6351-1 et s.](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006072050)

### Photographies commerciales retouchées

Les photographies à usage commercial de mannequins dont la silhouette a été modifiée portent la mention « photographie retouchée ».

- **Nature** : obligation légale
- **Gravité** : mineure · **Vérification** : declaratif · **Document** : interface
- **S'applique à** : publicite = true ; venteEnLigne = true
- **Sanction** : 37 500 € d'amende, portée jusqu'à 30 % des dépenses consacrées à la publicité (CSP art. L2133-2).
- **Sources** : [Code de la santé publique, art. L2133-2](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032411563)
