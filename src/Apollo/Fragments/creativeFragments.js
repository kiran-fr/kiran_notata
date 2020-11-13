import gql from "graphql-tag";

export default gql`
  fragment creativeFields on Creative {
    id
    name
    accountId
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
