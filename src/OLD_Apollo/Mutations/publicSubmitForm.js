import gql from "graphql-tag";
import {
  formFragments
} from '../Fragments';

export default gql`
  mutation publicSubmitForm($id: ID!, $input: [TextValInput]) {
    publicSubmitForm(id: $id, input: $input) {
      ...formFields
    }
  }
  ${formFragments}
`;