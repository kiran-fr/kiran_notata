import gql from "graphql-tag";

export default gql`
  fragment sharingsFields on Sharing {
    id
    createdAt
    sharedWithEmail
    userId
    organizationId
    evaluationId
  }
`;