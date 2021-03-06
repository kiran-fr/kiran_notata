import gql from "graphql-tag";
import { grouplogItemFragments } from "../Fragments";

// export default gql`
//   subscription subscribeToGroupLogPutEvents($groupId: String!) {
//     subscribeToGroupLogPutEvents(groupId: $groupId) {
//       groupId
//       dataPairs {
//         val
//       }
//     }
//   }
// `;

export default gql`
  subscription {
    subscribeToAllGroupLogPutEvents {
      ...grouplogItemFragments
    }
  }
  ${grouplogItemFragments}
`;
