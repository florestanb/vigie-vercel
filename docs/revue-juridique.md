# Revue juridique du registre Vigie

Registre du 2026-10-14, document généré le 2026-10-13 (npm run revue). Pour chaque règle : son champ d'application, le texte officiel des articles cités quand il a pu être récupéré, les doutes relevés et une case de validation.

**Effet de la validation.** Tant qu'une règle n'est pas validée, un manquement n'est jamais présenté comme « Illégal » (il apparaît en zone de flou) et n'est jamais cité dans un mail de prospection. La validation porte sur la version de la règle identifiée par son empreinte : toute modification ultérieure demande une nouvelle validation. Les validations sont saisies dans `src/lib/rules/validations.ts`.

| Règles | Validées | Avec doutes relevés | Sans revue |
|---|---|---|---|
| 93 | 0 | 46 | 0 |

## Identification de l'éditeur

### Page « Mentions légales » accessible

`id.page-mentions` · empreinte `beb9823094cd8f2f` · Loi (peut produire « Illégal » une fois validée) · gravité critique

**Exigence affichée aux clients.** Les informations d'identification de l'éditeur et de l'hébergeur doivent être « facilement, directement et en permanence » accessibles, en pratique via un lien présent sur toutes les pages (pied de page).

**Sanction affichée.** 1 an d'emprisonnement et 75 000 € d'amende (375 000 € pour une personne morale), LCEN art. 1-2.

**Conditions appliquées par le logiciel.** tous les sites

**S'applique si :**
- Toute personne dont l'activité est d'éditer un service de communication au public en ligne : tout site, quel que soit son objet.

**Doutes à trancher :**
- La loi exige que les informations soient « facilement, directement et en permanence » accessibles, pas une page intitulée « Mentions légales » : le constat porte sur l'accessibilité de l'information.

**LCEN (loi n° 2004-575), art. 1-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**LCEN (loi n° 2004-575), art. 1-2** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** LCEN (loi n° 2004-575), modifiée par la loi SREN n° 2024-449, art. 1-1 (ex-art. 6-III)

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Identité complète de l'éditeur

`id.identite-editeur` · empreinte `b3f2c8040f1e9181` · Loi (peut produire « Illégal » une fois validée) · gravité critique

**Exigence affichée aux clients.** Personne morale : dénomination ou raison sociale, forme juridique, adresse du siège, montant du capital social. Personne physique : nom, prénoms, domicile (un particulier non professionnel peut ne communiquer que les coordonnées de son hébergeur). Entrepreneur individuel : une dénomination qui incorpore son nom, précédée ou suivie des mots « entrepreneur individuel » ou des initiales « EI ».

**Sanction affichée.** LCEN art. 1-2 ; amende de 4e classe pour l'absence des mentions du Code de commerce.

**Conditions appliquées par le logiciel.** éditeur : Société ou Entrepreneur individuel ou Association ou Organisme public

**S'applique si :**
- L'éditeur est une entreprise, une association ou un organisme public.
- Personne morale : dénomination, forme, siège, capital (le capital n'est exigé que des sociétés commerciales).

**Ne s'applique pas si :**
- Particulier qui publie un site à titre non professionnel (il peut ne donner que les coordonnées de son hébergeur).

**Doutes à trancher :**
- Vérifier dans l'article 1-1 consolidé (après la loi SREN) que la liste des mentions est inchangée ; une source secondaire signale un ajout relatif aux prestataires de stockage.

**LCEN (loi n° 2004-575), art. 1-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de commerce, art. R123-237** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** LCEN, art. 1-1, I et II ; Code de commerce, art. R123-237, 3° et 9° et avant-dernier alinéa

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Adresse e-mail et téléphone de contact

`id.contact` · empreinte `8aeb68770ef33f6b` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** L'éditeur indique une adresse de courrier électronique et un numéro de téléphone permettant de le contacter rapidement et de communiquer directement avec lui.

**Sanction affichée.** 1 an d'emprisonnement et 75 000 € d'amende (375 000 € pour une personne morale), LCEN art. 1-2.

**Conditions appliquées par le logiciel.** au moins un de : (éditeur : Société ou Entrepreneur individuel ou Association ou Organisme public) ; (Commande ou paiement en ligne)

**S'applique si :**
- L'éditeur est une entreprise, une association ou un organisme public.
- Le site permet de conclure un contrat à distance avec des consommateurs.

**Ne s'applique pas si :**
- Particulier qui publie un site à titre non professionnel (il peut ne donner que les coordonnées de son hébergeur).

**Doutes à trancher :**
- Le contrôle cherche e-mail et téléphone dans les pages légales et l'accueil : un numéro publié uniquement sur une page de contact non visitée peut échapper (constat marqué incertain).

**LCEN (loi n° 2004-575), art. 1-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**LCEN (loi n° 2004-575), art. 19** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. R111-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. L221-5** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** LCEN, art. 1-1 et art. 19 ; Code de la consommation, art. R111-1 et L221-5

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Numéro d'immatriculation (SIREN, RCS ou RNE)

`id.immatriculation` · empreinte `435c1f2d573fceb1` · Loi (peut produire « Illégal » une fois validée) · gravité critique

**Exigence affichée aux clients.** Pour une entreprise assujettie aux formalités d'inscription au RCS ou au registre national des entreprises : le numéro d'inscription (SIREN suivi de la mention RCS et de la ville du greffe pour une société commerciale).

**Sanction affichée.** 1 an d'emprisonnement et 75 000 € d'amende (375 000 € pour une personne morale), LCEN art. 1-2.

**Conditions appliquées par le logiciel.** éditeur : Société ou Entrepreneur individuel

**S'applique si :**
- Entreprise assujettie à l'immatriculation au RCS ou au registre national des entreprises.

**Ne s'applique pas si :**
- Associations non immatriculées, organismes publics, particuliers.

**LCEN (loi n° 2004-575), art. 1-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de commerce, art. R123-237** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** LCEN, art. 1-1 ; Code de commerce, art. R123-237, avant-dernier alinéa (mentions à faire figurer sur le site internet)

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Numéro de TVA intracommunautaire

`id.tva` · empreinte `5407ffae82815a51` · Loi (peut produire « Illégal » une fois validée) · gravité mineure

**Exigence affichée aux clients.** Si l'activité est assujettie à la TVA : le numéro individuel d'identification à la TVA.

**Nuance affichée.** Seulement si l'entreprise est assujettie à la TVA (pas en franchise en base).

**Conditions appliquées par le logiciel.** éditeur : Société ou Entrepreneur individuel ET au moins un de : (Commande ou paiement en ligne) ; (S'adresse à des professionnels) ; (Vend ou s'adresse à des particuliers)

**S'applique si :**
- Entreprise assujettie à la TVA et identifiée à la TVA.

**Ne s'applique pas si :**
- Entreprise en franchise en base de TVA (art. 293 B du CGI).

**Doutes à trancher :**
- Vigie ne sait pas si l'entreprise est en franchise : le point reste « à vérifier » en l'absence de numéro, jamais « illégal ».

**LCEN (loi n° 2004-575), art. 19** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code général des impôts, art. 286 ter** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** LCEN, art. 19 ; Code général des impôts, art. 286 ter

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Directeur de la publication

`id.directeur-publication` · empreinte `f9ddfe6a9e1ea6b2` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Le nom du directeur ou du codirecteur de la publication et, le cas échéant, celui du responsable de la rédaction.

**Nuance affichée.** Concerne tous les sites, pas seulement la presse. Pour une société ou une association, c'est de droit son représentant légal (président, gérant) : il suffit d'ajouter une ligne « Directeur de la publication : Prénom Nom ».

**Sanction affichée.** 1 an d'emprisonnement et 75 000 € d'amende (375 000 € pour une personne morale), LCEN art. 1-2.

**Conditions appliquées par le logiciel.** éditeur : Société ou Entrepreneur individuel ou Association ou Organisme public

**S'applique si :**
- Tout service de communication au public en ligne, pas seulement les sites de presse (loi de 1982, art. 93-2 : « Tout service de communication au public par voie électronique est tenu d'avoir un directeur de la publication »).
- Pour une personne morale, c'est de droit son représentant légal (Cass. crim., 22 janvier 2019).

**Ne s'applique pas si :**
- Particulier qui publie un site à titre non professionnel (il peut ne donner que les coordonnées de son hébergeur).

**Doutes à trancher :**
- Confirmer la référence de l'arrêt du 22 janvier 2019 (numéro de pourvoi) avant de le citer aux clients.

**LCEN (loi n° 2004-575), art. 1-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Loi n° 82-652 du 29 juillet 1982, art. 93-2** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** LCEN, art. 1-1, I, 3°

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Identité de l'hébergeur

`id.hebergeur` · empreinte `caefc34d640cfa8a` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Le nom, la dénomination ou la raison sociale, l'adresse et le numéro de téléphone de l'hébergeur du site.

**Sanction affichée.** 1 an d'emprisonnement et 75 000 € d'amende (375 000 € pour une personne morale), LCEN art. 1-2.

**Conditions appliquées par le logiciel.** tous les sites

**S'applique si :**
- Tout site, y compris celui d'un particulier non professionnel.

**Doutes à trancher :**
- Confirmer la liste exacte des informations sur l'hébergeur dans l'article 1-1 consolidé (nom, adresse, téléphone).

**LCEN (loi n° 2004-575), art. 1-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** LCEN, art. 1-1, I, 4°

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Mentions des professions réglementées

`id.profession-reglementee` · empreinte `7d02c5d00a9ce2a6` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Pour une profession réglementée : la référence aux règles professionnelles applicables, le titre professionnel, l'État membre où il a été octroyé, le nom de l'ordre ou de l'organisme professionnel d'inscription.

**Conditions appliquées par le logiciel.** secteur : Profession réglementée

**S'applique si :**
- Professions réglementées (avocats, médecins, architectes, experts-comptables…).

**Ne s'applique pas si :**
- Activités non réglementées.

**Doutes à trancher :**
- Le secteur est déclaré par le client ou déduit du site : à confirmer au cas par cas.

**LCEN (loi n° 2004-575), art. 19** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. R111-2** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** LCEN, art. 19 ; Code de la consommation, art. R111-2

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Autorisation d'exercer, si l'activité y est soumise

`id.autorisation-activite` · empreinte `a68d50b13719f479` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Si l'activité est soumise à autorisation (agrément, carte professionnelle, immatriculation ORIAS, Atout France…) : le nom et l'adresse de l'autorité qui l'a délivrée.

**Conditions appliquées par le logiciel.** secteur : Immobilier ou Crédit, assurance ou Voyages, tourisme ou Jeux d'argent ou Santé

**S'applique si :**
- Activité soumise à autorisation (carte professionnelle, ORIAS, Atout France, agrément ANJ…).

**Ne s'applique pas si :**
- Activité libre.

**LCEN (loi n° 2004-575), art. 19** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. R111-2** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** LCEN, art. 19 ; Code de la consommation, art. R111-2

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

## Données personnelles

### Politique de confidentialité accessible

`rgpd.politique` · empreinte `5553a9c6bd36f010` · Loi (peut produire « Illégal » une fois validée) · gravité critique

**Exigence affichée aux clients.** Dès qu'il collecte des données personnelles (formulaire, compte, commande, newsletter, mesure d'audience), le site fournit une information concise, transparente et aisément accessible sur les traitements, en pratique une page dédiée liée depuis toutes les pages et depuis chaque formulaire.

**Sanction affichée.** Jusqu'à 20 M€ ou 4 % du chiffre d'affaires mondial (RGPD art. 83) ; amendes CNIL en procédure simplifiée jusqu'à 20 000 €.

**Conditions appliquées par le logiciel.** au moins un de : (Collecte de données personnelles) ; (Cookies ou traceurs non essentiels)

**S'applique si :**
- Le site collecte des données personnelles (formulaire, compte, commande, newsletter) ou dépose des traceurs.
- Y compris en vente entre professionnels : les coordonnées de salariés sont des données personnelles.

**Ne s'applique pas si :**
- Site qui ne collecte aucune donnée personnelle et ne dépose aucun traceur.

**Doutes à trancher :**
- Le RGPD impose une information, pas une page intitulée « Politique de confidentialité » : une information complète placée ailleurs suffit.

**RGPD, art. 12** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_12)

> Article 12
> Transparence des informations et des communications et modalités de l'exercice des droits de la personne concernée
> 1.   Le responsable du traitement prend des mesures appropriées pour fournir toute information visée aux articles 13 et 14 ainsi que pour procéder à toute communication au titre des articles 15 à 22 et de l'article 34 en ce qui concerne le traitement à la personne concernée d'une façon concise, transparente, compréhensible et aisément accessible, en des termes clairs et simples, en particulier pour toute information destinée spécifiquement à un enfant. Les informations sont fournies par écrit ou par d'autres moyens y compris, lorsque c'est approprié, par voie électronique. Lorsque la personne concernée en fait la demande, les informations peuvent être fournies oralement, à condition que l'identité de la personne concernée soit démontrée par d'autres moyens.
> 2.   Le responsable du traitement facilite l'exercice des droits conférés à la personne concernée au titre des articles 15 à 22. Dans les cas visés à l'article 11, paragraphe 2, le responsable du traitement ne refuse pas de donner suite à la demande de la personne concernée d'exercer les droits que lui confèrent les articles 15 à 22, à moins que le responsable du traitement ne démontre qu'il n'est pas en mesure d'identifier la personne concernée.
> 3.   Le responsable du traitement fournit à la personne concernée des informations sur les mesures prises à la suite d'une demande formulée en application des articles 15 à 22, dans les meilleurs délais et en tout état de cause dans un délai d'un mois à compter de la réception de la demande. Au besoin, ce délai peut être prolongé de deux mois, compte tenu de la complexité et du nombre de demandes. Le responsable du traitement informe la personne concernée de cette prolongation et des motifs du report dans un délai d'un mois à compter de la réception de la demande. Lorsque la personne concernée présente sa demande sous une forme électronique, les informations sont fournies par voie électronique lorsque cela est possible, à moins que la personne concernée ne demande qu'il en soit autrement.
> 4.   Si le responsable du traitement ne donne pas suite à la demande formulée par la personne concernée, il informe celle-ci sans tarder et au plus tard dans un délai d'un mois à compter de la réception de la demande des motifs de son inaction et de la possibilité d'introduire une réclamation auprès d'une autorité de contrôle et de former un recours juridictionnel.
> 5.   Aucun paiement n'est exigé pour fournir les informations au titre des articles 13 et 14 et pour procéder à toute communication et prendre toute mesure au titre des articles 15 à 22 et de l'article 34. Lorsque les demandes d'une personne concernée sont manifestement infondées ou excessives, notamment en raison de leur caractère répétitif, le responsable du traitement peut:
> a) exiger le paiement de frais raisonnables qui tiennent compte des coûts administratifs supportés pour fou
> […]

**RGPD, art. 13** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_13)

> Article 13
> Informations à fournir lorsque des données à caractère personnel sont collectées auprès de la personne concernée
> 1.   Lorsque des données à caractère personnel relatives à une personne concernée sont collectées auprès de cette personne, le responsable du traitement lui fournit, au moment où les données en question sont obtenues, toutes les informations suivantes:
> a) l'identité et les coordonnées du responsable du traitement et, le cas échéant, du représentant du responsable du traitement
> b) le cas échéant, les coordonnées du délégué à la protection des données;
> c) les finalités du traitement auquel sont destinées les données à caractère personnel ainsi que la base juridique du traitement;
> d) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point f), les intérêts légitimes poursuivis par le responsable du traitement ou par un tiers;
> e) les destinataires ou les catégories de destinataires des données à caractère personnel, s'ils existent; et
> f) le cas échéant, le fait que le responsable du traitement a l'intention d'effectuer un transfert de données à caractère personnel vers un pays tiers ou à une organisation internationale, et l'existence ou l'absence d'une décision d'adéquation rendue par la Commission ou, dans le cas des transferts visés à l'article 46 ou 47, ou à l'article 49, paragraphe 1, deuxième alinéa, la référence aux garanties appropriées ou adaptées et les moyens d'en obtenir une copie ou l'endroit où elles ont été mises à disposition;
> 2.   En plus des informations visées au paragraphe 1, le responsable du traitement fournit à la personne concernée, au moment où les données à caractère personnel sont obtenues, les informations complémentaires suivantes qui sont nécessaires pour garantir un traitement équitable et transparent:
> a) la durée de conservation des données à caractère personnel ou, lorsque ce n'est pas possible, les critères utilisés pour déterminer cette durée;
> b) l'existence du droit de demander au responsable du traitement l'accès aux données à caractère personnel, la rectification ou l'effacement de celles-ci, ou une limitation du traitement relatif à la personne concernée, ou du droit de s'opposer au traitement et du droit à la portabilité des données;
> c) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point a), ou sur l'article 9, paragraphe 2, point a), l'existence du droit de retirer son consentement à tout moment, sans porter atteinte à la licéité du traitement fondé sur le consentement effectué avant le retrait de celui-ci;
> d) le droit d'introduire une réclamation auprès d'une autorité de contrôle;
> e) des informations sur la question de savoir si l'exigence de fourniture de données à caractère personnel a un caractère réglementaire ou contractuel ou si elle conditionne la conclusion d'un contrat et si la personne concernée est tenue de fournir les données à caractère personnel, ainsi que sur les conséquences éventuelles de la non-fourniture de ces données;
> f) l'existence d'une
> […]

**Loi Informatique et Libertés (n° 78-17), art. 48** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** RGPD, art. 12 et 13 ; Loi Informatique et Libertés, art. 48

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Identité et coordonnées du responsable de traitement

`rgpd.responsable` · empreinte `4e0bb1fde908c57d` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** La politique indique qui est responsable du traitement et comment le contacter (et, le cas échéant, son représentant dans l'UE).

**Sanction affichée.** Amende administrative jusqu'à 20 M€ ou 4 % du chiffre d'affaires mondial (RGPD art. 83.5).

**Conditions appliquées par le logiciel.** au moins un de : (Collecte de données personnelles) ; (Cookies ou traceurs non essentiels)

**S'applique si :**
- Le site collecte des données personnelles (formulaire, compte, commande, newsletter) ou dépose des traceurs.

**RGPD, art. 13** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_13)

> Article 13
> Informations à fournir lorsque des données à caractère personnel sont collectées auprès de la personne concernée
> 1.   Lorsque des données à caractère personnel relatives à une personne concernée sont collectées auprès de cette personne, le responsable du traitement lui fournit, au moment où les données en question sont obtenues, toutes les informations suivantes:
> a) l'identité et les coordonnées du responsable du traitement et, le cas échéant, du représentant du responsable du traitement
> b) le cas échéant, les coordonnées du délégué à la protection des données;
> c) les finalités du traitement auquel sont destinées les données à caractère personnel ainsi que la base juridique du traitement;
> d) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point f), les intérêts légitimes poursuivis par le responsable du traitement ou par un tiers;
> e) les destinataires ou les catégories de destinataires des données à caractère personnel, s'ils existent; et
> f) le cas échéant, le fait que le responsable du traitement a l'intention d'effectuer un transfert de données à caractère personnel vers un pays tiers ou à une organisation internationale, et l'existence ou l'absence d'une décision d'adéquation rendue par la Commission ou, dans le cas des transferts visés à l'article 46 ou 47, ou à l'article 49, paragraphe 1, deuxième alinéa, la référence aux garanties appropriées ou adaptées et les moyens d'en obtenir une copie ou l'endroit où elles ont été mises à disposition;
> 2.   En plus des informations visées au paragraphe 1, le responsable du traitement fournit à la personne concernée, au moment où les données à caractère personnel sont obtenues, les informations complémentaires suivantes qui sont nécessaires pour garantir un traitement équitable et transparent:
> a) la durée de conservation des données à caractère personnel ou, lorsque ce n'est pas possible, les critères utilisés pour déterminer cette durée;
> b) l'existence du droit de demander au responsable du traitement l'accès aux données à caractère personnel, la rectification ou l'effacement de celles-ci, ou une limitation du traitement relatif à la personne concernée, ou du droit de s'opposer au traitement et du droit à la portabilité des données;
> c) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point a), ou sur l'article 9, paragraphe 2, point a), l'existence du droit de retirer son consentement à tout moment, sans porter atteinte à la licéité du traitement fondé sur le consentement effectué avant le retrait de celui-ci;
> d) le droit d'introduire une réclamation auprès d'une autorité de contrôle;
> e) des informations sur la question de savoir si l'exigence de fourniture de données à caractère personnel a un caractère réglementaire ou contractuel ou si elle conditionne la conclusion d'un contrat et si la personne concernée est tenue de fournir les données à caractère personnel, ainsi que sur les conséquences éventuelles de la non-fourniture de ces données;
> f) l'existence d'une
> […]

**Sources affichées.** RGPD, art. 13.1.a

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Coordonnées du délégué à la protection des données

`rgpd.dpo` · empreinte `e0ed56d1fcdc32c1` · Zone de flou · gravité majeure

**Exigence affichée aux clients.** Si un DPO a été désigné (obligatoire pour les organismes publics et pour les suivis réguliers à grande échelle ou les données sensibles à grande échelle) : ses coordonnées.

**Nuance affichée.** Un délégué n'est obligatoire que dans certains cas (organisme public, suivi régulier à grande échelle, données sensibles à grande échelle) : cela s'apprécie selon l'activité.

**Conditions appliquées par le logiciel.** au moins un de : (éditeur : Organisme public) ; (Chiffre d'affaires ≥ 250 M€) ; (secteur : Santé)

**S'applique si :**
- Seulement si un délégué a été désigné ; désignation obligatoire pour les organismes publics et les suivis réguliers ou données sensibles à grande échelle.

**Ne s'applique pas si :**
- Organisme qui n'a pas désigné de délégué et n'y est pas tenu.

**Doutes à trancher :**
- Le profil (public, grande entreprise, santé) ne dit pas si un délégué existe : règle classée zone de flou, à garder ainsi.

**RGPD, art. 13** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_13)

> Article 13
> Informations à fournir lorsque des données à caractère personnel sont collectées auprès de la personne concernée
> 1.   Lorsque des données à caractère personnel relatives à une personne concernée sont collectées auprès de cette personne, le responsable du traitement lui fournit, au moment où les données en question sont obtenues, toutes les informations suivantes:
> a) l'identité et les coordonnées du responsable du traitement et, le cas échéant, du représentant du responsable du traitement
> b) le cas échéant, les coordonnées du délégué à la protection des données;
> c) les finalités du traitement auquel sont destinées les données à caractère personnel ainsi que la base juridique du traitement;
> d) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point f), les intérêts légitimes poursuivis par le responsable du traitement ou par un tiers;
> e) les destinataires ou les catégories de destinataires des données à caractère personnel, s'ils existent; et
> f) le cas échéant, le fait que le responsable du traitement a l'intention d'effectuer un transfert de données à caractère personnel vers un pays tiers ou à une organisation internationale, et l'existence ou l'absence d'une décision d'adéquation rendue par la Commission ou, dans le cas des transferts visés à l'article 46 ou 47, ou à l'article 49, paragraphe 1, deuxième alinéa, la référence aux garanties appropriées ou adaptées et les moyens d'en obtenir une copie ou l'endroit où elles ont été mises à disposition;
> 2.   En plus des informations visées au paragraphe 1, le responsable du traitement fournit à la personne concernée, au moment où les données à caractère personnel sont obtenues, les informations complémentaires suivantes qui sont nécessaires pour garantir un traitement équitable et transparent:
> a) la durée de conservation des données à caractère personnel ou, lorsque ce n'est pas possible, les critères utilisés pour déterminer cette durée;
> b) l'existence du droit de demander au responsable du traitement l'accès aux données à caractère personnel, la rectification ou l'effacement de celles-ci, ou une limitation du traitement relatif à la personne concernée, ou du droit de s'opposer au traitement et du droit à la portabilité des données;
> c) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point a), ou sur l'article 9, paragraphe 2, point a), l'existence du droit de retirer son consentement à tout moment, sans porter atteinte à la licéité du traitement fondé sur le consentement effectué avant le retrait de celui-ci;
> d) le droit d'introduire une réclamation auprès d'une autorité de contrôle;
> e) des informations sur la question de savoir si l'exigence de fourniture de données à caractère personnel a un caractère réglementaire ou contractuel ou si elle conditionne la conclusion d'un contrat et si la personne concernée est tenue de fournir les données à caractère personnel, ainsi que sur les conséquences éventuelles de la non-fourniture de ces données;
> f) l'existence d'une
> […]

**RGPD, art. 37** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_37)

> Article 37
> Désignation du délégué à la protection des données
> 1.   Le responsable du traitement et le sous-traitant désignent en tout état de cause un délégué à la protection des données lorsque:
> a) le traitement est effectué par une autorité publique ou un organisme public, à l'exception des juridictions agissant dans l'exercice de leur fonction juridictionnelle;
> b) les activités de base du responsable du traitement ou du sous-traitant consistent en des opérations de traitement qui, du fait de leur nature, de leur portée et/ou de leurs finalités, exigent un suivi régulier et systématique à grande échelle des personnes concernées; ou
> c) les activités de base du responsable du traitement ou du sous-traitant consistent en un traitement à grande échelle de catégories particulières de données visées à l'article 9 et de données à caractère personnel relatives à des condamnations pénales et à des infractions visées à l'article 10.
> 2.   Un groupe d'entreprises peut désigner un seul délégué à la protection des données à condition qu'un délégué à la protection des données soit facilement joignable à partir de chaque lieu d'établissement.
> 3.   Lorsque le responsable du traitement ou le sous-traitant est une autorité publique ou un organisme public, un seul délégué à la protection des données peut être désigné pour plusieurs autorités ou organismes de ce type, compte tenu de leur structure organisationnelle et de leur taille.
> 4.   Dans les cas autres que ceux visés au paragraphe 1, le responsable du traitement ou le sous-traitant ou les associations et autres organismes représentant des catégories de responsables du traitement ou de sous-traitants peuvent désigner ou, si le droit de l'Union ou le droit d'un État membre l'exige, sont tenus de désigner un délégué à la protection des données. Le délégué à la protection des données peut agir pour ces associations et autres organismes représentant des responsables du traitement ou des sous-traitants.
> 5.   Le délégué à la protection des données est désigné sur la base de ses qualités professionnelles et, en particulier, de ses connaissances spécialisées du droit et des pratiques en matière de protection des données, et de sa capacité à accomplir les missions visées à l'article 39.
> 6.   Le délégué à la protection des données peut être un membre du personnel du responsable du traitement ou du sous-traitant, ou exercer ses missions sur la base d'un contrat de service.
> 7.   Le responsable du traitement ou le sous-traitant publient les coordonnées du délégué à la protection des données et les communiquent à l'autorité de contrôle.

**Sources affichées.** RGPD, art. 13.1.b et 37

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Finalités et bases légales de chaque traitement

`rgpd.finalites-bases` · empreinte `04e85f4b0f574d9d` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Pour chaque traitement : à quoi servent les données et sur quelle base légale (contrat, consentement, obligation légale, intérêt légitime, en précisant lequel).

**Sanction affichée.** Amende administrative jusqu'à 20 M€ ou 4 % du chiffre d'affaires mondial (RGPD art. 83.5).

**Conditions appliquées par le logiciel.** au moins un de : (Collecte de données personnelles) ; (Cookies ou traceurs non essentiels)

**S'applique si :**
- Le site collecte des données personnelles (formulaire, compte, commande, newsletter) ou dépose des traceurs.

**RGPD, art. 6** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_6)

> Article 6
> Licéité du traitement
> 1.   Le traitement n'est licite que si, et dans la mesure où, au moins une des conditions suivantes est remplie:
> a) la personne concernée a consenti au traitement de ses données à caractère personnel pour une ou plusieurs finalités spécifiques;
> b) le traitement est nécessaire à l'exécution d'un contrat auquel la personne concernée est partie ou à l'exécution de mesures précontractuelles prises à la demande de celle-ci;
> c) le traitement est nécessaire au respect d'une obligation légale à laquelle le responsable du traitement est soumis;
> d) le traitement est nécessaire à la sauvegarde des intérêts vitaux de la personne concernée ou d'une autre personne physique;
> e) le traitement est nécessaire à l'exécution d'une mission d'intérêt public ou relevant de l'exercice de l'autorité publique dont est investi le responsable du traitement;
> f) le traitement est nécessaire aux fins des intérêts légitimes poursuivis par le responsable du traitement ou par un tiers, à moins que ne prévalent les intérêts ou les libertés et droits fondamentaux de la personne concernée qui exigent une protection des données à caractère personnel, notamment lorsque la personne concernée est un enfant.
> Le point f) du premier alinéa ne s'applique pas au traitement effectué par les autorités publiques dans l'exécution de leurs missions.
> 2.   Les États membres peuvent maintenir ou introduire des dispositions plus spécifiques pour adapter l'application des règles du présent règlement pour ce qui est du traitement dans le but de respecter le paragraphe 1, points c) et e), en déterminant plus précisément les exigences spécifiques applicables au traitement ainsi que d'autres mesures visant à garantir un traitement licite et loyal, y compris dans d'autres situations particulières de traitement comme le prévoit le chapitre IX.
> 3.   Le fondement du traitement visé au paragraphe 1, points c) et e), est défini par:
> a) le droit de l'Union; ou
> b) le droit de l'État membre auquel le responsable du traitement est soumis.
> Les finalités du traitement sont définies dans cette base juridique ou, en ce qui concerne le traitement visé au paragraphe 1, point e), sont nécessaires à l'exécution d'une mission d'intérêt public ou relevant de l'exercice de l'autorité publique dont est investi le responsable du traitement. Cette base juridique peut contenir des dispositions spécifiques pour adapter l'application des règles du présent règlement, entre autres: les conditions générales régissant la licéité du traitement par le responsable du traitement; les types de données qui font l'objet du traitement; les personnes concernées; les entités auxquelles les données à caractère personnel peuvent être communiquées et les finalités pour lesquelles elles peuvent l'être; la limitation des finalités; les durées de conservation; et les opérations et procédures de traitement, y compris les mesures visant à garantir un traitement licite et loyal, telles que celles prévues dans d'autres situ
> […]

