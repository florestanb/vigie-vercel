import { EDITEUR as E, TEXTES_LEGAUX_MIS_A_JOUR } from "./editeur";
import { ABONNEMENTS, OFFRES, ORDRE_OFFRES, MOYENS_DE_PAIEMENT } from "./offres";

/**
 * Textes légaux de Vigie elle-même, en Markdown. L'identité de l'éditeur vient de editeur.ts.
 *
 * Fil directeur : Vigie est un logiciel d'aide à la conformité, pas un cabinet d'avocats. Elle ne délivre ni
 * consultation juridique ni acte rédigé pour autrui (loi n° 71-1130, art. 54) : elle produit des constats
 * automatisés et des modèles que le client complète, adapte et valide. Sa responsabilité est limitée autant
 * que le droit le permet entre professionnels, sans vider de sa substance l'obligation essentielle
 * (C. civ., art. 1170) ni exclure la faute lourde ou le dol (C. civ., art. 1231-3).
 */

const maj = new Date(TEXTES_LEGAUX_MIS_A_JOUR).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const NOM = E.nom;

const NATURE_DU_SERVICE = `Vigie est un logiciel d'aide à la conformité. **${NOM} n'est pas un cabinet d'avocats, n'emploie pas d'avocat pour fournir le service et ne délivre aucun conseil juridique.** Les rapports sont des constats produits automatiquement à partir des pages publiques d'un site, et les documents sont des modèles générés à partir des informations saisies par l'utilisateur. Ils ne constituent ni une consultation juridique ni la rédaction d'un acte pour autrui au sens de l'article 54 de la loi n° 71-1130 du 31 décembre 1971, et ne remplacent pas l'avis d'un professionnel du droit.`;

export const MENTIONS_LEGALES = `
## Éditeur

Le site Vigie est édité par **${NOM}**, ${E.formeJuridique} au capital de ${E.capital}, dont le siège social est situé ${E.siege}, immatriculée sous le numéro ${E.rcs}.

- Numéro de TVA intracommunautaire : ${E.tva}
- E-mail : ${E.email}
- Téléphone : ${E.telephone}

## Directeur de la publication

${E.directeurPublication}

## Hébergement

${E.hebergeur}. Téléphone : ${E.hebergeurTelephone}.

## Nature du service

${NATURE_DU_SERVICE}

## Propriété intellectuelle

Le logiciel Vigie, sa marque, son interface et le registre des obligations sont la propriété de ${NOM}. Les textes de loi cités et les modèles publiés par les autorités (DINUM, CNIL…) restent soumis à leurs propres conditions de réutilisation. Les polices Geist et Geist Mono sont distribuées sous licence SIL Open Font License.

## Signaler un contenu

Pour signaler une erreur dans le registre ou un contenu illicite, écrivez à ${E.email}.

*Dernière mise à jour : ${maj}.*
`;

