import gql from "graphql-tag";
import { tagGroupFragments } from "../Fragments";

export default gql`
  mutation tagGroupCreate($input: TagGroupInput!) {
    tagGroupCreate(input: $input) {
      ...tagGroupFields
    }
  }
  ${tagGroupFragments}
`;