**RGPD, art. 13** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_13)

> Article 13
> Informations à fournir lorsque des données à caractère personnel sont collectées auprès de la personne concernée
> 1.   Lorsque des données à caractère personnel relatives à une personne concernée sont collectées auprès de cette personne, le responsable du traitement lui fournit, au moment où les données en question sont obtenues, toutes les informations suivantes:
> a) l'identité et les coordonnées du responsable du traitement et, le cas échéant, du représentant du responsable du traitement
> b) le cas échéant, les coordonnées du délégué à la protection des données;
> c) les finalités du traitement auquel sont destinées les données à caractère personnel ainsi que la base juridique du traitement;
> d) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point f), les intérêts légitimes poursuivis par le responsable du traitement ou par un tiers;
> e) les destinataires ou les catégories de destinataires des données à caractère personnel, s'ils existent; et
> f) le cas échéant, le fait que le responsable du traitement a l'intention d'effectuer un transfert de données à caractère personnel vers un pays tiers ou à une organisation internationale, et l'existence ou l'absence d'une décision d'adéquation rendue par la Commission ou, dans le cas des transferts visés à l'article 46 ou 47, ou à l'article 49, paragraphe 1, deuxième alinéa, la référence aux garanties appropriées ou adaptées et les moyens d'en obtenir une copie ou l'endroit où elles ont été mises à disposition;
> 2.   En plus des informations visées au paragraphe 1, le responsable du traitement fournit à la personne concernée, au moment où les données à caractère personnel sont obtenues, les informations complémentaires suivantes qui sont nécessaires pour garantir un traitement équitable et transparent:
> a) la durée de conservation des données à caractère personnel ou, lorsque ce n'est pas possible, les critères utilisés pour déterminer cette durée;
> b) l'existence du droit de demander au responsable du traitement l'accès aux données à caractère personnel, la rectification ou l'effacement de celles-ci, ou une limitation du traitement relatif à la personne concernée, ou du droit de s'opposer au traitement et du droit à la portabilité des données;
> c) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point a), ou sur l'article 9, paragraphe 2, point a), l'existence du droit de retirer son consentement à tout moment, sans porter atteinte à la licéité du traitement fondé sur le consentement effectué avant le retrait de celui-ci;
> d) le droit d'introduire une réclamation auprès d'une autorité de contrôle;
> e) des informations sur la question de savoir si l'exigence de fourniture de données à caractère personnel a un caractère réglementaire ou contractuel ou si elle conditionne la conclusion d'un contrat et si la personne concernée est tenue de fournir les données à caractère personnel, ainsi que sur les conséquences éventuelles de la non-fourniture de ces données;
> f) l'existence d'une
> […]

**Sources affichées.** RGPD, art. 6 et 13.1.c-d

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Destinataires et sous-traitants

`rgpd.destinataires` · empreinte `b697ce68524797bc` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Les destinataires ou catégories de destinataires des données (prestataires techniques, outils d'analyse, paiement, envoi d'e-mails…).

**Sanction affichée.** Amende administrative jusqu'à 20 M€ ou 4 % du chiffre d'affaires mondial (RGPD art. 83.5).

**Conditions appliquées par le logiciel.** au moins un de : (Collecte de données personnelles) ; (Cookies ou traceurs non essentiels)

**S'applique si :**
- Le site collecte des données personnelles (formulaire, compte, commande, newsletter) ou dépose des traceurs.

**RGPD, art. 13** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_13)

> Article 13
> Informations à fournir lorsque des données à caractère personnel sont collectées auprès de la personne concernée
> 1.   Lorsque des données à caractère personnel relatives à une personne concernée sont collectées auprès de cette personne, le responsable du traitement lui fournit, au moment où les données en question sont obtenues, toutes les informations suivantes:
> a) l'identité et les coordonnées du responsable du traitement et, le cas échéant, du représentant du responsable du traitement
> b) le cas échéant, les coordonnées du délégué à la protection des données;
> c) les finalités du traitement auquel sont destinées les données à caractère personnel ainsi que la base juridique du traitement;
> d) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point f), les intérêts légitimes poursuivis par le responsable du traitement ou par un tiers;
> e) les destinataires ou les catégories de destinataires des données à caractère personnel, s'ils existent; et
> f) le cas échéant, le fait que le responsable du traitement a l'intention d'effectuer un transfert de données à caractère personnel vers un pays tiers ou à une organisation internationale, et l'existence ou l'absence d'une décision d'adéquation rendue par la Commission ou, dans le cas des transferts visés à l'article 46 ou 47, ou à l'article 49, paragraphe 1, deuxième alinéa, la référence aux garanties appropriées ou adaptées et les moyens d'en obtenir une copie ou l'endroit où elles ont été mises à disposition;
> 2.   En plus des informations visées au paragraphe 1, le responsable du traitement fournit à la personne concernée, au moment où les données à caractère personnel sont obtenues, les informations complémentaires suivantes qui sont nécessaires pour garantir un traitement équitable et transparent:
> a) la durée de conservation des données à caractère personnel ou, lorsque ce n'est pas possible, les critères utilisés pour déterminer cette durée;
> b) l'existence du droit de demander au responsable du traitement l'accès aux données à caractère personnel, la rectification ou l'effacement de celles-ci, ou une limitation du traitement relatif à la personne concernée, ou du droit de s'opposer au traitement et du droit à la portabilité des données;
> c) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point a), ou sur l'article 9, paragraphe 2, point a), l'existence du droit de retirer son consentement à tout moment, sans porter atteinte à la licéité du traitement fondé sur le consentement effectué avant le retrait de celui-ci;
> d) le droit d'introduire une réclamation auprès d'une autorité de contrôle;
> e) des informations sur la question de savoir si l'exigence de fourniture de données à caractère personnel a un caractère réglementaire ou contractuel ou si elle conditionne la conclusion d'un contrat et si la personne concernée est tenue de fournir les données à caractère personnel, ainsi que sur les conséquences éventuelles de la non-fourniture de ces données;
> f) l'existence d'une
> […]

**Sources affichées.** RGPD, art. 13.1.e

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Transferts hors Union européenne

`rgpd.transferts` · empreinte `36e7fd119bd4d3cc` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Si des données sont transférées hors de l'UE (outils américains notamment) : le pays, le mécanisme d'encadrement (décision d'adéquation dont le Data Privacy Framework, clauses contractuelles types…) et le moyen d'en obtenir une copie.

**Sanction affichée.** Amende administrative jusqu'à 20 M€ ou 4 % du chiffre d'affaires mondial (RGPD art. 83.5).

**Conditions appliquées par le logiciel.** au moins un de : (Collecte de données personnelles) ; (Cookies ou traceurs non essentiels)

**S'applique si :**
- Données transférées hors de l'Union (outil non européen, hébergement hors UE).

**Ne s'applique pas si :**
- Aucun destinataire hors de l'Union.

**Doutes à trancher :**
- Vigie déduit les transferts des services détectés : un service américain peut héberger les données dans l'UE. Le constat sur ce point devrait rester incertain.

**RGPD, art. 13** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_13)

> Article 13
> Informations à fournir lorsque des données à caractère personnel sont collectées auprès de la personne concernée
> 1.   Lorsque des données à caractère personnel relatives à une personne concernée sont collectées auprès de cette personne, le responsable du traitement lui fournit, au moment où les données en question sont obtenues, toutes les informations suivantes:
> a) l'identité et les coordonnées du responsable du traitement et, le cas échéant, du représentant du responsable du traitement
> b) le cas échéant, les coordonnées du délégué à la protection des données;
> c) les finalités du traitement auquel sont destinées les données à caractère personnel ainsi que la base juridique du traitement;
> d) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point f), les intérêts légitimes poursuivis par le responsable du traitement ou par un tiers;
> e) les destinataires ou les catégories de destinataires des données à caractère personnel, s'ils existent; et
> f) le cas échéant, le fait que le responsable du traitement a l'intention d'effectuer un transfert de données à caractère personnel vers un pays tiers ou à une organisation internationale, et l'existence ou l'absence d'une décision d'adéquation rendue par la Commission ou, dans le cas des transferts visés à l'article 46 ou 47, ou à l'article 49, paragraphe 1, deuxième alinéa, la référence aux garanties appropriées ou adaptées et les moyens d'en obtenir une copie ou l'endroit où elles ont été mises à disposition;
> 2.   En plus des informations visées au paragraphe 1, le responsable du traitement fournit à la personne concernée, au moment où les données à caractère personnel sont obtenues, les informations complémentaires suivantes qui sont nécessaires pour garantir un traitement équitable et transparent:
> a) la durée de conservation des données à caractère personnel ou, lorsque ce n'est pas possible, les critères utilisés pour déterminer cette durée;
> b) l'existence du droit de demander au responsable du traitement l'accès aux données à caractère personnel, la rectification ou l'effacement de celles-ci, ou une limitation du traitement relatif à la personne concernée, ou du droit de s'opposer au traitement et du droit à la portabilité des données;
> c) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point a), ou sur l'article 9, paragraphe 2, point a), l'existence du droit de retirer son consentement à tout moment, sans porter atteinte à la licéité du traitement fondé sur le consentement effectué avant le retrait de celui-ci;
> d) le droit d'introduire une réclamation auprès d'une autorité de contrôle;
> e) des informations sur la question de savoir si l'exigence de fourniture de données à caractère personnel a un caractère réglementaire ou contractuel ou si elle conditionne la conclusion d'un contrat et si la personne concernée est tenue de fournir les données à caractère personnel, ainsi que sur les conséquences éventuelles de la non-fourniture de ces données;
> f) l'existence d'une
> […]

**RGPD, art. 44** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_44)

> Article 44
> Principe général applicable aux transferts
> Un transfert, vers un pays tiers ou à une organisation internationale, de données à caractère personnel qui font ou sont destinées à faire l'objet d'un traitement après ce transfert ne peut avoir lieu que si, sous réserve des autres dispositions du présent règlement, les conditions définies dans le présent chapitre sont respectées par le responsable du traitement et le sous-traitant, y compris pour les transferts ultérieurs de données à caractère personnel au départ du pays tiers ou de l'organisation internationale vers un autre pays tiers ou à une autre organisation internationale. Toutes les dispositions du présent chapitre sont appliquées de manière à ce que le niveau de protection des personnes physiques garanti par le présent règlement ne soit pas compromis.

**RGPD, art. 45** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_45)

> Article 45
> Transferts fondés sur une décision d'adéquation
> 1.   Un transfert de données à caractère personnel vers un pays tiers ou à une organisation internationale peut avoir lieu lorsque la Commission a constaté par voie de décision que le pays tiers, un territoire ou un ou plusieurs secteurs déterminés dans ce pays tiers, ou l'organisation internationale en question assure un niveau de protection adéquat. Un tel transfert ne nécessite pas d'autorisation spécifique.
> 2.   Lorsqu'elle évalue le caractère adéquat du niveau de protection, la Commission tient compte, en particulier, des éléments suivants:
> a) l'état de droit, le respect des droits de l'homme et des libertés fondamentales, la législation pertinente, tant générale que sectorielle, y compris en ce qui concerne la sécurité publique, la défense, la sécurité nationale et le droit pénal ainsi que l'accès des autorités publiques aux données à caractère personnel, de même que la mise en œuvre de ladite législation, les règles en matière de protection des données, les règles professionnelles et les mesures de sécurité, y compris les règles relatives au transfert ultérieur de données à caractère personnel vers un autre pays tiers ou à une autre organisation internationale qui sont respectées dans le pays tiers ou par l'organisation internationale en question, la jurisprudence, ainsi que les droits effectifs et opposables dont bénéficient les personnes concernées et les recours administratifs et judiciaires que peuvent effectivement introduire les personnes concernées dont les données à caractère personnel sont transférées;
> b) l'existence et le fonctionnement effectif d'une ou de plusieurs autorités de contrôle indépendantes dans le pays tiers, ou auxquelles une organisation internationale est soumise, chargées d'assurer le respect des règles en matière de protection des données et de les faire appliquer, y compris par des pouvoirs appropriés d'application desdites règles, d'assister et de conseiller les personnes concernées dans l'exercice de leurs droits et de coopérer avec les autorités de contrôle des États membres; et
> c) les engagements internationaux pris par le pays tiers ou l'organisation internationale en question, ou d'autres obligations découlant de conventions ou d'instruments juridiquement contraignants ainsi que de sa participation à des systèmes multilatéraux ou régionaux, en particulier en ce qui concerne la protection des données à caractère personnel.
> 3.   La Commission, après avoir évalué le caractère adéquat du niveau de protection, peut décider, par voie d'actes d'exécution, qu'un pays tiers, un territoire ou un ou plusieurs secteurs déterminés dans un pays tiers, ou une organisation internationale, assure un niveau de protection adéquat au sens du paragraphe 2 du présent article. L'acte d'exécution prévoit un mécanisme d'examen périodique, au moins tous les quatre ans, qui prend en compte toutes les évolutions pertinentes dans le pays tiers ou au sein de l'organisation int
> […]

**RGPD, art. 46** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_46)

> Article 46
> Transferts moyennant des garanties appropriées
> 1.   En l'absence de décision en vertu de l'article 45, paragraphe 3, le responsable du traitement ou le sous-traitant ne peut transférer des données à caractère personnel vers un pays tiers ou à une organisation internationale que s'il a prévu des garanties appropriées et à la condition que les personnes concernées disposent de droits opposables et de voies de droit effectives.
> 2.   Les garanties appropriées visées au paragraphe 1 peuvent être fournies, sans que cela ne nécessite une autorisation particulière d'une autorité de contrôle, par:
> a) un instrument juridiquement contraignant et exécutoire entre les autorités ou organismes publics;
> b) des règles d'entreprise contraignantes conformément à l'article 47;
> c) des clauses types de protection des données adoptées par la Commission en conformité avec la procédure d'examen visée à l'article 93, paragraphe 2;
> d) des clauses types de protection des données adoptées par une autorité de contrôle et approuvées par la Commission en conformité avec la procédure d'examen visée à l'article 93, paragraphe 2;
> e) un code de conduite approuvé conformément à l'article 40, assorti de l'engagement contraignant et exécutoire pris par le responsable du traitement ou le sous-traitant dans le pays tiers d'appliquer les garanties appropriées, y compris en ce qui concerne les droits des personnes concernées; ou
> f) un mécanisme de certification approuvé conformément à l'article 42, assorti de l'engagement contraignant et exécutoire pris par le responsable du traitement ou le sous-traitant dans le pays tiers d'appliquer les garanties appropriées, y compris en ce qui concerne les droits des personnes concernées.
> 3.   Sous réserve de l'autorisation de l'autorité de contrôle compétente, les garanties appropriées visées au paragraphe 1 peuvent aussi être fournies, notamment, par:
> a) des clauses contractuelles entre le responsable du traitement ou le sous-traitant et le responsable du traitement, le sous-traitant ou le destinataire des données à caractère personnel dans le pays tiers ou l'organisation internationale; ou
> b) des dispositions à intégrer dans des arrangements administratifs entre les autorités publiques ou les organismes publics qui prévoient des droits opposables et effectifs pour les personnes concernées.
> 4.   L'autorité de contrôle applique le mécanisme de contrôle de la cohérence visé à l'article 63 dans les cas visés au paragraphe 3 du présent article.
> 5.   Les autorisations accordées par un État membre ou une autorité de contrôle sur le fondement de l'article 26, paragraphe 2, de la directive 95/46/CE demeurent valables jusqu'à leur modification, leur remplacement ou leur abrogation, si nécessaire, par ladite autorité de contrôle. Les décisions adoptées par la Commission sur le fondement de l'article 26, paragraphe 4, de la directive 95/46/CE demeurent en vigueur jusqu'à leur modification, leur remplacement ou leur abrogation, si nécessaire, par un
> […]

**Sources affichées.** RGPD, art. 13.1.f et 44 à 49

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Durées de conservation

`rgpd.durees` · empreinte `fe947ef636438c07` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** La durée de conservation de chaque catégorie de données, ou les critères qui la déterminent.

**Sanction affichée.** Amende administrative jusqu'à 20 M€ ou 4 % du chiffre d'affaires mondial (RGPD art. 83.5).

**Conditions appliquées par le logiciel.** au moins un de : (Collecte de données personnelles) ; (Cookies ou traceurs non essentiels)

**S'applique si :**
- Le site collecte des données personnelles (formulaire, compte, commande, newsletter) ou dépose des traceurs.

**RGPD, art. 5** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_5)

> Article 5
> Principes relatifs au traitement des données à caractère personnel
> 1.   Les données à caractère personnel doivent être:
> a) traitées de manière licite, loyale et transparente au regard de la personne concernée (licéité, loyauté, transparence);
> b) collectées pour des finalités déterminées, explicites et légitimes, et ne pas être traitées ultérieurement d'une manière incompatible avec ces finalités; le traitement ultérieur à des fins archivistiques dans l'intérêt public, à des fins de recherche scientifique ou historique ou à des fins statistiques n'est pas considéré, conformément à l'article 89, paragraphe 1, comme incompatible avec les finalités initiales (limitation des finalités);
> c) adéquates, pertinentes et limitées à ce qui est nécessaire au regard des finalités pour lesquelles elles sont traitées (minimisation des données);
> d) exactes et, si nécessaire, tenues à jour; toutes les mesures raisonnables doivent être prises pour que les données à caractère personnel qui sont inexactes, eu égard aux finalités pour lesquelles elles sont traitées, soient effacées ou rectifiées sans tarder (exactitude);
> e) conservées sous une forme permettant l'identification des personnes concernées pendant une durée n'excédant pas celle nécessaire au regard des finalités pour lesquelles elles sont traitées; les données à caractère personnel peuvent être conservées pour des durées plus longues dans la mesure où elles seront traitées exclusivement à des fins archivistiques dans l'intérêt public, à des fins de recherche scientifique ou historique ou à des fins statistiques conformément à l'article 89, paragraphe 1, pour autant que soient mises en œuvre les mesures techniques et organisationnelles appropriées requises par le présent règlement afin de garantir les droits et libertés de la personne concernée (limitation de la conservation);
> f) traitées de façon à garantir une sécurité appropriée des données à caractère personnel, y compris la protection contre le traitement non autorisé ou illicite et contre la perte, la destruction ou les dégâts d'origine accidentelle, à l'aide de mesures techniques ou organisationnelles appropriées (intégrité et confidentialité);
> 2.   Le responsable du traitement est responsable du respect du paragraphe 1 et est en mesure de démontrer que celui-ci est respecté (responsabilité).

**RGPD, art. 13** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_13)

> Article 13
> Informations à fournir lorsque des données à caractère personnel sont collectées auprès de la personne concernée
> 1.   Lorsque des données à caractère personnel relatives à une personne concernée sont collectées auprès de cette personne, le responsable du traitement lui fournit, au moment où les données en question sont obtenues, toutes les informations suivantes:
> a) l'identité et les coordonnées du responsable du traitement et, le cas échéant, du représentant du responsable du traitement
> b) le cas échéant, les coordonnées du délégué à la protection des données;
> c) les finalités du traitement auquel sont destinées les données à caractère personnel ainsi que la base juridique du traitement;
> d) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point f), les intérêts légitimes poursuivis par le responsable du traitement ou par un tiers;
> e) les destinataires ou les catégories de destinataires des données à caractère personnel, s'ils existent; et
> f) le cas échéant, le fait que le responsable du traitement a l'intention d'effectuer un transfert de données à caractère personnel vers un pays tiers ou à une organisation internationale, et l'existence ou l'absence d'une décision d'adéquation rendue par la Commission ou, dans le cas des transferts visés à l'article 46 ou 47, ou à l'article 49, paragraphe 1, deuxième alinéa, la référence aux garanties appropriées ou adaptées et les moyens d'en obtenir une copie ou l'endroit où elles ont été mises à disposition;
> 2.   En plus des informations visées au paragraphe 1, le responsable du traitement fournit à la personne concernée, au moment où les données à caractère personnel sont obtenues, les informations complémentaires suivantes qui sont nécessaires pour garantir un traitement équitable et transparent:
> a) la durée de conservation des données à caractère personnel ou, lorsque ce n'est pas possible, les critères utilisés pour déterminer cette durée;
> b) l'existence du droit de demander au responsable du traitement l'accès aux données à caractère personnel, la rectification ou l'effacement de celles-ci, ou une limitation du traitement relatif à la personne concernée, ou du droit de s'opposer au traitement et du droit à la portabilité des données;
> c) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point a), ou sur l'article 9, paragraphe 2, point a), l'existence du droit de retirer son consentement à tout moment, sans porter atteinte à la licéité du traitement fondé sur le consentement effectué avant le retrait de celui-ci;
> d) le droit d'introduire une réclamation auprès d'une autorité de contrôle;
> e) des informations sur la question de savoir si l'exigence de fourniture de données à caractère personnel a un caractère réglementaire ou contractuel ou si elle conditionne la conclusion d'un contrat et si la personne concernée est tenue de fournir les données à caractère personnel, ainsi que sur les conséquences éventuelles de la non-fourniture de ces données;
> f) l'existence d'une
> […]

**Sources affichées.** RGPD, art. 5.1.e et 13.2.a

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Droits des personnes et modalités d'exercice

`rgpd.droits` · empreinte `6bbe375acc966040` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Droits d'accès, rectification, effacement, limitation, portabilité, opposition, retrait du consentement à tout moment, avec un moyen concret de les exercer.

**Sanction affichée.** Amende administrative jusqu'à 20 M€ ou 4 % du chiffre d'affaires mondial (RGPD art. 83.5).

**Conditions appliquées par le logiciel.** au moins un de : (Collecte de données personnelles) ; (Cookies ou traceurs non essentiels)

**S'applique si :**
- Le site collecte des données personnelles (formulaire, compte, commande, newsletter) ou dépose des traceurs.

**RGPD, art. 13** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_13)

> Article 13
> Informations à fournir lorsque des données à caractère personnel sont collectées auprès de la personne concernée
> 1.   Lorsque des données à caractère personnel relatives à une personne concernée sont collectées auprès de cette personne, le responsable du traitement lui fournit, au moment où les données en question sont obtenues, toutes les informations suivantes:
> a) l'identité et les coordonnées du responsable du traitement et, le cas échéant, du représentant du responsable du traitement
> b) le cas échéant, les coordonnées du délégué à la protection des données;
> c) les finalités du traitement auquel sont destinées les données à caractère personnel ainsi que la base juridique du traitement;
> d) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point f), les intérêts légitimes poursuivis par le responsable du traitement ou par un tiers;
> e) les destinataires ou les catégories de destinataires des données à caractère personnel, s'ils existent; et
> f) le cas échéant, le fait que le responsable du traitement a l'intention d'effectuer un transfert de données à caractère personnel vers un pays tiers ou à une organisation internationale, et l'existence ou l'absence d'une décision d'adéquation rendue par la Commission ou, dans le cas des transferts visés à l'article 46 ou 47, ou à l'article 49, paragraphe 1, deuxième alinéa, la référence aux garanties appropriées ou adaptées et les moyens d'en obtenir une copie ou l'endroit où elles ont été mises à disposition;
> 2.   En plus des informations visées au paragraphe 1, le responsable du traitement fournit à la personne concernée, au moment où les données à caractère personnel sont obtenues, les informations complémentaires suivantes qui sont nécessaires pour garantir un traitement équitable et transparent:
> a) la durée de conservation des données à caractère personnel ou, lorsque ce n'est pas possible, les critères utilisés pour déterminer cette durée;
> b) l'existence du droit de demander au responsable du traitement l'accès aux données à caractère personnel, la rectification ou l'effacement de celles-ci, ou une limitation du traitement relatif à la personne concernée, ou du droit de s'opposer au traitement et du droit à la portabilité des données;
> c) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point a), ou sur l'article 9, paragraphe 2, point a), l'existence du droit de retirer son consentement à tout moment, sans porter atteinte à la licéité du traitement fondé sur le consentement effectué avant le retrait de celui-ci;
> d) le droit d'introduire une réclamation auprès d'une autorité de contrôle;
> e) des informations sur la question de savoir si l'exigence de fourniture de données à caractère personnel a un caractère réglementaire ou contractuel ou si elle conditionne la conclusion d'un contrat et si la personne concernée est tenue de fournir les données à caractère personnel, ainsi que sur les conséquences éventuelles de la non-fourniture de ces données;
> f) l'existence d'une
> […]

**RGPD, art. 15** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_15)

> Article 15
> Droit d'accès de la personne concernée
> 1.   La personne concernée a le droit d'obtenir du responsable du traitement la confirmation que des données à caractère personnel la concernant sont ou ne sont pas traitées et, lorsqu'elles le sont, l'accès auxdites données à caractère personnel ainsi que les informations suivantes:
> a) les finalités du traitement;
> b) les catégories de données à caractère personnel concernées;
> c) les destinataires ou catégories de destinataires auxquels les données à caractère personnel ont été ou seront communiquées, en particulier les destinataires qui sont établis dans des pays tiers ou les organisations internationales;
> d) lorsque cela est possible, la durée de conservation des données à caractère personnel envisagée ou, lorsque ce n'est pas possible, les critères utilisés pour déterminer cette durée;
> e) l'existence du droit de demander au responsable du traitement la rectification ou l'effacement de données à caractère personnel, ou une limitation du traitement des données à caractère personnel relatives à la personne concernée, ou du droit de s'opposer à ce traitement;
> f) le droit d'introduire une réclamation auprès d'une autorité de contrôle;
> g) lorsque les données à caractère personnel ne sont pas collectées auprès de la personne concernée, toute information disponible quant à leur source;
> h) l'existence d'une prise de décision automatisée, y compris un profilage, visée à l'article 22, paragraphes 1 et 4, et, au moins en pareils cas, des informations utiles concernant la logique sous-jacente, ainsi que l'importance et les conséquences prévues de ce traitement pour la personne concernée.
> 2.   Lorsque les données à caractère personnel sont transférées vers un pays tiers ou à une organisation internationale, la personne concernée a le droit d'être informée des garanties appropriées, en vertu de l'article 46, en ce qui concerne ce transfert.
> 3.   Le responsable du traitement fournit une copie des données à caractère personnel faisant l'objet d'un traitement. Le responsable du traitement peut exiger le paiement de frais raisonnables basés sur les coûts administratifs pour toute copie supplémentaire demandée par la personne concernée. Lorsque la personne concernée présente sa demande par voie électronique, les informations sont fournies sous une forme électronique d'usage courant, à moins que la personne concernée ne demande qu'il en soit autrement.
> 4.   Le droit d'obtenir une copie visé au paragraphe 3 ne porte pas atteinte aux droits et libertés d'autrui.
> Section 3
> Rectification et effacement

**RGPD, art. 21** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_21)

> Article 21
> Droit d'opposition
> 1.   La personne concernée a le droit de s'opposer à tout moment, pour des raisons tenant à sa situation particulière, à un traitement des données à caractère personnel la concernant fondé sur l'article 6, paragraphe 1, point e) ou f), y compris un profilage fondé sur ces dispositions. Le responsable du traitement ne traite plus les données à caractère personnel, à moins qu'il ne démontre qu'il existe des motifs légitimes et impérieux pour le traitement qui prévalent sur les intérêts et les droits et libertés de la personne concernée, ou pour la constatation, l'exercice ou la défense de droits en justice.
> 2.   Lorsque les données à caractère personnel sont traitées à des fins de prospection, la personne concernée a le droit de s'opposer à tout moment au traitement des données à caractère personnel la concernant à de telles fins de prospection, y compris au profilage dans la mesure où il est lié à une telle prospection.
> 3.   Lorsque la personne concernée s'oppose au traitement à des fins de prospection, les données à caractère personnel ne sont plus traitées à ces fins.
> 4.   Au plus tard au moment de la première communication avec la personne concernée, le droit visé aux paragraphes 1 et 2 est explicitement porté à l'attention de la personne concernée et est présenté clairement et séparément de toute autre information.
> 5.   Dans le cadre de l'utilisation de services de la société de l'information, et nonobstant la directive 2002/58/CE, la personne concernée peut exercer son droit d'opposition à l'aide de procédés automatisés utilisant des spécifications techniques.
> 6.   Lorsque des données à caractère personnel sont traitées à des fins de recherche scientifique ou historique ou à des fins statistiques en application de l'article 89, paragraphe 1, la personne concernée a le droit de s'opposer, pour des raisons tenant à sa situation particulière, au traitement de données à caractère personnel la concernant, à moins que le traitement ne soit nécessaire à l'exécution d'une mission d'intérêt public.

**Sources affichées.** RGPD, art. 13.2.b-c et 15 à 22

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Directives relatives au sort des données après le décès

`rgpd.directives-post-mortem` · empreinte `7ca7fe0b47721e7e` · Loi (peut produire « Illégal » une fois validée) · gravité mineure

**Exigence affichée aux clients.** Spécificité française : le droit de définir des directives sur la conservation, l'effacement et la communication des données après le décès.

**Conditions appliquées par le logiciel.** au moins un de : (Collecte de données personnelles) ; (Cookies ou traceurs non essentiels)

**S'applique si :**
- Le site collecte des données personnelles (formulaire, compte, commande, newsletter) ou dépose des traceurs.

**Doutes à trancher :**
- L'article 85, II vise le « prestataire d'un service de communication au public en ligne » et l'oblige à informer l'utilisateur du sort de ses données à son décès : vérifier s'il concerne tout site qui collecte des données, ou seulement les services avec compte utilisateur.

**Loi Informatique et Libertés (n° 78-17), art. 85** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Loi Informatique et Libertés, art. 85

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Droit de réclamation auprès de la CNIL

`rgpd.reclamation-cnil` · empreinte `d07dcd9f685498d3` · Loi (peut produire « Illégal » une fois validée) · gravité mineure

**Exigence affichée aux clients.** Le droit d'introduire une réclamation auprès d'une autorité de contrôle, la CNIL en France.

