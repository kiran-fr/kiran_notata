import gql from "graphql-tag";

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
      groupId
      dataPairs {
        val
      }
    }
  }
`;