export const CGU = `
Les présentes conditions générales d'utilisation (CGU) encadrent l'accès au site Vigie et l'usage de ses fonctions gratuites (audit d'un site, consultation du rapport, registre des obligations). Les prestations payantes sont régies par les [conditions générales de vente](/cgv).

## 1. Service réservé aux professionnels

Vigie s'adresse aux entreprises, associations, indépendants et organismes qui éditent un site web, ainsi qu'à leurs prestataires. En utilisant le service, vous déclarez agir à des fins professionnelles.

## 2. Ce que fait Vigie, et ce qu'elle ne fait pas

${NATURE_DU_SERVICE}

En pratique :

- Vigie ne lit que ce qui est **publiquement accessible** au moment de l'audit, comme le ferait un internaute : elle parcourt le site, clique sur le bouton de refus des cookies, ajoute un produit au panier et ouvre la page de commande, **sans jamais rien commander, payer ni saisir** ; elle ne voit ni l'espace client ni les documents internes ;
- le registre des obligations est établi à une date donnée (indiquée sur chaque page) et le droit évolue ensuite ;
- les constats automatiques peuvent être **incomplets ou erronés** (page mal détectée, site qui bloque les robots, contenu chargé tardivement…) et les analyses produites par intelligence artificielle peuvent contenir des erreurs ;
- un site jugé « conforme » par Vigie peut ne pas l'être, et inversement.

**Aucune garantie de conformité, de résultat ou d'absence de sanction n'est donnée.** Vous restez seul responsable de la conformité de votre site et des textes que vous y publiez. Pour une activité réglementée, un enjeu important ou en cas de doute, faites relire par un avocat.

## 3. Intelligence artificielle

Certaines analyses et tous les modèles de documents sont **générés automatiquement** par un système d'intelligence artificielle (Claude, développé par Anthropic), sans intervention humaine. Ils sont signalés comme tels, conformément à l'article 50 du règlement (UE) 2024/1689 sur l'intelligence artificielle. Un modèle ne peut être copié ou téléchargé qu'après que vous l'avez expressément approuvé ; la date de cette approbation et l'empreinte du texte approuvé sont enregistrées.

## 4. Usage autorisé

Vous pouvez auditer tout site accessible au public. Un audit charge les pages du site comme le ferait un internaute (quelques dizaines de pages au plus, avec un robot qui s'identifie comme « VigieAudit ») et peut créer un panier anonyme, jamais validé. Il est interdit :

- d'automatiser l'envoi d'audits, de contourner les limites d'usage ou de perturber le fonctionnement du service ;
- d'extraire massivement le registre ou les rapports ;
- de présenter un rapport Vigie comme un avis juridique, ou de l'utiliser pour dénigrer un tiers ou faire pression sur lui.

${NOM} peut suspendre l'accès en cas de manquement.

## 5. Rapports

Chaque rapport est accessible à toute personne qui en connaît le lien. Ne le partagez qu'avec les personnes concernées. Les rapports sont supprimés au bout de ${E.conservationAuditsMois} mois.

## 6. Responsabilité

Le service gratuit est fourni « en l'état ». Dans les limites permises par la loi, ${NOM} n'est pas responsable des décisions prises sur la base d'un rapport ou d'un document généré, ni des conséquences d'une mise en conformité incomplète, notamment d'une sanction administrative, d'une condamnation ou d'une perte d'exploitation. Cette limitation ne s'applique pas en cas de faute lourde ou de dol.

## 7. Disponibilité

Le service peut être interrompu pour maintenance ou en cas d'incident, sans indemnité.

## 8. Données personnelles

Voir la [politique de confidentialité](/confidentialite).

## 9. Modification des CGU

Les CGU applicables sont celles en ligne au moment de l'utilisation. Toute modification est datée ci-dessous.

## 10. Droit applicable

Les présentes CGU sont soumises au droit français. Tout litige entre professionnels relève de la compétence exclusive du ${E.tribunal}.

*Dernière mise à jour : ${maj}.*
`;