**Sanction affichée.** Amende administrative jusqu'à 20 M€ ou 4 % du chiffre d'affaires mondial (RGPD art. 83.5).

**Conditions appliquées par le logiciel.** au moins un de : (Collecte de données personnelles) ; (Cookies ou traceurs non essentiels)

**S'applique si :**
- Le site collecte des données personnelles (formulaire, compte, commande, newsletter) ou dépose des traceurs.

**RGPD, art. 13** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_13)

> Article 13
> Informations à fournir lorsque des données à caractère personnel sont collectées auprès de la personne concernée
> 1.   Lorsque des données à caractère personnel relatives à une personne concernée sont collectées auprès de cette personne, le responsable du traitement lui fournit, au moment où les données en question sont obtenues, toutes les informations suivantes:
> a) l'identité et les coordonnées du responsable du traitement et, le cas échéant, du représentant du responsable du traitement
> b) le cas échéant, les coordonnées du délégué à la protection des données;
> c) les finalités du traitement auquel sont destinées les données à caractère personnel ainsi que la base juridique du traitement;
> d) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point f), les intérêts légitimes poursuivis par le responsable du traitement ou par un tiers;
> e) les destinataires ou les catégories de destinataires des données à caractère personnel, s'ils existent; et
> f) le cas échéant, le fait que le responsable du traitement a l'intention d'effectuer un transfert de données à caractère personnel vers un pays tiers ou à une organisation internationale, et l'existence ou l'absence d'une décision d'adéquation rendue par la Commission ou, dans le cas des transferts visés à l'article 46 ou 47, ou à l'article 49, paragraphe 1, deuxième alinéa, la référence aux garanties appropriées ou adaptées et les moyens d'en obtenir une copie ou l'endroit où elles ont été mises à disposition;
> 2.   En plus des informations visées au paragraphe 1, le responsable du traitement fournit à la personne concernée, au moment où les données à caractère personnel sont obtenues, les informations complémentaires suivantes qui sont nécessaires pour garantir un traitement équitable et transparent:
> a) la durée de conservation des données à caractère personnel ou, lorsque ce n'est pas possible, les critères utilisés pour déterminer cette durée;
> b) l'existence du droit de demander au responsable du traitement l'accès aux données à caractère personnel, la rectification ou l'effacement de celles-ci, ou une limitation du traitement relatif à la personne concernée, ou du droit de s'opposer au traitement et du droit à la portabilité des données;
> c) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point a), ou sur l'article 9, paragraphe 2, point a), l'existence du droit de retirer son consentement à tout moment, sans porter atteinte à la licéité du traitement fondé sur le consentement effectué avant le retrait de celui-ci;
> d) le droit d'introduire une réclamation auprès d'une autorité de contrôle;
> e) des informations sur la question de savoir si l'exigence de fourniture de données à caractère personnel a un caractère réglementaire ou contractuel ou si elle conditionne la conclusion d'un contrat et si la personne concernée est tenue de fournir les données à caractère personnel, ainsi que sur les conséquences éventuelles de la non-fourniture de ces données;
> f) l'existence d'une
> […]

**RGPD, art. 77** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_77)

> Article 77
> Droit d'introduire une réclamation auprès d'une autorité de contrôle
> 1.   Sans préjudice de tout autre recours administratif ou juridictionnel, toute personne concernée a le droit d'introduire une réclamation auprès d'une autorité de contrôle, en particulier dans l'État membre dans lequel se trouve sa résidence habituelle, son lieu de travail ou le lieu où la violation aurait été commise, si elle considère que le traitement de données à caractère personnel la concernant constitue une violation du présent règlement.
> 2.   L'autorité de contrôle auprès de laquelle la réclamation a été introduite informe l'auteur de la réclamation de l'état d'avancement et de l'issue de la réclamation, y compris de la possibilité d'un recours juridictionnel en vertu de l'article 78.

**Sources affichées.** RGPD, art. 13.2.d et 77

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Caractère obligatoire ou facultatif des données

`rgpd.caractere-obligatoire` · empreinte `ce765f07a744c905` · Loi (peut produire « Illégal » une fois validée) · gravité mineure

**Exigence affichée aux clients.** Si la fourniture des données conditionne un contrat ou est obligatoire : le préciser et indiquer les conséquences d'un refus (souvent via des astérisques sur le formulaire).

**Sanction affichée.** Amende administrative jusqu'à 20 M€ ou 4 % du chiffre d'affaires mondial (RGPD art. 83.5).

**Conditions appliquées par le logiciel.** Collecte de données personnelles

**S'applique si :**
- Formulaire dont certaines données conditionnent le contrat ou sont exigées.

**RGPD, art. 13** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_13)

> Article 13
> Informations à fournir lorsque des données à caractère personnel sont collectées auprès de la personne concernée
> 1.   Lorsque des données à caractère personnel relatives à une personne concernée sont collectées auprès de cette personne, le responsable du traitement lui fournit, au moment où les données en question sont obtenues, toutes les informations suivantes:
> a) l'identité et les coordonnées du responsable du traitement et, le cas échéant, du représentant du responsable du traitement
> b) le cas échéant, les coordonnées du délégué à la protection des données;
> c) les finalités du traitement auquel sont destinées les données à caractère personnel ainsi que la base juridique du traitement;
> d) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point f), les intérêts légitimes poursuivis par le responsable du traitement ou par un tiers;
> e) les destinataires ou les catégories de destinataires des données à caractère personnel, s'ils existent; et
> f) le cas échéant, le fait que le responsable du traitement a l'intention d'effectuer un transfert de données à caractère personnel vers un pays tiers ou à une organisation internationale, et l'existence ou l'absence d'une décision d'adéquation rendue par la Commission ou, dans le cas des transferts visés à l'article 46 ou 47, ou à l'article 49, paragraphe 1, deuxième alinéa, la référence aux garanties appropriées ou adaptées et les moyens d'en obtenir une copie ou l'endroit où elles ont été mises à disposition;
> 2.   En plus des informations visées au paragraphe 1, le responsable du traitement fournit à la personne concernée, au moment où les données à caractère personnel sont obtenues, les informations complémentaires suivantes qui sont nécessaires pour garantir un traitement équitable et transparent:
> a) la durée de conservation des données à caractère personnel ou, lorsque ce n'est pas possible, les critères utilisés pour déterminer cette durée;
> b) l'existence du droit de demander au responsable du traitement l'accès aux données à caractère personnel, la rectification ou l'effacement de celles-ci, ou une limitation du traitement relatif à la personne concernée, ou du droit de s'opposer au traitement et du droit à la portabilité des données;
> c) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point a), ou sur l'article 9, paragraphe 2, point a), l'existence du droit de retirer son consentement à tout moment, sans porter atteinte à la licéité du traitement fondé sur le consentement effectué avant le retrait de celui-ci;
> d) le droit d'introduire une réclamation auprès d'une autorité de contrôle;
> e) des informations sur la question de savoir si l'exigence de fourniture de données à caractère personnel a un caractère réglementaire ou contractuel ou si elle conditionne la conclusion d'un contrat et si la personne concernée est tenue de fournir les données à caractère personnel, ainsi que sur les conséquences éventuelles de la non-fourniture de ces données;
> f) l'existence d'une
> […]

**Sources affichées.** RGPD, art. 13.2.e

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Profilage et décisions automatisées

`rgpd.decision-automatisee` · empreinte `9227d7520d0e2ab9` · Zone de flou · gravité mineure

**Exigence affichée aux clients.** En cas de décision entièrement automatisée ou de profilage produisant des effets significatifs : son existence, la logique sous-jacente et ses conséquences.

**Nuance affichée.** Ne s'impose que si le site fait réellement du profilage ou prend des décisions automatisées, ce qui ne se voit pas toujours depuis l'extérieur.

**Conditions appliquées par le logiciel.** au moins un de : (Publicité, affiliation ou contenus sponsorisés) ; (Chatbot ou assistant IA) ; (secteur : Crédit, assurance)

**S'applique si :**
- Décision entièrement automatisée produisant des effets juridiques ou significatifs, ou profilage.

**Ne s'applique pas si :**
- Publicité ou recommandations sans effet significatif : l'article 22 ne vise que les décisions à effets significatifs.

**Doutes à trancher :**
- La condition « publicité ou chatbot » est large : la règle reste en zone de flou, ce qui est approprié.

**RGPD, art. 13** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_13)

> Article 13
> Informations à fournir lorsque des données à caractère personnel sont collectées auprès de la personne concernée
> 1.   Lorsque des données à caractère personnel relatives à une personne concernée sont collectées auprès de cette personne, le responsable du traitement lui fournit, au moment où les données en question sont obtenues, toutes les informations suivantes:
> a) l'identité et les coordonnées du responsable du traitement et, le cas échéant, du représentant du responsable du traitement
> b) le cas échéant, les coordonnées du délégué à la protection des données;
> c) les finalités du traitement auquel sont destinées les données à caractère personnel ainsi que la base juridique du traitement;
> d) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point f), les intérêts légitimes poursuivis par le responsable du traitement ou par un tiers;
> e) les destinataires ou les catégories de destinataires des données à caractère personnel, s'ils existent; et
> f) le cas échéant, le fait que le responsable du traitement a l'intention d'effectuer un transfert de données à caractère personnel vers un pays tiers ou à une organisation internationale, et l'existence ou l'absence d'une décision d'adéquation rendue par la Commission ou, dans le cas des transferts visés à l'article 46 ou 47, ou à l'article 49, paragraphe 1, deuxième alinéa, la référence aux garanties appropriées ou adaptées et les moyens d'en obtenir une copie ou l'endroit où elles ont été mises à disposition;
> 2.   En plus des informations visées au paragraphe 1, le responsable du traitement fournit à la personne concernée, au moment où les données à caractère personnel sont obtenues, les informations complémentaires suivantes qui sont nécessaires pour garantir un traitement équitable et transparent:
> a) la durée de conservation des données à caractère personnel ou, lorsque ce n'est pas possible, les critères utilisés pour déterminer cette durée;
> b) l'existence du droit de demander au responsable du traitement l'accès aux données à caractère personnel, la rectification ou l'effacement de celles-ci, ou une limitation du traitement relatif à la personne concernée, ou du droit de s'opposer au traitement et du droit à la portabilité des données;
> c) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point a), ou sur l'article 9, paragraphe 2, point a), l'existence du droit de retirer son consentement à tout moment, sans porter atteinte à la licéité du traitement fondé sur le consentement effectué avant le retrait de celui-ci;
> d) le droit d'introduire une réclamation auprès d'une autorité de contrôle;
> e) des informations sur la question de savoir si l'exigence de fourniture de données à caractère personnel a un caractère réglementaire ou contractuel ou si elle conditionne la conclusion d'un contrat et si la personne concernée est tenue de fournir les données à caractère personnel, ainsi que sur les conséquences éventuelles de la non-fourniture de ces données;
> f) l'existence d'une
> […]

**RGPD, art. 22** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_22)

> Article 22
> Décision individuelle automatisée, y compris le profilage
> 1.   La personne concernée a le droit de ne pas faire l'objet d'une décision fondée exclusivement sur un traitement automatisé, y compris le profilage, produisant des effets juridiques la concernant ou l'affectant de manière significative de façon similaire.
> 2.   Le paragraphe 1 ne s'applique pas lorsque la décision:
> a) est nécessaire à la conclusion ou à l'exécution d'un contrat entre la personne concernée et un responsable du traitement;
> b) est autorisée par le droit de l'Union ou le droit de l'État membre auquel le responsable du traitement est soumis et qui prévoit également des mesures appropriées pour la sauvegarde des droits et libertés et des intérêts légitimes de la personne concernée; ou
> c) est fondée sur le consentement explicite de la personne concernée.
> 3.   Dans les cas visés au paragraphe 2, points a) et c), le responsable du traitement met en œuvre des mesures appropriées pour la sauvegarde des droits et libertés et des intérêts légitimes de la personne concernée, au moins du droit de la personne concernée d'obtenir une intervention humaine de la part du responsable du traitement, d'exprimer son point de vue et de contester la décision.
> 4.   Les décisions visées au paragraphe 2 ne peuvent être fondées sur les catégories particulières de données à caractère personnel visées à l'article 9, paragraphe 1, à moins que l'article 9, paragraphe 2, point a) ou g), ne s'applique et que des mesures appropriées pour la sauvegarde des droits et libertés et des intérêts légitimes de la personne concernée ne soient en place.
> Section 5
> Limitations

**Sources affichées.** RGPD, art. 13.2.f et 22

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Information au point de collecte (formulaires)

`rgpd.formulaires` · empreinte `6f22bb1beb02ffdf` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Chaque formulaire porte une mention d'information courte (responsable, finalité, droits) avec un lien vers la politique de confidentialité, et distingue les champs obligatoires.

**Nuance affichée.** Un lien vers la politique de confidentialité à côté du formulaire suffit ; ce qui est interdit, c'est de collecter sans aucune information.

**Sanction affichée.** Amende administrative jusqu'à 20 M€ ou 4 % du chiffre d'affaires mondial (RGPD art. 83.5).

**Conditions appliquées par le logiciel.** Collecte de données personnelles

**S'applique si :**
- Chaque formulaire qui collecte des données personnelles.

**Doutes à trancher :**
- L'information « au moment de la collecte » peut être donnée par un lien vers la politique : le contrôle accepte un lien à proximité.

**RGPD, art. 12** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_12)

> Article 12
> Transparence des informations et des communications et modalités de l'exercice des droits de la personne concernée
> 1.   Le responsable du traitement prend des mesures appropriées pour fournir toute information visée aux articles 13 et 14 ainsi que pour procéder à toute communication au titre des articles 15 à 22 et de l'article 34 en ce qui concerne le traitement à la personne concernée d'une façon concise, transparente, compréhensible et aisément accessible, en des termes clairs et simples, en particulier pour toute information destinée spécifiquement à un enfant. Les informations sont fournies par écrit ou par d'autres moyens y compris, lorsque c'est approprié, par voie électronique. Lorsque la personne concernée en fait la demande, les informations peuvent être fournies oralement, à condition que l'identité de la personne concernée soit démontrée par d'autres moyens.
> 2.   Le responsable du traitement facilite l'exercice des droits conférés à la personne concernée au titre des articles 15 à 22. Dans les cas visés à l'article 11, paragraphe 2, le responsable du traitement ne refuse pas de donner suite à la demande de la personne concernée d'exercer les droits que lui confèrent les articles 15 à 22, à moins que le responsable du traitement ne démontre qu'il n'est pas en mesure d'identifier la personne concernée.
> 3.   Le responsable du traitement fournit à la personne concernée des informations sur les mesures prises à la suite d'une demande formulée en application des articles 15 à 22, dans les meilleurs délais et en tout état de cause dans un délai d'un mois à compter de la réception de la demande. Au besoin, ce délai peut être prolongé de deux mois, compte tenu de la complexité et du nombre de demandes. Le responsable du traitement informe la personne concernée de cette prolongation et des motifs du report dans un délai d'un mois à compter de la réception de la demande. Lorsque la personne concernée présente sa demande sous une forme électronique, les informations sont fournies par voie électronique lorsque cela est possible, à moins que la personne concernée ne demande qu'il en soit autrement.
> 4.   Si le responsable du traitement ne donne pas suite à la demande formulée par la personne concernée, il informe celle-ci sans tarder et au plus tard dans un délai d'un mois à compter de la réception de la demande des motifs de son inaction et de la possibilité d'introduire une réclamation auprès d'une autorité de contrôle et de former un recours juridictionnel.
> 5.   Aucun paiement n'est exigé pour fournir les informations au titre des articles 13 et 14 et pour procéder à toute communication et prendre toute mesure au titre des articles 15 à 22 et de l'article 34. Lorsque les demandes d'une personne concernée sont manifestement infondées ou excessives, notamment en raison de leur caractère répétitif, le responsable du traitement peut:
> a) exiger le paiement de frais raisonnables qui tiennent compte des coûts administratifs supportés pour fou
> […]

**RGPD, art. 13** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_13)

> Article 13
> Informations à fournir lorsque des données à caractère personnel sont collectées auprès de la personne concernée
> 1.   Lorsque des données à caractère personnel relatives à une personne concernée sont collectées auprès de cette personne, le responsable du traitement lui fournit, au moment où les données en question sont obtenues, toutes les informations suivantes:
> a) l'identité et les coordonnées du responsable du traitement et, le cas échéant, du représentant du responsable du traitement
> b) le cas échéant, les coordonnées du délégué à la protection des données;
> c) les finalités du traitement auquel sont destinées les données à caractère personnel ainsi que la base juridique du traitement;
> d) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point f), les intérêts légitimes poursuivis par le responsable du traitement ou par un tiers;
> e) les destinataires ou les catégories de destinataires des données à caractère personnel, s'ils existent; et
> f) le cas échéant, le fait que le responsable du traitement a l'intention d'effectuer un transfert de données à caractère personnel vers un pays tiers ou à une organisation internationale, et l'existence ou l'absence d'une décision d'adéquation rendue par la Commission ou, dans le cas des transferts visés à l'article 46 ou 47, ou à l'article 49, paragraphe 1, deuxième alinéa, la référence aux garanties appropriées ou adaptées et les moyens d'en obtenir une copie ou l'endroit où elles ont été mises à disposition;
> 2.   En plus des informations visées au paragraphe 1, le responsable du traitement fournit à la personne concernée, au moment où les données à caractère personnel sont obtenues, les informations complémentaires suivantes qui sont nécessaires pour garantir un traitement équitable et transparent:
> a) la durée de conservation des données à caractère personnel ou, lorsque ce n'est pas possible, les critères utilisés pour déterminer cette durée;
> b) l'existence du droit de demander au responsable du traitement l'accès aux données à caractère personnel, la rectification ou l'effacement de celles-ci, ou une limitation du traitement relatif à la personne concernée, ou du droit de s'opposer au traitement et du droit à la portabilité des données;
> c) lorsque le traitement est fondé sur l'article 6, paragraphe 1, point a), ou sur l'article 9, paragraphe 2, point a), l'existence du droit de retirer son consentement à tout moment, sans porter atteinte à la licéité du traitement fondé sur le consentement effectué avant le retrait de celui-ci;
> d) le droit d'introduire une réclamation auprès d'une autorité de contrôle;
> e) des informations sur la question de savoir si l'exigence de fourniture de données à caractère personnel a un caractère réglementaire ou contractuel ou si elle conditionne la conclusion d'un contrat et si la personne concernée est tenue de fournir les données à caractère personnel, ainsi que sur les conséquences éventuelles de la non-fourniture de ces données;
> f) l'existence d'une
> […]

**Sources affichées.** RGPD, art. 12 et 13 ; CNIL, modèles de mentions d'information

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Consentement des mineurs de moins de 15 ans

`rgpd.mineurs` · empreinte `c3d0c45e550f5e8f` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Pour un service en ligne proposé directement à des mineurs et fondé sur le consentement : en dessous de 15 ans, consentement conjoint du mineur et du titulaire de l'autorité parentale, et information rédigée en termes clairs pour un enfant.

**Conditions appliquées par le logiciel.** Public pouvant être mineur ET Collecte de données personnelles

**S'applique si :**
- Service de la société de l'information proposé directement à des mineurs, fondé sur le consentement.

**Ne s'applique pas si :**
- Traitement fondé sur une autre base légale que le consentement (contrat, obligation légale…).

**RGPD, art. 8** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_8)

> Article 8
> Conditions applicables au consentement des enfants en ce qui concerne les services de la société de l'information
> 1.   Lorsque l'article 6, paragraphe 1, point a), s'applique, en ce qui concerne l'offre directe de services de la société de l'information aux enfants, le traitement des données à caractère personnel relatives à un enfant est licite lorsque l'enfant est âgé d'au moins 16 ans. Lorsque l'enfant est âgé de moins de 16 ans, ce traitement n'est licite que si, et dans la mesure où, le consentement est donné ou autorisé par le titulaire de la responsabilité parentale à l'égard de l'enfant.
> Les États membres peuvent prévoir par la loi un âge inférieur pour ces finalités pour autant que cet âge inférieur ne soit pas en-dessous de 13 ans.
> 2.   Le responsable du traitement s'efforce raisonnablement de vérifier, en pareil cas, que le consentement est donné ou autorisé par le titulaire de la responsabilité parentale à l'égard de l'enfant, compte tenu des moyens technologiques disponibles.
> 3.   Le paragraphe 1 ne porte pas atteinte au droit général des contrats des États membres, notamment aux règles concernant la validité, la formation ou les effets d'un contrat à l'égard d'un enfant.

**Loi Informatique et Libertés (n° 78-17), art. 45** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** RGPD, art. 8 et 12 ; Loi Informatique et Libertés, art. 45

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Représentant dans l'Union

`rgpd.representant-ue` · empreinte `5c9464d059aa57ca` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Un éditeur établi hors UE qui cible des personnes dans l'UE désigne par écrit un représentant dans l'Union et l'indique.

**Conditions appliquées par le logiciel.** Éditeur établi hors de l'UE ET Collecte de données personnelles

**S'applique si :**
- Responsable établi hors de l'Union qui cible des personnes dans l'Union.

**Ne s'applique pas si :**
- Traitement occasionnel, sans données sensibles à grande échelle et peu risqué (art. 27.2).

**RGPD, art. 3** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_3)

> Article 3
> Champ d'application territorial
> 1.   Le présent règlement s'applique au traitement des données à caractère personnel effectué dans le cadre des activités d'un établissement d'un responsable du traitement ou d'un sous-traitant sur le territoire de l'Union, que le traitement ait lieu ou non dans l'Union.
> 2.   Le présent règlement s'applique au traitement des données à caractère personnel relatives à des personnes concernées qui se trouvent sur le territoire de l'Union par un responsable du traitement ou un sous-traitant qui n'est pas établi dans l'Union, lorsque les activités de traitement sont liées:
> a) à l'offre de biens ou de services à ces personnes concernées dans l'Union, qu'un paiement soit exigé ou non desdites personnes; ou
> b) au suivi du comportement de ces personnes, dans la mesure où il s'agit d'un comportement qui a lieu au sein de l'Union.
> 3.   Le présent règlement s'applique au traitement de données à caractère personnel par un responsable du traitement qui n'est pas établi dans l'Union mais dans un lieu où le droit d'un État membre s'applique en vertu du droit international public.

**RGPD, art. 27** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_27)

> Article 27
> Représentants des responsables du traitement ou des sous-traitants qui ne sont pas établis dans l'Union
> 1.   Lorsque l'article 3, paragraphe 2, s'applique, le responsable du traitement ou le sous-traitant désigne par écrit un représentant dans l'Union.
> 2.   L'obligation prévue au paragraphe 1 du présent article ne s'applique pas:
> a) à un traitement qui est occasionnel, qui n'implique pas un traitement à grande échelle des catégories particulières de données visées à l'article 9, paragraphe 1, ou un traitement de données à caractère personnel relatives à des condamnations pénales et à des infractions visées à l'article 10, et qui n'est pas susceptible d'engendrer un risque pour les droits et libertés des personnes physiques, compte tenu de la nature, du contexte, de la portée et des finalités du traitement; ou
> b) à une autorité publique ou à un organisme public;
> 3.   Le représentant est établi dans un des États membres dans lesquels se trouvent les personnes physiques dont les données à caractère personnel font l'objet d'un traitement lié à l'offre de biens ou de services, ou dont le comportement fait l'objet d'un suivi.
> 4.   Le représentant est mandaté par le responsable du traitement ou le sous-traitant pour être la personne à qui, notamment, les autorités de contrôle et les personnes concernées doivent s'adresser, en plus ou à la place du responsable du traitement ou du sous-traitant, pour toutes les questions relatives au traitement, aux fins d'assurer le respect du présent règlement.
> 5.   La désignation d'un représentant par le responsable du traitement ou le sous-traitant est sans préjudice d'actions en justice qui pourraient être intentées contre le responsable du traitement ou le sous-traitant lui-même.

**Sources affichées.** RGPD, art. 3.2 et 27

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Registre des activités de traitement

`rgpd.registre` · empreinte `8f951a674be6cbf1` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Tenir un registre des traitements (non publié). L'exemption des moins de 250 salariés ne joue pas pour les traitements non occasionnels, comme la gestion des clients ou la prospection.

**Conditions appliquées par le logiciel.** Collecte de données personnelles

**S'applique si :**
- Le site collecte des données personnelles (formulaire, compte, commande, newsletter) ou dépose des traceurs.

**Ne s'applique pas si :**
- Moins de 250 salariés ET traitement seulement occasionnel, sans risque ni données sensibles (rare pour un site marchand).

**RGPD, art. 30** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_30)

> Article 30
> Registre des activités de traitement
> 1.   Chaque responsable du traitement et, le cas échéant, le représentant du responsable du traitement tiennent un registre des activités de traitement effectuées sous leur responsabilité. Ce registre comporte toutes les informations suivantes:
> a) le nom et les coordonnées du responsable du traitement et, le cas échéant, du responsable conjoint du traitement, du représentant du responsable du traitement et du délégué à la protection des données;
> b) les finalités du traitement;
> c) une description des catégories de personnes concernées et des catégories de données à caractère personnel;
> d) les catégories de destinataires auxquels les données à caractère personnel ont été ou seront communiquées, y compris les destinataires dans des pays tiers ou des organisations internationales;
> e) le cas échéant, les transferts de données à caractère personnel vers un pays tiers ou à une organisation internationale, y compris l'identification de ce pays tiers ou de cette organisation internationale et, dans le cas des transferts visés à l'article 49, paragraphe 1, deuxième alinéa, les documents attestant de l'existence de garanties appropriées;
> f) dans la mesure du possible, les délais prévus pour l'effacement des différentes catégories de données;
> g) dans la mesure du possible, une description générale des mesures de sécurité techniques et organisationnelles visées à l'article 32, paragraphe 1.
> 2.   Chaque sous-traitant et, le cas échéant, le représentant du sous-traitant tiennent un registre de toutes les catégories d'activités de traitement effectuées pour le compte du responsable du traitement, comprenant:
> a) le nom et les coordonnées du ou des sous-traitants et de chaque responsable du traitement pour le compte duquel le sous-traitant agit ainsi que, le cas échéant, les noms et les coordonnées du représentant du responsable du traitement ou du sous-traitant et celles du délégué à la protection des données;
> b) les catégories de traitements effectués pour le compte de chaque responsable du traitement;
> c) le cas échéant, les transferts de données à caractère personnel vers un pays tiers ou à une organisation internationale, y compris l'identification de ce pays tiers ou de cette organisation internationale et, dans le cas des transferts visés à l'article 49, paragraphe 1, deuxième alinéa, les documents attestant de l'existence de garanties appropriées;
> d) dans la mesure du possible, une description générale des mesures de sécurité techniques et organisationnelles visées à l'article 32, paragraphe 1.
> 3.   Les registres visés aux paragraphes 1 et 2 se présentent sous une forme écrite y compris la forme électronique.
> 4.   Le responsable du traitement ou le sous-traitant et, le cas échéant, leur représentant mettent le registre à la disposition de l'autorité de contrôle sur demande.
> 5.   Les obligations visées aux paragraphes 1 et 2 ne s'appliquent pas à une entreprise ou à une organisation comptant moins de 250 employ
> […]

**Sources affichées.** RGPD, art. 30

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Contrats avec les sous-traitants

`rgpd.sous-traitants` · empreinte `4cae1d3c7b5a9213` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Un contrat conforme à l'article 28 (DPA) avec chaque prestataire qui traite des données pour le compte de l'éditeur : hébergeur, outil d'e-mailing, CRM, analytics…

**Conditions appliquées par le logiciel.** Collecte de données personnelles

**S'applique si :**
- Tout prestataire qui traite des données pour le compte de l'éditeur.

**RGPD, art. 28** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_28)

> Article 28
> Sous-traitant
> 1.   Lorsqu'un traitement doit être effectué pour le compte d'un responsable du traitement, celui-ci fait uniquement appel à des sous-traitants qui présentent des garanties suffisantes quant à la mise en œuvre de mesures techniques et organisationnelles appropriées de manière à ce que le traitement réponde aux exigences du présent règlement et garantisse la protection des droits de la personne concernée.
> 2.   Le sous-traitant ne recrute pas un autre sous-traitant sans l'autorisation écrite préalable, spécifique ou générale, du responsable du traitement. Dans le cas d'une autorisation écrite générale, le sous-traitant informe le responsable du traitement de tout changement prévu concernant l'ajout ou le remplacement d'autres sous-traitants, donnant ainsi au responsable du traitement la possibilité d'émettre des objections à l'encontre de ces changements.
> 3.   Le traitement par un sous-traitant est régi par un contrat ou un autre acte juridique au titre du droit de l'Union ou du droit d'un État membre, qui lie le sous-traitant à l'égard du responsable du traitement, définit l'objet et la durée du traitement, la nature et la finalité du traitement, le type de données à caractère personnel et les catégories de personnes concernées, et les obligations et les droits du responsable du traitement. Ce contrat ou cet autre acte juridique prévoit, notamment, que le sous-traitant:
> a) ne traite les données à caractère personnel que sur instruction documentée du responsable du traitement, y compris en ce qui concerne les transferts de données à caractère personnel vers un pays tiers ou à une organisation internationale, à moins qu'il ne soit tenu d'y procéder en vertu du droit de l'Union ou du droit de l'État membre auquel le sous-traitant est soumis; dans ce cas, le sous-traitant informe le responsable du traitement de cette obligation juridique avant le traitement, sauf si le droit concerné interdit une telle information pour des motifs importants d'intérêt public;
> b) veille à ce que les personnes autorisées à traiter les données à caractère personnel s'engagent à respecter la confidentialité ou soient soumises à une obligation légale appropriée de confidentialité;
> c) prend toutes les mesures requises en vertu de l'article 32;
> d) respecte les conditions visées aux paragraphes 2 et 4 pour recruter un autre sous-traitant;
> e) tient compte de la nature du traitement, aide le responsable du traitement, par des mesures techniques et organisationnelles appropriées, dans toute la mesure du possible, à s'acquitter de son obligation de donner suite aux demandes dont les personnes concernées le saisissent en vue d'exercer leurs droits prévus au chapitre III;
> f) aide le responsable du traitement à garantir le respect des obligations prévues aux articles 32 à 36, compte tenu de la nature du traitement et des informations à la disposition du sous-traitant;
> g) selon le choix du responsable du traitement, supprime toutes les données à caractère pers
> […]

