import gql from "graphql-tag";
import { tagGroupFragments } from "../Fragments";

export default gql`
  mutation tagGroupPut($id: ID, $input: TagGroupInput!) {
    tagGroupPut(id: $id, input: $input) {
      ...tagGroupFields
    }
  }
  ${tagGroupFragments}
`;
