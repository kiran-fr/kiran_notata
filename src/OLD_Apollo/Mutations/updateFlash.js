import gql from "graphql-tag";
import { flashFragments } from '../Fragments';

export default gql`
  mutation updateFlash($id: String!, $input: UpdateFlashInput!) {
    updateFlash(id: $id, input: $input) {
      ...flashFields
    }
  }
  ${flashFragments}
`;


