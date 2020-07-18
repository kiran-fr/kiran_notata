import gql from "graphql-tag";

export default gql`
  mutation markAsSeen($id: ID!) {
    markAsSeen(id: $id) {
      message
    }
  }
`;

// import gql from "graphql-tag";
// import {
//   evaluationFragments_new
// } from "../Fragments";

// export default gql`
//   mutation markAsSeen($id: ID!) {
//     markAsSeen(id: $id) {
//       ...evaluationFields_new
//     }
//   }
//   ${evaluationFragments_new}
// `;
