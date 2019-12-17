# [Step 1](./doc/step1.md)

Dans cette étape on va :

- créer un serveur Apollo en spécifiant un `schema`
- connecter notre serveur à une base de données cloud MongoDB Atlas via `mongoose`
- faire nos premières opérations CRUD de base : Read et Write

# [Step 2](./doc/step2.md)

Dans cette étape on va :

- ajouter un model `Quizz` qui contient lui même une collection de `questions`
- créer la query `allQuizz` pour récupérer les quizz et l'ensemble de ses sous-champs
- créer la mutation `saveQuizz`

# [Step 3](./doc/step3.md)

Dans cette étape on va :

- ajouter la query `quizzById` pour ne fetch qu'uin seul quizz
- créer mutation `deleteQuizz`
- créer la mutation `updateQuestion`
