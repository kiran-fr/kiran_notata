import gql from "graphql-tag";

export default gql`
  mutation groupLogMarkConversationAsSeen(
    $groupId: String!
    $creativeId: String!
  ) {
    groupLogMarkConversationAsSeen(groupId: $groupId, creativeId: $creativeId) {
      message
    }
  }
`;
