import gql from "graphql-tag";
import { tagFragments } from "../Fragments";

export default gql`
  mutation tagCreate($tagGroupId: ID!, $input: TagInput!) {
    tagCreate(tagGroupId: $tagGroupId, input: $input) {
      ...tagFields
    }
  }
  ${tagFragments}
`;
