import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";

Vue.use(VueApollo);

Vue.config.productionTip = false;

const API_URI = "http://localhost:4000";

export const defaultClient = new ApolloClient({
  uri: `${API_URI}/graphql`,
  fetchOptions: {
    credentials: "include"
  }
});

const apolloProvider = new VueApollo({ defaultClient });

new Vue({
  apolloProvider,
  router,
  render: h => h(App)
}).$mount("#app");