**Sources affichées.** RGPD, art. 28

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Procédure de violation de données

`rgpd.violations` · empreinte `f322f03b9c468a34` · Loi (peut produire « Illégal » une fois validée) · gravité mineure

**Exigence affichée aux clients.** Documenter les violations de données et notifier la CNIL sous 72 heures en cas de risque pour les personnes.

**Conditions appliquées par le logiciel.** Collecte de données personnelles

**S'applique si :**
- Le site collecte des données personnelles (formulaire, compte, commande, newsletter) ou dépose des traceurs.

**RGPD, art. 33** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_33)

> Article 33
> Notification à l'autorité de contrôle d'une violation de données à caractère personnel
> 1.   En cas de violation de données à caractère personnel, le responsable du traitement en notifie la violation en question à l'autorité de contrôle compétente conformément à l'article 55, dans les meilleurs délais et, si possible, 72 heures au plus tard après en avoir pris connaissance, à moins que la violation en question ne soit pas susceptible d'engendrer un risque pour les droits et libertés des personnes physiques. Lorsque la notification à l'autorité de contrôle n'a pas lieu dans les 72 heures, elle est accompagnée des motifs du retard.
> 2.   Le sous-traitant notifie au responsable du traitement toute violation de données à caractère personnel dans les meilleurs délais après en avoir pris connaissance.
> 3.   La notification visée au paragraphe 1 doit, à tout le moins:
> a) décrire la nature de la violation de données à caractère personnel y compris, si possible, les catégories et le nombre approximatif de personnes concernées par la violation et les catégories et le nombre approximatif d'enregistrements de données à caractère personnel concernés;
> b) communiquer le nom et les coordonnées du délégué à la protection des données ou d'un autre point de contact auprès duquel des informations supplémentaires peuvent être obtenues;
> c) décrire les conséquences probables de la violation de données à caractère personnel;
> d) décrire les mesures prises ou que le responsable du traitement propose de prendre pour remédier à la violation de données à caractère personnel, y compris, le cas échéant, les mesures pour en atténuer les éventuelles conséquences négatives.
> 4.   Si, et dans la mesure où, il n'est pas possible de fournir toutes les informations en même temps, les informations peuvent être communiquées de manière échelonnée sans autre retard indu.
> 5.   Le responsable du traitement documente toute violation de données à caractère personnel, en indiquant les faits concernant la violation des données à caractère personnel, ses effets et les mesures prises pour y remédier. La documentation ainsi constituée permet à l'autorité de contrôle de vérifier le respect du présent article.

**RGPD, art. 34** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_34)

> Article 34
> Communication à la personne concernée d'une violation de données à caractère personnel
> 1.   Lorsqu'une violation de données à caractère personnel est susceptible d'engendrer un risque élevé pour les droits et libertés d'une personne physique, le responsable du traitement communique la violation de données à caractère personnel à la personne concernée dans les meilleurs délais.
> 2.   La communication à la personne concernée visée au paragraphe 1 du présent article décrit, en des termes clairs et simples, la nature de la violation de données à caractère personnel et contient au moins les informations et mesures visées à l'article 33, paragraphe 3, points b), c) et d).
> 3.   La communication à la personne concernée visée au paragraphe 1 n'est pas nécessaire si l'une ou l'autre des conditions suivantes est remplie:
> a) le responsable du traitement a mis en œuvre les mesures de protection techniques et organisationnelles appropriées et ces mesures ont été appliquées aux données à caractère personnel affectées par ladite violation, en particulier les mesures qui rendent les données à caractère personnel incompréhensibles pour toute personne qui n'est pas autorisée à y avoir accès, telles que le chiffrement;
> b) le responsable du traitement a pris des mesures ultérieures qui garantissent que le risque élevé pour les droits et libertés des personnes concernées visé au paragraphe 1 n'est plus susceptible de se matérialiser;
> c) elle exigerait des efforts disproportionnés. Dans ce cas, il est plutôt procédé à une communication publique ou à une mesure similaire permettant aux personnes concernées d'être informées de manière tout aussi efficace.
> 4.   Si le responsable du traitement n'a pas déjà communiqué à la personne concernée la violation de données à caractère personnel la concernant, l'autorité de contrôle peut, après avoir examiné si cette violation de données à caractère personnel est susceptible d'engendrer un risque élevé, exiger du responsable du traitement qu'il procède à cette communication ou décider que l'une ou l'autre des conditions visées au paragraphe 3 est remplie.
> Section 3
> Analyse d'impact relative à la protection des donnés et consultation préalable

**Sources affichées.** RGPD, art. 33 et 34

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

## Sécurité

### Chiffrement HTTPS

`secu.https` · empreinte `ea24cc73d3d8acf4` · Zone de flou · gravité critique

**Exigence affichée aux clients.** Les pages, et a fortiori les formulaires et espaces de compte, sont servies en HTTPS. La CNIL considère le TLS comme une mesure de sécurité élémentaire.

**Nuance affichée.** Aucun texte n'impose HTTPS nommément : c'est la CNIL qui le tient pour la mesure de sécurité minimale exigée par l'article 32 du RGPD dès qu'un site collecte des données.

**Sanction affichée.** Amende administrative jusqu'à 10 M€ ou 2 % du chiffre d'affaires mondial (RGPD art. 83.4).

**Conditions appliquées par le logiciel.** tous les sites

**S'applique si :**
- Site qui collecte des données personnelles.

**Doutes à trancher :**
- Aucun texte ne nomme HTTPS : c'est la doctrine CNIL qui le tient pour minimal. Zone de flou, à garder ainsi.

**RGPD, art. 32** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_32)

> Article 32
> Sécurité du traitement
> 1.   Compte tenu de l'état des connaissances, des coûts de mise en œuvre et de la nature, de la portée, du contexte et des finalités du traitement ainsi que des risques, dont le degré de probabilité et de gravité varie, pour les droits et libertés des personnes physiques, le responsable du traitement et le sous-traitant mettent en œuvre les mesures techniques et organisationnelles appropriées afin de garantir un niveau de sécurité adapté au risque, y compris entre autres, selon les besoins:
> a) la pseudonymisation et le chiffrement des données à caractère personnel;
> b) des moyens permettant de garantir la confidentialité, l'intégrité, la disponibilité et la résilience constantes des systèmes et des services de traitement;
> c) des moyens permettant de rétablir la disponibilité des données à caractère personnel et l'accès à celles-ci dans des délais appropriés en cas d'incident physique ou technique;
> d) une procédure visant à tester, à analyser et à évaluer régulièrement l'efficacité des mesures techniques et organisationnelles pour assurer la sécurité du traitement.
> 2.   Lors de l'évaluation du niveau de sécurité approprié, il est tenu compte en particulier des risques que présente le traitement, résultant notamment de la destruction, de la perte, de l'altération, de la divulgation non autorisée de données à caractère personnel transmises, conservées ou traitées d'une autre manière, ou de l'accès non autorisé à de telles données, de manière accidentelle ou illicite.
> 3.   L'application d'un code de conduite approuvé comme le prévoit l'article 40 ou d'un mécanisme de certification approuvé comme le prévoit l'article 42 peut servir d'élément pour démontrer le respect des exigences prévues au paragraphe 1 du présent article.
> 4.   Le responsable du traitement et le sous-traitant prennent des mesures afin de garantir que toute personne physique agissant sous l'autorité du responsable du traitement ou sous celle du sous-traitant, qui a accès à des données à caractère personnel, ne les traite pas, excepté sur instruction du responsable du traitement, à moins d'y être obligée par le droit de l'Union ou le droit d'un État membre.

**Sources affichées.** RGPD, art. 32 ; CNIL, guide de la sécurité des données

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

## Cookies et traceurs

### Aucun traceur non essentiel avant consentement

`cookies.consentement-prealable` · empreinte `f0e08914230aa052` · Loi (peut produire « Illégal » une fois validée) · gravité critique

**Exigence affichée aux clients.** Les cookies et traceurs non strictement nécessaires (publicité, réseaux sociaux, la plupart des outils de mesure d'audience) ne sont déposés ni lus avant que l'internaute ait consenti.

**Sanction affichée.** Amende administrative de la CNIL jusqu'à 10 M€ ou 2 % du chiffre d'affaires mondial (loi Informatique et Libertés, art. 20) ; jusqu'à 20 000 € en procédure simplifiée.

**Conditions appliquées par le logiciel.** tous les sites

**S'applique si :**
- Tout site qui lit ou dépose des traceurs non strictement nécessaires.

**Ne s'applique pas si :**
- Traceurs strictement nécessaires au service demandé, ou mesure d'audience exemptée selon les conditions CNIL.

**Doutes à trancher :**
- La catégorie de chaque traceur vient d'une liste tenue par Vigie : un traceur mal classé fausse le constat. La liste mérite une relecture.

**Loi Informatique et Libertés (n° 78-17), art. 82** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Directive ePrivacy 2002/58/CE, art. 5** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:02002L0058-20091219)

> Article 5
> Confidentialité des communications
> 1.  Les États membres garantissent, par la législation nationale, la confidentialité des communications effectuées au moyen d'un réseau public de communications et de services de communications électroniques accessibles au public, ainsi que la confidentialité des données relatives au trafic y afférentes. En particulier, ils interdisent à toute autre personne que les utilisateurs d'écouter, d'intercepter, de stocker les communications et les données relatives au trafic y afférentes, ou de les soumettre à tout autre moyen d'interception ou de surveillance, sans le consentement des utilisateurs concernés sauf lorsque cette personne y est légalement autorisée, conformément à l'article 15, paragraphe 1. Le présent paragraphe n'empêche pas le stockage technique nécessaire à l'acheminement d'une communication, sans préjudice du principe de confidentialité.
> 2.  Le paragraphe 1 n'affecte pas l'enregistrement légalement autorisé de communications et des données relatives au trafic y afférentes, lorsqu'il est effectué dans le cadre des usages professionnels licites, afin de fournir la preuve d'une transaction commerciale ou de toute autre communication commerciale.
> ▼M2
> 3.  Les États membres garantissent que le stockage d'informations, ou l’obtention de l’accès à des informations déjà stockées, dans l’équipement terminal d’un abonné ou d’un utilisateur n’est permis qu’à condition que l’abonné ou l’utilisateur ait donné son accord, après avoir reçu, dans le respect de la directive 95/46/CE, une information claire et complète, entre autres sur les finalités du traitement. Cette disposition ne fait pas obstacle à un stockage ou à un accès techniques visant exclusivement à effectuer la transmission d’une communication par la voie d’un réseau de communications électroniques, ou strictement nécessaires au fournisseur pour la fourniture d’un service de la société de l’information expressément demandé par l’abonné ou l’utilisateur.
> ▼B

**Sources affichées.** Loi Informatique et Libertés, art. 82 ; Directive ePrivacy 2002/58/CE, art. 5.3 ; CNIL, lignes directrices du 17 septembre 2020

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Contenus tiers chargés avant consentement

`cookies.tiers-integres` · empreinte `ee0cefb94f172b87` · Zone de flou · gravité majeure

**Exigence affichée aux clients.** Les intégrations qui transmettent l'adresse IP à un tiers (vidéos YouTube, cartes Google, polices Google Fonts, boutons sociaux) sont soit hébergées localement, soit bloquées jusqu'au consentement.

**Nuance affichée.** Transmettre l'adresse IP à Google Fonts ou Google Maps sans consentement a été jugé illégal en Allemagne (tribunal de Munich, 2022) ; la CNIL ne l'a pas sanctionné à ce jour. Le risque est réel mais la question n'est pas tranchée en France.

**Conditions appliquées par le logiciel.** tous les sites

**S'applique si :**
- Vidéos, cartes, polices ou boutons de réseaux sociaux chargés depuis un tiers.

**Doutes à trancher :**
- Question non tranchée en France (décision allemande de 2022 sur Google Fonts). Zone de flou, à garder ainsi.

**Loi Informatique et Libertés (n° 78-17), art. 82** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**RGPD, art. 6** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_6)

> Article 6
> Licéité du traitement
> 1.   Le traitement n'est licite que si, et dans la mesure où, au moins une des conditions suivantes est remplie:
> a) la personne concernée a consenti au traitement de ses données à caractère personnel pour une ou plusieurs finalités spécifiques;
> b) le traitement est nécessaire à l'exécution d'un contrat auquel la personne concernée est partie ou à l'exécution de mesures précontractuelles prises à la demande de celle-ci;
> c) le traitement est nécessaire au respect d'une obligation légale à laquelle le responsable du traitement est soumis;
> d) le traitement est nécessaire à la sauvegarde des intérêts vitaux de la personne concernée ou d'une autre personne physique;
> e) le traitement est nécessaire à l'exécution d'une mission d'intérêt public ou relevant de l'exercice de l'autorité publique dont est investi le responsable du traitement;
> f) le traitement est nécessaire aux fins des intérêts légitimes poursuivis par le responsable du traitement ou par un tiers, à moins que ne prévalent les intérêts ou les libertés et droits fondamentaux de la personne concernée qui exigent une protection des données à caractère personnel, notamment lorsque la personne concernée est un enfant.
> Le point f) du premier alinéa ne s'applique pas au traitement effectué par les autorités publiques dans l'exécution de leurs missions.
> 2.   Les États membres peuvent maintenir ou introduire des dispositions plus spécifiques pour adapter l'application des règles du présent règlement pour ce qui est du traitement dans le but de respecter le paragraphe 1, points c) et e), en déterminant plus précisément les exigences spécifiques applicables au traitement ainsi que d'autres mesures visant à garantir un traitement licite et loyal, y compris dans d'autres situations particulières de traitement comme le prévoit le chapitre IX.
> 3.   Le fondement du traitement visé au paragraphe 1, points c) et e), est défini par:
> a) le droit de l'Union; ou
> b) le droit de l'État membre auquel le responsable du traitement est soumis.
> Les finalités du traitement sont définies dans cette base juridique ou, en ce qui concerne le traitement visé au paragraphe 1, point e), sont nécessaires à l'exécution d'une mission d'intérêt public ou relevant de l'exercice de l'autorité publique dont est investi le responsable du traitement. Cette base juridique peut contenir des dispositions spécifiques pour adapter l'application des règles du présent règlement, entre autres: les conditions générales régissant la licéité du traitement par le responsable du traitement; les types de données qui font l'objet du traitement; les personnes concernées; les entités auxquelles les données à caractère personnel peuvent être communiquées et les finalités pour lesquelles elles peuvent l'être; la limitation des finalités; les durées de conservation; et les opérations et procédures de traitement, y compris les mesures visant à garantir un traitement licite et loyal, telles que celles prévues dans d'autres situ
> […]

**Sources affichées.** RGPD, art. 6 et 44 ; Loi Informatique et Libertés, art. 82

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Bandeau de consentement

`cookies.bandeau` · empreinte `91cbf4d1ed62b9ab` · Loi (peut produire « Illégal » une fois validée) · gravité critique

**Exigence affichée aux clients.** Si des traceurs soumis à consentement sont utilisés : un mécanisme de recueil du consentement libre, spécifique, éclairé et univoque, qui liste les finalités et permet de choisir.

**Sanction affichée.** Amende administrative de la CNIL jusqu'à 10 M€ ou 2 % du chiffre d'affaires mondial (loi Informatique et Libertés, art. 20).

**Conditions appliquées par le logiciel.** Cookies ou traceurs non essentiels

**S'applique si :**
- Site qui utilise des traceurs soumis à consentement.

**Ne s'applique pas si :**
- Site sans traceur soumis à consentement : aucun bandeau n'est exigé.

**Doutes à trancher :**
- La loi exige un consentement, pas un « bandeau » : c'est la forme usuelle de son recueil.

**Loi Informatique et Libertés (n° 78-17), art. 82** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**RGPD, art. 4** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_4)

> Article 4
> Définitions
> Aux fins du présent règlement, on entend par:
> 1)
> «données à caractère personnel», toute information se rapportant à une personne physique identifiée ou identifiable (ci-après dénommée «personne concernée»); est réputée être une «personne physique identifiable» une personne physique qui peut être identifiée, directement ou indirectement, notamment par référence à un identifiant, tel qu'un nom, un numéro d'identification, des données de localisation, un identifiant en ligne, ou à un ou plusieurs éléments spécifiques propres à son identité physique, physiologique, génétique, psychique, économique, culturelle ou sociale;
> 2)
> «traitement», toute opération ou tout ensemble d'opérations effectuées ou non à l'aide de procédés automatisés et appliquées à des données ou des ensembles de données à caractère personnel, telles que la collecte, l'enregistrement, l'organisation, la structuration, la conservation, l'adaptation ou la modification, l'extraction, la consultation, l'utilisation, la communication par transmission, la diffusion ou toute autre forme de mise à disposition, le rapprochement ou l'interconnexion, la limitation, l'effacement ou la destruction;
> 3)
> «limitation du traitement», le marquage de données à caractère personnel conservées, en vue de limiter leur traitement futur;
> 4)
> «profilage», toute forme de traitement automatisé de données à caractère personnel consistant à utiliser ces données à caractère personnel pour évaluer certains aspects personnels relatifs à une personne physique, notamment pour analyser ou prédire des éléments concernant le rendement au travail, la situation économique, la santé, les préférences personnelles, les intérêts, la fiabilité, le comportement, la localisation ou les déplacements de cette personne physique;
> 5)
> «pseudonymisation», le traitement de données à caractère personnel de telle façon que celles-ci ne puissent plus être attribuées à une personne concernée précise sans avoir recours à des informations supplémentaires, pour autant que ces informations supplémentaires soient conservées séparément et soumises à des mesures techniques et organisationnelles afin de garantir que les données à caractère personnel ne sont pas attribuées à une personne physique identifiée ou identifiable;
> 6)
> «fichier», tout ensemble structuré de données à caractère personnel accessibles selon des critères déterminés, que cet ensemble soit centralisé, décentralisé ou réparti de manière fonctionnelle ou géographique;
> 7)
> «responsable du traitement», la personne physique ou morale, l'autorité publique, le service ou un autre organisme qui, seul ou conjointement avec d'autres, détermine les finalités et les moyens du traitement; lorsque les finalités et les moyens de ce traitement sont déterminés par le droit de l'Union ou le droit d'un État membre, le responsable du traitement peut être désigné ou les critères spécifiques applicables à sa désignation peuvent être prévus par le droit de l'Union ou par le droit d'un É
> […]

**RGPD, art. 7** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_7)

> Article 7
> Conditions applicables au consentement
> 1.   Dans les cas où le traitement repose sur le consentement, le responsable du traitement est en mesure de démontrer que la personne concernée a donné son consentement au traitement de données à caractère personnel la concernant.
> 2.   Si le consentement de la personne concernée est donné dans le cadre d'une déclaration écrite qui concerne également d'autres questions, la demande de consentement est présentée sous une forme qui la distingue clairement de ces autres questions, sous une forme compréhensible et aisément accessible, et formulée en des termes clairs et simples. Aucune partie de cette déclaration qui constitue une violation du présent règlement n'est contraignante.
> 3.   La personne concernée a le droit de retirer son consentement à tout moment. Le retrait du consentement ne compromet pas la licéité du traitement fondé sur le consentement effectué avant ce retrait. La personne concernée en est informée avant de donner son consentement. Il est aussi simple de retirer que de donner son consentement.
> 4.   Au moment de déterminer si le consentement est donné librement, il y a lieu de tenir le plus grand compte de la question de savoir, entre autres, si l'exécution d'un contrat, y compris la fourniture d'un service, est subordonnée au consentement au traitement de données à caractère personnel qui n'est pas nécessaire à l'exécution dudit contrat.

**Sources affichées.** Loi Informatique et Libertés, art. 82 ; RGPD, art. 4.11 et 7 ; CNIL, recommandation du 17 septembre 2020

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Refuser aussi simplement qu'accepter

`cookies.refus-simple` · empreinte `56e854309d6dc5f5` · Zone de flou · gravité critique

**Exigence affichée aux clients.** Le bandeau propose, au même niveau et avec la même visibilité que « Tout accepter », un moyen de tout refuser (bouton « Tout refuser » ou équivalent). Fermer le bandeau ou continuer à naviguer ne vaut pas consentement.

**Nuance affichée.** La loi exige un consentement libre ; la CNIL en déduit que refuser doit être aussi simple qu'accepter, et sanctionne régulièrement ce point. Un bouton « Gérer les cookies » qui renvoie à un second écran ne suffit pas.

**Sanction affichée.** Sanctionné par la CNIL sur le fondement de l'art. 82, jusqu'à 10 M€ ou 2 % du chiffre d'affaires mondial (délibérations du 31 décembre 2021 : 150 M€ contre Google, 60 M€ contre Facebook, pour ce seul motif).

**Conditions appliquées par le logiciel.** Cookies ou traceurs non essentiels

**S'applique si :**
- Site qui demande le consentement à des traceurs.

**Doutes à trancher :**
- Exigence de la recommandation CNIL de 2020, appliquée dans ses sanctions : zone de flou, à garder ainsi. Un « mur » avec alternative payante s'apprécie au cas par cas.

**Loi Informatique et Libertés (n° 78-17), art. 82** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**RGPD, art. 7** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_7)

> Article 7
> Conditions applicables au consentement
> 1.   Dans les cas où le traitement repose sur le consentement, le responsable du traitement est en mesure de démontrer que la personne concernée a donné son consentement au traitement de données à caractère personnel la concernant.
> 2.   Si le consentement de la personne concernée est donné dans le cadre d'une déclaration écrite qui concerne également d'autres questions, la demande de consentement est présentée sous une forme qui la distingue clairement de ces autres questions, sous une forme compréhensible et aisément accessible, et formulée en des termes clairs et simples. Aucune partie de cette déclaration qui constitue une violation du présent règlement n'est contraignante.
> 3.   La personne concernée a le droit de retirer son consentement à tout moment. Le retrait du consentement ne compromet pas la licéité du traitement fondé sur le consentement effectué avant ce retrait. La personne concernée en est informée avant de donner son consentement. Il est aussi simple de retirer que de donner son consentement.
> 4.   Au moment de déterminer si le consentement est donné librement, il y a lieu de tenir le plus grand compte de la question de savoir, entre autres, si l'exécution d'un contrat, y compris la fourniture d'un service, est subordonnée au consentement au traitement de données à caractère personnel qui n'est pas nécessaire à l'exécution dudit contrat.

**Sources affichées.** CNIL, lignes directrices et recommandation de 2020 ; RGPD, art. 7.3

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Le refus est respecté

`cookies.refus-respecte` · empreinte `eacfee21e2323a78` · Loi (peut produire « Illégal » une fois validée) · gravité critique

**Exigence affichée aux clients.** Après un clic sur « Tout refuser », aucun traceur soumis à consentement n'est déposé ni lu, ni sur la page en cours ni lors de la suite de la navigation. Un bandeau qui propose de refuser mais laisse les traceurs fonctionner ne recueille aucun consentement valable.

**Nuance affichée.** Vigie clique sur le bouton de refus dans un navigateur vierge, recharge la page, puis relève les cookies et les services contactés. Des requêtes sans cookie (« mode consentement » de Google) restent une zone de flou.

**Sanction affichée.** Amende administrative de la CNIL jusqu'à 10 M€ ou 2 % du chiffre d'affaires mondial (loi Informatique et Libertés, art. 20) ; jusqu'à 20 000 € en procédure simplifiée.

**Conditions appliquées par le logiciel.** Cookies ou traceurs non essentiels

**S'applique si :**
- Site qui propose de refuser les traceurs.

**Doutes à trancher :**
- Des requêtes sans cookie après refus (mode consentement de Google) ne sont pas tranchées : le contrôle les classe en zone de flou.

**Loi Informatique et Libertés (n° 78-17), art. 82** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Directive ePrivacy 2002/58/CE, art. 5** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:02002L0058-20091219)

> Article 5
> Confidentialité des communications
> 1.  Les États membres garantissent, par la législation nationale, la confidentialité des communications effectuées au moyen d'un réseau public de communications et de services de communications électroniques accessibles au public, ainsi que la confidentialité des données relatives au trafic y afférentes. En particulier, ils interdisent à toute autre personne que les utilisateurs d'écouter, d'intercepter, de stocker les communications et les données relatives au trafic y afférentes, ou de les soumettre à tout autre moyen d'interception ou de surveillance, sans le consentement des utilisateurs concernés sauf lorsque cette personne y est légalement autorisée, conformément à l'article 15, paragraphe 1. Le présent paragraphe n'empêche pas le stockage technique nécessaire à l'acheminement d'une communication, sans préjudice du principe de confidentialité.
> 2.  Le paragraphe 1 n'affecte pas l'enregistrement légalement autorisé de communications et des données relatives au trafic y afférentes, lorsqu'il est effectué dans le cadre des usages professionnels licites, afin de fournir la preuve d'une transaction commerciale ou de toute autre communication commerciale.
> ▼M2
> 3.  Les États membres garantissent que le stockage d'informations, ou l’obtention de l’accès à des informations déjà stockées, dans l’équipement terminal d’un abonné ou d’un utilisateur n’est permis qu’à condition que l’abonné ou l’utilisateur ait donné son accord, après avoir reçu, dans le respect de la directive 95/46/CE, une information claire et complète, entre autres sur les finalités du traitement. Cette disposition ne fait pas obstacle à un stockage ou à un accès techniques visant exclusivement à effectuer la transmission d’une communication par la voie d’un réseau de communications électroniques, ou strictement nécessaires au fournisseur pour la fourniture d’un service de la société de l’information expressément demandé par l’abonné ou l’utilisateur.
> ▼B

**Sources affichées.** Loi Informatique et Libertés, art. 82 ; Directive ePrivacy 2002/58/CE, art. 5.3 ; CNIL, lignes directrices du 17 septembre 2020

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Durée de vie des traceurs et du choix

`cookies.duree` · empreinte `0e79af3bcaf3ad14` · Recommandation · gravité mineure

**Exigence affichée aux clients.** Durée de vie des traceurs limitée à 13 mois au plus (recommandation CNIL) ; le choix de l'internaute est conservé et redemandé à intervalle raisonnable (6 mois recommandés).

**Nuance affichée.** La limite de 13 mois vient d'une recommandation de la CNIL, pas d'un texte de loi.

**Conditions appliquées par le logiciel.** Cookies ou traceurs non essentiels

**S'applique si :**
- Site qui utilise des traceurs.

**Doutes à trancher :**
- Recommandation CNIL seulement : hors de la note, à garder ainsi.

**Sources affichées.** CNIL, recommandation du 17 septembre 2020

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Information sur les traceurs

`cookies.information` · empreinte `8e298a873394714b` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Une information accessible sur chaque finalité, l'identité des tiers qui déposent des traceurs, la durée de conservation et la possibilité de retirer son consentement aussi facilement qu'on l'a donné (lien permanent « Gérer mes cookies »).

**Sanction affichée.** Amende administrative de la CNIL jusqu'à 10 M€ ou 2 % du chiffre d'affaires mondial (loi Informatique et Libertés, art. 20).

**Conditions appliquées par le logiciel.** Cookies ou traceurs non essentiels

**S'applique si :**
- Site qui utilise des traceurs soumis à consentement.

**Loi Informatique et Libertés (n° 78-17), art. 82** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**RGPD, art. 7** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679#art_7)

> Article 7
> Conditions applicables au consentement
> 1.   Dans les cas où le traitement repose sur le consentement, le responsable du traitement est en mesure de démontrer que la personne concernée a donné son consentement au traitement de données à caractère personnel la concernant.
> 2.   Si le consentement de la personne concernée est donné dans le cadre d'une déclaration écrite qui concerne également d'autres questions, la demande de consentement est présentée sous une forme qui la distingue clairement de ces autres questions, sous une forme compréhensible et aisément accessible, et formulée en des termes clairs et simples. Aucune partie de cette déclaration qui constitue une violation du présent règlement n'est contraignante.
> 3.   La personne concernée a le droit de retirer son consentement à tout moment. Le retrait du consentement ne compromet pas la licéité du traitement fondé sur le consentement effectué avant ce retrait. La personne concernée en est informée avant de donner son consentement. Il est aussi simple de retirer que de donner son consentement.
> 4.   Au moment de déterminer si le consentement est donné librement, il y a lieu de tenir le plus grand compte de la question de savoir, entre autres, si l'exécution d'un contrat, y compris la fourniture d'un service, est subordonnée au consentement au traitement de données à caractère personnel qui n'est pas nécessaire à l'exécution dudit contrat.

**Sources affichées.** CNIL, lignes directrices du 17 septembre 2020 ; RGPD, art. 7.3

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Mesure d'audience exemptée correctement configurée

`cookies.mesure-audience` · empreinte `6087124d08466fdb` · Zone de flou · gravité majeure

**Exigence affichée aux clients.** Un outil de mesure d'audience n'est dispensé de consentement que s'il respecte les conditions CNIL : finalité strictement limitée, données anonymes agrégées, pas de recoupement, traceurs de 13 mois maximum, données conservées 25 mois. Google Analytics ne remplit pas ces conditions.

**Nuance affichée.** Les conditions de l'exemption sont fixées par la CNIL. Un outil non exempté chargé sans consentement est déjà relevé, comme manquement certain, au point « Aucun traceur non essentiel avant consentement ».

**Sanction affichée.** Amende administrative de la CNIL jusqu'à 10 M€ ou 2 % du chiffre d'affaires mondial (loi Informatique et Libertés, art. 20).

**Conditions appliquées par le logiciel.** Cookies ou traceurs non essentiels

**S'applique si :**
- Outil de mesure d'audience chargé sans consentement.

**Ne s'applique pas si :**
- Outil configuré selon les conditions d'exemption de la CNIL.

**Doutes à trancher :**
- La configuration réelle (anonymisation, absence de recoupement) ne se voit pas de l'extérieur.

