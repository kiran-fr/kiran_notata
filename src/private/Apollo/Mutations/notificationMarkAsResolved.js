import gql from "graphql-tag";

export default gql`
  mutation notificationMarkAsResolved($id: ID!) {
    notificationMarkAsResolved(id: $id) {
      id
      createdAt
      notificationType
      references {
        key
        val
      }
      content
      seen
      resolved
    }
  }
`;
