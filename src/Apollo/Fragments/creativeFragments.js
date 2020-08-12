import gql from "graphql-tag";

export default gql`
  fragment creativeFields on Creative {
    id
    name
    description
    templateId
    sharedWithEmail
    answers {
      val
    }
  }
`;