**Loi Informatique et Libertés (n° 78-17), art. 82** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Loi Informatique et Libertés, art. 82 ; CNIL, solutions pour la mesure d'audience

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

## Vente à distance

### Conditions générales de vente accessibles

`vente.cgv` · empreinte `af726b089787ac12` · Loi (peut produire « Illégal » une fois validée) · gravité critique

**Exigence affichée aux clients.** Des conditions générales de vente accessibles avant la commande, téléchargeables et imprimables, que le client accepte expressément. Entre professionnels, les CGV sont le socle de la négociation et doivent être communiquées sur demande.

**Sanction affichée.** Amende administrative jusqu'à 15 000 € pour une personne physique et 75 000 € pour une personne morale par manquement aux obligations d'information (C. conso art. L242-10, qui vise L221-5 et L221-11).

**Conditions appliquées par le logiciel.** Commande ou paiement en ligne

**S'applique si :**
- Tout site qui permet de conclure un contrat en ligne : les conditions contractuelles doivent être mises à disposition de façon à pouvoir être conservées et reproduites (C. civ. art. 1127-1).

**Ne s'applique pas si :**
- Site sans vente ni contrat en ligne.

**Doutes à trancher :**
- La loi n'impose pas un document intitulé « CGV » aux ventes aux consommateurs, mais la mise à disposition des stipulations contractuelles. Entre professionnels, les CGV ne sont dues que sur demande (C. com. L441-1) : une absence de page n'est pas en soi illégale pour un site B2B.

**Code civil, art. 1127-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. L221-5** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. L221-11** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de commerce, art. L441-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code civil, art. 1119 et 1127-1 ; Code de la consommation, art. L221-5 et L221-11 ; Code de commerce, art. L441-1

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Informations précontractuelles

`vente.info-precontractuelle` · empreinte `3ed17579c9fe06de` · Loi (peut produire « Illégal » une fois validée) · gravité critique

**Exigence affichée aux clients.** Avant la commande : caractéristiques essentielles, prix total TTC et frais de livraison, délai ou date de livraison, identité et coordonnées du vendeur, modalités de paiement et d'exécution, garanties légales, durée du contrat et conditions de résiliation, fonctionnalité et interopérabilité des contenus numériques.

**Sanction affichée.** Amende administrative jusqu'à 15 000 € pour une personne physique et 75 000 € pour une personne morale (C. conso art. L242-10).

**Conditions appliquées par le logiciel.** Commande ou paiement en ligne ET Vend ou s'adresse à des particuliers

**S'applique si :**
- Le site permet de conclure un contrat à distance avec des consommateurs.

**Ne s'applique pas si :**
- Vente exclusivement à des professionnels.

**Code de la consommation, art. L111-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. R111-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. L221-5** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. R221-2** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de la consommation, art. L111-1, R111-1, R221-2 ; Code de la consommation, art. L221-5

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Droit de rétractation de 14 jours et formulaire type

`vente.retractation-info` · empreinte `337634c38307e737` · Loi (peut produire « Illégal » une fois validée) · gravité critique

**Exigence affichée aux clients.** Les conditions, le délai (14 jours) et les modalités d'exercice du droit de rétractation, le formulaire type de rétractation, qui supporte les frais de retour, ou l'absence de droit de rétractation et sa raison (biens personnalisés, contenus numériques exécutés…).

**Nuance affichée.** Certains contrats sont exclus du droit de rétractation (art. L221-28), par exemple les activités de loisirs fournies à une date déterminée : à vérifier selon ce que vend le site.

**Sanction affichée.** À défaut d'information, le délai de rétractation est prolongé de 12 mois (C. conso art. L221-20).

**Conditions appliquées par le logiciel.** Commande ou paiement en ligne ET Vend ou s'adresse à des particuliers

**S'applique si :**
- Le site permet de conclure un contrat à distance avec des consommateurs.

**Ne s'applique pas si :**
- Vente exclusivement à des professionnels.
- Contrats exclus du droit de rétractation (art. L221-28 : biens personnalisés, denrées périssables, loisirs à date déterminée…).

**Code de la consommation, art. L221-5** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. L221-18** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. L221-28** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. R221-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de la consommation, art. L221-5, I, 7°, 8° et 10° ; Code de la consommation, art. L221-18 à L221-28 (exclusions : art. L221-28) ; Code de la consommation, art. R221-1 et annexe (formulaire type)

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Fonctionnalité de rétractation en ligne

`vente.bouton-retractation` · empreinte `59a189d463b85ecb` · Loi (peut produire « Illégal » une fois validée) · gravité critique · applicable depuis le 2026-06-19

**Exigence affichée aux clients.** Depuis le 19 juin 2026, tout contrat conclu à distance via une interface en ligne doit pouvoir être rétracté en ligne par une fonctionnalité gratuite, visible, directement et facilement accessible pendant tout le délai, libellée « renoncer au contrat ici » ou par une formule analogue dénuée d'ambiguïté. Elle permet de donner son nom, d'identifier le contrat et d'indiquer où recevoir l'accusé de réception, puis de valider par un bouton « confirmer la rétractation » (ou formule analogue). Le professionnel envoie ensuite un accusé de réception sur support durable mentionnant le contenu de la déclaration, sa date et son heure.

**Nuance affichée.** Ne concerne que les contrats ouvrant droit à rétractation (voir les exclusions de l'art. L221-28).

**Conditions appliquées par le logiciel.** Commande ou paiement en ligne ET Vend ou s'adresse à des particuliers

**S'applique si :**
- Le site permet de conclure un contrat à distance avec des consommateurs. Contrats ouvrant droit à rétractation, depuis le 19 juin 2026.

**Ne s'applique pas si :**
- Vente exclusivement à des professionnels.
- Contrats exclus du droit de rétractation (art. L221-28).

**Doutes à trancher :**
- Numéros (L221-21, D221-5) et dates de l'ordonnance n° 2026-2 et du décret n° 2026-3 relevés dans des sources secondaires : à confirmer sur le texte consolidé.
- Sanction propre non identifiée : aucune n'est affichée.

**Code de la consommation, art. L221-21** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. D221-5** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Directive (UE) 2023/2673, art. 1** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32023L2673#art_1)

> Article premier
> Modifications de la directive 2011/83/UE
> La directive 2011/83/UE est modifiée comme suit:
> 1)
> L’article 3 est modifié comme suit:
> a) le paragraphe suivant est inséré:
> «1 ter.   Dans le cas des contrats à distance conclus entre un professionnel et un consommateur pour la fourniture de services financiers, seuls les articles 1er et 2, l’article 3, paragraphes 2, 5 et 6, l’article 4, l’article 6 bis, l’article 8, paragraphe 6, l’article 11 bis, les articles 16 bis à 16 sexies, l’article 19, les articles 21 à 23, l’article 24, paragraphes 1 et 6, les articles 25 à 27 et l’article 29 s’appliquent.
> À l’exception de l’article 21, lorsque des contrats visés au premier alinéa comportent une première convention de service suivie d’une série d’opérations successives, ou d’une série d’opérations distinctes, de même nature, échelonnées dans le temps, les dispositions visées au premier alinéa ne s’appliquent qu’à la première convention.
> Lorsqu’il n’y a pas de première convention de service, mais que des opérations successives, ou distinctes, de même nature échelonnées dans le temps, concernant les mêmes parties au contrat, sont exécutées, les articles 16 bis et 16 quinquies s’appliquent uniquement à la première opération.
> Cependant, lorsque aucune opération de même nature n’est effectuée pendant plus d’un an, l’opération suivante est considérée comme étant la première d’une nouvelle série d’opérations, en conséquence de quoi les articles 16 bis et 16 quinquies s’appliquent.»
> ;
> b) au paragraphe 3, le point d) est remplacé par le texte suivant:
> «d)
> portant sur les services financiers non couverts par l’article 3, paragraphe 1 ter;».
> 2)
> À l’article 6, paragraphe 1, le point h) est remplacé par le texte suivant:
> «h)
> lorsqu’il existe un droit de rétractation, les conditions, le délai et les modalités d’exercice de ce droit conformément à l’article 11, paragraphe 1, ainsi que le modèle de formulaire de rétractation figurant à l’annexe I, partie B, et, le cas échéant, des informations sur l’existence et l’emplacement de la fonction de rétractation visée à l’article 11 bis;».
> 3)
> L’article suivant est inséré:
> «Article 11 bis
> Exercice du droit de rétractation des contrats à distance conclus au moyen d’une interface en ligne
> 1.   Pour les contrats à distance conclus au moyen d’une interface en ligne, le professionnel veille à ce que le consommateur puisse également se rétracter du contrat en utilisant une fonction de rétractation.
> La fonction de rétractation porte une mention comportant les mots “renoncer au contrat ici” ou une formule analogue dénuée d’ambiguïté, qui soit facilement lisible. La fonction de rétractation est disponible en permanence pendant toute la durée du délai de rétractation. Elle est affichée sur l’interface en ligne de manière bien visible et est facilement accessible au consommateur.
> 2.   La fonction de rétractation permet au consommateur d’envoyer une déclaration de rétractation en ligne dans laquelle il informe le professionnel de
> […]

**Sources affichées.** Directive (UE) 2023/2673, art. 11 bis de la directive 2011/83/UE ; Code de la consommation, issu de l'ordonnance n° 2026-2 du 5 janvier 2026, art. L221-21, dernier alinéa ; Code de la consommation, issu du décret n° 2026-3 du 5 janvier 2026, art. D221-5

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Bouton « Commande avec obligation de paiement »

`vente.bouton-commande` · empreinte `fa5df8c65df291ff` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Le bouton qui finalise la commande porte la mention « commande avec obligation de paiement » ou une formule analogue dénuée d'ambiguïté. Le client peut vérifier le détail de sa commande et son prix total et corriger ses erreurs avant de confirmer (double clic). Les moyens de paiement acceptés et les éventuelles restrictions de livraison sont indiqués au plus tard au début du processus de commande.

**Nuance affichée.** La directive 2011/83/UE (considérant 39) cite « commander maintenant » ou « confirmer » parmi les formules ambiguës ; « Payer » ou « Acheter » sont admis. Vigie lit le bouton en parcourant le tunnel de commande, sans jamais commander.

**Sanction affichée.** Le contrat n'est valablement conclu que si le client a pu vérifier sa commande avant de la confirmer (C. civ. art. 1127-2) ; amende administrative jusqu'à 75 000 € pour une personne morale (C. conso art. L242-10, qui vise L221-14).

**Conditions appliquées par le logiciel.** Commande ou paiement en ligne ET Vend ou s'adresse à des particuliers

**S'applique si :**
- Le site permet de conclure un contrat à distance avec des consommateurs.

**Ne s'applique pas si :**
- Vente exclusivement à des professionnels.

**Doutes à trancher :**
- Libellés « Valider la commande », « Commander » : ambiguïté appréciée au cas par cas (CJUE, 7 avril 2022, C-249/21) ; le contrôle les classe en zone de flou.

**Code de la consommation, art. L221-14** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code civil, art. 1127-2** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de la consommation, art. L221-14 ; Code civil, art. 1127-2

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Confirmation de commande sur support durable

`vente.confirmation` · empreinte `d41520ec9eb41a68` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Une confirmation du contrat, reprenant toutes les informations précontractuelles et le formulaire de rétractation, envoyée sur support durable (e-mail) au plus tard à la livraison.

**Sanction affichée.** Amende administrative jusqu'à 75 000 € pour une personne morale (C. conso art. L242-10).

**Conditions appliquées par le logiciel.** Commande ou paiement en ligne ET Vend ou s'adresse à des particuliers

**S'applique si :**
- Le site permet de conclure un contrat à distance avec des consommateurs.

**Ne s'applique pas si :**
- Vente exclusivement à des professionnels.

**Code de la consommation, art. L221-13** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de la consommation, art. L221-13

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Garantie légale de conformité et garantie des vices cachés

`vente.garanties` · empreinte `f6bbf8516afbb632` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Les CGV reproduisent les informations sur la garantie légale de conformité (2 ans ; défaut présumé exister à la livraison pendant 2 ans, 1 an pour les biens d'occasion ; mises à jour des biens comportant des éléments numériques), la garantie des vices cachés et, le cas échéant, la garantie commerciale, sous la forme de l'encadré prévu par décret.

**Conditions appliquées par le logiciel.** Commande ou paiement en ligne ET Vend ou s'adresse à des particuliers

**S'applique si :**
- Le site permet de conclure un contrat à distance avec des consommateurs. Vente de biens ou de contenus numériques.

**Ne s'applique pas si :**
- Vente exclusivement à des professionnels.

**Doutes à trancher :**
- Confirmer la référence de l'encadré réglementaire des garanties (D211-2 ou article voisin après la réforme de 2021-2022).

**Code de la consommation, art. L217-3** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. L217-7** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. D211-2** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code civil, art. 1641** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de la consommation, art. L217-3 et s., L224-25-12 et s., D211-2 ; Code civil, art. 1641 à 1649

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Délai de livraison et transfert des risques

`vente.livraison` · empreinte `ce1b7c795f91fcdb` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** La date ou le délai de livraison (à défaut, 30 jours au plus), les conséquences d'un retard et le transfert des risques à la prise de possession par le consommateur.

**Conditions appliquées par le logiciel.** Commande ou paiement en ligne ET Vend ou s'adresse à des particuliers

**S'applique si :**
- Le site permet de conclure un contrat à distance avec des consommateurs. Vente de biens livrés.

**Ne s'applique pas si :**
- Vente exclusivement à des professionnels.
- Services et contenus numériques sans livraison physique.

**Code de la consommation, art. L216-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. L216-4** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de la consommation, art. L216-1 à L216-4

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Médiateur de la consommation

`vente.mediateur` · empreinte `fc863a4268ebd267` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Le professionnel adhère à un médiateur de la consommation référencé et communique ses coordonnées (nom, site internet) sur son site et dans ses CGV.

**Sanction affichée.** Amende administrative jusqu'à 3 000 € pour une personne physique et 15 000 € pour une personne morale (art. L641-1).

**Conditions appliquées par le logiciel.** Vend ou s'adresse à des particuliers ET au moins un de : (Commande ou paiement en ligne) ; (type de site : Site vitrine)

**S'applique si :**
- Tout professionnel qui contracte avec des consommateurs, qu'il vende en ligne ou non : coordonnées du médiateur sur son site et dans ses CGV.

**Ne s'applique pas si :**
- Vente exclusivement à des professionnels.

**Code de la consommation, art. L612-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. L616-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. R616-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de la consommation, art. L612-1 et L616-1 ; Code de la consommation, art. R616-1 ; Liste des médiateurs référencés

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Lien vers la plateforme européenne RLL à retirer

`vente.lien-rll-obsolete` · empreinte `b02859b2579c8148` · Loi (peut produire « Illégal » une fois validée) · gravité mineure · applicable depuis le 2025-07-20

**Exigence affichée aux clients.** La plateforme européenne de règlement en ligne des litiges (ec.europa.eu/consumers/odr) a fermé le 20 juillet 2025 et l'obligation d'y renvoyer a disparu. Un lien encore présent est un lien mort à retirer des CGV et du pied de page.

**Conditions appliquées par le logiciel.** tous les sites

**S'applique si :**
- Site qui affiche encore le lien vers la plateforme RLL.

**Règlement (UE) 2024/3228, art. 1** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32024R3228#art_1)

> Article premier
> Le règlement (UE) no 524/2013 est abrogé avec effet au 20 juillet 2025.

**Sources affichées.** Règlement (UE) 2024/3228 abrogeant le règlement (UE) n° 524/2013

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Pas de discrimination géographique dans l'UE

`vente.geoblocage` · empreinte `af22382c8a5e55f1` · Loi (peut produire « Illégal » une fois validée) · gravité mineure

**Exigence affichée aux clients.** Pas de blocage ni de redirection forcée, ni de conditions générales d'accès différentes selon la nationalité ou le lieu de résidence d'un client de l'UE, sauf justification légale (livraison possible à retirer sur place).

**Conditions appliquées par le logiciel.** Commande ou paiement en ligne

**S'applique si :**
- Vente en ligne à des clients de l'Union.

**Ne s'applique pas si :**
- Le règlement n'oblige pas à livrer partout : seule la discrimination d'accès ou de conditions est visée.

**Règlement géoblocage, art. 3** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32018R0302#art_3)

> Article 3
> Accès aux interfaces en ligne
> 1.   Un professionnel ne bloque ni ne limite, par l'utilisation de mesures technologiques ou autres, l'accès d'un client à l'interface en ligne du professionnel pour des motifs liés à la nationalité, au lieu de résidence ou au lieu d'établissement du client.
> 2.   Un professionnel ne redirige pas, pour des motifs liés à la nationalité, au lieu de résidence ou au lieu d'établissement d'un client, ce client vers une version de l'interface en ligne du professionnel qui est différente de l'interface en ligne à laquelle le client a initialement voulu accéder, en raison de son agencement, de son choix de langues ou d'autres caractéristiques qui la rendent spécifique aux clients possédant une nationalité, un lieu de résidence ou un lieu d'établissement déterminés, sauf si le client a expressément donné son consentement à cet effet.
> Lorsqu'un client est ainsi redirigé avec son consentement exprès, il continue de pouvoir accéder facilement à la version de l'interface en ligne du professionnel à laquelle il a initialement voulu accéder.
> 3.   Les interdictions énoncées aux paragraphes 1 et 2 ne sont pas applicables lorsque le blocage ou la limitation de l'accès ou la redirection sont nécessaires en vue de satisfaire une exigence légale applicable aux activités du professionnel, prévue dans le droit de l'Union ou dans la législation d'un État membre conformément au droit de l'Union.
> Dans de tels cas, le professionnel fournit une explication claire et spécifique aux clients sur les raisons pour lesquelles le blocage ou la limitation d'accès ou la redirection sont nécessaires à des fins de mise en conformité. Cette explication est rédigée dans la langue de l'interface en ligne à laquelle le client a initialement cherché à accéder.

**Règlement géoblocage, art. 4** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32018R0302#art_4)

> Article 4
> Accès aux biens ou aux services
> 1.   Un professionnel n'applique pas des conditions générales d'accès aux biens ou services qui diffèrent en fonction de la nationalité, du lieu de résidence ou du lieu d'établissement du client, dans les cas où le client cherche à:
> a) acheter des biens auprès d'un professionnel et que soit ces biens sont livrés en un lieu situé dans un État membre vers lequel la livraison est proposée dans les conditions générales d'accès du professionnel, soit ces biens sont retirés en un lieu défini d'un commun accord entre le professionnel et le client dans un État membre pour lequel le professionnel propose une telle option dans les conditions générales d'accès;
> b) obtenir des services fournis par un professionnel par voie électronique, autres que des services dont la principale caractéristique est de fournir un accès à des œuvres protégées par le droit d'auteur ou d'autres objets protégés ou de permettre leur utilisation, y compris la vente sous une forme immatérielle des œuvres protégées par le droit d'auteur ou des objets protégés;
> c) obtenir des services d'un professionnel autres que des services fournis par voie électronique, en un lieu situé sur le territoire d'un État membre dans lequel le professionnel exerce son activité.
> 2.   L'interdiction énoncée au paragraphe 1 n'empêche pas les professionnels de proposer des conditions générales d'accès, notamment des prix de vente nets, qui varient d'un État membre à l'autre ou au sein d'un État membre et qui sont proposées, de manière non discriminatoire, à des clients situés sur un territoire spécifique ou à certains groupes de clients.
> 3.   Le simple respect de l'interdiction énoncée au paragraphe 1 ne signifie pas en soi que le professionnel est tenu de se conformer aux prescriptions légales nationales non contractuelles applicables aux biens et services respectifs dans l'État membre du client, ou d'informer les clients quant à ces exigences.
> 4.   L'interdiction énoncée au paragraphe 1, point b), ne s'applique pas aux professionnels qui sont exemptés de la TVA en vertu des dispositions du titre XII, chapitre 1, de la directive 2006/112/CE.
> 5.   L'interdiction énoncée au paragraphe 1 ne s'applique pas dans la mesure où une disposition spécifique du droit de l'Union ou des législations des États membres conformément au droit de l'Union empêche le professionnel de vendre les biens ou de fournir les services à certains clients ou aux clients situés sur certains territoires.
> En ce qui concerne la vente de livres, l'interdiction énoncée au paragraphe 1 ne fait pas obstacle à ce que les professionnels appliquent des prix différents aux clients situés sur certains territoires, dans la mesure où ils sont tenus de le faire en vertu des législations des États membres conformément au droit de l'Union.

**Sources affichées.** Règlement (UE) 2018/302 « géoblocage », art. 3 à 5

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Fiche produit : fabricant, identification et avertissements de sécurité

`vente.securite-produits` · empreinte `e864ee77c7a13b7c` · Loi (peut produire « Illégal » une fois validée) · gravité majeure · applicable depuis le 2024-12-13

**Exigence affichée aux clients.** Depuis le 13 décembre 2024, chaque offre en ligne d'un produit de consommation indique de façon claire et visible : le nom ou la marque du fabricant et ses adresses postale et électronique ; si le fabricant est établi hors de l'Union, la personne responsable dans l'Union et ses coordonnées ; les éléments permettant d'identifier le produit (image, type, référence) ; les avertissements et informations de sécurité qui doivent figurer sur le produit ou sa notice, en français.

**Nuance affichée.** Ne concerne que la vente de biens (pas les services ni les contenus numériques). Sur une place de marché, la plateforme doit permettre aux vendeurs d'afficher ces informations (art. 22).

**Conditions appliquées par le logiciel.** type de site : Boutique en ligne ou Place de marché ET Commande ou paiement en ligne ET Vend ou s'adresse à des particuliers

**S'applique si :**
- Vente en ligne de produits de consommation, depuis le 13 décembre 2024.

**Ne s'applique pas si :**
- Services.

**Règlement (UE) 2023/988, art. 19** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32023R0988#art_19)

> Article 19
> Obligations des opérateurs économiques en cas de vente à distance
> Lorsque les opérateurs économiques mettent des produits à disposition sur le marché en ligne ou par d’autres moyens de vente à distance, l’offre de ces produits indique de manière claire et visible au moins les informations suivantes:
> a) le nom, la raison sociale ou la marque déposée du fabricant ainsi que l’adresse postale et électronique à laquelle il peut être contacté;
> b) lorsque le fabricant n’est pas établi dans l’Union, le nom, l’adresse postale et électronique de la personne responsable au sens de l’article 16, paragraphe 1, du présent règlement ou de l’article 4, paragraphe 1, du règlement (UE) 2019/1020;
> c) les informations permettant d’identifier le produit, y compris une image de celui-ci, son type et tout autre identifiant du produit; et
> d) tout avertissement ou toute information concernant la sécurité qui doit être apposé(e) sur le produit ou sur l’emballage ou figurer dans un document d’accompagnement conformément au présent règlement ou à la législation d’harmonisation de l’Union applicable, dans une langue aisément compréhensible par les consommateurs, déterminée par l’État membre dans lequel le produit est mis à disposition sur le marché.

**Sources affichées.** Règlement (UE) 2023/988 relatif à la sécurité générale des produits (GPSR), art. 19

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

## Contrats en ligne

### Archivage des contrats de 120 € ou plus

`vente.archivage` · empreinte `d78bdecf2f83b918` · Loi (peut produire « Illégal » une fois validée) · gravité mineure

**Exigence affichée aux clients.** Pour une commande de 120 € TTC ou plus, le professionnel conserve l'écrit du contrat pendant 10 ans et en garantit l'accès au consommateur ; les CGV indiquent ces modalités d'archivage.

**Conditions appliquées par le logiciel.** Commande ou paiement en ligne ET Vend ou s'adresse à des particuliers

**S'applique si :**
- Le site permet de conclure un contrat à distance avec des consommateurs.

**Ne s'applique pas si :**
- Vente exclusivement à des professionnels.

**Code de la consommation, art. L213-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. D213-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code civil, art. 1127-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de la consommation, art. L213-1 et D213-1 (seuil de 120 €) ; Code civil, art. 1127-1, 4°

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Étapes de conclusion du contrat électronique

`vente.etapes-contrat` · empreinte `f6bb132db12146d4` · Loi (peut produire « Illégal » une fois validée) · gravité mineure

**Exigence affichée aux clients.** Les différentes étapes à suivre pour conclure le contrat, les moyens de corriger les erreurs de saisie, les langues proposées (dont obligatoirement le français) et les règles professionnelles auxquelles le vendeur se soumet ; les conditions contractuelles sont mises à disposition d'une manière qui permet de les conserver et de les reproduire.

**Conditions appliquées par le logiciel.** Commande ou paiement en ligne

**S'applique si :**
- Tout contrat conclu par voie électronique.

**Ne s'applique pas si :**
- Contrats entre professionnels qui en ont convenu autrement (C. civ. art. 1127-3).

**Doutes à trancher :**
- L'exception entre professionnels n'est pas prise en compte par la condition actuelle (« vente en ligne ») : à ajouter.

**Code civil, art. 1127-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code civil, art. 1127-3** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code civil, art. 1127-1

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Absence de clauses abusives

`vente.clauses-abusives` · empreinte `844be7463ff5dd4b` · Zone de flou · gravité majeure

**Exigence affichée aux clients.** Les conditions ne contiennent pas de clauses abusives (liste noire et liste grise), par exemple exclure toute responsabilité du vendeur, imposer une juridiction éloignée au consommateur ou se réserver de modifier unilatéralement le prix.

**Nuance affichée.** Hors des clauses listées par décret (art. R212-1 et R212-2), le caractère abusif d'une clause est apprécié par le juge au cas par cas.

**Sanction affichée.** Clause réputée non écrite ; pour les clauses de la liste noire (art. R212-1), amende administrative jusqu'à 15 000 € pour une personne physique et 75 000 € pour une personne morale (art. L241-2).

**Conditions appliquées par le logiciel.** Vend ou s'adresse à des particuliers ET au moins un de : (Commande ou paiement en ligne) ; (Comptes utilisateurs)

**S'applique si :**
- Contrats proposés aux consommateurs et non-professionnels.

**Ne s'applique pas si :**
- Vente exclusivement à des professionnels. (le droit commun des contrats s'applique alors : C. civ. 1171, C. com. L442-1).

**Code de la consommation, art. L212-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. R212-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. R212-2** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de la consommation, art. L212-1, R212-1 et R212-2

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### CGV entre professionnels : délais et pénalités de retard

`vente.b2b-penalites` · empreinte `f2c60b3d58f94a0b` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Pour une clientèle professionnelle : conditions de règlement, délais de paiement (60 jours ou 45 jours fin de mois au plus), taux des pénalités de retard et indemnité forfaitaire de 40 € pour frais de recouvrement.

**Sanction affichée.** Amende administrative jusqu'à 75 000 € (personne physique) ou 2 M€ (personne morale) pour les délais de paiement et l'absence des mentions sur les pénalités (C. com. art. L441-16).

**Conditions appliquées par le logiciel.** S'adresse à des professionnels ET Commande ou paiement en ligne

**S'applique si :**
- Ventes entre professionnels.

**Ne s'applique pas si :**
- Ventes aux seuls consommateurs.

**Code de commerce, art. L441-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de commerce, art. L441-10** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de commerce, art. D441-5** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de commerce, art. L441-1 et D441-5 ; Code de commerce, art. L441-10

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Information sur la reconduction des abonnements

`vente.abonnement-reconduction` · empreinte `59e40a9b81d9f472` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Pour un contrat de prestation de services à reconduction tacite, le consommateur est informé par lettre nominative ou courrier électronique dédiés, 1 à 3 mois avant le terme, de sa faculté de ne pas reconduire, avec un encadré apparent indiquant la date limite ; à défaut, il peut résilier gratuitement à tout moment après la reconduction. Les conditions de résiliation figurent dans les conditions générales.

**Conditions appliquées par le logiciel.** Abonnements ou reconduction tacite ET Vend ou s'adresse à des particuliers

**S'applique si :**
- Contrats de prestation de services à reconduction tacite conclus avec des consommateurs.

**Ne s'applique pas si :**
- Vente exclusivement à des professionnels.

**Doutes à trancher :**
- L'obligation porte sur un courrier à envoyer avant l'échéance, invisible depuis le site : seule la description dans les conditions peut être vérifiée.

**Code de la consommation, art. L215-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. L215-4** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de la consommation, art. L215-1 à L215-4

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Résiliation en ligne « en trois clics »

`vente.resiliation-3-clics` · empreinte `37e4792875061cfc` · Loi (peut produire « Illégal » une fois validée) · gravité critique · applicable depuis le 2023-06-01

**Exigence affichée aux clients.** Quand un contrat peut être conclu par voie électronique, il doit pouvoir être résilié de la même façon via une fonctionnalité gratuite, directement et facilement accessible (mention « résilier votre contrat »), avec confirmation de la résiliation sur support durable.

**Sanction affichée.** Amende administrative jusqu'à 15 000 € pour une personne physique et 75 000 € pour une personne morale (art. L241-3-1).

**Conditions appliquées par le logiciel.** Abonnements ou reconduction tacite ET Vend ou s'adresse à des particuliers

**S'applique si :**
- Contrats conclus par voie électronique avec des consommateurs ou non-professionnels, qui peuvent être résiliés.

**Ne s'applique pas si :**
- Vente exclusivement à des professionnels.

**Code de la consommation, art. L215-1-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. D215-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de la consommation, art. L215-1-1 ; Code de la consommation, art. D215-1 à D215-3 (mention « résilier votre contrat », pas de création de compte imposée)

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Contenus et services numériques

`vente.contenus-numeriques` · empreinte `5eb5c2db130a0c40` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Information sur la fonctionnalité, la compatibilité et l'interopérabilité, les mises à jour fournies et la garantie légale de conformité des contenus et services numériques ; si l'exécution commence avant la fin du délai, accord exprès et renoncement au droit de rétractation.

**Conditions appliquées par le logiciel.** Contenus ou services numériques ET Vend ou s'adresse à des particuliers

**S'applique si :**
- Le site permet de conclure un contrat à distance avec des consommateurs. Contenus ou services numériques.

**Ne s'applique pas si :**
- Vente exclusivement à des professionnels.

**Code de la consommation, art. L111-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. L221-28** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. L224-25-12** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de la consommation, art. L111-1, 1° ; Code de la consommation, art. L221-28 13° et L224-25-12 et s.

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Logiciel en ligne (SaaS) : droit de changer de fournisseur

`vente.changement-fournisseur` · empreinte `7528b5f97424560e` · Zone de flou · gravité majeure · applicable depuis le 2025-09-12

**Exigence affichée aux clients.** Depuis le 12 septembre 2025, le fournisseur d'un service de traitement de données (cloud, SaaS) prévoit dans un contrat écrit le droit du client de changer de fournisseur ou de passer sur ses propres serveurs : préavis de deux mois au plus, période de transition de 30 jours en principe, export de toutes les données exportables dans un format structuré et couramment utilisé, effacement après la transition, information sur les frais de changement. Ces frais doivent être réduits aux coûts réels, puis supprimés à partir du 12 janvier 2027.

**Nuance affichée.** Tout logiciel en ligne n'est pas un « service de traitement de données » au sens du Data Act : cela dépend du service. S'applique aux clients professionnels comme aux particuliers. Les services en grande partie développés sur mesure pour un client, ou fournis en version d'essai, bénéficient d'allègements (art. 31).

**Conditions appliquées par le logiciel.** type de site : Logiciel / application en ligne

**S'applique si :**
- Fournisseurs de services de traitement de données (informatique en nuage, y compris certains logiciels en ligne).

**Ne s'applique pas si :**
- Services sur mesure non commercialisés à grande échelle, et certaines dérogations de l'article 31.

**Doutes à trancher :**
- Passée en zone de flou le 14 octobre 2026 : tout logiciel en ligne n'est pas un « service de traitement de données » au sens du Data Act. À confirmer, avec les critères de qualification.

**Data Act, art. 23** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32023R2854#art_23)

> Article 23
> Suppression des obstacles à un changement de fournisseur effectif
> Les fournisseurs de services de traitement de données prennent les mesures prévues aux articles 25, 26, 27, 29 et 30 afin de permettre aux clients de changer de fournisseur pour passer à un service de traitement de données, couvrant le même type de service, qui est fourni par un fournisseur de services de traitement de données différent, ou passer à une infrastructure TIC sur site, ou, le cas échéant, recourir simultanément à plusieurs fournisseurs de services de traitement de données. En particulier, les fournisseurs de services de traitement de données n'imposent pas d'obstacles et suppriment les obstacles précommerciaux, commerciaux, techniques, contractuels et organisationnels, qui freinent les clients dans les démarches suivantes:
> a) la résiliation, après le préavis maximal et l'achèvement avec succès du processus de changement de fournisseur, conformément à l'article 25, du contrat portant sur le service de traitement de données;
> b) la conclusion de nouveaux contrats avec un fournisseur de services de traitement de données différent couvrant le même type de service;
> c) le portage des données exportables et des actifs numériques du client vers un fournisseur de services de traitement de données différent ou vers une infrastructure TIC sur site, y compris après avoir bénéficié d'une offre gratuite;
> d) conformément à l'article 24, la réalisation de l'équivalence fonctionnelle lors de l'utilisation du nouveau service de traitement de données dans l'environnement TIC d'un fournisseur de services de traitement de données différent couvrant le même type de service;
> e) le découplage, lorsqu'il est techniquement possible, des services de traitement de données visés à l'article 30, paragraphe 1, des autres services de traitement de données fournis par le fournisseur de services de traitement de données.

