# Ajuri · prototype haute fidélité

Prototype interactif de coordination des bénévoles, basé sur la [maquette Figma](https://www.figma.com/design/vUnHx78MCcXTG607f5Ul0a/Mich---Final-Project-figma?node-id=2301-294).

## Démarrer

Node.js 24 recommandé.

```sh
npm ci
npm run dev
```

```sh
npm run lint
npm run build
npx playwright install chromium
npm test
```

`npm run preview` sert le build de production. `npm run format` applique Prettier.

## Stack et architecture

- React 19, TypeScript strict, Vite, MUI 7 et Emotion.
- `src/theme/` : tokens sémantiques Figma, typographie Nunito Sans locale et thème MUI.
- `src/components/atoms/` : logo, icônes originales, tags, avatars, panneaux.
- `src/components/molecules/` : carte de créneau et visualisation de charge.
- `src/components/organisms/` : navigation et structure de l’application.
- `src/pages/` : accueil de test, configuration, tableau de bord, remplacements, fiche bénévole, parcours mobiles.
- `src/domain/` : modèles TypeScript et données fictives.
- `src/state/` : état partagé et persistance locale. Aucun backend nécessaire.

Les SVG Figma sont conservés dans `public/assets/`. Aucune URL temporaire Figma n’est utilisée à l’exécution. Les captures Figma ne sont pas utilisées comme écran ou comme image de fond.

## Tester les parcours

L’interface est disponible en anglais et en portugais brésilien. Le sélecteur **English / Português (Brasil)** conserve le parcours et les données en cours. Le lien `/#/?lang=pt-BR` ouvre directement la version brésilienne ; `lang=en` ouvre la version anglaise. La préférence est mémorisée dans le navigateur lorsque le stockage local est disponible.

1. **Pedro** : mes créneaux → signaler une absence → confirmation. En mode hors ligne, le formulaire conserve les réponses et propose de réessayer.
2. **Camila** : tableau de bord → alerte d’absence → suggestions classées selon la charge → envoyer une demande.
3. **Ana** : demande → accepter ou refuser → checklist / créneaux. Le résultat est visible en revenant au tableau de bord.
4. **Configuration** : nom d’équipe, fonctions et checklist, objectifs, sélection des bénévoles.
5. **Fiche bénévole** : modification, paramètres de partage, export JSON, retrait avec confirmation et possibilité d’annulation.

Le lien « Test roles » revient à l’accueil. « Reset prototype data » réinitialise les données fictives. La page des remplacements propose également une simulation d’absence pour lancer le scénario depuis Camila.

Les consignes de la section Figma **9 · Test EN** apparaissent dans des snackbars persistantes : tâche 1 sur le tableau de bord, tâche 2 pour Pedro, tâche 3 après signalement d’une absence et tâche 4 sur la demande d’Ana. « Next task → » simule l’absence de Pedro pour passer de la tâche 1 à la tâche 3. Les écrans de fin des tâches 2, 3 et 4 affichent la question de facilité, « Give feedback » et « Back to start ». Les consignes peuvent être réduites puis rouvertes ; elles n’expirent pas et leur espace est réservé pour laisser les actions accessibles.

Le [questionnaire de satisfaction](docs/feedback.md), accessible depuis l’accueil et les fins de tâche, enregistre les réponses dans une base Notion privée via un formulaire public intégré. Il recueille les rôles, la facilité de chaque tâche essayée, la satisfaction globale et des commentaires. La saisie et l’envoi sont volontaires ; les données du prototype ne sont pas transmises automatiquement.

La version PT-BR utilise un formulaire et une base Notion distincts afin de conserver la version anglaise et de séparer les cohortes de test. Les questions et les échelles sont équivalentes. Les traductions se trouvent dans `src/i18n/`, les identifiants métier et les données saisies restent indépendants de la langue d’affichage.

Les données restent dans le navigateur (`localStorage`, clé `ajuri-prototype-v1`). Les onglets partagent les données après rechargement ; aucune synchronisation serveur n’est prévue. Les invitations et messages sont simulés, sans envoi externe. Le semestre et les noms sont des données de démonstration. Ne pas saisir de données personnelles réelles.

La page Schedule reprend la vue des créneaux du tableau de bord : aucun calendrier complet hors maquette n’est ajouté. Les six bénévoles visibles représentent l’échantillon du prototype.

## Accessibilité

Voir [le suivi des vérifications](docs/accessibility.md). Le projet prend en compte les exigences RGAA applicables à ces parcours : structure sémantique, langue de page, formulaires nommés, navigation clavier, focus visible, gestion du focus des dialogues et des changements de page, messages textuels, statuts lisibles sans couleur et réduction des animations.

Les contrôles automatisés axe et les tests clavier apportent une vérification partielle. Ils ne permettent pas de déclarer une conformité RGAA complète. Une évaluation manuelle avec lecteur d’écran et une grille RGAA exhaustive restent nécessaires.

## GitHub Pages

Le workflow `.github/workflows/pages.yml` construit et publie `dist/` après un push sur `main` ou un lancement manuel. Dans Settings → Pages, sélectionner **GitHub Actions** comme source.

Le routage par hash (`/#/coordinator`) et les chemins d’assets relatifs permettent l’hébergement dans un sous-répertoire GitHub Pages et le rechargement direct des pages.

Dépôt cible : [michelsonhns/ajuri-mvp-ironhack](https://github.com/michelsonhns/ajuri-mvp-ironhack).

Aucune configuration ni dépendance Firebase n’est utilisée.
