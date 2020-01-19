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

export const DELETE_QUIZZ_BY_ID = gql`
  mutation($quizzId: ID!) {
    deleteQuizz(quizzId: $quizzId)
  }
`;

export const QUIZZ_BY_ID = gql`
  query($quizzId: ID!) {
    quizzById(quizzId: $quizzId) {
      _id
      author
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
