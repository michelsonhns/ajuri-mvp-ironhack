# Questionnaire de satisfaction · Notion

Le formulaire de réponse est intégré à `/#/feedback`, accessible depuis l’accueil et les snackbars de fin des tâches 2, 3 et 4. Une ouverture dans un nouvel onglet reste proposée si l’intégration est bloquée par le navigateur.

- [Formulaire public](https://atom-condor-c96.notion.site/33d14d81a0c840efae4c8f0a7e029bb0)
- [Base privée pour l’analyse](https://app.notion.com/p/1a54325a72e348dba597adb23894337b)

## Version en portugais brésilien

- [Prototype PT-BR](https://michelsonhns.github.io/ajuri-mvp-ironhack/#/?lang=pt-BR)
- [Formulaire PT-BR](https://atom-condor-c96.notion.site/da48149d32fc485095ce0dbd07661d08)
- [Base privée PT-BR](https://app.notion.com/p/266f77d5845440a0a17b043450d686e0)

Le sélecteur du prototype choisit automatiquement le bon formulaire. Le contenu des questions, les rôles, les consignes et les échelles sont traduits en portugais brésilien. Les boutons et messages gérés directement par Notion peuvent suivre la langue du navigateur du répondant.

Les deux bases sont séparées. Les colonnes PT-BR correspondent aux mêmes mesures : `Facilidade da tarefa 1–4 (1–7)`, `Satisfação geral (1–5)`, `Papéis testados` et les trois commentaires. La base PT-BR possède ses vues « Respostas dos participantes », « Satisfação baixa · revisar » et « Satisfação média · 1–5 ». Pour réunir les deux cohortes, exporter les données et harmoniser les noms des colonnes ; aucune synchronisation automatique entre bases n’est mise en place.

La réponse `QA-PT-BR — teste técnico` a vérifié la sauvegarde avec les notes 6, 5, 6 et 7 et une satisfaction de 4. Elle est marquée `Teste técnico` et exclue des vues d’analyse.

## Données collectées

Une ligne correspond à une réponse de session de test. Le participant remplit lui-même le questionnaire ; les données locales du prototype ne sont pas envoyées automatiquement.

| Champ                            | Utilisation                                                |
| -------------------------------- | ---------------------------------------------------------- |
| Participant code                 | Pseudonyme facultatif, sans nom réel demandé               |
| Roles tested                     | Un ou plusieurs rôles, obligatoire                         |
| Task 1 ease (1–7)                | Lire le tableau de bord ; facultatif                       |
| Task 2 ease (1–7)                | Signaler l’absence de Pedro ; facultatif                   |
| Task 3 ease (1–7)                | Trouver un remplacement ; facultatif                       |
| Task 4 ease (1–7)                | Répondre à la demande et trouver la checklist ; facultatif |
| Overall satisfaction (1–5)       | Satisfaction globale, obligatoire                          |
| What worked well?                | Commentaire facultatif                                     |
| What was difficult or confusing? | Commentaire facultatif                                     |
| What would you improve first?    | Commentaire facultatif                                     |
| Submitted at                     | Horodatage Notion automatique                              |
| Technical test                   | Champ interne excluant les essais techniques des analyses  |

Facilité : 1 = très difficile, 7 = très facile. Satisfaction : 1 = très insatisfait, 5 = très satisfait. Les tâches non essayées doivent rester vides : une valeur absente n’est pas une note zéro.

Notion utilise des champs numériques libres : vérifier les bornes et les doublons avant une analyse. Le formulaire recommande une seule réponse par session ; il ne bloque pas les réponses multiples. Le pseudonyme n’est pas automatiquement transmis ni prérempli depuis le prototype.

## Analyser les réponses

- **Participant responses** : toutes les réponses hors essais techniques, triées par date, avec filtre rapide sur les rôles.
- **Low satisfaction · follow up** : réponses dont la satisfaction est comprise entre 1 et 3, hors essais techniques.
- **Average satisfaction · 1–5** : moyenne des satisfactions comprises entre 1 et 5, hors essais techniques.

Pour calculer la facilité moyenne d’une tâche, ne conserver que les notes de 1 à 7 et les participants ayant essayé cette tâche. Ne pas interpréter ces questions comme un score SUS ou NPS : il s’agit de notes de facilité et de satisfaction.

Une réponse `QA-CHECK — technical test` a vérifié la chaîne formulaire → base. Elle est conservée avec `Technical test` coché et n’entre pas dans les trois vues d’analyse.

## Fonctionnement

Le formulaire public accepte les réponses anonymes sans donner accès aux réponses des autres testeurs. La base reste privée. Seul le formulaire de réponse est référencé dans le code public ; aucune clé Notion n’est embarquée et aucun service Firebase n’est ajouté.

La sauvegarde a lieu après **Submit** dans le formulaire Notion. L’application ne peut pas lire la confirmation d’envoi d’un iframe d’un autre domaine : elle n’affiche donc pas de fausse confirmation et ne marque pas une réponse comme envoyée lors d’un simple clic.

Pour suspendre la collecte, fermer le formulaire depuis sa vue Notion. Les droits d’accès à la base, la durée de conservation et les exports sont gérés dans Notion par le propriétaire de l’étude.

## Vérification

Les tests locaux et CI contrôlent les liens, le contexte conservé entre les parcours et le questionnaire, le titre accessible de l’iframe, le repli en cas d’échec de chargement et l’accessibilité de la page hôte sur mobile et desktop. Ils ne soumettent pas de réponses à Notion. Le formulaire externe a fait l’objet d’un envoi technique réel et d’une lecture des valeurs enregistrées ; il n’est pas inclus dans une déclaration de conformité RGAA de l’application.
