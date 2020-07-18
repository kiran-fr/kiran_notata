import gql from "graphql-tag";

export default gql`
  fragment evaluationOptionFields on EvaluationOption {
    id
    createdAt
    userId
    options {
      name
      sid
      index
      options {
        id
        index
      }
    }
  }
`;
