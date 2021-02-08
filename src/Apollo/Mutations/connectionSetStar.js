import gql from "graphql-tag";
import { connectionExtendedFragments } from "../Fragments";

export default gql`
  mutation connectionSetStar($id: ID) {
    connectionSetStar(id: $id) {
      ...connectionExtendedFields
    }
  }
  ${connectionExtendedFragments}
`;
