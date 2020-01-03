On passe maintenant à la partie Vue du projet qu'on va
_cabler_ à l'API graphql qu'on vient de développer.


## Setup Vue client

1. La première chose à faire est d'installer globalement [Vue CLI](https://cli.vuejs.org/)

```shell
npm install -g @vue/cli
# OR
yarn global add @vue/cli
```
(NB: vous aurez certainement besoin d'être en mode administrateur pour installer cette dépendance globalement : `sudo npm instal...`)

Une fois l'installation terminée, on peut verifier la version de vue cli avec `vue --version`

Vous devriez normalement avoir la version 4 (`4.x.x`)

2. Générer le projet Vue


A la racine de votre projet et depuis le terminal :

```shell
vue create client
```
La commande `vue create` peut prendre un certain nombre d'arguments pour configurer le projet.
Voir [ici](https://cli.vuejs.org/guide/creating-a-project.html#vue-create).

Dans notre cas, on n'en a pas besoin donc on lui passe juste le _nom_ du projet (client) : vous pouvez évidemment l'appeler comme vous voulez
mais pour s'y retrouver dans nos dossiers, je le nomme `client`

Pour créer le projet, il faut spécifier à Vue Cli quelques options de configuration : `

- Vous avez d'abord le choix entre la config par defaut et le fait de choisir manuellement les features dont on a besoin.
Pour l'exercice, on va choisr la main : séléctionnez `manually select features`

- Ensuite Vue Cli vous propose un certain nombre d'options. A ce stade, vous pouvez choisir ce que vous voulez.
Pour ma part, je vais faire le plus simple possible et ne prendre que le nécéssaire :
    - Babel
    - Vue Router
    - CSS-preprocessor
    - linter

Sur un "vrai" projet, j'aurais installé aussi Typescript et Vuex mais ici, on peut s'en passer pour gagner du temps.

- à la question suivante `use history mode for router`, répondre `Y`

- choisissez ensuite le pré-processeur de votre choix (en admettant que vous ayez coché l'option à l'étape précédente)
Pour ma part, j'aime bien [*Stylus*](http://stylus-lang.com/) mais c'est vraiment une question de gout personnel

- pour le linter, je choisir EsLint + Prettier et Lint on Save

- enfin, je préfère que les fichiers de config soient bien "rangés" dans leurs fichiers à part plutôt que de tout
mettre dans `package.json` mais là encore, c'est une question de préférence personnelle.

Et voilà ! Vue CLI peut maintenant générer tout ce qu'il faut pour nous :)

Une fois l'installation terminée, on peut `cd client && yarn serve` pour lancer le projet en local sur votre ordi `http://localhost:8080/`


>NOTE : en plus de nous permettre de faire plein de choses depuis le terminal, Vue CLI
>a aussi une interface graphique assez sympa : pour essayer taper `vue ui`.
>Vous atterissez sur un écran d'accueil sur lequel tous vos projets Vue sont listés : en en séléctionneznt un
>vous pouvez depuis le GUI voir les dépendances ou les plugins installés, en installer d'autres, modifier les options de config etc...


3. Installer Vue dev tools

 `Vue dev tools` est une extension Chrome très utile pour développer et debuguer :
 Vous pouvez voir directement dans votre navigateur les composants, les variables, les props etc...
 Aller sur le repo Github [Vue dev tools](https://github.com/vuejs/vue-devtools) et suivez les instructions

 Une fois l'installation de l'extenstion terminée, refaire un coup de `yarn serve` et sur le port `localhost:8080`, dans les `outils de developpement`
 de Chrome, vous devriez avoir un onglet `Vue`. En cliquant dessus, vous avez ceci :

 ![Alt text](./assets/vue-dev-tools.png)

On va s'en servir en permanence pour voir rapidement le détail d'un composant, ses variales, ses props etc...


4. Installer concurrently

A ce stade, on peut lancer à la fois le server avec `yarn server` (ou `npm run server`) et le client en faisant `cd client yarn serve`
Ca marche mais c'est quand même pas très pratique de devoir faire 2 commandes différentes. Or, comme un bon dev est un dev feignant,
on va installer une dépendance qui nous permet de faire la même chose en une seule commande:

Assurez vous d'être bien à la racine du projet (et pas dans le dossier `client` depuis votre terminal et installer `concurrently`

`yarn add concurrently` ou `npm install concurrently`

Maintenant dans `package.json`, ajouter 2 scripts, un pour lancer le client et un qui lance les 2 en même temps via concurrently :

```json
"scripts": {
    "server": "nodemon index.js",
    "client": "cd client && yarn serve",
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "concurrently -r --names \"server, client\" \"yarn server --silent\" \"yarn client --silent\" "
  },
```
(remplacez yarn par npm run si vous utilisez npm)


Maintenant, on faisant simplement `yarn start`  depuis la racine du projet, on lance en même temps le back et le front !


***

On a maintenant en plus de l'API graphql (steps 1, 2 et 3) un projet Vue. Il nous reste maintenant à connecter les 2.

A ce stade, si vous êtes complètement débutant sur VueJs, je vous invite à visionner quelques videos ou lire quelques articles sur les bases de
ce framework.

Pas de panique : la grande force de Vue c'est précisement sa simplicité de prise en main. Avec des connaissances en JS et dans la mesure où
vous avez déjà travaillé sur un framework JS (React ou Angular par exemple), vous verrez que vous allez très vite comprendre le fonctionnement de base de VueJs.

Quelques ressources :

- la doc officielle de Vue, en particulier la partie [*Getting started*](https://vuejs.org/v2/guide/)
- série de videos [*Introduction to VueJs*](https://www.vuemastery.com/courses/intro-to-vue-js/vue-instance/) sur le site Vue Mastery
- la plupart des youtubeurs qui produisent du contenu pédagogiques ont des cours ou des tutos sur Vue, par exemple :
    - Brad Traversy : [VueJs Crash Course](https://www.youtube.com/watch?v=Wy9q22isx3U)
    - Academind : [Getting Started with Vue Js](https://www.youtube.com/watch?v=nyJSd6V2DRI&list=PL55RiY5tL51p-YU-Uw90qQH419BM4Iz07)
    - et pour ceux qui sont allergiques à l'anglais (c'est mal!), Grafikart, [Vuejs 2](https://www.grafikart.fr/formations/vuejs)
    - Vue School [Vue Js Fondamentals](https://vueschool.io/courses/vuejs-fundamentals)
    - ...et beaucoup d'autres que vous trouverez par vous-mêmes


 Pour la suite de cette démo, dans l'idéal et pour bien comprendre ce qu'on fait, vous devriez avoir quelques bases sur VueJs (avoir visionné une des videos ci-dessus suffit) :

 - à quoi ressemble un composant Vue : les sections `template`, `script` et `style`, comment important un composant dans un autre et lui passer des données...
 - les concepts de `props`, `data`, `computed`, `methods`
 - les principales directives applicables sur les éléments du template HTML : `v-if`, `v-for`, `v-model`
 - Vue router : comment créer un système basique de routes



**End of Step 4**
