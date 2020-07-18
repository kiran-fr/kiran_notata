import gql from "graphql-tag";
import {
  tagFragments
} from '../Fragments';

export default gql`
  mutation createTag($input: TagInput!) {
    createTag(input: $input) {
      ...tagFields
    }
  }
  ${tagFragments}
`;