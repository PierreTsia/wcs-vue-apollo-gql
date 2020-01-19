<template>
  <v-layout class="home" column>
    <v-flex xs12>
      <h1 class="text-center">Vue Quizz App</h1>
    </v-flex>
    <v-flex xs12 class="mt-10 pa-5">
      <QuizzItem
        v-for="quizz in allQuizz"
        :key="quizz._id"
        :quizz="quizz"
        :isActive="quizz._id === activeQuizzId"
        @onSelectQuizz="handleQuizzSelected"
        @onDeleteQuizz="handleDeleteQuizz"
        @oneditQuizz="editQuizz"
      />
    </v-flex>
    <v-flex xs12>
      <v-btn @click="editQuizz('new')" text color="red accent-4">
        <v-icon>mdi-plus</v-icon>
        Create a new quizz
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import { ALL_QUIZZ } from "../../api/quizz";
import { DELETE_QUIZZ_BY_ID } from "../../api/quizz";
import QuizzItem from "@/components/QuizzItem";

export default {
  name: "home",
  components: {
    QuizzItem
  },
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
    editQuizz(quizzId) {
      this.$router.push(`/edit-quizz/${quizzId}`);
    },
    takeQuizz(quizzId) {
      this.$router.push(`/take-quizz/${quizzId}`);
    },
    handleQuizzSelected(quizzId) {
      this.activeQuizzId = quizzId;
    }
  },
  async mounted() {
    this.allQuizz = await this.fetchAllQuizz();
  }
};
</script>
