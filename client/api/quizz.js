import { gql } from "apollo-boost";

export const ALL_QUIZZ = gql`
  query {
    allQuizz {
      _id
      author
      _id
      title
      questions {
        _id
        label
        options
        answer
      }
    }
  }
`;
