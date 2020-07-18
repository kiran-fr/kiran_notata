import gql from "graphql-tag";
import { tagFragments } from '../Fragments';

export default gql`
  mutation updateTags($input: [TagInput]!) {
    updateTags(input: $input) {
      ...tagFields
    }
  }
  ${tagFragments}
`;


