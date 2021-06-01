import gql from "graphql-tag";
import { grouplogItemFragments } from "Apollo/Fragments";

export default gql`
  mutation groupLogCreate(
    $groupId: String!
    $creativeId: String
    $input: GroupLogInput!
  ) {
    groupLogCreate(groupId: $groupId, creativeId: $creativeId, input: $input) {
      ...grouplogItemFragments
    }
  }
  ${grouplogItemFragments}
`;
