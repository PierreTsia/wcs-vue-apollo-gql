const populateQuestions = {
  path: "questions",
  model: "Question"
};

const sortQuestions = questions => {
  return questions.reduce(
    (sortedQuestions, question) => {
      question._id
        ? sortedQuestions.registeredQuestions.push(question)
        : sortedQuestions.unregisteredQuestions.push(question);
      return sortedQuestions;
    },
    { registeredQuestions: [], unregisteredQuestions: [] }
  );
};
module.exports = {
  Query: {
    questions: async (_, args, { Question }) => {
      const questions = await Question.find();
      return questions;
    },
    allQuizz: async (_, args, { Quizz }) => {
      const allQuizz = await Quizz.find().populate(populateQuestions);
      return allQuizz;
    },
    quizzById: async (_, { quizzId }, { Quizz }) => {
      const quizz = await Quizz.findById(quizzId).populate(populateQuestions);
      if (!quizz) {
        throw new Error(`No quizz found with id ${quizzId}`);
      }
      return quizz;
    }
  },
  Mutation: {
    addQuestion: async (_, { label, options, answer }, { Question }) => {
      const newQuestion = await new Question({ label, options, answer }).save();
      return newQuestion;
    },
    updateQuestion: async (_, { questionInput }, { Question }) => {
      const { _id, ...questionFields } = questionInput;
      const updatedQuestion = await Question.findOneAndUpdate(
        { _id },
        { ...questionFields },
        { new: true }
      );
      return updatedQuestion;
    },
    saveQuizz: async (_, { quizzInput }, { Quizz, Question }) => {
      const { questions, title, author, _id } = quizzInput;

      // sort registered from unregistered questions (ie. have an _id or not)
      const { registeredQuestions, unregisteredQuestions } = sortQuestions(
        questions
      );

      //save new questions first to get their _id
      const savedQuestions = [];
      for (const questionToSave of unregisteredQuestions) {
        const savedQuestion = await new Question(questionToSave).save();
        savedQuestions.push(savedQuestion);
      }

      // if quizz already exist, we update it with new questions,
      // else we just save the new one
      if (_id) {
        const updatedQuizz = await Quizz.findOneAndUpdate(
          { _id },
          {
            questions: [...registeredQuestions, ...savedQuestions],
            title,
            author
          },
          { new: true }
        ).populate(populateQuestions);
        return updatedQuizz;
      } else {
        // merge registered questions with newly saved questions
        quizzInput = {
          ...quizzInput,
          questions: [...registeredQuestions, ...savedQuestions]
        };

        const newQuizz = await new Quizz(quizzInput).save();

        return newQuizz;
      }
    },
    deleteQuizz: async (_, { quizzId }, { Quizz }) => {
      const quizToDelete = await Quizz.findById(quizzId);
      if (!quizToDelete) {
        throw new Error(`No quizz found with id ${quizzId}`);
      }

      await Quizz.deleteOne({ _id: quizzId });
      return true;
    }
  }
};
