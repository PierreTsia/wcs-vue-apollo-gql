module.exports = {
    Query: {
        questions: async (parent, args, context, info) => {
            const questions = [
                {_id: "87654654", label:"première question", options:["1", "2", "3"], author: "54651"},
                {_id: "1154654", label:"test", options:["1", "2", "3"], author: "4864987"}
             ];
            return questions
        }
    }
};
