import gql from "graphql-tag";

export default gql`
  query groupInvitationsGet {
    groupInvitationsGet {
      id
      name
      createdByUser {
        email
        given_name
        family_name
      }
    }
  }
`;
