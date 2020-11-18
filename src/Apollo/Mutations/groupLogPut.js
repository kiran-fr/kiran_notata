import gql from "graphql-tag";
import { grouplogItemFragments } from "../Fragments";

export default gql`
  mutation groupLogPut($groupId: ID!, $input: GroupLogInput!) {
    groupLogPut(groupId: $groupId, input: $input) {
      ...grouplogItemFragments
    }
  }
  ${grouplogItemFragments}
`;