export const CGV = `
Les présentes conditions générales de vente (CGV) s'appliquent à toute commande de prestations payantes Vigie passée auprès de **${NOM}** (le « Prestataire ») par un client professionnel (le « Client »). Elles prévalent sur tout autre document du Client, sauf accord écrit contraire.

## 1. Clients professionnels uniquement

Les prestations sont réservées aux professionnels qui commandent pour les besoins de leur activité. Le Client le déclare en passant commande. Les dispositions du Code de la consommation propres aux consommateurs, dont le droit de rétractation, ne s'appliquent donc pas.

## 2. Nature des prestations

${NATURE_DU_SERVICE}

Les prestations consistent à fournir, au moyen du logiciel :

- un **rapport d'audit** : liste des obligations susceptibles de s'appliquer au site, constats automatisés et sources ;
- des **modèles de documents** (mentions légales, politique de confidentialité, politique cookies, CGV, CGU, déclaration d'accessibilité) **générés automatiquement** par un système d'intelligence artificielle à partir des constats et des réponses du Client, qui comportent des champs à compléter ;
- pour les abonnements : le **réaudit hebdomadaire** des sites suivis, des **alertes** (nouveaux manquements, évolution du registre des obligations qui concerne ces sites), l'**hébergement** des documents approuvés et un **dossier de conformité** en PDF ;
- pour les offres Agence : la **marque blanche** des rapports et dossiers, l'**import CSV** et un **accès par API**.

Aucune personne n'intervient dans la génération des modèles : aucun juriste ni avocat ne les rédige, ne les relit ni ne les adapte à la situation du Client. Le Client choisit les informations qu'il fournit, complète et adapte les modèles, et décide seul de les publier. Il lui appartient de les faire valider par un professionnel du droit lorsque son activité, ses enjeux ou un doute le justifient.

## 3. Offres et prix

| Offre | Prix | Contenu |
|---|---|---|
${ORDRE_OFFRES.map((id) => {
  const o = OFFRES[id];
  return `| ${o.nom} | ${o.prix} €${o.periode === "mois" ? " par mois" : ""} | ${o.avantages.join(" ; ")} |`;
}).join("\n")}

Les montants indiqués sont ceux payés par le Client : ${E.mentionTva}. Le prix applicable est celui affiché au moment de la commande.

**Audit ponctuel.** L'achat permet de débloquer un site ; il est débloqué lorsque le Client choisit de l'associer à son achat, et ce choix est définitif. Pendant ${OFFRES.ponctuel.dureeJours} jours à compter du paiement, le Client peut lancer autant d'audits qu'il le souhaite sur ce site et générer ses modèles de documents. À l'issue de ce délai, les rapports déjà produits restent consultables jusqu'à leur suppression (voir la politique de confidentialité), mais les nouveaux audits sont présentés dans leur version gratuite.

**Abonnements (${ABONNEMENTS.map((id) => OFFRES[id].nom).join(", ")}).** L'abonnement est mensuel et se renouvelle automatiquement à chaque échéance. Il couvre, par période mensuelle, le nombre de sites indiqué ci-dessus : analyse complète, génération et hébergement des documents, suivi automatique. Le quota non utilisé n'est pas reporté. Le Client peut résilier à tout moment depuis son compte : la résiliation prend effet à la fin de la période en cours, déjà payée, sans remboursement au prorata.

## 4. Commande et compte

La commande se passe en ligne, depuis la page Tarifs : le Client coche la case d'acceptation des présentes CGV, choisit son offre, puis paie sur la page sécurisée de Stripe. Le compte du Client est créé automatiquement avec l'adresse e-mail indiquée lors du paiement ; il s'y connecte ensuite par un lien envoyé à cette adresse. La commande est ferme dès son paiement. Le Prestataire peut refuser une commande pour motif légitime (demande anormale, litige antérieur, site manifestement illicite).

## 5. Paiement et facturation

Le paiement est traité par Stripe ; le Prestataire n'a jamais accès aux données complètes de la carte ou du compte du Client. Moyens acceptés : ${MOYENS_DE_PAIEMENT.join(", ")}, selon leur disponibilité. L'abonnement est prélevé à chaque échéance sur le moyen de paiement enregistré. Une facture est émise pour chaque paiement et reste disponible depuis le compte du Client.

En cas d'échec d'un prélèvement, l'accès aux fonctions de l'abonnement peut être suspendu jusqu'à régularisation. Tout retard de paiement entraîne de plein droit, sans rappel :

- des pénalités de retard au taux d'intérêt appliqué par la Banque centrale européenne à son opération de refinancement la plus récente, majoré de 10 points ;
- une indemnité forfaitaire pour frais de recouvrement de 40 € (Code de commerce, art. L441-10 et D441-5).

## 6. Exécution

Le rapport et les modèles de documents sont mis à disposition en ligne dès leur génération. Ils sont réputés livrés à ce moment. Le Prestataire est tenu d'une **obligation de moyens** : il met en œuvre un registre d'obligations sourcé et tenu à jour, et des contrôles automatisés qu'il s'efforce de rendre fiables.

## 7. Approbation des modèles et obligations du Client

Le Client fournit des informations exactes et complètes, relit intégralement chaque modèle, remplit les champs « à compléter » et vérifie que le texte correspond à sa situation réelle.

**Un modèle ne peut être copié ni téléchargé qu'après son approbation expresse par le Client**, qui coche une déclaration par laquelle il reconnaît avoir relu et complété le modèle, avoir compris qu'il a été généré automatiquement sans conseil juridique, et l'approuver. Le Prestataire enregistre la date de cette approbation, le type de document et l'empreinte numérique (SHA-256) du texte approuvé ; cet enregistrement fait foi de la version validée par le Client et est conservé cinq ans.

Toute modification apportée par le Client après l'export, et toute publication, relèvent de sa seule responsabilité. Le Client demeure seul responsable de la conformité de son site, de ses pratiques et des textes qu'il publie.

## 7 bis. Documents hébergés, marque blanche et API

**Documents hébergés.** Le Client peut demander que la version d'un modèle qu'il a approuvée soit servie par le Prestataire à une adresse fixe, qu'il intègre à son site. Le Prestataire ne sert **que des versions approuvées par le Client** et n'en modifie jamais le contenu. Lorsque le registre des obligations évolue sur un point qui concerne le document, le Client en est informé ; la version en ligne reste inchangée jusqu'à ce que le Client approuve une nouvelle version. Le Client reste l'éditeur de ces documents au sens de la loi : le Prestataire agit comme simple prestataire technique d'hébergement. À la fin de l'abonnement, les documents hébergés restent servis dans leur dernière version pendant 90 jours, pour laisser au Client le temps de les reprendre sur son site, puis cessent de l'être.

**Marque blanche.** Le Client des offres Agence peut faire apparaître son nom et son logo sur les rapports et dossiers remis à ses propres clients. Il garantit disposer des droits sur ces éléments. Il reste seul responsable, vis-à-vis de ses clients, de la présentation qu'il fait de ces rapports, qui ne doivent pas être présentés comme un avis juridique.

**API.** La clé d'API est personnelle et confidentielle ; tout usage fait avec elle est réputé fait par le Client. Elle est soumise à une limite de 120 requêtes par heure, et chaque audit lancé par l'API entre dans le quota de l'abonnement.

## 8. Absence de garantie de résultat

Le droit évolue, les autorités et les juges interprètent les textes, et un logiciel ne voit qu'une partie d'un site. En conséquence, le Prestataire **ne garantit pas** :

- que le rapport relève tous les manquements ni que chaque constat est exact ;
- que les documents générés suffisent à rendre le site conforme ;
- que le Client échappera à un contrôle, une mise en demeure, une sanction ou un litige.

## 9. Responsabilité

La responsabilité du Prestataire ne peut être engagée qu'en cas de faute prouvée dans l'exécution de ses prestations. Elle est exclue pour les dommages indirects, notamment la perte de chiffre d'affaires, de clientèle ou d'image, et pour les amendes, sanctions ou condamnations prononcées contre le Client, qui découlent de sa propre situation juridique.

En tout état de cause, la responsabilité totale du Prestataire, toutes causes confondues, est **plafonnée au montant hors taxes payé par le Client au titre de la commande concernée**.

Ces limitations ne s'appliquent pas en cas de faute lourde ou de dol, et ne privent pas de sa substance l'obligation essentielle du Prestataire (Code civil, art. 1170 et 1231-3). Elles constituent un élément déterminant du prix.

## 10. Intelligence artificielle

Les analyses de textes et les modèles de documents sont générés automatiquement par un système d'intelligence artificielle (Claude, développé par Anthropic) et signalés comme tels (règlement (UE) 2024/1689, art. 50). Ils peuvent contenir des erreurs : c'est pourquoi le Client les relit et les approuve avant tout export (article 7).

## 11. Propriété intellectuelle

Le Client reçoit, dès paiement complet, le droit d'utiliser, de modifier et de publier les documents générés pour le site concerné. Le logiciel, le registre des obligations et les modèles du Prestataire restent sa propriété.

## 12. Données personnelles

Chaque partie respecte la réglementation applicable. Le traitement des données par le Prestataire est décrit dans la [politique de confidentialité](/confidentialite). Le Client s'abstient de saisir dans les formulaires de rédaction des données personnelles autres que celles nécessaires aux documents (identité de l'éditeur, du directeur de la publication, contacts).

## 13. Force majeure

Aucune partie n'est responsable d'un manquement causé par un cas de force majeure au sens de l'article 1218 du Code civil, y compris l'indisponibilité prolongée d'un prestataire technique essentiel.

## 14. Droit applicable et litiges

Les présentes CGV sont soumises au droit français. Les parties recherchent d'abord une solution amiable. À défaut, tout litige relève de la compétence exclusive du ${E.tribunal}.

*Dernière mise à jour : ${maj}.*
`;

