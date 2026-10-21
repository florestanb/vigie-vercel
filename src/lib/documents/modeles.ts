// Modèles publiés par les autorités, recopiés mot pour mot. Les passages entre crochets sont à remplir.
// Seuls des textes officiels figurent ici : les modèles d'éditeurs ou de cabinets privés sont protégés par le droit d'auteur.

export interface Modele {
  source: string;
  url: string;
  consulte: string; // date de la dernière vérification du texte (AAAA-MM-JJ)
  /** Format imposé : le texte est repris tel quel, seuls les crochets changent. Sinon, c'est une illustration à adapter. */
  obligatoire: boolean;
  /** Consigne propre au modèle, ajoutée à la consigne générale. */
  consigne?: string;
  texte: string;
}

export const MODELE_DECLARATION_ACCESSIBILITE: Modele = {
  source: "DINUM, « Déclaration d'accessibilité » (RGAA), format obligatoire",
  url: "https://accessibilite.numerique.gouv.fr/obligations/declaration-accessibilite/",
  consulte: "2026-10-12",
  obligatoire: true,
  texte: `[Nom de l'organisme concerné] s'engage à rendre [son (ses) site(s) internet, intranet, extranet et son (ses) application(s) mobile(s), etc.] accessibles conformément à l'article 47 de la loi n° 2005-102 du 11 février 2005.

À cette fin, il met en œuvre la stratégie et les actions suivantes [liens vers le schéma pluriannuel et vers le plan d'action de l'année en cours incluant le bilan des actions réalisées l'année précédente].

Cette déclaration d'accessibilité s'applique à [Nom du site web de l'application mobile, ou d'un autre service auquel la déclaration s'applique].

## État de conformité

[Nom du site web, de l'application mobile, ou d'un autre service concerné] est [totalement / partiellement / non] conforme avec [pour les sites : le référentiel général d'amélioration de l'accessibilité / autre protocole de test utilisé ; pour les autres services de communication : protocole de test utilisé].

## Résultat des tests

L'audit de conformité réalisé [en interne / par la société NNN] révèle que :

[pourcentage de critères RGAA respectés] des critères RGAA sont respectés.

[Facultatif] Le taux moyen de conformité du service en ligne s'élève à [taux moyen de conformité du service en ligne].

[Détailler ici les résultats des tests ou insérer un lien vers le rapport de test]

## Contenus non accessibles

Les contenus listés ci-dessous ne sont pas accessibles pour les raisons suivantes.

### Non conformité

[Lister la/les non-conformité(s) du/de la/des site(s) internet/application(s) mobile(s) et/ou décrire quels section(s)/contenu(s)/fonction(s) ne sont pas encore conformes, indiquer les alternatives s'il y a lieu].

### Dérogations pour charge disproportionnée

[Lister la/le/les section(s)/contenu(s)/fonction(s) non accessible(s) pour laquelle/lequel/lesquels la dérogation pour charge disproportionnée est temporairement invoquée, indiquer les alternatives s'il y a lieu].

### Contenus non soumis à l'obligation d'accessibilité

[Lister la/le/les section(s)/contenu(s)/fonction(s) non accessible(s) qui n'entre(nt) pas dans le champ d'application de la législation applicable, indiquer les alternatives s'il y a lieu].

## Établissement de cette déclaration d'accessibilité

Cette déclaration a été établie le [JJ mois AAAA]. Elle a été mise à jour le [JJ mois AAAA].

### Technologies utilisées pour la réalisation [Du site web / De l'application mobile / Du service…]

[Liste des technologies utilisées]

### Environnement de test

Agents utilisateurs, technologies d'assistance et outils utilisés pour vérifier l'accessibilité

[Indiquer les combinaisons utilisées pour effectuer les vérifications de conformité]

### Les outils utilisés lors de l'évaluation

[Indiquer les outils utilisés]

### Pages du site ayant fait l'objet de la vérification de conformité

[Indiquer la liste des pages qui ont été testées]

## Retour d'information et contact

Si vous n'arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le responsable du [site internet / application mobile / Autre service] pour être orienté vers une alternative accessible ou obtenir le contenu sous une autre forme.

- Envoyer un message [url du formulaire en ligne]
- Contacter [Nom de l'entité responsable du service en ligne] [url d'une page avec les coordonnées de l'entité]

## Voies de recours

Cette procédure est à utiliser dans le cas suivant.

Vous avez signalé au responsable du site internet un défaut d'accessibilité qui vous empêche d'accéder à un contenu ou à un des services du portail et vous n'avez pas obtenu de réponse satisfaisante.

- Écrire un message au Défenseur des droits (https://www.defenseurdesdroits.fr/nous-contacter-355)
- Contacter le délégué du Défenseur des droits près de chez vous (https://www.defenseurdesdroits.fr/carte-des-delegues)
- Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) :
  Défenseur des droits
  Libre réponse 71120
  75342 Paris CEDEX 07`,
};

