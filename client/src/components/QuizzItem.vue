<template>
  <v-card class="mx-auto mb-2" @click="$emit('onSelectQuizz', quizz._id)">
    <v-card-text>
      <div>{{ quizz.author }}</div>
      <p class="display-1 text--primary">
        {{ quizz.title }}
      </p>
      <p>{{ quizz.questions.length }} questions</p>
      <v-layout class="text--primary d-flex" v-if="isActive" row>
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
      <v-btn
        icon
        color="green accent-4"
        @click="$emit('onEditQuizz', quizz._id)"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        icon
        color="red accent-4"
        @click="$emit('onDeleteQuizz', quizz._id)"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "QuizzItem",
  props: {
    quizz: {
      type: Object,
      default: () => {}
    },
    isActive: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped></style>