export const CONFIDENTIALITE = `
Cette politique explique quelles données personnelles Vigie traite, pourquoi, combien de temps, et comment exercer vos droits (règlement (UE) 2016/679, « RGPD », et loi Informatique et Libertés).

## Responsable de traitement

**${NOM}**, ${E.siege}. Contact pour toute question relative à vos données : ${E.email}.

## Ce que nous traitons, pourquoi et combien de temps

| Traitement | Données | Base légale | Durée |
|---|---|---|---|
| Audit d'un site | Adresse du site, contenu de ses pages publiques (qui peut inclure des noms, e-mails ou téléphones publiés par l'éditeur), données de l'entreprise issues du répertoire Sirene, résultats | Intérêt légitime : fournir le service demandé et informer sur la conformité des sites | ${E.conservationAuditsMois} mois, puis suppression automatique |
| Captures d'écran prises pendant l'audit | Image des pages du site audité (bandeau cookies, page après refus, page de commande vide), qui peut montrer des informations publiées par l'éditeur | Intérêt légitime : apporter la preuve des constats | ${E.conservationAuditsMois} mois, avec l'audit |
| Rédaction de documents | Informations saisies dans le formulaire (identité de l'éditeur, du directeur de la publication, contacts) | Exécution du contrat ou des mesures précontractuelles | ${E.conservationAuditsMois} mois |
| Comptes et commandes | Adresse e-mail, achats, sites débloqués ou suivis, historique des audits de suivi | Exécution du contrat | Durée de la relation, puis 3 ans |
| Paiement et facturation | Nom, adresse de facturation, numéro de TVA, montant et moyen de paiement (les données de carte sont traitées par Stripe seul) | Exécution du contrat ; obligation légale pour la comptabilité | 10 ans pour les pièces comptables |
| Documents hébergés | Texte approuvé par le client (qui peut comporter l'identité et les coordonnées de l'éditeur du site), date et empreinte de chaque version | Exécution du contrat | Durée de l'abonnement, puis 90 jours ; empreintes et dates : 5 ans |
| Marque blanche et API | Nom, logo et coordonnées de l'agence ; empreinte de la clé d'API (jamais la clé elle-même) | Exécution du contrat | Durée de l'abonnement |
| Approbation des modèles | Date, type de document et empreinte du texte approuvé | Intérêt légitime : prouver la version validée par le client | 5 ans |
| Prospection entre professionnels | Adresse e-mail professionnelle publiée sur le site de l'entreprise, nom de domaine, résultats de l'audit de ce site, données Sirene de l'entreprise | Intérêt légitime : proposer nos services à des professionnels, en lien avec leur activité | 3 ans après le dernier échange ; en cas d'opposition, l'adresse est conservée sur une liste d'opposition pour ne plus vous écrire |
| Sécurité et limitation d'usage | Adresse IP | Intérêt légitime : protéger le service contre les abus | Gardée en mémoire au plus 1 heure, jamais enregistrée |

## Prospection : d'où viennent vos données

Si vous avez reçu un message de notre part, votre adresse e-mail a été relevée **sur le site de votre entreprise**, où elle était publiée, et votre site a été audité par Vigie à partir de ses pages publiques. Nous ne l'avons ni achetée ni obtenue auprès d'un tiers. Vous pouvez vous opposer à tout moment, sans motif, à recevoir nos messages : répondez « STOP » ou écrivez à ${E.email}. L'opposition est prise en compte immédiatement.

## Destinataires et sous-traitants

Vos données ne sont jamais vendues. Elles sont accessibles à l'équipe de ${NOM} et à ses sous-traitants, dans la limite de leur mission :

- **hébergement** : ${E.hebergeur} ;
- **analyse des textes et rédaction** : Anthropic PBC (États-Unis), via l'API Claude. Les contenus envoyés ne servent pas à entraîner ses modèles ;
- **paiement** : Stripe Payments Europe, Ltd. (Irlande), qui traite les paiements et la facturation ;
- **e-mails de connexion et d'alerte** : Resend, Inc. (États-Unis) ;
- **messagerie** : ${E.messagerie} ;
- **répertoire des entreprises** : l'API Recherche d'entreprises de l'État (recherche-entreprises.api.gouv.fr) est interrogée avec le numéro SIREN relevé sur le site.

## Transferts hors de l'Union européenne

Les données transmises à Anthropic, à Resend et, le cas échéant, à l'hébergeur sont traitées aux États-Unis. Ces transferts sont encadrés par [À COMPLÉTER : le Data Privacy Framework si le prestataire y est certifié, ou les clauses contractuelles types de la Commission européenne prévues par son contrat de sous-traitance]. Vous pouvez en obtenir une copie en nous écrivant.

## Cookies et stockage local

Vigie ne dépose **aucun cookie publicitaire ni de mesure d'audience**, et ne charge aucun service tiers dans votre navigateur (les polices sont servies par Vigie elle-même). Lorsque vous corrigez le profil d'un site dans un rapport, ce choix est enregistré dans le stockage local de votre navigateur pour être conservé d'une visite à l'autre. Ce stockage est strictement nécessaire à la fonction que vous utilisez et n'est pas soumis à consentement (loi Informatique et Libertés, art. 82). Vous pouvez l'effacer à tout moment depuis les réglages de votre navigateur. Lorsque vous vous connectez à votre compte, un cookie de session (« vigie_session », 30 jours) vous garde connecté ; l'espace d'administration réservé à l'équipe de Vigie utilise un cookie équivalent. Ces cookies sont strictement nécessaires au service que vous demandez. La page de paiement est hébergée par Stripe, qui y dépose ses propres cookies de sécurité et de prévention de la fraude.

## Vos droits

Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, de portabilité et d'opposition (en particulier à la prospection, sans avoir à vous justifier), ainsi que du droit de définir des directives sur le sort de vos données après votre décès. Pour les exercer : ${E.email}. Nous répondons dans un délai d'un mois.

Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL ([cnil.fr](https://www.cnil.fr)).

## Sécurité

Le site est servi exclusivement en HTTPS, l'accès aux serveurs est restreint, les données sont sauvegardées chaque jour sous forme chiffrée, et les rapports sont supprimés automatiquement à l'issue de leur durée de conservation. Les sauvegardes sont conservées 14 jours au plus.

*Dernière mise à jour : ${maj}.*
`;
