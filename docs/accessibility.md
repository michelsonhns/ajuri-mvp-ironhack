# Suivi accessibilité du prototype Ajuri

Le RGAA est la cible de conception. Ce document décrit les vérifications du prototype ; ce n’est pas une déclaration de conformité ni un audit exhaustif.

## Mesures intégrées

- Langue `en` cohérente avec les écrans anglais de la maquette.
- Un titre principal par page, sections et listes de champs structurées.
- Régions `header`, `nav`, `main`, lien d’évitement et titre de document actualisé.
- Éléments natifs et composants MUI pour boutons, liens, champs, cases à cocher, interrupteurs et dialogues.
- Libellés explicites, indications des champs optionnels, erreurs associées aux champs.
- Focus visible, déplacement vers le contenu lors du changement de page, confinement du focus des dialogues, annulation par Échap et retour au déclencheur.
- Statuts exprimés par des mots et des icônes ; graphiques avec valeurs numériques et alternative textuelle.
- Ressources décoratives avec alternative vide et logo avec nom accessible.
- Contrastes des textes vérifiés automatiquement par axe ; texte secondaire conservé à une couleur lisible.
- Boutons principaux et contrôles interactifs avec zone d’action d’au moins 44 px, généralement 48 px.
- Mise en page responsive, sans défilement horizontal aux largeurs testées.
- Respect de `prefers-reduced-motion`.
- Retour de progression de checklist avec région `aria-live`.

## Vérifications reproductibles

`npm test` exécute les parcours d’absence, d’acceptation, de refus, de reprise après erreur réseau, la persistance et la gestion clavier du dialogue de suppression.

Les contrôles axe ciblent WCAG 2 A/AA et WCAG 2.1 A/AA sur l’accueil, le tableau de bord, les remplacements, les trois étapes de configuration, la fiche bénévole, les créneaux mobiles, le formulaire d’absence, la demande de remplacement et la checklist, à 390 × 844 et 1440 × 1024.

Les captures générées dans `test-results/` servent à comparer le rendu à Figma.

## À compléter pour un audit RGAA

- Parcours complet avec VoiceOver / Safari et NVDA / Firefox.
- Zoom navigateur à 200 % et 400 %, agrandissement des caractères et espacement personnalisé du texte.
- Contrastes manuels des états focus, sélection, erreur et graphiques.
- Lecture et ordre de navigation dans tous les dialogues et tous les états dynamiques.
- Grille de critères RGAA applicable au périmètre réel et rédaction d’une déclaration d’accessibilité après audit.

Les textes de confidentialité de la maquette sont des contenus fictifs de démonstration : aucune politique serveur de conservation n’est implémentée dans ce prototype local.