**Data Act, art. 31** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32023R2854#art_31)

> Article 31
> Régime spécifique applicable à certains services de traitement de données
> 1.   Les obligations prévues à l'article 23, point d), à l'article 29 et à l'article 30, paragraphes 1 et 3, ne s'appliquent pas aux services de traitement de données dont la majorité des caractéristiques principales ont été conçues sur mesure pour répondre aux besoins spécifiques d'un client particulier ou dont tous les composants ont été développés pour les besoins d'un client particulier, et lorsque ces services de traitement de données ne sont pas proposés à grande échelle sur le plan commercial par l'intermédiaire du catalogue de services du fournisseur de services de traitement de données.
> 2.   Les obligations prévues dans le présent chapitre ne s'appliquent pas aux services de traitement de données fournis en tant que version non destinée à la production à des fins d'essai et d'évaluation et pour une durée limitée.
> 3.   Avant la conclusion d'un contrat pour la fourniture de services de traitement de données visés au présent article, le fournisseur de services de traitement de données informe le client potentiel des obligations énoncées au présent chapitre qui ne s'appliquent pas.
> CHAPITRE VII
> ACCES INTERNATIONAL ILLICITE AUX DONNEES A CARACTERE NON PERSONNEL ET TRANSFERT INTERNATIONAL ILLICITE DE CES DONNEES PAR LES AUTORITES PUBLIQUES

**Sources affichées.** Règlement (UE) 2023/2854 « Data Act », art. 23 à 31

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

## Prix et promotions

### Pas de frais supplémentaires selon le moyen de paiement

`vente.paiement-surcout` · empreinte `82910487f2a2069f` · Loi (peut produire « Illégal » une fois validée) · gravité mineure

**Exigence affichée aux clients.** Aucun surcoût ne peut être appliqué au consommateur pour l'utilisation d'une carte de paiement grand public ou d'un virement ou prélèvement SEPA.

**Conditions appliquées par le logiciel.** Commande ou paiement en ligne ET Vend ou s'adresse à des particuliers

**S'applique si :**
- Le site permet de conclure un contrat à distance avec des consommateurs.

**Ne s'applique pas si :**
- Vente exclusivement à des professionnels.

**Code monétaire et financier, art. L112-12** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code monétaire et financier, art. L112-12

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Prix affichés TTC, frais en sus indiqués

`prix.ttc` · empreinte `0d722d984e715a2b` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Les prix proposés aux consommateurs sont indiqués toutes taxes comprises, en euros, avec les frais de livraison ou leur mode de calcul ; prix à l'unité de mesure pour les produits concernés.

**Sanction affichée.** Amende administrative jusqu'à 3 000 € pour une personne physique et 15 000 € pour une personne morale (C. conso art. L131-5).

**Conditions appliquées par le logiciel.** Commande ou paiement en ligne ET Vend ou s'adresse à des particuliers

**S'applique si :**
- Prix proposés aux consommateurs.

**Ne s'applique pas si :**
- Vente exclusivement à des professionnels. (prix hors taxes admis).

**Code de la consommation, art. L112-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de la consommation, art. L112-1 ; Arrêté du 3 décembre 1987 relatif à l'information du consommateur sur les prix

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Prix de référence des réductions

`prix.reductions` · empreinte `87a4d191e6db4cc4` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Toute annonce de réduction de prix indique le prix antérieur pratiqué, à savoir le prix le plus bas pratiqué envers tous les consommateurs au cours des 30 derniers jours précédant la réduction (en cas de réductions successives, le prix d'avant la première réduction).

**Nuance affichée.** Vigie relève les prix barrés affichés, mais ne connaît pas l'historique des prix : seul le vendeur peut vérifier le prix des 30 derniers jours.

**Sanction affichée.** Le code ne prévoit pas d'amende administrative propre à l'art. L112-1-1 ; un prix de référence fictif est poursuivi comme pratique commerciale trompeuse : 2 ans d'emprisonnement et 300 000 € d'amende, portés à 5 ans et 750 000 € quand elle est commise en ligne (C. conso art. L132-2).

**Conditions appliquées par le logiciel.** Prix barrés ou promotions

**S'applique si :**
- Annonce de réduction de prix à des consommateurs.

**Ne s'applique pas si :**
- Prix barrés qui ne sont pas présentés comme une réduction (ex. prix conseillé clairement présenté comme tel) : à apprécier.

**Code de la consommation, art. L112-1-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de la consommation, art. L112-1-1 ; Directive (UE) 2019/2161 « Omnibus »

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Prix personnalisés par algorithme

`prix.personnalises` · empreinte `a07e68835b9be4c7` · Loi (peut produire « Illégal » une fois validée) · gravité mineure

**Exigence affichée aux clients.** Si le prix est personnalisé sur la base d'une prise de décision automatisée, le consommateur en est informé.

**Conditions appliquées par le logiciel.** Commande ou paiement en ligne ET Vend ou s'adresse à des particuliers ET Publicité, affiliation ou contenus sponsorisés

**S'applique si :**
- Prix personnalisé par décision automatisée.

**Ne s'applique pas si :**
- Prix identique pour tous.

**Doutes à trancher :**
- Invisible depuis le site ; la condition « publicité » ne prouve pas une personnalisation des prix.

**Code de la consommation, art. L221-5** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de la consommation, art. L221-5, I, 11° ; Directive (UE) 2019/2161

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

## Accessibilité

### Informations d'accessibilité du service dans les conditions générales

`vente.accessibilite-cgv` · empreinte `69881880fb28def9` · Loi (peut produire « Illégal » une fois validée) · gravité majeure · applicable depuis le 2025-06-28

**Exigence affichée aux clients.** Les services de commerce électronique couverts par l'European Accessibility Act indiquent dans leurs conditions générales, ou un document équivalent, comment le service satisfait aux exigences d'accessibilité.

**Conditions appliquées par le logiciel.** Commande ou paiement en ligne ET Vend ou s'adresse à des particuliers ET NON : Moins de 10 salariés et CA ≤ 2 M€

**S'applique si :**
- Services de commerce électronique vers les consommateurs, depuis le 28 juin 2025.

**Ne s'applique pas si :**
- Microentreprises (moins de 10 salariés et 2 M€ de chiffre d'affaires ou de bilan).

**Doutes à trancher :**
- Confirmer l'article de transposition française (loi n° 2005-102 et décret n° 2023-931) qui reprend l'annexe V.

**Directive (UE) 2019/882, art. 13** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32019L0882#art_13)

> Article 13
> Obligations des prestataires de services
> 1.   Les prestataires de services veillent à concevoir et à fournir des services conformément aux exigences en matière d’accessibilité énoncées dans la présente directive.
> 2.   Les prestataires de services établissent les informations nécessaires conformément à l’annexe V, et expliquent comment les services satisfont aux exigences applicables en matière d’accessibilité. Les informations sont mises à la disposition du public sous forme écrite et orale, y compris d’une façon qui est accessible aux personnes handicapées. Les prestataires de services conservent ces informations aussi longtemps que le service est disponible.
> 3.   Sans préjudice de l’article 32, les prestataires de services veillent à ce que des procédures soient en place afin que la fourniture des services reste conforme aux exigences applicables en matière d’accessibilité. Toute modification des caractéristiques de la fourniture du service, des exigences applicables en matière d’accessibilité et des normes harmonisées ou des spécifications techniques par rapport auxquelles est déclarée la conformité d’un service aux exigences en matière d’accessibilité, est dûment prise en considération par les prestataires de services.
> 4.   En cas de non-conformité du service, les prestataires prennent les mesures correctives nécessaires pour le mettre en conformité avec les exigences applicables en matière d’accessibilité. En outre, lorsque le service n’est pas conforme aux exigences applicables en matière d’accessibilité, les prestataires de services en informent immédiatement les autorités nationales compétentes des États membres dans lesquels ils fournissent le service, en fournissant des précisions, notamment, sur la non-conformité et sur toute mesure corrective prise.
> 5.   Sur demande motivée d’une autorité compétente, les prestataires de services lui communiquent toutes les informations nécessaires pour démontrer la conformité du service avec les exigences applicables en matière d’accessibilité. Ils coopèrent avec cette autorité, à la demande de celle-ci, à toute mesure prise en vue de rendre le service conforme à ces exigences.
> CHAPITRE V
> Modification fondamentale des produits ou services et charge disproportionnée pour les opérateurs économiques

**Sources affichées.** Directive (UE) 2019/882, annexe V ; Loi n° 2005-102 modifiée par l'ordonnance n° 2023-859, art. 47

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Mention « Accessibilité : non / partiellement / totalement conforme »

`a11y.mention` · empreinte `ba6ed5709715865c` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Les organismes publics et les entreprises dont le chiffre d'affaires dépasse le seuil fixé par décret (250 M€) affichent sur leur page d'accueil leur état de conformité, renvoient à une déclaration d'accessibilité et publient un schéma pluriannuel.

**Nuance affichée.** Cette mention ne concerne pas les autres entreprises : pour elles, l'European Accessibility Act impose l'accessibilité du service et une information dans les conditions générales, pas cette mention.

**Conditions appliquées par le logiciel.** au moins un de : (éditeur : Organisme public) ; (Chiffre d'affaires ≥ 250 M€)

**S'applique si :**
- Organismes publics et entreprises au-delà du seuil de chiffre d'affaires fixé par décret.

**Ne s'applique pas si :**
- Autres entreprises.

**Doutes à trancher :**
- Vérifier que l'article 47 consolidé (après l'ordonnance n° 2023-859) maintient cette mention et ce seuil pour les entreprises privées.

**Loi n° 2005-102, art. 47** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Loi n° 2005-102, art. 47 ; Décret n° 2019-768, art. 3 à 5 ; Référentiel RGAA

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Conformité aux exigences d'accessibilité (RGAA / EN 301 549)

`a11y.conformite` · empreinte `92344ea367aa8efd` · Loi (peut produire « Illégal » une fois validée) · gravité majeure · applicable depuis le 2025-06-28

**Exigence affichée aux clients.** Depuis le 28 juin 2025, les services de commerce électronique et les services numériques des entreprises qui ne sont pas des microentreprises doivent être accessibles aux personnes handicapées (European Accessibility Act).

**Nuance affichée.** Les microentreprises (moins de 10 salariés et 2 M€ de chiffre d'affaires ou de bilan) qui fournissent des services en sont dispensées. Vigie lance les tests automatiques d'axe-core (WCAG 2.1 A et AA, socle de la norme EN 301 549) sur la page d'accueil : ils détectent des erreurs certaines, mais ne couvrent qu'une partie des critères.

**Conditions appliquées par le logiciel.** au moins un de : (éditeur : Organisme public) ; (Chiffre d'affaires ≥ 250 M€) ; (Commande ou paiement en ligne ET Vend ou s'adresse à des particuliers ET NON : Moins de 10 salariés et CA ≤ 2 M€)

**S'applique si :**
- Services de commerce électronique et services numériques couverts, depuis le 28 juin 2025 ; organismes publics.

**Ne s'applique pas si :**
- Microentreprises qui fournissent des services.

**Doutes à trancher :**
- La taille de l'entreprise est déduite (répertoire Sirene) ou supposée : sans Sirene, le constat ne doit pas être présenté comme certain.

**Directive (UE) 2019/882, art. 4** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32019L0882#art_4)

> Article 4
> Exigences en matière d’accessibilité
> 1.   Les États membres veillent, conformément aux paragraphes 2, 3 et 5 du présent article, et sous réserve de l’article 14, à ce que les opérateurs économiques ne mettent sur le marché que les produits, et ne fournissent que les services, qui sont conformes aux exigences en matière d’accessibilité prévues à l’annexe I.
> 2.   Tous les produits, sont conformes aux exigences en matière d’accessibilité prévues à l’annexe I, section I.
> Tous les produits, à l’exception des terminaux en libre-service, sont conformes aux exigences en matière d’accessibilité prévues à l’annexe I, section II.
> 3.   Sans préjudice du paragraphe 5, à l’exception des services de transport urbains et suburbains et des services de transport régionaux, tous les services, sont conformes aux exigences en matière d’accessibilité prévues à l’annexe I, section III.
> Sans préjudice du paragraphe 5, tous les services, sont conformes aux exigences en matière d’accessibilité prévues à l’annexe I, section IV.
> 4.   Les États membres peuvent décider, compte tenu des circonstances nationales, que l’environnement bâti utilisé par les clients de services relevant de la présente directive doive être conforme aux exigences en matière d’accessibilité prévues à l’annexe III, de manière à garantir une utilisation optimale par les personnes handicapées.
> 5.   Les microentreprises qui proposent des services sont exonérées de l’obligation de se conformer aux exigences en matière d’accessibilité visées au paragraphe 3 du présent article et de toutes obligations relatives à la conformité avec ces exigences.
> 6.   Les États membres fournissent des lignes directrices et des outils aux microentreprises pour faciliter l’application des mesures nationales transposant la présente directive. Les États membres élaborent ces outils en consultation avec les parties prenantes concernées.
> 7.   Les États membres peuvent fournir aux opérateurs économiques les exemples indicatifs, figurant à l’annexe II, de solutions possibles pour contribuer au respect des exigences en matière d’accessibilité énoncées à l’annexe I.
> 8.   Les États membres veillent à ce que la réception des communications d’urgence dirigées vers le numéro d’urgence unique européen «112», par le PSAP le plus approprié, soit conforme aux exigences spécifiques en matière d’accessibilité prévues à l’annexe I, section V, de la façon la mieux adaptée à l’organisation nationale des systèmes d’urgence.
> 9.   La Commission est habilitée à adopter des actes délégués conformément à l’article 26 pour compléter l’annexe I en précisant davantage les exigences en matière d’accessibilité qui, de façon intrinsèque, ne peuvent produire leurs effets escomptés à moins de faire l’objet de précisions complémentaires dans des actes juridiques contraignants de l’Union, telles que les exigences relatives à l’interopérabilité.

**Loi n° 2005-102, art. 47** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Directive (UE) 2019/882 « EAA » ; Loi n° 2005-102, modifiée par l'ordonnance n° 2023-859 du 6 septembre 2023

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

## Plateformes et contenus

### Conditions générales d'utilisation

`plat.cgu` · empreinte `3591701fd7183ce4` · Loi (peut produire « Illégal » une fois validée) · gravité majeure · applicable depuis le 2024-02-17

**Exigence affichée aux clients.** Pour un service qui héberge des contenus fournis par ses utilisateurs (avis, annonces, messages, fichiers) ou met en relation : des CGU claires qui fixent les règles d'usage, les restrictions imposées aux contenus et la procédure de modération (y compris les outils automatisés et le traitement des réclamations).

**Conditions appliquées par le logiciel.** au moins un de : (Contenus publiés par les utilisateurs) ; (type de site : Logiciel / application en ligne ou Place de marché ou Communauté / contenus d'utilisateurs)

**S'applique si :**
- Services intermédiaires, dont l'hébergement de contenus fournis par les utilisateurs.

**Ne s'applique pas si :**
- Site qui n'héberge aucun contenu fourni par ses utilisateurs.

**Doutes à trancher :**
- Un SaaS qui stocke des données de ses clients est un « service d'hébergement » au sens du DSA : à confirmer selon le service.

**DSA, art. 14** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32022R2065#art_14)

> Article 14
> Conditions générales
> 1.   Les fournisseurs de services intermédiaires incluent dans leurs conditions générales des renseignements relatifs aux éventuelles restrictions qu’ils imposent en ce qui concerne l’utilisation de leur service vis-à-vis des informations fournies par les destinataires du service. Ces renseignements comprennent des informations sur les politiques, procédures, mesures et outils utilisés à des fins de modération des contenus, y compris la prise de décision fondée sur des algorithmes et le réexamen par un être humain, ainsi que sur le règlement intérieur de leur système interne de traitement des réclamations. Ils sont énoncés dans un langage clair, simple, intelligible, aisément abordable et dépourvu d’ambiguïté, et sont mis à la disposition du public dans un format facilement accessible et lisible par une machine.
> 2.   Les fournisseurs de services intermédiaires informent les destinataires du service de toute modification importante des conditions générales.
> 3.   Lorsqu’un service intermédiaire s’adresse principalement à des mineurs ou est utilisé de manière prédominante par des mineurs, le fournisseur de ce service intermédiaire explique les conditions et les éventuelles restrictions relatives à l’utilisation du service d’une manière compréhensible pour les mineurs.
> 4.   Lorsqu’ils appliquent et font respecter les restrictions visées au paragraphe 1, les fournisseurs de services intermédiaires agissent de manière diligente, objective et proportionnée en tenant dûment compte des droits et des intérêts légitimes de toutes les parties impliquées, et notamment des droits fondamentaux des destinataires du service, tels que la liberté d’expression, la liberté et le pluralisme des médias et d’autres libertés et droits fondamentaux tels qu’ils sont consacrés dans la Charte.
> 5.   Les fournisseurs de très grandes plateformes en ligne et de très grands moteurs de recherche en ligne fournissent aux destinataires des services un résumé des conditions générales, y compris des mécanismes de recours et de réparation disponibles, concis, facilement accessible et lisible par une machine, dans un langage clair et dépourvu d’ambiguïté.
> 6.   Les très grandes plateformes en ligne et les très grands moteurs de recherche en ligne au sens de l’article 33 publient leurs conditions générales dans les langues officielles de tous les États membres dans lesquels ils proposent leurs services.

**Sources affichées.** Règlement (UE) 2022/2065 « DSA », art. 14 ; Code civil, art. 1119

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Point de contact unique pour les utilisateurs et les autorités

`plat.point-contact` · empreinte `c9893c166c54ea48` · Loi (peut produire « Illégal » une fois validée) · gravité majeure · applicable depuis le 2024-02-17

**Exigence affichée aux clients.** Les fournisseurs de services intermédiaires (hébergement de contenus de tiers inclus) publient un point de contact électronique, facilement accessible, et les langues utilisables.

**Conditions appliquées par le logiciel.** Contenus publiés par les utilisateurs

**S'applique si :**
- Tout fournisseur de services intermédiaires.

**DSA, art. 11** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32022R2065#art_11)

> Article 11
> Points de contact pour les autorités des États membres, la Commission et le comité
> 1.   Les fournisseurs de services intermédiaires désignent un point de contact unique pour leur permettre de communiquer directement, par voie électronique, avec les autorités des États membres, la Commission et le comité visé à l’article 61 en vue de l’application du présent règlement.
> 2.   Les fournisseurs de services intermédiaires rendent publiques les informations nécessaires pour faciliter l’identification de leurs points de contact uniques et la communication avec ces derniers. Ces informations sont aisément accessibles et sont tenues à jour.
> 3.   Les fournisseurs de services intermédiaires précisent, dans les informations visées au paragraphe 2, la ou les langues officielles des États membres qui, en plus d’une langue largement comprise par le plus grand nombre possible de citoyens de l’Union, peuvent être utilisées pour communiquer avec leurs points de contact, et qui comprennent au minimum une des langues officielles de l’État membre dans lequel le fournisseur de services intermédiaires a son établissement principal ou dans lequel son représentant légal réside ou est établi.

**DSA, art. 12** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32022R2065#art_12)

> Article 12
> Points de contact pour les destinataires du service
> 1.   Les fournisseurs de services intermédiaires désignent un point de contact unique pour permettre aux destinataires du service de communiquer directement et rapidement avec eux, par voie électronique et de manière conviviale, y compris en permettant aux destinataires du service de choisir les moyens de communication, lesquels ne s’appuient pas uniquement sur des outils automatisés.
> 2.   Outre les obligations prévues dans la directive 2000/31/CE, les fournisseurs de services intermédiaires rendent publiques les informations nécessaires pour que les destinataires du service puissent facilement identifier leurs points de contact uniques et communiquer avec eux. Ces informations sont aisément accessibles et sont tenues à jour.

**Sources affichées.** DSA, art. 11 et 12

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Mécanisme de signalement des contenus illicites

`plat.signalement` · empreinte `40b75ce1215ccc40` · Loi (peut produire « Illégal » une fois validée) · gravité majeure · applicable depuis le 2024-02-17

**Exigence affichée aux clients.** Un dispositif facile d'accès permettant à toute personne de signaler un contenu illicite, avec accusé de réception, décision motivée et information des personnes concernées.

**Conditions appliquées par le logiciel.** Contenus publiés par les utilisateurs

**S'applique si :**
- Services d'hébergement de contenus de tiers, quelle que soit leur taille.

**DSA, art. 16** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32022R2065#art_16)

> Article 16
> Mécanismes de notification et d’action
> 1.   Les fournisseurs de services d’hébergement mettent en place des mécanismes permettant à tout particulier ou à toute entité de leur signaler la présence au sein de leur service d’éléments d’information spécifiques que le particulier ou l’entité considère comme du contenu illicite. Ces mécanismes sont faciles d’accès et d’utilisation et permettent la soumission de notifications exclusivement par voie électronique.
> 2.   Les mécanismes prévus au paragraphe 1 sont de nature à faciliter la soumission de notifications suffisamment précises et dûment étayées. À cette fin, les fournisseurs de services d’hébergement prennent les mesures nécessaires pour permettre et faciliter la soumission de notifications contenant l’ensemble des éléments suivants:
> a) une explication suffisamment étayée des raisons pour lesquelles le particulier ou l’entité allègue que les informations en question sont du contenu illicite;
> b) une indication claire de l’emplacement électronique exact de ces informations, comme l’URL ou les URL exact(s), et, le cas échéant, des informations complémentaires permettant d’identifier le contenu illicite en fonction du type de contenu et du type spécifique de service d’hébergement;
> c) le nom et l’adresse de courrier électronique du particulier ou de l’entité soumettant la notification, sauf dans le cas d’informations considérées comme impliquant une des infractions visées aux articles 3 à 7 de la directive 2011/93/UE;
> d) une déclaration confirmant que le particulier ou l’entité soumettant la notification pense, de bonne foi, que les informations et les allégations qu’elle contient sont exactes et complètes.
> 3.   Les notifications visées au présent article sont réputées donner lieu à la connaissance ou à la prise de conscience effective aux fins de l’article 6 de l’élément d’information spécifique concerné lorsqu’elles permettent à un fournisseur diligent de services d’hébergement d’identifier l’illégalité de l’activité ou de l’information concernée sans examen juridique détaillé.
> 4.   Lorsque la notification contient les coordonnées électroniques du particulier ou de l’entité qui l’a soumise, le fournisseur de services d’hébergement envoie, dans les meilleurs délais, un accusé de réception de la notification à ce particulier ou cette entité.
> 5.   Le fournisseur notifie également, dans les meilleurs délais, à ce particulier ou cette entité sa décision concernant les informations auxquelles la notification se rapporte, tout en fournissant des informations sur les possibilités de recours à l’égard de cette décision.
> 6.   Les fournisseurs de services d’hébergement traitent les notifications qu’ils reçoivent au titre des mécanismes prévus au paragraphe 1 et prennent leurs décisions concernant les informations auxquelles les notifications se rapportent en temps opportun, de manière diligente, non arbitraire et objective. Lorsqu’ils font appel à des moyens automatisés aux fins de ce traitement ou d
> […]

**DSA, art. 17** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32022R2065#art_17)

> Article 17
> Exposé des motifs
> 1.   Les fournisseurs de services d’hébergement fournissent à tous les destinataires du service affectés un exposé des motifs clair et spécifique pour l’une ou l’autre des restrictions suivantes imposées au motif que les informations fournies par le destinataire du service constituent un contenu illicite ou sont incompatibles avec leurs conditions générales:
> a) toute restriction de la visibilité d’éléments d’information spécifiques fournis par le destinataire du service, y compris le retrait de contenus, le fait de rendre l’accès à des contenus impossible ou le déclassement de contenus;
> b) la suspension, la fin ou autre restriction des paiements monétaires;
> c) la suspension ou la fin, en tout ou en partie, de la fourniture du service;
> d) la suspension ou la suppression du compte du destinataire du service.
> 2.   Le paragraphe 1 s’applique uniquement lorsque les coordonnées électroniques pertinentes sont connues du fournisseur. Il s’applique au plus tard à compter de la date à laquelle la restriction est imposée, indépendamment de la raison pour laquelle ou de la manière dont elle a été imposée.
> Le paragraphe 1 ne s’applique pas lorsque les informations constituent un contenu commercial trompeur et de grande diffusion.
> 3.   L’exposé des motifs visé au paragraphe 1 comprend au minimum les informations suivantes:
> a) des informations indiquant si la décision implique soit de retirer des informations, de rendre l’accès à celles-ci impossible, de les déclasser, ou de restreindre leur visibilité, soit de suspendre ou de mettre fin aux paiements monétaires liés à ces informations, ou impose d’autres mesures visées au paragraphe 1 en ce qui concerne lesdites informations, et, le cas échéant, le champ d’application territorial de la décision et sa durée;
> b) les faits et circonstances sur base desquels la décision a été prise, y compris, le cas échéant, des informations indiquant si la décision a été prise en vertu d’une notification soumise conformément à l’article 16 ou sur la base d’enquêtes d’initiative volontaires et, lorsque cela est strictement nécessaire, l’identité de la personne à l’origine de la notification;
> c) le cas échéant, des informations relatives à l’utilisation de moyens automatisés pour prendre la décision, y compris des informations indiquant si la décision a été prise à l’égard de contenus détectés ou identifiés par des moyens automatisés;
> d) lorsque la décision concerne des contenus présumés illicites, une référence au fondement juridique sous-jacent et des explications quant aux raisons pour lesquelles ces informations sont considérées comme des contenus illicites sur ce fondement;
> e) lorsque la décision se fonde sur l’incompatibilité alléguée des informations avec les conditions générales du fournisseur de services d’hébergement, une référence aux clauses contractuelles sous-jacentes et des explications quant aux raisons pour lesquelles ces informations sont considérées comme incompatibles avec ces claus
> […]

**Sources affichées.** DSA, art. 16 et 17 ; LCEN, art. 6

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Transparence des plateformes en ligne

`plat.classement` · empreinte `351d9b2d2a2e3dd0` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Les plateformes de mise en relation indiquent les critères de classement des offres, l'existence d'une relation capitalistique ou d'une rémunération influant sur le classement, la qualité du vendeur (professionnel ou particulier) et les droits qui en découlent.

**Conditions appliquées par le logiciel.** type de site : Place de marché

**S'applique si :**
- Plateformes de mise en relation et places de marché.

**Ne s'applique pas si :**
- Micro et petites entreprises pour les articles 27 et 30 du DSA (art. 19).

