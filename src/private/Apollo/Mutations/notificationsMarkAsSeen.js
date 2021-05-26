import gql from "graphql-tag";

export default gql`
  mutation notificationsMarkAsSeen($ids: [String!]!) {
    notificationsMarkAsSeen(ids: $ids) {
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
