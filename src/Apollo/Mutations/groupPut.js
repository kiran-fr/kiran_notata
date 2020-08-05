import gql from "graphql-tag";
import { groupFragments } from "../Fragments";

export default gql`
  mutation groupPut($id: ID, $input: GroupInput) {
    groupPut(id: $id, input: $input) {
      ...groupFields
    }
  }
  ${groupFragments}
`;