export const MODELE_MENTION_FORMULAIRE: Modele = {
  source: "CNIL, « Exemples de formulaire de collecte de données à caractère personnel » (26 juillet 2019), exemple 1",
  url: "https://cnil.fr/fr/exemples-de-formulaire-de-collecte-de-donnees-caractere-personnel",
  consulte: "2026-10-12",
  obligatoire: false,
  texte: `Les informations recueillies sur ce formulaire sont enregistrées dans un fichier informatisé par [identité et coordonnées du responsable de traitement] pour [finalités du traitement]. La base légale du traitement est [base légale du traitement].

Les données collectées seront communiquées aux seuls destinataires suivants : [destinataires des données].

Les données sont conservées pendant [durée de conservation des données prévue par le responsable du traitement ou critères permettant de la déterminer].

Vous pouvez accéder aux données vous concernant, les rectifier, demander leur effacement ou exercer votre droit à la limitation du traitement de vos données. (en fonction de la base légale du traitement, mentionner également : Vous pouvez retirer à tout moment votre consentement au traitement de vos données ; Vous pouvez également vous opposer au traitement de vos données ; Vous pouvez également exercer votre droit à la portabilité de vos données)

Consultez le site cnil.fr pour plus d'informations sur vos droits.

Pour exercer ces droits ou pour toute question sur le traitement de vos données dans ce dispositif, vous pouvez contacter (le cas échéant, notre délégué à la protection des données ou le service chargé de l'exercice de ces droits) : [adresse électronique, postale, coordonnées téléphoniques, etc.]

Si vous estimez, après nous avoir contactés, que vos droits « Informatique et Libertés » ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL.

N.B : distinguer dans le formulaire de collecte, par exemple via des astérisques, les données dont la fourniture est obligatoire de celles dont la fourniture est facultative et précisez les conséquences éventuelles en cas de non-fourniture des données.`,
};

/**
 * Avis d'information type sur la rétractation. Correctement rempli, il vaut respect des obligations
 * d'information sur la rétractation (art. L221-5 et R221-3 du Code de la consommation).
 * Les appels (1) à (6) se remplacent selon les instructions, qui ne figurent pas dans le texte publié.
 */
