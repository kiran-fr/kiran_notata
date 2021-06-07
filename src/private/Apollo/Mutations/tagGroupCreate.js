import gql from "graphql-tag";
import { tagGroupFragments } from "Apollo/Fragments";

export default gql`
  mutation tagGroupCreate($input: TagGroupInput!) {
    tagGroupCreate(input: $input) {
      ...tagGroupFields
    }
  }
  ${tagGroupFragments}
`;
