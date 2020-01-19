# Step 7

Dans cette étrape, on va

- installer un framework CSS (optionnel) pour se faciliter la vie
- coder la HomePage avec la logique qui va avec (afficher, delete les quizz...)

## Installer un framework CSS

Comme j'ai envie ni d'écrire 20 000 lignes de css ni de vous infliger un truc trop moche, je vais choisir la solution du feignant et installer un framework CSS.

C'est entièrement optionnel et au choix de chacun : il y en a des tas, tous les principaux fonctionnent sur Vue (Bootstrap, etc...). Choisissez celui que vous préférez, en ce qui me concerne je vais installer [Vuetify](https://vuetifyjs.com/en/) qui est un framework _material design_ qui a en plus l'avantage (mais c'est pas le seul), d'être intégrable directement avec Vue Cli via un plugin.

Pour l'installer, il suffit de :

```shell script
  vue add vuetify
```

puis de choisir l'option par défaut.

(Encore une fois, faites le bien depuis le dossier `./client` et pas à la racine !)

Note : en installant le plugin Vuetify, Vue Cli edit le contenu du fichier `App.vue` avec du code par défaut. L'élément `<router-view></router-view>` n'y est plus ce qui fait que nos routes configurées juste avant ne fonctionnent plus.

Pour revenir à l'état précédent, on va dégager tout le code boilerplate dans App.vue pour ne laisser que ça :

```html
<template>
  <v-app>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    name: "App",
    components: {},
    data: () => ({})
  };
</script>
```

`<v-app>` et `<v-content>` ou tous les éléments html qui commencent par `<v-quelquechose>` sont propres à Vuetify. Si vous avez choisi un autre framework, ne vous en souciez pas.

L'important ici c'est `<router-view>` : il indique à Vue que c'est à partir d'ici qu'il doit injecter les routes que vous avez configurées. (Si vous êtes sur `/` par exemple, le composant `Home` qui est associé à cette route sera monté à la place de `<router-view>`**)**

## Home Page

On rentre dans le vif du sujet. Dans un premier temps on doit :

- requêter le serveur dès que le le composant est monté pour récupérer tous les quizz existants
- les afficher sur la page avec leur titre, leur auteur et le nombre de questions

### 1. Afficher les quizz

```html
<template>
  <v-layout class="home" column>
    <v-flex xs12>
      <h1 class="text-center">Vue Quizz App</h1>
    </v-flex>
    <v-flex xs12 class="mt-10 pa-5">
      <v-card class="mx-auto mb-2" v-for="quizz in allQuizz" :key="quizz._id">
        <v-card-text>
          <div>{{ quizz.author }}</div>
          <p class="display-1 text--primary">
            {{ quizz.title }}
          </p>
          <p>{{ quizz.questions.length }} questions</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn icon color="deep-purple accent-4">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="deep-purple accent-4">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { ALL_QUIZZ } from "../../api/quizz";

  export default {
    name: "home",
    components: {},
    data() {
      return {
        allQuizz: []
      };
    },
    methods: {
      async fetchAllQuizz() {
        const { data } = await this.$apollo.query({
          query: ALL_QUIZZ
        });
        return data.allQuizz;
      }
    },
    async mounted() {
      this.allQuizz = await this.fetchAllQuizz();
    }
  };
</script>
```

(une fois encore, ne faites pas attention aux détails des classes et éléments Vuetify)

Les choses intéréssantes sont plutôt :

- `async mounted(){...}` c'est un des _lifecycle hook_ de Vue : [voir ici](https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram). En lui ajoutant `async` je m'assure que Vue ne monte pas le composant avant que la méthode qu'il y à l'intérieur (qui est elle-même asynchrone) ne soit executée
- `fetchAllQuizz()` appelle ma query `ALL_QUIZZ` et return un array de quizz. Notez que j'ai destructuré `{ data }` puisque je sais que gql va nous renvoyer un objet data. J'aurais pu aussi faire `const response = await ....` puis `return response.data.allQuizz`. Ca revient exactement au même
- Donc à l'issue de cette requête, je réassigne ma data locale du composant, que j'ai auparavant initialisé en array vide : `allQuizz: []`
- Je peux donc, dans le template faire une boucle avec la directive Vue `v-for` sur l'array `allQuizz` pour afficher mes quizz. A l'intérieur de chaque itération, j'ai accès à une variable `quizz` que je peux afficher, ainsi que toutes ses propriétés en faisant `{{ quizz }}`
- On note au passage `:key="quizz._id"` : dans un v-for, Vue vous demandera d'attribuer une clé unique à chaque élément. Ca permet de savoir sur quel élément précis on est lorsque qu'on veut modifier dynamiquement l'un d'eux. Dans le ca où vous n'auriez pas d'id unique, vous pouvez vous servir de l'index : `v-for="(item, index) in items" :key="index"`

### 3.Delete quizz by id

Sur le bouton delete _:_

```html
<v-btn @click="handleDeleteQuizz(quizz._id)" icon color="deep-purple accent-4">
  <v-icon>mdi-delete</v-icon>
</v-btn>
```

- On attache un listener à un élément du DOM avec @ `@nomDeLevent` (ici click)
- Il faut ajouter ici un modificateur `.native` parce que `v-icon` (qui vient de Vuetify) est lui même un composant Vue et non un élément standard HTML (si on avait un span ou un div ou tout autre élément "normal", @click suffit)
- Au click donc, on execute une fonction `handleDeleteQuizz` en lui passant `quizz._id` comme paramètre

Dans la partie JS du composant, on ajoute notre handler :

```javascript
    methods: {
        async handleDeleteQuizz(quizzId) {
          const { data } = await this.$apollo.mutate({
            mutation: DELETE_QUIZZ_BY_ID,
            variables: { quizzId }
          });
          if (data.deleteQuizz) {
            this.allQuizz = this.allQuizz.filter(quizz => quizz._id !== quizzId);
          }
        }
      }
```

- Rien de bien nouveau ici : on appelle notre mutation graphql, on lui passe le quizzId en paramètre et au retour de la requête, si `data.deleteQuizz === true` (on a retourné un booléen pour cette mutation dans notre resolver) on met à jour l'UI en supprimant le quizz en question

Pour que ca fonctionne il reste évidemment à ajouter cette mutation dans notre dossier `./client/api/quizz.js` :

```javascript
import { gql } from "apollo-boost";

export const ALL_QUIZZ = gql`
  query {
    allQuizz {
      _id
      author
      _id
      title
      questions {
        _id
        label
        options
        answer
      }
    }
  }
`;

export const DELETE_QUIZZ_BY_ID = gql`
  mutation($quizzId: ID!) {
    deleteQuizz(quizzId: $quizzId)
  }
`;
```

Pas besoin ici de préciser les champs qu'on attend de recevoir... puisqu'il n'y en a pas !

### 4.Afficher dynamiquement les premières questions du quizz

Dans les specs, il est précisé qu'on veut afficher les premières questions (on va dire les 3 premières) d'un quizz lorsqu'on clique dessus.

Pour faire ça on va créer une nouvelle variable dans data, activeQuizzId qui vaudra null initialement :

```javascript
data() {
    return {
      allQuizz: [],
      activeQuizzId: null
    };
 }
```

Ensuite, on va mettre un autre @click sur la card du quizz :

```html
<v-card
  class="mx-auto mb-2"
  v-for="quizz in allQuizz"
  :key="quizz._id"
  @click="activeQuizzId = quizz._id"
  >...</v-card
>
```

Pas besoin ici de créer une fonction pour ça (on pourrait très bien le faire), on peut assigner directement notre variable.

Ensuite, on ajoute un élement pour boucler sur les questions du quizz avec un v-if qui vérifie si l'id est le même que `activeQuizzId`

```html
<v-card
  class="mx-auto mb-2"
  v-for="quizz in allQuizz"
  :key="quizz._id"
  @click="activeQuizzId = quizz._id"
>
  <v-card-text>
    <div>{{ quizz.author }}</div>
    <p class="display-1 text--primary">
      {{ quizz.title }}
    </p>
    <p>{{ quizz.questions.length }} questions</p>
    <v-layout
      class="text--primary d-flex"
      v-if="quizz._id === activeQuizzId"
      row
    >
      <v-flex xs10 class="pl-3">
        <div
          v-for="(question, index) in quizz.questions.slice(0, 3)"
          :key="index"
        >
          {{ question.label }}
        </div>
        <div v-if="quizz.questions.length > 3">...</div>
      </v-flex>
      <div>
        <v-btn icon color="blue darken-2">
          <v-icon large>mdi-play</v-icon>
        </v-btn>
      </div>
    </v-layout>
  </v-card-text>
  <v-card-actions>
    <v-spacer></v-spacer>
    <v-btn icon color="green accent-4">
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
    <v-btn @click="handleDeleteQuizz(quizz._id)" icon color="red accent-4">
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </v-card-actions>
</v-card>
```

### 5.Cabler les redirections vers EditQuizz et TakeQuizz

Il nous reste maintenant à gérer les boutons pour créer une nouveau quizz/editer un quizz
(les 2 doivent nous rediriger vers `EditQuizz`) et celui pour répondre au quizz (`TakeQuizz`)

- dans la partie `methods` de notre composant :

```javascript
editQuizz(quizzId) {
    this.$router.push(`/edit-quizz/${quizzId}`);
}
```

On fait une simple [redirection du router](https://router.vuejs.org/guide/essentials/navigation.html)
à partir d'un quizzId en guise de paramètre

- Sur l'icone 'crayon' qui sert à l'édition, on appelle cette fonction :

```html
<v-btn icon color="green accent-4" @click="editQuizz(quizz._id)">
  <v-icon>mdi-pencil</v-icon>
</v-btn>
```

Maintenant lorsqu'on clique dessus, on est bien redirigé vers notre composant
(qui est vide pour le moment) et on voit que notre route prend bien l'id du quizz
sur lequel je viens de cliquer, par exemple `http://localhost:8080/edit-quizz/5e237eb8f9633463ded699f7`

- gérer le cas d'une création d'un nouveau quizz :
  Pour gérer ce cas là avec la même logique et pour faire le plus simple possible,
  on va dire qu'au lieu de passer un ID, on va passer le string `new` : on va quand même être redirigé
  et une fois dans notre composant edit, on vérifiera le paramètre et adapter notre logique
  si jamais celui-ci vaut `new`

En bas du composant, comme dernier élément du template, j'ajoute un bouton:

```html
<v-flex xs12>
  <v-btn @click="editQuizz('new')" text color="red accent-4">
    <v-icon>mdi-plus</v-icon>
    Create a new quizz
  </v-btn>
</v-flex>
```

- C'est exactement la même chose pour la redirection vers `take-quizz`:

```html
<div>
  <v-btn icon color="blue darken-2" @click="takeQuizz(quizz._id)">
    <v-icon large>mdi-play</v-icon>
  </v-btn>
</div>
```

et dans `methods`

```javascript
takeQuizz(quizzId) {
  this.$router.push(`/take-quizz/${quizzId}`);
}
```

### 6.Refactoriser et créer un composant `QuizzItem`

Dans les specs, il est précisé que sur cet écran, je dois afficher x instances
d'un composant `QuizzItem` : on pouyrrait tout à fait se contenter de ce qu'on a fait jusqu'ici
mais imaginons que notre app devienne au fur et à mesure plus complexe.
Dans ce cas, on gagnerait à refactoriser pour créer des _briques_ les plus unitaires possibles :
c'est à la fois plus facile à lire et à maintenir.

- dans le dossier `/components`, créer un fichier `QuizzItem.vue` avec les 3
  parties habituelles d'un composant Vue :

```html
<template> </template>

<script>
  export default {
    name: "QuizzItem"
  };
</script>

<style scoped></style>
```

- on fait un `couper/coller` savant pour extraire de `Home` la partie
  du template qui correspond à un élément quizz (dans mon exemple c'est l'élement
  `v-card`) :

```html
<template>
  <v-card class="mx-auto mb-2">
    <v-card-text>
      <div>{{ quizz.author }}</div>
      <p class="display-1 text--primary">
        {{ quizz.title }}
      </p>
      <p>{{ quizz.questions.length }} questions</p>
      <v-layout class="text--primary d-flex" row>
        <v-flex xs10 class="pl-3">
          <div
            v-for="(question, index) in quizz.questions.slice(0, 3)"
            :key="index"
          >
            {{ question.label }}
          </div>
          <div v-if="quizz.questions.length > 3">...</div>
        </v-flex>
        <div>
          <v-btn icon color="blue darken-2">
            <v-icon large>mdi-play</v-icon>
          </v-btn>
        </div>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn icon color="green accent-4">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon color="red accent-4">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: "QuizzItem",
    props: {
      quizz: {
        type: Object,
        default: () => {}
      }
    }
  };
</script>

<style scoped></style>
```

Evidemment, ça ne fonctionne plus : les méthods et autres sont `undefined`
dans ce composant là. Et je n'ai pas envie de les appeler ici :
c'est plus logique d'avoir la logique d'ensemble dans le composant `Home`
et de faire de `QuizzItem` [un composant _dumb_](https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43)
dont la seule responsabilité est d'afficher du contenu dans le DOM, et pas de
gérer les appels API etc.

Donc au lieux d'appeler nos méthodes directement dans ce composant, au click,
il va `$emit` quelque chose vers le parent qui, lui est _smart_, va gérer toute la logique.

Dans un premier temps, on va supprimer le `v-for` et tous les `@click` pour ne pas avoir d'erreur Vue.
Et surtout on va lui déclarer une [props](https://vuejs.org/v2/guide/components-props.html) `quizz` qui lui sera fourni par `Home`

```html
<script>
  export default {
    name: "QuizzItem",
    props: {
      quizz: {
        type: Object,
        default: () => {}
      }
    }
  };
</script>
```

Notez que j'aurais simplement pu la déclarer comme ça :

`props:['quizz']` mais c'est de bonne pratique de typer ses props et/ou de lui donner
une valeur par défaut.

- maintenant on peut importer ce nouveau composant dans Home:

```javascript
import QuizzItem from "@/components/QuizzItem";

export default {
  name: "home",
  components: {
    QuizzItem
  },
  ...
}
```

- et le déclarer dans le template en lui passant la props qu'il attend :

```html
<v-flex xs12 class="mt-10 pa-5">
  <QuizzItem v-for="quizz in allQuizz" :key="quizz._id" :quizz="quizz" />
</v-flex>
```

La syntaxe c'est `:nomDeLaProps="variableQuiCorrespondACeQueJeVeuxPasserCommeProps"`
Bon ici, c'est le même nom mais je précise pour que ce soit moins confusant

En faisant ça, tout s'affiche comme avant mais on a perdu les fonctionnalités qu'on avait.

On va donc recabler nos `@click` mais cette fois, au lieu d'appeler les fonctions directement on va `$emit`
des évènements vers le parent qui, lui, va réagir en conséquence :

- pour set `activeQuizzId` (et afficher la preview):

```html
<v-card class="mx-auto mb-2" @click="$emit('onSelectQuizz', quizz._id)">
  ...
</v-card>
```

la fonction [`$emit`](https://vuejs.org/v2/guide/components-custom-events.html)
prend deux paramètres : le premier est le nom que vous donnez à votre event
(ici `onSelectQuizz`) et le second la (ou les) variables que vous passez avec
votre évènement. Ici je ne passe qu'une seule variable (l'ID du quizz) mais si
je voulais en passer plusieurs, je devrais déclarer un objet (je peux pas passer plus de 2
paramètres) : `$emit('monEvent', {first: myFirstVariable, second: mySecondVariable ...})`

- Maintenant, dans `Home` il faut que j'écoute mon évènement :

```html
<QuizzItem
  v-for="quizz in allQuizz"
  :key="quizz._id"
  :quizz="quizz"
  @onSelectQuizz="handleQuizzSelected"
/>
```

et on ajoute `handleQuizzSelected` dans methods :

```javascript
handleQuizzSelected(quizzId) {
  this.activeQuizzId = quizzId;
}
```

Notez que le paramètre `quizzId` est implicite ici : en déclarant simplement
`@onSelectQuizz="handleQuizzSelected"` dans le template.
Je pourrais aussi le déclarer explicitement pour réassigner directement ma variable
`activeQuizzId` : `@onSelectQuizz="(quizzId)=>activeQuizzId = quizzId"`

Là, `activeQuizzId` est bien réassignée à chaque fois que je clique sur un quizz
mais le composant enfant n'est pas au courant et donc ne réagit pas (encore)

Pour finir, on va donc lui passer une deuxième props qui sera un boolean :

```html
<QuizzItem
  v-for="quizz in allQuizz"
  :key="quizz._id"
  :quizz="quizz"
  :isActive="quizz._id === activeQuizzId"
  @onSelectQuizz="handleQuizzSelected"
/>
```

et dans le composant `QuizzItem` :

- on déclare la nouvelle props `isActive`

```html
<script>
  export default {
    name: "QuizzItem",
    props: {
      quizz: {
        type: Object,
        default: () => {}
      },
      isActive: {
        type: Boolean,
        default: false
      }
    }
  };
</script>
```

et on réécrit notre v-if dans le template

```html
<v-layout class="text--primary d-flex" v-if="isActive" row>
  <v-flex xs10 class="pl-3">
    <div v-for="(question, index) in quizz.questions.slice(0, 3)" :key="index">
      {{ question.label }}
    </div>
    <div v-if="quizz.questions.length > 3">...</div>
  </v-flex>
  <div>
    <v-btn icon color="blue darken-2">
      <v-icon large>mdi-play</v-icon>
    </v-btn>
  </div>
</v-layout>
```

Il nous reste plus qu'à réadapter les actions delete et les redirections :

- Delete :
  Dans `QuizzItem.vue`

```html
<v-btn icon color="red accent-4" @click="$emit('onDeleteQuizz', quizz._id)">
  <v-icon>mdi-delete</v-icon>
</v-btn>
```

Dans Home :

```html
<QuizzItem
  v-for="quizz in allQuizz"
  :key="quizz._id"
  :quizz="quizz"
  :isActive="quizz._id === activeQuizzId"
  @onSelectQuizz="handleQuizzSelected"
  @onDeleteQuizz="handleDeleteQuizz"
/>
```

- Redirections vers `TakeQuizz` et `EditQuizz`:

Dans `QuizzItem.vue` :

```html
<v-btn icon color="green accent-4" @click="$emit('onEditQuizz', quizz._id)">
  <v-icon>mdi-pencil</v-icon>
</v-btn>
```

Dans `Home` :

```html
<QuizzItem
  v-for="quizz in allQuizz"
  :key="quizz._id"
  :quizz="quizz"
  :isActive="quizz._id === activeQuizzId"
  @onSelectQuizz="handleQuizzSelected"
  @onDeleteQuizz="handleDeleteQuizz"
  @oneditQuizz="editQuizz"
/>
```
Voilà, toutes nos fonctionnalités marchent de nouveau !

On en a fini pour la page `Home` 🕺!
