import { gql } from "apollo-boost";

export const ALL_QUESTIONS = gql`
  query {
    questions {
      _id
      label
      options
      answer
    }
  }
`;

export const UPDATE_QUESTION = gql`
  mutation($questionInput: QuestionInput!) {
    updateQuestion(questionInput: $questionInput) {
      _id
      label
      options
      answer
    }
  }
`;
