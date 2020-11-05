import gql from "graphql-tag";

export default gql`
  fragment creativeFields on Creative {
    id
    name
    description
    templateId
    createdAt
    sharedWithEmail
    sharedByEmail
    submit
    answers {
      id
      inputType
      questionId
      sid
      question
      val
    }
  }
`;
