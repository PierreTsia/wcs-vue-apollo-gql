<template>
  <v-card class="mx-auto mb-2">
    <v-card-text>
      <h4 class="text-center">Question n°{{ questionIndex + 1 }}</h4>
      <h3 v-if="!isEditMode" class="display-1 text--primary text-center">
        {{ question.label }}
      </h3>
      <v-text-field v-else v-model="newQuestion.label"></v-text-field>

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
            :disabled="!isEditMode"
            @input="event => handleOptionCheck(event, option)"
          />
          <label :for="`${question._id}--${option}`" class="pb-1">{{
            option
          }}</label>
        </v-flex>
      </div>
    </v-card-text>
    <v-card-actions class="d-flex justify-center">
      <template v-if="!isEditMode">
        <v-btn icon color="green accent-4" @click="isEditMode = !isEditMode">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon color="red accent-4">
          <v-icon>mdi-delete</v-icon>
        </v-btn></template
      >
      <template v-else>
        <v-btn text color="green accent-4" @click="handleConfirmClick">
          <v-icon>mdi-content-save</v-icon>
          <span class="green--text ml-2">Save</span>
        </v-btn>
        <v-btn text color="red accent-4" @click="handleCancelClick">
          <v-icon>mdi-close-circle</v-icon>
          <span class="red--text ml-2">Cancel</span>
        </v-btn>
      </template>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "Question",
  props: {
    question: {
      type: Object,
      default: () => {}
    },
    questionIndex: {
      type: Number,
      default: 1
    }
  },
  watch: {
    question: {
      immediate: true,
      handler(questionProps) {
        if (questionProps) {
          this.newQuestion = questionProps;
        }
      }
    }
  },
  data() {
    return {
      newQuestion: {
        label: "",
        options: [],
        answer: []
      },
      isEditMode: false
    };
  },
  methods: {
    isCorrect(option, answers) {
      return answers.includes(option);
    },
    handleConfirmClick() {
      this.$emit("onQuestionEdited", this.newQuestion);
      this.isEditMode = false;
    },
    handleCancelClick() {},
    handleOptionCheck(event, option) {
      if (event.target.checked) {
        this.newQuestion.answer.push(option);
      } else {
        this.newQuestion.answer = this.newQuestion.answer.filter(
          a => a !== option
        );
      }
    }
  }
};
</script>

<style scoped></style>