**Doutes à trancher :**
- La règle mélange des obligations dont le champ diffère (Code de la consommation, P2B, DSA) : à séparer pour que chaque constat vise la bonne source.

**Code de la consommation, art. L111-7** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Règlement P2B, art. 5** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32019R1150#art_5)

> Article 5
> Classement
> 1.   Les fournisseurs de services d’intermédiation en ligne indiquent dans leurs conditions générales les principaux paramètres déterminant le classement, et les raisons justifiant l’importance relative de ces principaux paramètres par rapport aux autres paramètres.
> 2.   Les fournisseurs de moteurs de recherche en ligne indiquent les principaux paramètres qui, individuellement ou collectivement, sont les plus importants pour déterminer le classement ainsi que l’importance relative de ces principaux paramètres, en fournissant une description facilement et publiquement accessible, énoncée dans une formulation claire et compréhensible, sur les moteurs de recherche en ligne de ces fournisseurs. Ils tiennent cette description à jour.
> 3.   Lorsque les principaux paramètres incluent la possibilité d’influer sur le classement contre toute rémunération directe ou indirecte versée par les entreprises utilisatrices ou les utilisateurs de sites internet d’entreprise au fournisseur concerné, ce fournisseur présente également une description de ces possibilités et des effets de cette rémunération sur le classement, conformément aux exigences énoncées aux paragraphes 1 et 2.
> 4.   Lorsqu’un fournisseur de moteur de recherche en ligne a modifié l’ordre de classement dans un cas particulier ou qu’il a déréférencé un site internet particulier à la suite d’un signalement émanant d’un tiers, le fournisseur offre à l’utilisateur de site internet d’entreprise la possibilité de consulter le contenu de cette notification.
> 5.   Les descriptions visées aux paragraphes 1, 2 et 3 sont suffisantes pour que les entreprises utilisatrices ou les utilisateurs de sites internet d’entreprise puissent acquérir une compréhension suffisante pour déterminer si, et dans l’affirmative, comment et dans quelle mesure, le mécanisme de classement tient compte des éléments suivants:
> a) les caractéristiques des biens et services proposés aux consommateurs par le biais des services d’intermédiation en ligne ou des moteurs de recherche en ligne;
> b) la pertinence de ces caractéristiques pour ces consommateurs;
> c) en ce qui concerne les moteurs de recherche en ligne, les caractéristiques de conception du site internet utilisé par les utilisateurs de sites internet d’entreprise.
> 6.   Les fournisseurs de services d’intermédiation en ligne et les fournisseurs de moteurs de recherche en ligne ne sont pas tenus, lorsqu’ils satisfont aux exigences du présent article, de divulguer les algorithmes ou les informations dont on peut être raisonnablement certain qu’ils auraient pour effet de permettre de tromper les consommateurs ou de leur porter préjudice par la manipulation des résultats de recherche. Le présent article est sans préjudice de la directive (UE) 2016/943.
> 7.   Afin d’aider les fournisseurs de services d’intermédiation en ligne et les fournisseurs de moteurs de recherche en ligne à respecter les exigences du présent article et de faciliter leur application, la Commission j
> […]

**DSA, art. 27** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32022R2065#art_27)

> Article 27
> Transparence du système de recommandation
> 1.   Les fournisseurs de plateformes en ligne qui utilisent des systèmes de recommandation établissent dans leurs conditions générales, dans un langage simple et compréhensible, les principaux paramètres utilisés dans leurs systèmes de recommandation, ainsi que les options dont disposent les destinataires du service pour modifier ou influencer ces principaux paramètres.
> 2.   Les principaux paramètres visés au paragraphe 1 expliquent pourquoi certaines informations sont suggérées au destinataire du service. Ils précisent, au minimum:
> a) les critères les plus importants pour déterminer les informations suggérées au destinataire du service;
> b) les raisons de l’importance relative de ces paramètres.
> 3.   Lorsque plusieurs options sont disponibles conformément au paragraphe 1 pour les systèmes de recommandation qui déterminent l’ordre relatif des informations présentées aux destinataires du service, les fournisseurs de plateformes en ligne prévoient également une fonctionnalité permettant aux destinataires du service de sélectionner et de modifier à tout moment leur option favorite. Cette fonctionnalité est directement et aisément accessible dans la rubrique spécifique de l’interface de la plateforme en ligne où les informations sont hiérarchisées.

**DSA, art. 30** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32022R2065#art_30)

> Article 30
> Traçabilité des professionnels
> 1.   Les fournisseurs de plateformes en ligne permettant aux consommateurs de conclure des contrats à distance avec des professionnels veillent à ce que ces derniers puissent uniquement utiliser ces plateformes en ligne pour promouvoir des messages relatifs à des produits ou services ou proposer des produits ou services à des consommateurs situés dans l’Union si, avant l’utilisation de leurs services à ces fins, ils ont obtenu les informations suivantes, lorsque cela s’applique au professionnel:
> a) le nom, l’adresse, le numéro de téléphone et l’adresse de courrier électronique du professionnel;
> b) un exemplaire du document d’identification du professionnel ou toute autre identification électronique telle qu’elle est définie à l’article 3 du règlement (UE) n° 910/2014 du Parlement européen et du Conseil (40);
> c) les coordonnées du compte de paiement du professionnel;
> d) lorsque le professionnel est inscrit à un registre commercial ou un registre public similaire, le registre du commerce auquel le professionnel est inscrit et son numéro d’enregistrement ou un moyen équivalent d’identification dans ce registre;
> e) une autocertification du professionnel par laquelle il s’engage à ne fournir que des produits ou services conformes aux règles applicables du droit de l’Union.
> 2.   Lorsqu’il reçoit les informations visées au paragraphe 1, et avant d’autoriser le professionnel concerné à utiliser ses services, le fournisseur de la plateforme en ligne permettant aux consommateurs de conclure des contrats à distance avec des professionnels déploie tous ses efforts pour évaluer si les informations visées au paragraphe 1, points a) à e), sont fiables et complètes, au moyen de toute base de données ou interface en ligne officielle, libre d’accès, mise à disposition par un État membre ou l’Union, ou en demandant au professionnel de fournir des documents justificatifs provenant de sources fiables. Aux fins du présent règlement, les professionnels sont responsables de l’exactitude des informations fournies.
> Pour ce qui concerne les professionnels qui utilisent déjà les services de fournisseurs de plateformes en ligne permettant aux consommateurs de conclure des contrats à distance avec des professionnels, aux fins visées au paragraphe 1, à la date du 17 février 2024, le fournisseur déploie tous ses efforts pour obtenir du professionnel concerné les informations énumérées dans un délai de douze mois. Lorsque le professionnel concerné ne fournit pas les informations dans ce délai, le fournisseur suspend la fourniture de ses services à ce professionnel jusqu’à ce que celui-ci ait communiqué toutes les informations en question.
> 3.   Lorsque le fournisseur de la plateforme en ligne permettant aux consommateurs de conclure des contrats à distance avec des professionnels dispose de suffisamment d’indices ou a des raisons de penser qu’un élément d’information visé au paragraphe 1 obtenu du professionnel concerné est inexact, incom
> […]

**Sources affichées.** Code de la consommation, art. L111-7 (places de marché et comparateurs) ; Code de la consommation, art. L121-4, 25° (classement payé non signalé) ; Règlement (UE) 2019/1150 « P2B », art. 3 et 5 ; DSA, art. 27 et 30

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Conditions pour les vendeurs professionnels (P2B)

`plat.p2b` · empreinte `639a8371b1e42851` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Conditions générales destinées aux entreprises utilisatrices : motifs de suspension, préavis de 30 jours avant modification, système interne de traitement des plaintes, médiateurs désignés.

**Conditions appliquées par le logiciel.** type de site : Place de marché

**S'applique si :**
- Services d'intermédiation en ligne proposés à des entreprises.

**Ne s'applique pas si :**
- Petites entreprises pour le système interne de plaintes (art. 11.5).

**Règlement P2B, art. 3** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32019R1150#art_3)

> Article 3
> Conditions générales
> 1.   Les fournisseurs de services d’intermédiation en ligne veillent à ce que leurs conditions générales:
> a) soient rédigées de manière claire et compréhensible;
> b) soient facilement accessibles aux entreprises utilisatrices à toutes les étapes de leur relation commerciale avec le fournisseur de services d’intermédiation en ligne, y compris au cours de la phase précontractuelle;
> c) définissent les motifs des décisions de suspension, de résiliation ou d’imposition de toute autre restriction, en tout ou partie, de la fourniture de leurs services d’intermédiation en ligne à des entreprises utilisatrices;
> d) comportent des informations sur tout canal de distribution supplémentaire et tout programme affilié potentiel par l’intermédiaire duquel des fournisseurs de services d’intermédiation en ligne sont susceptibles de commercialiser les biens et services proposés par des entreprises utilisatrices;
> e) comportent des informations générales sur les effets des conditions générales sur la propriété et le contrôle des droits de propriété intellectuelle des entreprises utilisatrices.
> 2.   Les fournisseurs de services d’intermédiation en ligne notifient aux entreprises utilisatrices concernées, sur un support durable, tout changement proposé de leurs conditions générales.
> Les changements proposés ne sont pas appliqués avant l’expiration d’un délai de préavis raisonnable et proportionné à la nature et à l’étendue des changements envisagés et à leurs conséquences pour l’entreprise utilisatrice concernée. Ce délai de préavis ne doit pas être inférieur à quinze jours à compter de la date à laquelle le fournisseur de services d’intermédiation en ligne notifie aux entreprises utilisatrices les changements proposés. Les fournisseurs de services d’intermédiation en ligne accordent un délai de préavis plus long lorsque celui-ci est nécessaire pour permettre aux entreprises utilisatrices d’effectuer les adaptations techniques ou commerciales nécessaires pour se conformer aux changements.
> L’entreprise utilisatrice concernée a le droit de résilier le contrat conclu avec le fournisseur de services d’intermédiation en ligne avant l’expiration du délai de préavis. Cette résiliation prend effet dans les quinze jours suivant la réception du préavis en application du premier alinéa, sauf si un délai plus court s’applique au contrat.
> L’entreprise utilisatrice concernée peut, au moyen d’une déclaration écrite ou d’un acte positif clair, renoncer au délai de préavis visé au deuxième alinéa à tout moment après la réception de la notification en application du premier alinéa.
> Pendant le délai de préavis, l’offre de nouveaux biens ou services aux services d’intermédiation en ligne est considérée comme un acte positif clair de renonciation au délai de préavis, sauf dans les cas où le délai de préavis raisonnable et proportionné est supérieur à quinze jours en raison des changements apportés aux conditions générales, qui imposent à l’entreprise utilisatr
> […]

**Règlement P2B, art. 11** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32019R1150#art_11)

> Article 11
> Système interne de traitement des plaintes
> 1.   Les fournisseurs de services d’intermédiation en ligne mettent à disposition un système interne de traitement des plaintes émanant des entreprises utilisatrices.
> Ce système interne de traitement des plaintes est facilement accessible et gratuit pour les entreprises utilisatrices et garantit un traitement dans un délai raisonnable. Il est fondé sur les principes de transparence et d’égalité de traitement entre situations équivalentes et il traite les plaintes d’une manière proportionnée à leur importance et à leur complexité. Il permet aux entreprises utilisatrices de déposer directement auprès du fournisseur concerné des plaintes portant sur l’un quelconque des aspects suivants:
> a) un manquement présumé de ce fournisseur à toute obligation inscrite dans le présent règlement et qui affecte la capacité de l’entreprise utilisatrice à déposer une plainte (ci-après dénommée «plaignant»);
> b) les questions technologiques directement liées à la fourniture de services d’intermédiation en ligne et qui affectent le plaignant;
> c) les mesures prises par ce fournisseur ou son comportement directement liés à la fourniture de services d’intermédiation en ligne et qui affectent le plaignant.
> 2.   Dans le cadre de leur système interne de traitement des plaintes, les fournisseurs de services d’intermédiation en ligne:
> a) prennent dûment en considération les plaintes déposées et assurent le suivi éventuellement nécessaire afin de résoudre le problème soulevé de manière appropriée;
> b) traitent les plaintes rapidement et efficacement, en tenant compte de l’importance et de la complexité du problème soulevé;
> c) communiquent au plaignant le résultat du processus de traitement interne de sa plainte, de manière personnalisée et dans une formulation claire et compréhensible.
> 3.   Les fournisseurs de services d’intermédiation en ligne fournissent dans leurs conditions générales toutes les informations pertinentes relatives à l’accès à leur système interne de traitement des plaintes et à son fonctionnement.
> 4.   Les fournisseurs de services d’intermédiation en ligne établissent et rendent facilement accessibles au public des informations sur le fonctionnement et l’efficacité de leur système interne de traitement des plaintes. Ils vérifient les informations au moins une fois par an et, lorsque des changements importants sont nécessaires, ils mettent à jour ces informations.
> Ces informations incluent le nombre total de plaintes déposées, les principaux types de plaintes, le délai moyen nécessaire pour traiter les plaintes et des informations agrégées sur le résultat des plaintes.
> 5.   Les dispositions du présent article ne s’appliquent pas aux fournisseurs de services d’intermédiation en ligne qui sont des petites entreprises au sens de l’annexe de la recommandation 2003/361/CE.

**Sources affichées.** Règlement (UE) 2019/1150 « P2B », art. 3, 4, 11 et 12

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Fiabilité des avis en ligne

`plat.avis` · empreinte `62cc5c381570314b` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Le site qui publie des avis indique, à proximité des avis, s'ils font l'objet d'une procédure de contrôle, la date de chaque avis et de l'expérience concernée, et les critères de classement (dont l'ordre chronologique) ; dans une rubrique dédiée, l'existence ou non d'une contrepartie au dépôt d'un avis, le délai de publication et de conservation, les caractéristiques du contrôle et les motifs de rejet. Il offre aux professionnels concernés une fonctionnalité gratuite pour signaler un doute sur l'authenticité d'un avis. Affirmer que des avis sont vérifiés sans l'avoir fait, publier ou commander de faux avis sont des pratiques trompeuses.

**Sanction affichée.** Faux avis ou vérification affichée mais inexistante : pratique commerciale trompeuse, jusqu'à 5 ans et 750 000 € quand elle est commise en ligne (C. conso art. L132-2).

**Conditions appliquées par le logiciel.** Avis clients affichés

**S'applique si :**
- Toute personne qui collecte, modère ou diffuse des avis de consommateurs.

**Doutes à trancher :**
- Confirmer la numérotation des articles réglementaires (D111-16 et suivants, ou D111-9 et suivants).

**Code de la consommation, art. L111-7-2** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. L121-4** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de la consommation, art. L111-7-2 ; Code de la consommation, art. D111-9 à D111-11 ; Code de la consommation, art. L121-4, 27° et 28°

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Pas d'interface trompeuse (dark patterns)

`plat.interfaces-trompeuses` · empreinte `fe2b306a2a637c95` · Zone de flou · gravité mineure

**Exigence affichée aux clients.** L'interface ne doit pas tromper ou manipuler l'utilisateur : options préselectionnées, désabonnement plus difficile que l'abonnement, sollicitations répétées, choix mis en avant de façon déséquilibrée.

**Nuance affichée.** La notion d'interface trompeuse est récente et appréciée au cas par cas. L'article 25 du DSA ne vise pas les micro et petites entreprises (art. 19), mais l'interdiction des pratiques commerciales trompeuses s'applique à tous.

**Conditions appliquées par le logiciel.** au moins un de : (type de site : Place de marché ou Communauté / contenus d'utilisateurs) ; (Commande ou paiement en ligne)

**S'applique si :**
- Plateformes en ligne (DSA) ; tout professionnel (pratiques trompeuses).

**Ne s'applique pas si :**
- Micro et petites entreprises pour le seul article 25 du DSA.

**DSA, art. 25** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32022R2065#art_25)

> Article 25
> Conception et organisation des interfaces en ligne
> 1.   Les fournisseurs de plateformes en ligne ne conçoivent, n’organisent ni n’exploitent leurs interfaces en ligne de façon à tromper ou à manipuler les destinataires de leur service ou de toute autre façon propre à altérer ou à entraver substantiellement la capacité des destinataires de leur service à prendre des décisions libres et éclairées.
> 2.   L’interdiction contenue dans le paragraphe 1 ne s’applique pas aux pratiques couvertes par la directive 2005/29/CE ou le règlement (UE) 2016/679.
> 3.   La Commission peut publier des lignes directrices sur la manière dont le paragraphe 1 s’applique à des pratiques spécifiques, notamment:
> a) accorder davantage d’importance à certains choix au moment de demander au destinataire du service de prendre une décision;
> b) demander de façon répétée au destinataire du service de faire un choix lorsque ce choix a déjà été fait, notamment en faisant apparaître une fenêtre contextuelle qui perturbe l’expérience de l’utilisateur;
> c) rendre la procédure de désinscription d’un service plus compliquée que l’inscription à celui-ci.

**Code de la consommation, art. L121-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** DSA, art. 25 ; Code de la consommation, art. L121-1 à L121-4

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Protection des mineurs sur les plateformes

`plat.mineurs` · empreinte `7dc3e69bd377ba1e` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Les plateformes accessibles aux mineurs garantissent un niveau élevé de protection et n'affichent pas de publicité ciblée fondée sur le profilage d'un mineur.

**Nuance affichée.** Les plateformes exploitées par des micro ou petites entreprises (moins de 50 salariés et 10 M€ de chiffre d'affaires) ne sont pas visées (DSA art. 19).

**Conditions appliquées par le logiciel.** Public pouvant être mineur ET Contenus publiés par les utilisateurs

**S'applique si :**
- Plateformes en ligne accessibles aux mineurs.

**Ne s'applique pas si :**
- Micro et petites entreprises (DSA art. 19).

**DSA, art. 28** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32022R2065#art_28)

> Article 28
> Protection des mineurs en ligne
> 1.   Les fournisseurs de plateformes en ligne accessibles aux mineurs mettent en place des mesures appropriées et proportionnées pour garantir un niveau élevé de protection de la vie privée, de sûreté et de sécurité des mineurs sur leur service.
> 2.   Les fournisseurs de plateformes en ligne ne présentent pas sur leur interface de publicité qui repose sur du profilage, tel qu’il est défini à l’article 4, point 4), du règlement (UE) 2016/679 en utilisant des données à caractère personnel concernant le destinataire du service dès lors qu’ils ont connaissance avec une certitude raisonnable que le destinataire du service est un mineur.
> 3.   Le respect des obligations énoncées dans le présent article n’impose pas aux fournisseurs de plateformes en ligne de traiter des données à caractère personnel supplémentaires afin de déterminer si le destinataire du service est un mineur.
> 4.   La Commission, après avoir consulté le comité, peut publier des lignes directrices pour aider les fournisseurs de plateformes en ligne à appliquer le paragraphe 1.
> SECTION 4
> Dispositions supplémentaires applicables aux fournisseurs de plateformes en ligne permettant aux consommateurs de conclure des contrats à distance avec des professionnels

**Sources affichées.** DSA, art. 28

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Audit de cybersécurité affiché (« cyberscore »)

`plat.cyberscore` · empreinte `d4a60a7ab6a16945` · Zone de flou · gravité mineure

**Exigence affichée aux clients.** Les plateformes en ligne, moteurs de recherche, comparateurs et messageries dont l'activité dépasse les seuils fixés par décret font réaliser un audit de cybersécurité par un prestataire qualifié par l'ANSSI et en présentent le résultat aux consommateurs, de façon lisible, avec un système d'information coloriel.

**Nuance affichée.** Ne concerne que les très grands services (seuils d'audience fixés par décret) ; les critères et la présentation sont fixés par arrêté.

**Conditions appliquées par le logiciel.** Chiffre d'affaires ≥ 250 M€ ET au moins un de : (type de site : Place de marché ou Communauté / contenus d'utilisateurs) ; (Contenus publiés par les utilisateurs)

**S'applique si :**
- Plateformes dépassant les seuils fixés par décret.

**Ne s'applique pas si :**
- Plateformes sous les seuils.

**Doutes à trancher :**
- Vérifier que le décret d'application et l'arrêté de seuils sont en vigueur, et leurs dates.

**Code de la consommation, art. L111-7-3** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de la consommation, art. L111-7-3

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

## Prospection et publicité

### Consentement à la prospection par e-mail

`pub.prospection-email` · empreinte `875b06490ad7e58c` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** La prospection commerciale par e-mail ou SMS vers des particuliers exige leur consentement préalable (case non précochée), sauf pour des produits analogues vendus à un client existant qui a pu s'y opposer ; chaque message comporte un lien de désinscription.

**Sanction affichée.** Amende administrative prononcée par la DGCCRF jusqu'à 75 000 € (personne physique) ou 375 000 € (personne morale), CPCE art. L34-5 ; la CNIL est aussi compétente.

**Conditions appliquées par le logiciel.** Newsletter ou prospection e-mail

**S'applique si :**
- Prospection par e-mail ou SMS de personnes physiques.

**Ne s'applique pas si :**
- Prospection entre professionnels sur adresse professionnelle et en rapport avec leur activité (doctrine CNIL : opposition suffit).

**Code des postes et des communications électroniques, art. L34-5** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code des postes et des communications électroniques, art. L34-5

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Démarchage téléphonique : consentement préalable

`pub.bloctel` · empreinte `77318d20002e06a8` · Loi (peut produire « Illégal » une fois validée) · gravité majeure · applicable depuis le 2026-08-11

**Exigence affichée aux clients.** Depuis le 11 août 2026, il est interdit de démarcher par téléphone un consommateur qui n'y a pas consenti au préalable (consentement libre, spécifique, éclairé, univoque, révocable, par un acte positif clair, dont le professionnel doit apporter la preuve), sauf dans le cadre d'un contrat en cours. Quand le site recueille un numéro de téléphone, il informe le consommateur que toute sollicitation commerciale par téléphone suppose son consentement préalable ; un contrat conclu à cette occasion le mentionne. Le renvoi à Bloctel ne suffit plus.

**Sanction affichée.** Amende administrative jusqu'à 75 000 € (personne physique) ou 375 000 € (personne morale), C. conso art. L242-16 ; un contrat conclu à la suite d'un démarchage illicite est nul.

**Conditions appliquées par le logiciel.** Collecte de données personnelles ET Vend ou s'adresse à des particuliers

**S'applique si :**
- Professionnel qui recueille le numéro de téléphone d'un consommateur.

**Ne s'applique pas si :**
- Vente exclusivement à des professionnels.

**Code de la consommation, art. L223-2** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de la consommation, issu de la loi n° 2025-594 du 30 juin 2025, art. L223-1 ; Code de la consommation, art. L223-2

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Publicité et contenus sponsorisés identifiables

`pub.identification` · empreinte `eda5acd5dad0fa80` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Toute publicité, y compris un contenu sponsorisé ou un lien d'affiliation, doit être clairement identifiable comme telle et l'annonceur identifiable.

**Conditions appliquées par le logiciel.** Publicité, affiliation ou contenus sponsorisés

**S'applique si :**
- Site qui diffuse de la publicité ou des contenus sponsorisés.

**LCEN (loi n° 2004-575), art. 20** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la consommation, art. L121-4** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**DSA, art. 26** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32022R2065#art_26)

> Article 26
> Publicité sur les plateformes en ligne
> 1.   Les fournisseurs de plateformes en ligne qui présentent de la publicité sur leurs interfaces en ligne veillent à ce que, pour chaque publicité spécifique présentée à chaque destinataire individuel, les destinataires du service puissent de manière claire, précise, non ambiguë et en temps réel:
> a) se rendre compte que les informations sont de la publicité, y compris au moyen de marquages bien visibles qui pourraient suivre des normes en vertu de l’article 44;
> b) identifier la personne physique ou morale pour le compte de laquelle la publicité est présentée;
> c) identifier la personne physique ou morale qui a payé pour la publicité, si cette personne est différente de la personne physique ou morale visée au point b); et
> d) déterminer les informations utiles, qui doivent être directement et facilement accessibles à partir de la publicité, concernant les principaux paramètres utilisés pour déterminer le destinataire auquel la publicité est présentée et, le cas échéant, la manière dont ces paramètres peuvent être modifiés.
> 2.   Les fournisseurs de plateformes en ligne fournissent aux destinataires du service une fonctionnalité leur permettant de déclarer si le contenu qu’ils fournissent constitue une communication commerciale ou s’il contient une telle communication.
> Lorsque le destinataire du service soumet une déclaration en vertu du présent paragraphe, le fournisseur de plateformes en ligne veille à ce que les autres destinataires du service puissent se rendre compte de manière claire, non ambiguë et en temps réel, y compris au moyen de marquages bien visibles, qui pourraient suivre des normes en vertu de l’article 44, que le contenu fourni par le destinataire du service constitue une communication commerciale ou contient une telle communication, telle qu’elle est décrite dans cette déclaration.
> 3.   Les fournisseurs de plateformes en ligne ne présentent pas aux destinataires du service de publicité qui repose sur du profilage, tel qu’il est défini à l’article 4, point 4), du règlement (UE) 2016/679, en utilisant les catégories particulières de données à caractère personnel visées à l’article 9, paragraphe 1, du règlement (UE) 2016/679.

**Sources affichées.** LCEN, art. 20 ; Code de la consommation, art. L121-4, 11° ; DSA, art. 26

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Influence commerciale

`pub.influence` · empreinte `0c5bc0c3f73a0204` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Les contenus d'influence commerciale portent la mention « publicité » ou « collaboration commerciale » et, le cas échéant, « image retouchée » ou « image virtuelle ».

**Conditions appliquées par le logiciel.** type de site : Blog ou média ou Communauté / contenus d'utilisateurs ET Publicité, affiliation ou contenus sponsorisés

**S'applique si :**
- Personnes qui exercent une activité d'influence commerciale.

**Ne s'applique pas si :**
- Marque qui publie sa propre publicité sur son site.

**Doutes à trancher :**
- La condition (publicité + média ou communauté) ne prouve pas une activité d'influence : déclaratif, à garder ainsi.

**Loi n° 2023-451, art. 5** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Loi n° 2023-451 du 9 juin 2023, art. 5

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

## Environnement

### Allégations environnementales génériques interdites

`env.allegations-generiques` · empreinte `52c98e7e507d2d72` · Zone de flou · gravité critique · applicable depuis le 2026-09-27

**Exigence affichée aux clients.** Les allégations environnementales doivent être précises, vérifiables et justifiées. Sont déjà interdites en France : « biodégradable », « respectueux de l'environnement » ou toute mention équivalente sur un produit ou un emballage, la mention « recyclé » sans le pourcentage de matière recyclée, et toute allégation de neutralité carbone sans bilan d'émissions publié. La directive 2024/825, applicable depuis le 27 septembre 2026, interdit en plus les allégations génériques sans performance reconnue, la neutralité fondée sur la compensation et les labels non certifiés.

**Nuance affichée.** La France n'a pas encore transposé la directive 2024/825 (projet de loi DDADUE en cours d'examen au 13 octobre 2026) : une directive ne s'impose pas directement entre entreprises, et la DGCCRF a indiqué attendre la transposition pour contrôler les nouvelles règles. Les juges interprètent toutefois déjà le droit français à sa lumière, et les interdictions du Code de l'environnement s'appliquent.

**Sanction affichée.** Pratique commerciale trompeuse : 2 ans d'emprisonnement et 300 000 € d'amende, portés à 5 ans et 750 000 € quand elle est commise en ligne ; l'amende peut atteindre 80 % des dépenses de la publicité en cas d'allégation environnementale (C. conso art. L132-2).

**Conditions appliquées par le logiciel.** Allégations environnementales

**S'applique si :**
- Allégations environnementales dans une communication commerciale.

**Doutes à trancher :**
- Directive 2024/825 non transposée au 14 octobre 2026 : suivre le projet de loi DDADUE et mettre la règle à jour dès sa publication.

**Code de la consommation, art. L121-2** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de l'environnement, art. L229-68** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de l'environnement, art. L541-9-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Directive (UE) 2024/825, art. 1** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32024L0825#art_1)

> Article premier
> Modifications de la directive 2005/29/CE
> La directive 2005/29/CE est modifiée comme suit:
> 1)
> À l’article 2, le premier alinéa est modifié comme suit:
> a) le point suivant est inséré:
> «c bis)
> “bien”: un bien au sens de l’article 2, point 5), de la directive (UE) 2019/771 du Parlement européen et du Conseil (*1);
> (*1)  Directive (UE) 2019/771 du Parlement européen et du Conseil du 20 mai 2019 relative à certains aspects concernant les contrats de vente de biens, modifiant le règlement (UE) 2017/2394 et la directive 2009/22/CE et abrogeant la directive 1999/44/CE (JO L 136 du 22.5.2019, p. 28).»;"
> b) les points suivants sont ajoutés:
> «o)
> “allégation environnementale”: tout message ou toute déclaration non obligatoire en vertu du droit de l’Union ou du droit national, sous quelque forme que ce soit, notamment du texte, une image, une représentation graphique ou un symbole tels que un label, une marque, une dénomination sociale ou une dénomination de produit, dans le cadre d’une communication commerciale, et qui affirme ou suggère qu’un produit, une catégorie de produits, une marque ou un professionnel a une incidence positive ou nulle sur l’environnement, est moins préjudiciable pour l’environnement que d’autres produits, catégories de produits, marques ou professionnels, ou a amélioré son incidence environnementale au fil du temps;
> p) “allégation environnementale générique”: toute allégation environnementale formulée sous forme écrite ou orale, y compris dans les médias audiovisuels, qui ne fait pas partie d’un label de développement durable, et lorsque la spécification de l’allégation n’est pas fournie en des termes clairs et bien visibles sur le même support;
> q) “label de développement durable”: tout label de confiance volontaire, label de qualité ou équivalent, public ou privé, qui vise à distinguer et à promouvoir un produit, un procédé ou une entreprise pour ses caractéristiques environnementales ou sociales, ou les deux, et qui exclut tout label obligatoire requis en vertu du droit de l’Union ou du droit national;
> r) “système de certification”: un système de vérification par un tiers qui certifie qu’un produit, un processus ou une entreprise satisfait à certaines exigences, qui permet l’utilisation d’un label de développement durable correspondant et dont les dispositions, notamment les exigences qu’il définit, sont accessibles au public et répondent aux critères suivants:
> i) le système est ouvert, à des conditions transparentes, équitables et non discriminatoires, à tous les professionnels désireux et en mesure de se conformer aux exigences du système;
> ii) les exigences définies par le système sont élaborées par le propriétaire de ce dernier en consultation avec les experts et les parties prenantes concernées;
> iii) le système établit des procédures pour traiter les cas de non-conformité à ses exigences et prévoit le retrait ou la suspension de l’utilisation du label de développement durable par le professionnel en cas de non-re
> […]

