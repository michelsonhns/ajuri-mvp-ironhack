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

L’interface est en anglais, conformément aux écrans de démonstration Figma.

1. **Pedro** : mes créneaux → signaler une absence → confirmation. En mode hors ligne, le formulaire conserve les réponses et propose de réessayer.
2. **Camila** : tableau de bord → alerte d’absence → suggestions classées selon la charge → envoyer une demande.
3. **Ana** : demande → accepter ou refuser → checklist / créneaux. Le résultat est visible en revenant au tableau de bord.
4. **Configuration** : nom d’équipe, fonctions et checklist, objectifs, sélection des bénévoles.
5. **Fiche bénévole** : modification, paramètres de partage, export JSON, retrait avec confirmation et possibilité d’annulation.

Le lien « Test roles » revient à l’accueil. « Reset prototype data » réinitialise les données fictives. La page des remplacements propose également une simulation d’absence pour lancer le scénario depuis Camila.

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
