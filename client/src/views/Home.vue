<template>
  <v-layout class="home" column>
    <v-flex xs12>
      <h1 class="text-center">Vue Quizz App</h1>
    </v-flex>
    <v-flex xs12 class="mt-10 pa-5">
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
              <v-btn icon color="blue darken-2" @click="takeQuizz(quizz._id)">
                <v-icon large>mdi-play</v-icon>
              </v-btn>
            </div>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn icon color="green accent-4" @click="editQUizz(quizz._id)">
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
    </v-flex>
    <v-flex xs12>
      <v-btn @click="editQUizz('new')" text color="red accent-4">
        <v-icon>mdi-plus</v-icon>
        Create a new quizz
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import { ALL_QUIZZ } from "../../api/quizz";
import { DELETE_QUIZZ_BY_ID } from "../../api/quizz";

export default {
  name: "home",
  components: {},
  data() {
    return {
      allQuizz: [],
      activeQuizzId: null
    };
  },
  methods: {
    async fetchAllQuizz() {
      const { data } = await this.$apollo.query({
        query: ALL_QUIZZ
      });
      return data.allQuizz;
    },
    async handleDeleteQuizz(quizzId) {
      const { data } = await this.$apollo.mutate({
        mutation: DELETE_QUIZZ_BY_ID,
        variables: { quizzId }
      });
      if (data.deleteQuizz) {
        this.allQuizz = this.allQuizz.filter(quizz => quizz._id !== quizzId);
      }
    },
    editQUizz(quizzId) {
      this.$router.push(`/edit-quizz/${quizzId}`);
    },
    takeQuizz(quizzId) {
      this.$router.push(`/take-quizz/${quizzId}`);
    }
  },
  async mounted() {
    this.allQuizz = await this.fetchAllQuizz();
  }
};
</script>
