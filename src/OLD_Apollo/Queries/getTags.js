import gql from "graphql-tag";
import {
  tagFragments
} from '../Fragments';

export default gql`
  query getTags {
    getTags {
      ...tagFields
    }
  }
  ${tagFragments}
`;

