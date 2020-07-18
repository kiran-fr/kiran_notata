import gql from "graphql-tag";
import {
  formFragments
} from '../Fragments';

export default gql`
  query publicGetForm($id: ID!) {
    publicGetForm(id: $id) {
      ...formFields
    }
  }
  ${formFragments}
`;

