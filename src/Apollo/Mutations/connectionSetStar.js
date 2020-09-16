import gql from "graphql-tag";
import { connectionFragments, creativeFragments } from "../Fragments";

export default gql`
  mutation connectionSetStar($id: ID) {
    connectionSetStar(id: $id) {
      ...connectionFields
      creative {
        ...creativeFields
      }
    }
  }
  ${connectionFragments}
  ${creativeFragments}
`;
