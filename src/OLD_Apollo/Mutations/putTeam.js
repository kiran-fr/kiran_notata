import gql from "graphql-tag";

export default gql`
  mutation putTeam(
    $id: String
    $invite_email: String
    $accept_user: String
    $delete_user: String
  ) {
    putTeam(
      id: $id
      invite_email: $invite_email
      accept_user: $accept_user
      delete_user: $delete_user
    ) {
      id
      members
      pending
    }
  }
`;
