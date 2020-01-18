# step 6

## Designing the app routing system

Si on reprend les specs qui sont listées au début du README, on a 3 écrans principaux :

- `Home`, (logiquement la route `/` sur laquelle on arrive quand on affiche l'app) qui doit contenir une *liste* de quizz
- `EditQuizz` qui affiche toutes les questions du quizz (quand celui-ci existe déjà) ou rien (s'il s'agit d'un nouveau quizz) et qui contient la logique de création/édition
- `TakeQuizz` qui premet à l'utilisateur de répondre aux questions du quizz puis d'afficher le score

On va donc commencer par créer ces 3 routes et les 3 composants qui vont avec:

### **1. Dans le dossier `./views` :**

Créer deux fichiers : `EditQuizz.vue`

    <template>
      <div>
        <h1>EDIT VIEW</h1>
      </div>
    </template>
    
    <script>
    export default {
      name: "EditQuizz"
    };
    </script>
    
    <style scoped></style>

...et `TakeQuizz.vue`

    <template>
      <div>
        <h1>TakeQuizz</h1>
      </div>
    </template>
    
    <script>
    export default {
      name: "TakeQuizz"
    };
    </script>
    
    <style scoped></style>

### **2. Dans `./router/index.js` :**

(Voir la doc de [Vue Router](https://router.vuejs.org/guide/#html))

    import Vue from "vue";
    import VueRouter from "vue-router";
    import Home from "../views/Home.vue";
    import EditQuizz from '../views/EditQuizz.vue'
    import TakeQuizz from '../views/TakeQuizz.vue'
    
    Vue.use(VueRouter);
    
    const routes = [
      {
        path: "/",
        name: "home",
        component: Home
      },
      {
        path: "/edit-quizz/:id",
        name: "edit-quizz",
        component: () => import(/* webpackChunkName: "about" */ "../views/EditQuizz.vue")
      },
      {
        path: "/take-quizz/:id",
        name: "take-quizz",
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/TakeQuizz.vue")
      }
    ];
    
    const router = new VueRouter({
      mode: "history",
      base: process.env.BASE_URL,
      routes
    });
    
    export default router;

Noter le `routename/:id` qui est un [paramètre dynamique](https://router.vuejs.org/guide/essentials/dynamic-matching.html)

On garde la route Home, on remplace `About` par 2 nouvelles routes et nos 2 nouveaux composants.

Si vous avez un linter, il vous avertit (ou vous crache une erreur s'il est aussi nazi que le mien) que vos imports ne servent à rien : `component: () => import(/* webpackChunkName: "about" */ "../views/Edit.vue")` va *lazy-loader* le composant à la volée donc il n'y pas besoin de l'importer, on peut supprimer :

    import EditQuizz from "../views/EditQuizz.vue";
    import TakeQuizz from "../views/TakeQuizz.vue";

Maintenant si vous allez sur `http://localhost:8080/edit/jhsdfkjshdfkjhsdf` (ou n'importe quel string en guise d'ID) ou sur `http://localhost:8080/take-quizz/jhsdfkjshdfkjhsdf` vous devez voir votre `h1` de votre composant.

Notre système de route est désormais en place, on peut passer au développement des composants associés.
