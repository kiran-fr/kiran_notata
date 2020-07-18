import gql from "graphql-tag";

export default gql`
  fragment evaluationFields on Evaluation {
    id
    name
    description
    createdAt
    updatedAt
    createdBy
    answers {
      id
      inputType
      templateId
      questionId
      sid
      question
      val
    }
    createdByUser {
      email
      given_name
      family_name
    }    
  }
`;
