###### Apollo Server Setup

Tout est indiqué dans la doc d'Apollo ici [lien](https://www.apollographql.com/docs/apollo-server/getting-started/)

Créer un dossier Vue-apollo-demo (ou le nom que vous voulez) : 

```
mkdir vue-apollo
cd vue apollo
npm init --yes
touch index.js typeDefs.graphql resolvers.js

```
C'est la structure de base, le minimum requis pour setup un serveur Apollo.

- `index.js` c'est la qu'on va instancier le `ApolloServer` 
- `typeDefs.graphql` le schéma qui définit la structure de données que le client peut `query` (GET) ou `mutate` (POST/PUT/DEL) [GQL Schema and Types](https://graphql.org/learn/schema/)
- `resolvers.js` le controller (au sens rest) : ce sont les fonctions qui vont récéptionner la requête et retourner quelque chose (ou pas!) au client

Pour pouvoir lancer le serveur, on ajoute un script dans `package.json` :

```json
  "scripts": {
    "server": "node index.js",
    ...
    }
```

C'est le moment d'installer Apollo et graphql 🚀 🚀
```shell script
npm install apollo-server graphql
```

###### Configuration minimale

1. Dans `index.js`

```js
//sert juste à indiquer le fichier typeDefs.graphql
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "typeDefs.graphql");

//import du schema et des resovers
const typeDefs = fs.readFileSync(filePath, "utf-8");
const resolvers = require("./resolvers");
//import de ApolloServeur
const { ApolloServer } = require('apollo-server');


// créée une instance de ApolloServer 
// avec le schéma qu'on vinet d'importer (typeDefs et resolvers)
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.listen().then(({url} )=> {
    console.log(`🤖🤖 Server listening on ${url}`)
})
```

2. Dans `typeDefs.graphql`

```graphql
type Question {
    _id: ID
    label: String!
    options: [String]!
    author: ID
}


type Query {
    questions:[Question]
}

```

On commence simplement avec un type `Question` et ses différents champs : 
notez le `!` pour required et le `[String]` pour signifier un array.
La Query `questions`  retourne simplement un array de questions. 
L'autre type manquant ici est la `Mutation` qu'on ajoutera par la suite


3.Dans `resolvers.js`

```js
module.exports = {
    Query: {
        questions: async (parent, args, context, info) => {
           ...
        }
    }
};

```

On retrouve la query `questions` qui a été définie plus haut : dans `typeDefs` on dit à Apollo _quel type de données_ on manipule, dans les resolvers, on lui dit _quoi en faire_  

/!\ Noter les paramètres de la fonction `parent, args, context, info` sont importants à connaitre (dans les faits on se servira plus des 2 du milieu que des 2 autres)

/!\ [Lire la doc Apollo ici](https://www.apollographql.com/docs/apollo-server/data/data/#resolver-type-signature)

C'est dans cette fonction `questions` qu'on va requêter la base de données pour renvoyer les questions.
Mais on en est pas encore là, on va pour le moment se contenter d'un glorieux : 

```js
module.exports = {
    Query: {
        questions: async (parent, args, context, info) => {
            const questions = [
                {_id: "87654654", label:"première question", options:["1", "2", "3"], author: "54651"},
                {_id: "1154654", label:"test", options:["1", "2", "3"], author: "4864987"}
             ];
            return questions
        }
    }
};

```

Maintenant si on `npm run server` ca doit marcher et on doit voir `🤖🤖 Server listening on http://localhost:4000/
` s'afficher sur la console 🕺🕺🕺


###### Graphql playground

C'est une feature que j'aime beaucoup et qui permet de developper très vite une api en graphql:

Ouvrir le navigateur sur `http://localhost:4000/` :tadaaaam:

Noter les 2 onglets DOCS et SCHEMA à droite dans lesquels on retrouve notre structure. Très pratique pour servir de doc quand un projet commence a prendre de l'ampleur !

Dans la fenêtre de gauche, je peux écrire ma query graphql `questions`

```graphql
query {
  questions {
    _id
  }
}

```
et normalement au clic, apollo me retourne mes questions : 

```json
{
  "data": {
    "questions": [
      {
        "_id": "87654654"
      },
      {
        "_id": "1154654"
      }
    ]
  }
}
```

Et évidemment c'est tout l'intérêt de graphql, je peux spécifier exactement ce que je veux en modifiant la requete : 

```graphql
query {
  questions {
    _id
    label
    author
  }
}

```

```json
{
  "data": {
    "questions": [
      {
        "_id": "87654654",
        "label": "première question",
        "author": "54651"
      },
      {
        "_id": "1154654",
        "label": "test",
        "author": "4864987"
      }
    ]
  }
}
```
