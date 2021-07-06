import gql from "graphql-tag";

export default gql`
  mutation notificationsMarkAllAsSeen {
    notificationsMarkAllAsSeen {
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