export const MODELE_INFORMATION_RETRACTATION: Modele = {
  source: "Code de la consommation, annexe à l'article R221-3 (version en vigueur depuis le 19 juin 2026, décret n° 2026-3 du 5 janvier 2026)",
  url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053303407",
  consulte: "2026-10-12",
  obligatoire: true,
  texte: `INFORMATIONS CONCERNANT L'EXERCICE DU DROIT DE RÉTRACTATION

Droit de rétractation

Vous avez le droit de vous rétracter du présent contrat sans donner de motif dans un délai de quatorze jours.

Le délai de rétractation expire quatorze jours après le jour (1).

Pour exercer le droit de rétractation, vous devez nous notifier (2) votre décision de rétractation du présent contrat au moyen d'une déclaration dénuée d'ambiguïté (par exemple, lettre envoyée par la poste ou courrier électronique). Vous pouvez utiliser le modèle de formulaire de rétractation mais ce n'est pas obligatoire (3).

Pour que le délai de rétractation soit respecté, il suffit que vous transmettiez votre communication relative à l'exercice du droit de rétractation avant l'expiration du délai de rétractation.

Effets de rétractation

En cas de rétractation de votre part du présent contrat, nous vous rembourserons tous les paiements reçus de vous, y compris les frais de livraison (à l'exception des frais supplémentaires découlant du fait que vous avez choisi, le cas échéant, un mode de livraison autre que le mode moins coûteux de livraison standard proposé par nous) sans retard excessif et, en tout état de cause, au plus tard quatorze jours à compter du jour où nous sommes informés de votre décision de rétractation du présent contrat. Nous procéderons au remboursement en utilisant le même moyen de paiement que celui que vous aurez utilisé pour la transaction initiale, sauf si vous convenez expressément d'un moyen différent ; en tout état de cause, ce remboursement n'occasionnera pas de frais pour vous (4).

(5)

(6)

Instructions à suivre pour remplir les informations :

(1) Insérez l'un des passages suivants entre guillemets :

a) S'il s'agit d'un contrat de service ou d'un contrat portant sur la fourniture d'eau, de gaz ou d'électricité lorsqu'ils ne sont pas conditionnés dans un volume délimité ou en quantité déterminée, de chauffage urbain ou d'un contenu numérique non fourni sur un support matériel : " de la conclusion du contrat. " ;

b) S'il s'agit d'un contrat de vente : " où vous-même, ou un tiers autre que le transporteur et désigné par vous, prend physiquement possession du bien. " ;

c) S'il s'agit d'un contrat portant sur plusieurs biens commandés par le consommateur au moyen d'une seule commande et si ces biens sont livrés séparément : " où vous-même, ou un tiers autre que le transporteur et désigné par vous, prend physiquement possession du dernier bien. " ;

d) S'il s'agit d'un contrat portant sur la livraison d'un bien en plusieurs lots ou pièces : " où vous-même, ou un tiers autre que le transporteur et désigné par vous, prend physiquement possession du dernier lot ou de la dernière pièce. " ;

e) S'il s'agit d'un contrat portant sur la livraison régulière de biens pendant une période de temps déterminée : " où vous-même, ou un tiers autre que le transporteur et désigné par vous, prend physiquement possession du premier bien. " ;

(2) Insérez votre nom, votre adresse géographique, votre numéro de téléphone et votre adresse électronique.

(3) Si vous êtes tenu de prévoir une fonctionnalité permettant au consommateur de se rétracter du contrat conclu en ligne, insérez le texte suivant : “Vous pouvez également exercer votre droit de rétractation en ligne sur [insérer l'adresse du site internet ou une autre référence adéquate indiquant où se trouve la fonctionnalité de rétractation]. Si vous utilisez cette fonctionnalité en ligne, nous vous enverrons, dans les meilleurs délais, un accusé de réception de la rétractation sur un support durable (par exemple, par courriel), y compris son contenu ainsi que la date et l'heure de sa soumission.”. Si vous offrez au consommateur la faculté de remplir et de transmettre électroniquement sa rétractation du contrat sur votre site internet, insérez le texte suivant : “Vous pouvez également remplir et transmettre le modèle de formulaire de rétractation ou toute autre déclaration dénuée d'ambiguïté sur notre site internet [insérer l'adresse du site internet]. Si vous utilisez cette option, nous vous enverrons dans les meilleurs délais un accusé de réception de la rétractation sur un support durable (par exemple, par courriel).”

(4) S'il s'agit d'un contrat de vente dans le cadre duquel vous n'avez pas proposé de récupérer le bien en cas de rétractation, insérez le texte suivant : " Nous pouvons différer le remboursement jusqu'à ce que nous ayons reçu le bien ou jusqu'à ce que vous ayez fourni une preuve d'expédition du bien, la date retenue étant celle du premier de ces faits. "

(5) Si le consommateur a reçu des biens dans le cadre du contrat :

a) Insérez :

" Nous récupérerons le bien " ; ou

" Vous devrez renvoyer ou rendre le bien, à nous-mêmes ou à ... [insérer le nom et l'adresse géographique, le cas échéant, de la personne habilitée par vous à réceptionner le bien] sans retard excessif et, en tout état de cause, au plus tard quatorze jours après que vous nous aurez communiqué votre décision de rétractation du présent contrat. Ce délai est réputé respecté si vous renvoyez le bien avant l'expiration du délai de quatorze jours. "

b) Insérez :

" Nous prendrons en charge les frais de renvoi du bien. " ;

" Vous devrez prendre en charge les frais directs de renvoi du bien. " ;

Si, dans le cas d'un contrat à distance, vous ne proposez pas de prendre en charge les frais de renvoi du bien et que le bien, en raison de sa nature, ne peut normalement être renvoyé par la poste : " Vous devrez prendre en charge les frais directs de renvoi du bien, ... EUR [insérer le montant]. " ; ou, si le coût de renvoi du bien ne peut raisonnablement être calculé à l'avance : " Vous devrez prendre en charge les frais directs de renvoi du bien. Ces frais sont estimés à un maximum d'environ ... EUR [insérer le montant]. " ; ou

Si, dans le cas d'un contrat hors établissement, le bien, en raison de sa nature, ne peut normalement être renvoyé par la poste et a été livré au domicile du consommateur au moment de la conclusion du contrat : " Nous récupérerons le bien à nos propres frais. " et

c) Insérez : " Votre responsabilité n'est engagée qu'à l'égard de la dépréciation du bien résultant de manipulations autres que celles nécessaires pour établir la nature, les caractéristiques et le bon fonctionnement de ce bien. "

(6) Dans le cas d'un contrat de prestation de services ou de fourniture d'eau, de gaz ou d'électricité lorsqu'ils ne sont pas conditionnés dans un volume délimité ou en quantité déterminée, ou de chauffage urbain, insérez le texte suivant : " Si vous avez demandé de commencer la prestation de services ou la fourniture d'eau/de gaz/d'électricité/de chauffage urbain [supprimer les mentions inutiles] pendant le délai de rétractation, vous devrez nous payer un montant proportionnel à ce qui vous a été fourni jusqu'au moment où vous nous avez informé de votre rétractation du présent contrat, par rapport à l'ensemble des prestations prévues par le contrat. "`,
};

