import gql from "graphql-tag";
import { tagGroupFragments } from "../Fragments";

export default gql`
  mutation tagGroupUpdate($id: ID!, $input: TagGroupInput!) {
    tagGroupUpdate(id: $id, input: $input) {
      ...tagGroupFields
    }
  }
  ${tagGroupFragments}
`;
