import gql from "graphql-tag";

export default gql`
  fragment connectionFields on Connection {
    id
    name
    description
    createdAt
    updatedAt
    createdBy
    accountId
    creativeId
    subjectiveScores {
      score
      createdAt
      createdBy
      createdByUser {
        email
        given_name
        family_name
      }
    }
    createdByUser {
      email
      given_name
      family_name
    }
  }
`;
