import gql from "graphql-tag";

export default gql`
  fragment userFields on User {
    cognitoIdentityId
    email
    given_name
    family_name
    phone_number
    company
  }
`;
