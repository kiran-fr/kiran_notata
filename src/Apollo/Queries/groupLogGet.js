import gql from "graphql-tag";

import { grouplogItemFragments } from "../Fragments";

export default gql`
  query groupLogGet($groupId: String) {
    groupLogGet(groupId: $groupId) {
      ...grouplogItemFragments
    }
  }
  ${grouplogItemFragments}
`;
