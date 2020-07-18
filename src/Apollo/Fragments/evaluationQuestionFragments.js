import gql from "graphql-tag";

export default gql`
  fragment evaluationQuestionFields on EvaluationQuestion {
    id
    createdBy
    accountId
    createdAt
    updatedAt
    name
    description
    inputType
    options {
      val
      score
      index
      sid
    }    
  }
`;



