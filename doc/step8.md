# EditQuizz.vue

Quand on relis les specs de ce composant, on se rend compte que mine de
rien, il y a pas mal de choses à faire ici. Quand c'est comme ça, avant de
commencer à coder, on se pose 5 minutes et on décompose en petites tâches
auxquelles on va s'attaquer une par une... Bref, on _prend les matchs les uns après les autres_ !

1. fetch le quizz si on a une id, et gérer le cas où on est dans un contexte
   de création d'un nouveau
2. afficher le contenu du quizz (si on en a 1) dans le template et prévoir un contenu par défaut
   si on en a pas
3. ajouter une nouvelle question
4. ajouter une question déjà existante
5. éditer une question du quizz
6. sauvegarder le quizz modifié et rediriger vers la home

### fetch quizz by id

`EditQuizz.vue` :

```html
<template>
  <div>
    <section class="header"></section>
    <section class="addQuestions"></section>
    <section class="quizzQuestions"></section>
    <section class="saveQuizz"></section>
  </div>
</template>

<script>
  import { QUIZZ_BY_ID } from "../../api/quizz";

  export default {
    name: "EditQuizz",
    data() {
      return {
        quizz: null
      };
    },
    async mounted() {
      if (
        this.$route.params &&
        this.$route.params.id &&
        this.$route.params.id !== "new"
      ) {
        const { data } = await this.$apollo.query({
          query: QUIZZ_BY_ID,
          variables: { quizzId: this.$route.params.id }
        });
        this.quizz = data.quizzById;
      }
    }
  };
</script>

<style scoped></style>
```

Il faut aussi qu'on écrive cette query. Dans `./api/quizz.js` , on ajoute notre query :

```javascript
export const QUIZZ_BY_ID = gql`
  query($quizzId: ID!) {
    quizzById(quizzId: $quizzId) {
      _id
      author
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
```

Au passage, on remarquera ce truc pas très joli et très verbeux pour éviter de se manger une erreur `cannot read property id of undefined` qui ferait tout péter
au cas où on ait pas de params ou pas d'id :

```javascript
if (
    this.$route.params &&
    this.$route.params.id &&
    this.$route.params.id !== "new"
  ){...}
```

Heureusement, c'est bientôt du passé grâce au nouveau [`optional chaining operator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining).
On pourra faire simplement `if(this.$route?.params?.id !== 'new'){...}` qui est quand même nettement plus élégant !

- On commence par déclarer dans `data` une variable `quizz` qu'on initialise à `null`
- Sur le hook `mounted` on fait une requête `async` (à condition d'avoir une id différente de `new`) :
  une query GQL `QUIZZ_BY_ID` avec en variable l'id que je récupère de mon `$route.params`
- je réassigne ma variable `quizz` avec l'objet que je reçois de ma requête

Pour le moment on ne voit rien à l'écran mais si je fais un `console.log` ou si j'affiche le state d emon composant dans Vue Dev Tools, je vois
que ma variable quizz contient bien ce que je veux.

Dans mon template, je peux donc maintenant afficher pour commencer le titre de mon quizz (ou un titre par defaut si je suis en mode creation)

```html
<section class="header">
  <h1 class="title text-center pa-5">
    {{ quizz ? quizz.title : "New quizz Title" }}
  </h1>
  <h2 class="subtitle-1 text-center grey--text">
    {{ quizz.author ? quizz.author : "Author name" }}
  </h2>
</section>
```

### Display Questions

On est toujours dans le cas d'une édition, donc on part du principe qu'on a des questions qui
ont chacune 1 ou plusieurs bonnes réponses.

Pour me faciliter la tâche, je vais d'abord _extraire_
mes questions pour les réassigner dans une data du composant, ca me permet de l'initialiser en `[]` et d'éviter d'avoir une erreur quand quizz vaut `null`.
Ca nous facilitera aussi la tâche quand il s'agira d'éditer/sauvegarder notre quizz comme on le verra après :

```javascript
data() {
    return {
      quizz: null,
      questions: []
    };
  },
```

et dans le hook mounted:

```javascript
this.quizz = data.quizzById;
this.questions = this.quizz.questions;
```

Maintenant dans la partie template:

```html
<section class="quizzQuestions">
  <v-card
    class="mx-auto mb-2"
    v-for="(question, index) in questions"
    :key="question._id"
  >
    <v-card-text>
      <h4 class="text-center">Question n°{{ index + 1 }}</h4>
      <h3 class="display-1 text--primary text-center">
        {{ question.label }}
      </h3>

      <div class="text--primary justify-space-between d-flex row mt-3">
        <v-flex
          xs6
          v-for="(option, i) in question.options"
          :key="i"
          class="px-10 mt-3"
        >
          <input
            type="checkbox"
            :id="`${question._id}--${option}`"
            :checked="isCorrect(option, question.answer)"
          />
          <label :for="`${question._id}--${option}`" class="pb-1"
            >{{ option }}</label
          >
        </v-flex>
      </div>
    </v-card-text>
  </v-card>
</section>
```

- je refais un v-for pour afficher mes options dans chaque question
- pour chaque option, j'affiche un input de type checkbox avec son label
- en html natif, vous feriez `<input type="checkbox" checked>` pour que la checkbox soit cochée.
  Sur Vue, n'importe quel attribut natif d'un élément html peut devenir dynmique si vous lui collez `:` devant. Pratique !
  Donc pour savoir si une réponse est la bonne, il suffit de faire un `:checked="uneMethodeCustom"` où `uneMethodeCustom` retourne un boolean

Du coup, ma méthode `isCorrect()` est très simple :

```javascript
methods: {
    isCorrect(option, answers) {
      return answers.includes(option);
    }
}
```

Maintenant les bonnes réponses sont cochées, les autres non.
Voilà ce que ca devrait donner chez vous :

![Alt text](./assets/EditQuizzComponent.png)
