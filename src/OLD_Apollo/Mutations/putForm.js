import gql from "graphql-tag";
import {
  formFragments
} from '../Fragments';

export default gql`
  mutation putForm($id: ID, $input: FormInput) {
    putForm(id: $id, input: $input) {
      ...formFields
    }
  }
  ${formFragments}
`;