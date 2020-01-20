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
      <Question
        v-for="(question, index) in questions"
        :key="question._id"
        :question="question"
        :questionIndex="index"
        @onQuestionEdited="
          newQuestion => handleQuestionEdited(newQuestion, index)
        "
      />
    </section>
    <section class="saveQuizz d-flex justify-center">
      <v-btn primary color="blue accent-4">
        <v-icon class="white--text">mdi-floppy</v-icon>
        <span class="white--text">Save Quizz</span>
      </v-btn>
    </section>
  </div>
</template>

<script>
import { QUIZZ_BY_ID } from "../../api/quizz";
import { UPDATE_QUESTION } from "../../api/questions";
import Question from "@/components/Question";

export default {
  name: "EditQuizz",
  components: {
    Question
  },
  data() {
    return {
      quizz: null,
      questions: []
    };
  },
  methods: {
    async handleQuestionEdited(newQuestion, index) {
      //eslint-disable-next-line
      const { __typename, ...questionInput } = newQuestion;
      const { data } = await this.$apollo.mutate({
        mutation: UPDATE_QUESTION,
        variables: { questionInput }
      });
      this.$set(this.questions, index, data.updateQuestion);
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
