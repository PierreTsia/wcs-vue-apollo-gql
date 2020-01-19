# Step 7

Dans cette étrape, on va

- installer un framework CSS (optionnel) pour se faciliter la vie
- coder la HomePage avec la logique qui va avec (afficher, delete les quizz...)

## Installer un framework CSS

Comme j'ai envie ni d'écrire 20 000 lignes de css ni de vous infliger un truc trop moche, je vais choisir la solution du feignant et installer un framework CSS.

C'est entièrement optionnel et au choix de chacun : il y en a des tas, tous les principaux fonctionnent sur Vue (Bootstrap, etc...). Choisissez celui que vous préférez, en ce qui me concerne je vais installer [Vuetify](https://vuetifyjs.com/en/) qui est un framework _material design_ qui a en plus l'avantage (mais c'est pas le seul), d'être intégrable directement avec Vue Cli via un plugin.

Pour l'installer, il suffit de :

    vue add vuetify

puis de choisir l'option par défaut.

(Encore une fois, faites le bien depuis le dossier `./client` et pas à la racine !)

Note : en installant le plugin Vuetify, Vue Cli edit le contenu du fichier `App.vue` avec du code par défaut. L'élément `<router-view></router-view>` n'y est plus ce qui fait que nos routes configurées juste avant ne fonctionnent plus.

Pour revenir à l'état précédent, on va dégager tout le code boilerplate dans App.vue pour ne laisser que ça :

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

`<v-app>` et `<v-content>` ou tous les éléments html qui commencent par `<v-quelquechose>` sont propres à Vuetify. Si vous avez choisi un autre framework, ne vous en souciez pas.

L'important ici c'est `<router-view>` : il indique à Vue que c'est à partir d'ici qu'il doit injecter les routes que vous avez configurées. (Si vous êtes sur `/` par exemple, le composant `Home` qui est associé à cette route sera monté à la place de `<router-view>`**)**

## Home Page

On rentre dans le vif du sujet. Dans un premier temps on doit :

- requêter le serveur dès que le le composant est monté pour récupérer tous les quizz existants
- les afficher sur la page avec leur titre, leur auteur et le nombre de questions

### 1. Afficher les quizz

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
    // @ is an alias to /src

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

(une fois encore, ne faites pas attention aux détails des classes et éléments Vuetify)

Les choses intéréssantes sont plutôt :

- `async mounted(){...}` c'est un des _lifecycle hook_ de Vue : [voir ici](https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram). En lui ajoutant `async` je m'assure que Vue ne monte pas le composant avant que la méthode qu'il y à l'intérieur (qui est elle-même asynchrone) ne soit executée
- `fetchAllQuizz()` appelle ma query `ALL_QUIZZ` et return un array de quizz. Notez que j'ai destructuré `{ data }` puisque je sais que gql va nous renvoyer un objet data. J'aurais pu aussi faire `const response = await ....` puis `return response.data.allQuizz`. Ca revient exactement au même
- Donc à l'issue de cette requête, je réassigne ma data locale du composant, que j'ai auparavant initialisé en array vide : `allQuizz: []`
- Je peux donc, dans le template faire une boucle avec la directive Vue `v-for` sur l'array `allQuizz` pour afficher mes quizz. A l'intérieur de chaque itération, j'ai accès à une variable `quizz` que je peux afficher, ainsi que toutes ses propriétés en faisant `{{ quizz }}`
- On note au passage `:key="quizz._id"` : dans un v-for, Vue vous demandera d'attribuer une clé unique à chaque élément. Ca permet de savoir sur quel élément précis on est lorsque qu'on veut modifier dynamiquement l'un d'eux. Dans le ca où vous n'auriez pas d'id unique, vous pouvez vous servir de l'index : `v-for="(item, index) in items" :key="index"`

### 3.Delete quizz by id

Sur le bouton delete _:_

    <v-btn
        @click="handleDeleteQuizz(quizz._id)"
        icon
        color="deep-purple accent-4">
      <v-icon>mdi-delete</v-icon>
    </v-btn>

- On attache un listener à un élément du DOM avec @ `@nomDeLevent` (ici click)
- Il faut ajouter ici un modificateur `.native` parce que `v-icon` (qui vient de Vuetify) est lui même un composant Vue et non un élément standard HTML (si on avait un span ou un div ou tout autre élément "normal", @click suffit)
- Au click donc, on execute une fonction `handleDeleteQuizz` en lui passant `quizz._id` comme paramètre

Dans la partie JS du composant, on ajoute notre handler :

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
      },

- Rien de bien nouveau ici : on appelle notre mutation graphql, on lui passe le quizzId en paramètre et au retour de la requête, si `data.deleteQuizz === true` (on a retourné un booléen pour cette mutation dans notre resolver) on met à jour l'UI en supprimant le quizz en question

Pour que ca fonctionne il reste évidemment à ajouter cette mutation dans notre dossier `./client/api/quizz.js` :

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

Pas besoin ici de préciser les champs qu'on attend de recevoir... puisqu'il n'y en a pas !

### 4.Afficher dynamiquement les premières questions du quizz

Dans les specs, il est précisé qu'on veut afficher les premières questions (on va dire les 3 premières) d'un quizz lorsqu'on clique dessus.

Pour faire ça on va créer une nouvelle variable dans data, activeQuizzId qui vaudra null initialement :

    data() {
        return {
          allQuizz: [],
          activeQuizzId: null
        };
      },

Ensuite, on va mettre un autre @click sur la card du quizz :

    <v-card
      class="mx-auto mb-2"
      v-for="quizz in allQuizz"
      :key="quizz._id"
      @click="activeQuizzId = quizz._id"
    >...</v-card>

Pas besoin ici de créer une fonction pour ça (on pourrait très bien le faire), on peut assigner directement notre variable.

Ensuite, on ajoute un élement pour boucler sur les questions du quizz avec un v-if qui vérifie si l'id est le même que `activeQuizzId`

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
        <v-btn
          @click="handleDeleteQuizz(quizz._id)"
          icon
          color="red accent-4"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

### 5.Cabler les redirections vers EditQuizz et TakeQuizz

Il nous reste maintenant à gérer les boutons pour créer une nouveau quizz/editer un quizz
(les 2 doivent nous rediriger vers `EditQuizz`) et celui pour répondre au quizz (`TakeQuizz`)

- dans la partie `methods` de notre composant :

```javascript
editQUizz(quizzId) {
    this.$router.push(`/edit-quizz/${quizzId}`);
}
```

On fait une simple [redirection du router](https://router.vuejs.org/guide/essentials/navigation.html)
à partir d'un quizzId en guise de paramètre

- Sur l'icone 'crayon' qui sert à l'édition, on appelle cette fonction :

```html
<v-btn icon color="green accent-4" @click="editQuizzQuizz(quizz._id)">
  <v-icon>mdi-pencil</v-icon>
</v-btn>
```

Miantenant lorsqu'on clique dessus, on est bien redirigé vers notre composant
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
  <v-btn @click="editQUizz('new')" text color="red accent-4">
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

On en a fini pour la page `Home` 🕺!