/** Formulaire type remis au consommateur : le professionnel ne remplit que ses coordonnées, le reste est rempli par le client. */
export const MODELE_FORMULAIRE_RETRACTATION: Modele = {
  source: "Code de la consommation, annexe à l'article R221-1 (version en vigueur depuis le 28 mai 2022, décret n° 2022-424 du 25 mars 2022)",
  url: "https://www.legifrance.gouv.fr/search/code?tab_selection=code&query=Annexe%20%C3%A0%20l%27article%20R221-1",
  consulte: "2026-10-12",
  obligatoire: true,
  consigne:
    "Remplace uniquement le crochet par le nom, l'adresse géographique et l'adresse électronique du professionnel. Garde tels quels les astérisques (*), les doubles mentions « Je/nous », « vente du bien/prestation de services », « Commandé le/reçu le » et la ligne « (*) Rayez la mention inutile. » : c'est le consommateur qui raye. Laisse vides les lignes que le consommateur remplit.",
  texte: `MODÈLE DE FORMULAIRE DE RÉTRACTATION

(Veuillez compléter et renvoyer le présent formulaire uniquement si vous souhaitez vous rétracter du contrat.)

A l'attention de [le professionnel insère ici son nom, son adresse géographique et son adresse électronique] :

Je/nous (*) vous notifie/notifions (*) par la présente ma/notre (*) rétractation du contrat portant sur la vente du bien (*)/pour la prestation de services (*) ci-dessous :

Commandé le (*)/reçu le (*) :

Nom du (des) consommateur(s) :

Adresse du (des) consommateur(s) :

Signature du (des) consommateur(s) (uniquement en cas de notification du présent formulaire sur papier) :

Date :

(*) Rayez la mention inutile.`,
};
