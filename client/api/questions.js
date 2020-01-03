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
