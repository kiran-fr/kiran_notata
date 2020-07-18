import gql from "graphql-tag";
import {
  formFragments
} from '../Fragments';

export default gql`
  query getForms {
    getForms {
      ...formFields
    }
  }
  ${formFragments}
`;

