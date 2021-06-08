import gql from "graphql-tag";

export default gql`
  mutation accountInviteCreate($email: String) {
    accountInviteCreate(email: $email) {
      email
      accountId
      createdAt
      createdBy
    }
  }
`;
