import gql from "graphql-tag";
import {
  flashFragments
} from '../Fragments';

export default gql`
  query getFlash($id: String!) {
    getFlash(id: $id) {
      ...flashFields
    }
  }
  ${flashFragments}
`;

