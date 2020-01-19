<template>
  <div class="px-10">
    <section class="header">
      <h1 class="title text-center pa-5">
        {{ quizz ? quizz.title : "New quizz Title" }}
      </h1>
      <h2 class="subtitle-1 text-center grey--text">
        {{ quizz ? quizz.author : "Author name" }}
      </h2>
    </section>
    <section class="addQuestions"></section>
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
              <label :for="`${question._id}--${option}`" class="pb-1">{{
                option
              }}</label>
            </v-flex>
          </div>
        </v-card-text>
        <v-card-actions>
          <!--<v-btn text color="deep-purple accent-4">
            Learn More
          </v-btn>-->
        </v-card-actions>
      </v-card>
    </section>
    <section class="saveQuizz"></section>
  </div>
</template>

<script>
import { QUIZZ_BY_ID } from "../../api/quizz";

export default {
  name: "EditQuizz",
  data() {
    return {
      quizz: null,
      questions: []
    };
  },
  methods: {
    isCorrect(option, answers) {
      return answers.includes(option);
    }
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
      this.questions = this.quizz.questions;
    }
  }
};
</script>

<style scoped></style>