**Sources affichées.** Directive (UE) 2024/825 « transition verte » ; Code de la consommation, art. L121-2 et L121-4 ; Code de l'environnement, art. L229-68 (neutralité carbone) ; Code de l'environnement, art. L541-9-1 (« biodégradable », « respectueux de l'environnement », pourcentage de matière recyclée)

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Indice de réparabilité ou de durabilité

`env.durabilite` · empreinte `2e8a16416763334d` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Pour les équipements électriques et électroniques concernés (ordinateurs, téléviseurs, lave-linge…), informer sans frais le consommateur, au moment de l'achat, de l'indice de réparabilité ou de durabilité, y compris en ligne, et mettre à sa disposition les paramètres qui ont permis de l'établir.

**Nuance affichée.** Pour les smartphones et tablettes, l'étiquette énergie européenne (avec sa classe de réparabilité) remplace l'indice français depuis le 20 juin 2025 (règlement (UE) 2023/1669).

**Conditions appliquées par le logiciel.** secteur : Électronique, électroménager ET Commande ou paiement en ligne

**S'applique si :**
- Vente en ligne des équipements couverts par l'indice.

**Ne s'applique pas si :**
- Smartphones et tablettes, couverts depuis le 20 juin 2025 par l'étiquette énergie européenne.

**Code de l'environnement, art. L541-9-2** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de l'environnement, art. L541-9-2

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Disponibilité des pièces détachées

`env.pieces-detachees` · empreinte `a1e88d821a33b792` · Loi (peut produire « Illégal » une fois validée) · gravité mineure

**Exigence affichée aux clients.** Le vendeur informe le consommateur, de manière lisible avant la conclusion du contrat, de la disponibilité ou de la non-disponibilité des pièces détachées indispensables à l'utilisation du bien et, le cas échéant, de la période ou de la date jusqu'à laquelle elles sont disponibles ; l'information est confirmée par écrit lors de l'achat. Pour les équipements électriques et électroniques et l'ameublement, à défaut d'information du fabricant, les pièces sont réputées non disponibles.

**Conditions appliquées par le logiciel.** secteur : Électronique, électroménager ET Commande ou paiement en ligne ET Vend ou s'adresse à des particuliers

**S'applique si :**
- Vente aux consommateurs de biens dont le fabricant a communiqué la disponibilité des pièces.

**Ne s'applique pas si :**
- Vente exclusivement à des professionnels.

**Code de la consommation, art. L111-4** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de la consommation, art. L111-4

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Information sur la réparation

`env.reparation` · empreinte `50e76102ef214caf` · Zone de flou · gravité mineure · applicable depuis le 2026-07-31

**Exigence affichée aux clients.** Pour les biens couverts par la directive « droit à la réparation » : informer de l'obligation de réparation du fabricant et, quand le consommateur choisit la réparation au titre de la garantie légale, de la prolongation de cette garantie de 12 mois.

**Nuance affichée.** La directive devait être transposée au 31 juillet 2026 ; la France ne l'a pas encore fait au 13 octobre 2026. Les obligations pèsent surtout sur les fabricants ; pour le vendeur, l'anticiper dans les CGV est une précaution.

**Conditions appliquées par le logiciel.** secteur : Électronique, électroménager ET Commande ou paiement en ligne

**S'applique si :**
- Biens couverts par la directive.

**Doutes à trancher :**
- Directive non transposée au 14 octobre 2026.

**Directive (UE) 2024/1799, art. 5** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32024L1799#art_5)

> Article 5
> Obligation de réparation
> 1.   Les États membres veillent à ce que, à la demande du consommateur, le fabricant répare les biens pour lesquels des exigences de réparabilité sont prévues dans les actes juridiques de l’Union énumérés à l’annexe II, dans la mesure prévue par lesdites exigences. Le fabricant n’est pas tenu de réparer lesdits biens lorsque la réparation est impossible. Il peut sous-traiter la réparation afin de remplir son obligation de réparation.
> 2.   La réparation au titre du paragraphe 1 est effectuée aux conditions suivantes:
> a) elle est effectuée gratuitement ou moyennant un prix raisonnable;
> b) elle est effectuée dans un délai raisonnable à compter du moment où le fabricant est en possession physique du bien, a reçu le bien ou s’est vu donner accès au bien par le consommateur;
> c) le fabricant peut accorder au consommateur le prêt d’un bien de remplacement, gratuitement ou moyennant un coût raisonnable pendant la durée de la réparation; et
> d) dans les cas où la réparation est impossible, le fabricant peut proposer au consommateur un bien reconditionné.
> 3.   Lorsque le fabricant tenu de procéder à la réparation en vertu du paragraphe 1 est établi en dehors de l’Union, son mandataire dans l’Union s’acquitte de son obligation. Lorsque le fabricant n’a pas de mandataire dans l’Union, l’importateur du bien concerné s’acquitte de l’obligation du fabricant. En l’absence d’importateur, le distributeur du bien concerné s’acquitte de l’obligation du fabricant. Le mandataire, l’importateur et le distributeur peuvent sous-traiter la réparation afin de remplir leur obligation de réparation.
> 4.   Les fabricants qui mettent à disposition des pièces de rechange et des outils destinés à des biens relevant des actes juridiques de l’Union énumérés à l’annexe II proposent ces pièces de rechange et ces outils à un prix raisonnable qui ne dissuade pas de procéder à la réparation.
> 5.   Les fabricants ou, le cas échéant, les mandataires, les importateurs ou les distributeurs qui sont tenus à une obligation de réparation en vertu du présent article veillent à ce que les consommateurs puissent accéder, via un site internet en accès libre, aux informations relatives aux prix indicatifs facturés pour la réparation type des biens relevant des actes juridiques de l’Union énumérés à l’annexe II.
> 6.   Les fabricants n’utilisent aucune clause contractuelle, aucune technique matérielle ou logicielle entravant la réparation de biens relevant des actes juridiques de l’Union énumérés à l’annexe II, à moins que cela ne soit justifié par des facteurs légitimes et objectifs, y compris la protection des droits de propriété intellectuelle en vertu du droit de l’Union et du droit national. Les fabricants n’empêchent pas, en particulier, les réparateurs indépendants d’utiliser des pièces de rechange originales ou de seconde main, des pièces de rechange compatibles et des pièces de rechange issues de l’impression 3D, lorsque celles-ci sont conformes aux exigences d
> […]

**Directive (UE) 2024/1799, art. 16** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32024L1799#art_16)

> Article 16
> Modification de la directive (UE) 2019/771
> La directive (UE) 2019/771 est modifiée comme suit:
> 1)
> À l’article 7, paragraphe 1, le point d) est remplacé par le texte suivant:
> «d)
> être en quantité et présenter les qualités et d’autres caractéristiques, y compris en termes de durabilité, de réparabilité, de fonctionnalité, de compatibilité et de sécurité, normales pour des biens de même type et auxquelles le consommateur peut raisonnablement s’attendre, eu égard à la nature des biens et compte tenu de toute déclaration publique faite par le vendeur ou d’autres personnes situées en amont dans la chaîne de transactions ou pour le compte du vendeur ou de telles personnes, y compris le producteur, en particulier dans les publicités ou sur l’étiquette.».
> 2)
> L’article 10 est modifié comme suit:
> a) le paragraphe suivant est inséré:
> «2 bis.   Lorsque, conformément à l’article 13, paragraphe 2, la réparation est le recours utilisé pour mettre les biens en conformité, le délai de responsabilité est prolongé une fois de douze mois.»
> ;
> b) le paragraphe 3 est remplacé par le texte suivant:
> «3.   Les États membres peuvent maintenir ou introduire des délais plus longs que ceux visés aux paragraphes 1, 2 et 2 bis.»
> ;
> c) le paragraphe suivant est inséré:
> «5 bis.   Les États membres qui, conformément au paragraphe 3 ou au paragraphe 5, ne prévoient pas de délais fixes pour la responsabilité du vendeur ou qui ne prévoient un délai de prescription que pour les recours, peuvent déroger au paragraphe 2 bis à condition de veiller à ce que la responsabilité du vendeur ou le délai de prescription pour le recours en cas de réparation soient au moins équivalents à trois ans.».
> 3)
> À l’article 13, le paragraphe suivant est inséré:
> «2 bis.   Avant de fournir un recours pour mettre les biens en conformité, le vendeur informe le consommateur du droit du consommateur de choisir entre la réparation et le remplacement, ainsi que de l’éventuelle prolongation de la période de responsabilité, prévue à l’article 10, paragraphe 2 bis.».
> 4)
> L’article 14, paragraphe 1, est remplacé par le texte suivant:
> «1.   Une réparation ou un remplacement est effectué(e):
> a) sans frais;
> b) dans un délai raisonnable à compter du moment où le vendeur a été informé par le consommateur du défaut de conformité;
> c) sans inconvénient majeur pour le consommateur, compte tenu de la nature des biens et de l’usage recherché par le consommateur.
> Pendant la réparation, en fonction des spécificités de la catégorie de biens concernée, en particulier de la nécessité pour le consommateur de disposer des biens en permanence, le vendeur peut prêter gratuitement au consommateur un bien de remplacement, y compris un bien reconditionné.
> Le vendeur peut fournir, à la demande expresse du consommateur, un bien reconditionné pour s’acquitter de son obligation de remplacer le bien.».

**Sources affichées.** Directive (UE) 2024/1799, art. 5, 6 et 16

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

## Intelligence artificielle

### Information sur l'interaction avec une IA

`ia.chatbot` · empreinte `07d1d5dd1722add4` · Zone de flou · gravité majeure · applicable depuis le 2026-08-02

**Exigence affichée aux clients.** Les personnes qui échangent avec un système d'IA (chatbot, assistant) sont informées qu'elles interagissent avec une IA, sauf évidence ; les contenus générés ou manipulés par IA (hypertrucages, textes d'information) sont signalés comme tels.

**Nuance affichée.** L'article 50.1 vise le fournisseur du système d'IA : un site qui conçoit son propre assistant (même sur un modèle tiers) l'est ; un site qui installe un outil prêt à l'emploi peut ne pas l'être. Le report d'une partie de l'AI Act (règlement « omnibus » de 2026) ne concerne pas cette obligation.

**Conditions appliquées par le logiciel.** Chatbot ou assistant IA

**S'applique si :**
- Fournisseur d'un système d'IA qui dialogue avec des personnes, depuis le 2 août 2026.

**Ne s'applique pas si :**
- Site qui installe un outil tiers dont il n'est pas le fournisseur (l'obligation pèse alors sur l'éditeur de l'outil).

**Doutes à trancher :**
- Qualification fournisseur ou déployeur au cas par cas : zone de flou, à garder ainsi.
- Le texte cité est celui publié en 2024 : vérifier la version consolidée après le règlement omnibus (UE) 2026/1744.

**AI Act, art. 50** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32024R1689#art_50)

> Article 50
> Obligations de transparence pour les fournisseurs et les déployeurs de certains systèmes d’IA
> 1.   Les fournisseurs veillent à ce que les systèmes d’IA destinés à interagir directement avec des personnes physiques soient conçus et développés de manière que les personnes physiques concernées soient informées qu’elles interagissent avec un système d’IA, sauf si cela ressort clairement du point de vue d’une personne physique normalement informée et raisonnablement attentive et avisée, compte tenu des circonstances et du contexte d’utilisation. Cette obligation ne s’applique pas aux systèmes d’IA dont la loi autorise l’utilisation à des fins de prévention ou de détection des infractions pénales, d’enquêtes ou de poursuites en la matière, sous réserve de garanties appropriées pour les droits et libertés des tiers, sauf si ces systèmes sont mis à la disposition du public pour permettre le signalement d’une infraction pénale.
> 2.   Les fournisseurs de systèmes d’IA, y compris de systèmes d’IA à usage général, qui génèrent des contenus de synthèse de type audio, image, vidéo ou texte, veillent à ce que les sorties des systèmes d’IA soient marquées dans un format lisible par machine et identifiables comme ayant été générées ou manipulées par une IA. Les fournisseurs veillent à ce que leurs solutions techniques soient aussi efficaces, interopérables, solides et fiables que la technologie le permet, compte tenu des spécificités et des limites des différents types de contenus, des coûts de mise en œuvre et de l’état de la technique généralement reconnu, comme cela peut ressortir des normes techniques pertinentes. Cette obligation ne s’applique pas dans la mesure où les systèmes d’IA remplissent une fonction d’assistance pour la mise en forme standard ou ne modifient pas de manière substantielle les données d’entrée fournies par le déployeur ou leur sémantique, ou lorsque leur utilisation est autorisée par la loi à des fins de prévention ou de détection des infractions pénales, d’enquêtes ou de poursuites en la matière.
> 3.   Les déployeurs d’un système de reconnaissance des émotions ou d’un système de catégorisation biométrique informent les personnes physiques qui y sont exposées du fonctionnement du système et traitent les données à caractère personnel conformément au règlement (UE) 2016/679, au règlement (UE) 2018/1725 et à la directive (UE) 2016/680, selon le cas. Cette obligation ne s’applique pas aux systèmes d’IA utilisés pour la catégorisation biométrique et la reconnaissance des émotions dont la loi autorise l’utilisation à des fins de prévention ou de détection des infractions pénales ou d’enquêtes en la matière, sous réserve de garanties appropriées pour les droits et libertés des tiers et conformément au droit de l’Union.
> 4.   Les déployeurs d’un système d’IA qui génère ou manipule des images ou des contenus audio ou vidéo constituant un hypertrucage indiquent que les contenus ont été générés ou manipulés par une IA. Cette obligation ne 
> […]

**Sources affichées.** Règlement (UE) 2024/1689 « AI Act », art. 50

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

## Langue

### Offre et conditions en français

`langue.francais` · empreinte `349f49eb35cd8c65` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** La présentation des biens et services, les modes d'emploi, les garanties et les conditions contractuelles proposés à des consommateurs en France sont rédigés en français (les traductions sont permises en plus).

**Conditions appliquées par le logiciel.** Vend ou s'adresse à des particuliers

**S'applique si :**
- Offre de biens ou services aux consommateurs en France.

**Ne s'applique pas si :**
- Vente exclusivement à des professionnels.

**Doutes à trancher :**
- Un site étranger en anglais visant la France : application territoriale à apprécier.

**Loi n° 94-665 (Toubon), art. 2** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Loi n° 94-665 « Toubon », art. 2

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

## Sectoriel

### Alcool : message sanitaire et interdiction de vente aux mineurs

`sect.alcool` · empreinte `b206e107626bae65` · Loi (peut produire « Illégal » une fois validée) · gravité critique

**Exigence affichée aux clients.** Toute publicité pour des boissons alcooliques porte un message sanitaire précisant que l'abus d'alcool est dangereux pour la santé (formule d'usage : « L'abus d'alcool est dangereux pour la santé, à consommer avec modération ») et se limite aux mentions objectives autorisées ; en ligne, elle n'est ni intrusive ni interstitielle et est exclue des sites destinés à la jeunesse ou édités par des clubs et fédérations sportives. La vente aux mineurs est interdite : le vendeur exige la preuve de la majorité.

**Conditions appliquées par le logiciel.** secteur : Alcool

**S'applique si :**
- Publicité en ligne pour des boissons alcooliques, y compris la présentation des produits sur un site marchand.

**Doutes à trancher :**
- Le secteur est déduit de mots du site : faux positifs possibles (constat marqué incertain).

**Code de la santé publique, art. L3323-4** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la santé publique, art. L3342-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de la santé publique, art. L3323-2 9°, L3323-4 et L3342-1

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Denrées alimentaires vendues à distance

`sect.alimentaire` · empreinte `4a27f5bdf2460897` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Les informations obligatoires (dénomination, liste des ingrédients, allergènes, quantité, conditions de conservation, origine si requise) sont disponibles avant l'achat, sur la fiche produit.

**Conditions appliquées par le logiciel.** secteur : Alimentaire ET Commande ou paiement en ligne

**S'applique si :**
- Vente à distance de denrées alimentaires préemballées.

**Règlement INCO, art. 14** (texte publié au JOUE, récupéré le 2026-10-13 : https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32011R1169#art_14)

> Article 14
> Vente à distance
> 1.   Sans préjudice des informations requises en vertu de l’article 9, pour les denrées alimentaires préemballées proposées à la vente au moyen d’une technique de communication à distance:
> a) les informations obligatoires sur les denrées alimentaires, à l’exception des mentions prévues à l’article 9, paragraphe 1, point f), sont fournies avant la conclusion de l’achat et figurent sur le support de la vente à distance ou sont transmises par tout autre moyen approprié clairement précisé par l’exploitant du secteur alimentaire. Lorsque d’autres moyens appropriés sont utilisés, les informations obligatoires sur les denrées alimentaires sont fournies sans que l’exploitant du secteur alimentaire puisse imputer de frais supplémentaires aux consommateurs;
> b) toutes les mentions obligatoires sont fournies au moment de la livraison.
> 2.   Dans le cas des denrées alimentaires non préemballées proposées à la vente au moyen d’une technique de communication à distance, les mentions requises en vertu de l’article 44 sont fournies conformément au paragraphe 1 du présent article.
> 3.   Le paragraphe 1, point a), ne s’applique pas aux denrées alimentaires proposées à la vente au moyen de distributeurs automatiques ou de locaux commerciaux automatisés.

**Sources affichées.** Règlement (UE) n° 1169/2011 « INCO », art. 9 et 14

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Immobilier : honoraires, carte professionnelle, DPE

`sect.immobilier` · empreinte `35fb2a358129ea1b` · Loi (peut produire « Illégal » une fois validée) · gravité critique

**Exigence affichée aux clients.** Les agents immobiliers affichent leurs barèmes d'honoraires TTC sur leur site, leur numéro de carte professionnelle et sa préfecture ou CCI de délivrance, leur garant ; les annonces mentionnent la classe énergie et climat (DPE).

**Sanction affichée.** Absence des classes énergie et climat dans une annonce : amende administrative jusqu'à 3 000 € (personne physique) ou 15 000 € (personne morale), CCH art. L126-33.

**Conditions appliquées par le logiciel.** secteur : Immobilier

**S'applique si :**
- Agents immobiliers et administrateurs de biens.

**Ne s'applique pas si :**
- Particuliers qui vendent leur bien.

**Doutes à trancher :**
- Vérifier que l'arrêté du 10 janvier 2017 sur l'affichage des honoraires est toujours en vigueur dans cette version.

**Loi n° 70-9 (Hoguet), art. 6** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Loi n° 70-9 « Hoguet » ; Arrêté du 10 janvier 2017 relatif à l'information sur les prix des prestations des agents immobiliers ; Code de la construction et de l'habitation, art. L126-33

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Crédit et assurance : ORIAS et mentions de publicité

`sect.credit-assurance` · empreinte `fff799736a4395cd` · Loi (peut produire « Illégal » une fois validée) · gravité critique

**Exigence affichée aux clients.** Les intermédiaires indiquent leur numéro d'immatriculation ORIAS ; la publicité pour un crédit à la consommation comporte les mentions obligatoires (TAEG en exemple représentatif, « Un crédit vous engage et doit être remboursé… »).

**Nuance affichée.** La directive (UE) 2023/2225 s'applique à partir du 20 novembre 2026 : elle fait entrer dans le crédit à la consommation les crédits gratuits ou à frais négligeables remboursables en moins de trois mois, comme le paiement fractionné (« payez en 3 ou 4 fois »). Un site marchand qui le met en avant devra alors porter les mentions de publicité du crédit. Vérifier le texte de transposition sur Légifrance à cette date.

**Conditions appliquées par le logiciel.** secteur : Crédit, assurance

**S'applique si :**
- Prêteurs, intermédiaires en crédit et en assurance.

**Doutes à trancher :**
- Directive (UE) 2023/2225 sur le crédit à la consommation applicable à partir du 20 novembre 2026 : à mettre à jour à cette date.

**Code de la consommation, art. L312-5** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code des assurances, art. L512-1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de la consommation, art. L312-5 à L312-10 ; Code des assurances, art. L512-1 et R521-1 ; Directive (UE) 2023/2225 (crédit à la consommation)

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Santé : hébergement HDS et règles de vente en ligne

`sect.sante` · empreinte `c5edfe74c8398533` · Loi (peut produire « Illégal » une fois validée) · gravité critique

**Exigence affichée aux clients.** Les données de santé confiées à un prestataire sont hébergées chez un hébergeur certifié HDS ; la vente en ligne de médicaments est réservée aux pharmacies autorisées et soumise à des mentions précises (logo commun européen, lien vers l'ARS).

**Conditions appliquées par le logiciel.** secteur : Santé

**S'applique si :**
- Hébergement de données de santé pour compte de tiers ; vente en ligne de médicaments.

**Code de la santé publique, art. L1111-8** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code de la santé publique, art. L5125-33** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de la santé publique, art. L1111-8, L5125-33 et s.

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Voyages et séjours : immatriculation et formulaire d'information

`sect.tourisme` · empreinte `265e7da4b50091f0` · Loi (peut produire « Illégal » une fois validée) · gravité critique

**Exigence affichée aux clients.** Les opérateurs de voyages indiquent leur immatriculation Atout France, leur garantie financière et fournissent le formulaire d'information standard avant la vente d'un forfait.

**Conditions appliquées par le logiciel.** secteur : Voyages, tourisme

**S'applique si :**
- Opérateurs de voyages et séjours (forfaits).

**Code du tourisme, art. L211-8** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code du tourisme, art. L211-18** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code du tourisme, art. L211-8, L211-18 et R211-3-1

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Artisans et BTP : assurance professionnelle

`sect.btp` · empreinte `b3f036f3c9145d44` · Recommandation · gravité mineure

**Exigence affichée aux clients.** Les artisans soumis à une assurance obligatoire (décennale notamment) indiquent l'assurance souscrite, les coordonnées de l'assureur et la couverture géographique sur leurs devis et factures. Les reprendre sur le site est une bonne pratique.

**Nuance affichée.** La loi vise les devis et factures, pas le site : l'absence de ces mentions sur le site n'est pas un manquement.

**Conditions appliquées par le logiciel.** secteur : BTP, artisanat

**S'applique si :**
- Artisans et entreprises du bâtiment soumis à une assurance obligatoire.

**Doutes à trancher :**
- Reclassée en recommandation le 14 octobre 2026 : le texte vise les devis et factures, pas le site. À confirmer.

**Loi n° 96-603, art. 22-2** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Code des assurances, art. L243-2** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Loi n° 96-603 du 5 juillet 1996, art. 22-2 ; Code des assurances, art. L243-2

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Livres : prix unique et frais de port minimum

`sect.livre` · empreinte `3f358ef90cad603f` · Loi (peut produire « Illégal » une fois validée) · gravité majeure

**Exigence affichée aux clients.** Prix de vente fixé par l'éditeur (remise de 5 % au plus) ; pour la vente en ligne de livres neufs livrés, frais de livraison minimum de 3 € TTC en dessous de 35 € d'achat.

**Conditions appliquées par le logiciel.** secteur : Livres ET Commande ou paiement en ligne

**S'applique si :**
- Vente de livres neufs.

**Ne s'applique pas si :**
- Livres d'occasion.

**Loi n° 81-766 (Lang), art. 1** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Loi n° 81-766 « Lang », art. 1

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Jeux d'argent : agrément et mise en garde

`sect.jeux` · empreinte `b83842014b315174` · Loi (peut produire « Illégal » une fois validée) · gravité critique

**Exigence affichée aux clients.** Seuls les opérateurs agréés par l'ANJ peuvent proposer des jeux d'argent en ligne ; les communications portent un message de mise en garde et l'interdiction aux mineurs.

**Conditions appliquées par le logiciel.** secteur : Jeux d'argent

**S'applique si :**
- Opérateurs de jeux d'argent en ligne.

**Doutes à trancher :**
- Préciser les articles exacts (agrément, messages de mise en garde) : la règle cite la loi sans article.

**Loi n° 2010-476, art. 21** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Loi n° 2010-476 du 12 mai 2010

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Formation professionnelle : déclaration d'activité

`sect.formation` · empreinte `370608a678f58c6d` · Loi (peut produire « Illégal » une fois validée) · gravité mineure

**Exigence affichée aux clients.** Quand un organisme de formation fait état de sa déclaration d'activité, c'est uniquement sous la forme : « Enregistrée sous le numéro … Cet enregistrement ne vaut pas agrément de l'État. » La certification Qualiopi, si elle est obtenue, peut être indiquée.

**Conditions appliquées par le logiciel.** secteur : Formation professionnelle

**S'applique si :**
- Organismes de formation professionnelle déclarés.

**Code du travail, art. L6352-12** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code du travail, art. L6352-12 ; Code du travail, art. L6351-1 et R6351-1 et s.

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

### Photographies commerciales retouchées

`sect.photos-retouchees` · empreinte `0c904fa8e24832b4` · Loi (peut produire « Illégal » une fois validée) · gravité mineure

**Exigence affichée aux clients.** Les photographies à usage commercial de mannequins dont la silhouette a été modifiée portent la mention « photographie retouchée ».

**Sanction affichée.** 37 500 € d'amende, portée jusqu'à 30 % des dépenses consacrées à la publicité (CSP art. L2133-2).

**Conditions appliquées par le logiciel.** Publicité, affiliation ou contenus sponsorisés ET Commande ou paiement en ligne

**S'applique si :**
- Photographies à usage commercial de mannequins dont la silhouette a été modifiée.

**Ne s'applique pas si :**
- Retouches qui ne modifient pas la silhouette.

**Code de la santé publique, art. L2133-2** : texte officiel non récupéré (non récupéré : identifiants PISTE absents).

**Sources affichées.** Code de la santé publique, art. L2133-2

**Validation.** ☐ Validée ☐ À corriger · Par : ____________ · Le : ________ · Remarques : ______________________

---

## Articles dont le texte officiel reste à récupérer (82)

- Code civil, art. 1127-1
- Code civil, art. 1127-2
- Code civil, art. 1127-3
- Code civil, art. 1641
- Code de commerce, art. D441-5
- Code de commerce, art. L441-1
- Code de commerce, art. L441-10
- Code de commerce, art. R123-237
- Code de l'environnement, art. L229-68
- Code de l'environnement, art. L541-9-1
- Code de l'environnement, art. L541-9-2
- Code de la consommation, art. D211-2
- Code de la consommation, art. D213-1
- Code de la consommation, art. D215-1
- Code de la consommation, art. D221-5
- Code de la consommation, art. L111-1
- Code de la consommation, art. L111-4
- Code de la consommation, art. L111-7
- Code de la consommation, art. L111-7-2
- Code de la consommation, art. L111-7-3
- Code de la consommation, art. L112-1
- Code de la consommation, art. L112-1-1
- Code de la consommation, art. L121-1
- Code de la consommation, art. L121-2
- Code de la consommation, art. L121-4
- Code de la consommation, art. L212-1
- Code de la consommation, art. L213-1
- Code de la consommation, art. L215-1
- Code de la consommation, art. L215-1-1
- Code de la consommation, art. L215-4
- Code de la consommation, art. L216-1
- Code de la consommation, art. L216-4
- Code de la consommation, art. L217-3
- Code de la consommation, art. L217-7
- Code de la consommation, art. L221-11
- Code de la consommation, art. L221-13
- Code de la consommation, art. L221-14
- Code de la consommation, art. L221-18
- Code de la consommation, art. L221-21
- Code de la consommation, art. L221-28
- Code de la consommation, art. L221-5
- Code de la consommation, art. L223-2
- Code de la consommation, art. L224-25-12
- Code de la consommation, art. L312-5
- Code de la consommation, art. L612-1
- Code de la consommation, art. L616-1
- Code de la consommation, art. R111-1
- Code de la consommation, art. R111-2
- Code de la consommation, art. R212-1
- Code de la consommation, art. R212-2
- Code de la consommation, art. R221-1
- Code de la consommation, art. R221-2
- Code de la consommation, art. R616-1
- Code de la santé publique, art. L1111-8
- Code de la santé publique, art. L2133-2
- Code de la santé publique, art. L3323-4
- Code de la santé publique, art. L3342-1
- Code de la santé publique, art. L5125-33
- Code des assurances, art. L243-2
- Code des assurances, art. L512-1
- Code des postes et des communications électroniques, art. L34-5
- Code du tourisme, art. L211-18
- Code du tourisme, art. L211-8
- Code du travail, art. L6352-12
- Code général des impôts, art. 286 ter
- Code monétaire et financier, art. L112-12
- LCEN (loi n° 2004-575), art. 1-1
- LCEN (loi n° 2004-575), art. 1-2
- LCEN (loi n° 2004-575), art. 19
- LCEN (loi n° 2004-575), art. 20
- Loi Informatique et Libertés (n° 78-17), art. 45
- Loi Informatique et Libertés (n° 78-17), art. 48
- Loi Informatique et Libertés (n° 78-17), art. 82
- Loi Informatique et Libertés (n° 78-17), art. 85
- Loi n° 2005-102, art. 47
- Loi n° 2010-476, art. 21
- Loi n° 2023-451, art. 5
- Loi n° 70-9 (Hoguet), art. 6
- Loi n° 81-766 (Lang), art. 1
- Loi n° 82-652 du 29 juillet 1982, art. 93-2
- Loi n° 94-665 (Toubon), art. 2
- Loi n° 96-603, art. 22-2
