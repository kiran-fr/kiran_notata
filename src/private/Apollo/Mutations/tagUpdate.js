import gql from "graphql-tag";
import { tagFragments } from "../Fragments";

export default gql`
  mutation tagUpdate($id: ID!, $input: TagInput!) {
    tagUpdate(id: $id, input: $input) {
      ...tagFields
    }
  }
  ${tagFragments}
`;
