# Identité visuelle de Vigie

## Le nom

Une **vigie** est la personne postée en haut du mât qui repère les écueils avant que le navire ne les touche : voir les risques juridiques d'un site avant un contrôle ou une plainte.

## Principes

Fond blanc, texte noir, une couleur de marque : l'indigo. Sobre et net, avec quelques touches de vie (halo dégradé en haut de l'accueil, mot clé du titre en dégradé, survols teintés). Les autres couleurs ne servent qu'à porter une information : le statut d'un constat.

- **Aucune illustration dessinée à la main** (SVG décoratifs, pictogrammes maison). Si une image devient nécessaire, ce sera un visuel généré par IA, choisi et validé.
- Ombres rares et légères (champ d'adresse, survol d'un constat). Les surfaces se distinguent par un filet de 1 px.
- Thème clair uniquement.

## Logo

Le mot « vigie » en minuscules, en Geist semi-gras, suivi d'un point indigo (`src/components/Logo.tsx`). Favicon : un carré noir arrondi avec un « v » blanc (`public/favicon.svg`).

## Couleurs

| Nom | Valeur | Usage |
|---|---|---|
| Blanc | `#ffffff` | Fond |
| Noir | `#0a0a0a` | Texte |
| Indigo (marque) | `#4338ca`, vif `#6366f1`, pâle `#eef0ff` | Boutons principaux, liens, focus, numéros, halo |
| Gris 1 / 2 / 3 | `#fafafa` / `#f4f4f5` / `#e8e8ea` | Fonds secondaires, filets |
| Gris 5 / 7 | `#a1a1aa` / `#52525b` | Texte secondaire |
| Illégal | `#dc2626` | Manquement certain |
| Zone de flou | `#b45309` | Manquement discutable |
| Conforme | `#15803d` | Obligation respectée |
| Recommandé | `#6d28d9` | Bonne pratique, mention à retirer |

## Typographies

- **Geist** pour tout le texte ; titres en semi-gras, interlettrage resserré (-0,035 em).
- **Geist Mono** pour les références juridiques et les numéros.

Chargées via `next/font` : aucune requête vers Google au chargement de la page, ce qui serait un comble pour un outil d'audit RGPD.

## Mails de prospection

Même système, en version compatible messageries (tableaux, styles en ligne, police système) : `src/lib/prospection/mail.ts`.

## Ton

Clair, direct, sans jargon. On dit ce qui manque, pourquoi, ce que risque le site et comment corriger. Jamais d'alarmisme : la gravité suffit.
