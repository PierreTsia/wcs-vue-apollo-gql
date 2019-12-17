const mongoose = require("mongoose");

const QuizzSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  questions: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true
  }
});

QuizzSchema.post("save", async function() {
  await this.populate({
    path: "questions",
    model: "Question"
  }).execPopulate();
});

module.exports = mongoose.model("Quizz", QuizzSchema);
