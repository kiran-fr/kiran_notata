import gql from "graphql-tag";

export default gql`
  query notificationsGet($input: NotificationsGetInput) {
    notificationsGet(input: $input) {
      id
      createdAt
      notificationType
      references {
        key
        val
      }
      content
      seen
    }
  }
`;
