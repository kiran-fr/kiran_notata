import gql from "graphql-tag";

export default gql`
  mutation accountInviteDelete($email: String) {
    accountInviteDelete(email: $email) {
      message
    }
  }
`;
