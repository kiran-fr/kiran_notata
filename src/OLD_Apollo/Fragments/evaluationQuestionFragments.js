import gql from "graphql-tag";

export default gql`
  fragment evaluationQuestionFields on EvaluationQuestion {
    id
    userId
    name
    description
    input_type
    options {
      val
      score
      sid
      index
    }
  }
`;
