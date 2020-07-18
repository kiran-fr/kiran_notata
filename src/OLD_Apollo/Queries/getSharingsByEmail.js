import gql from "graphql-tag";
import { sharingsFragments } from '../Fragments';

export default gql`
  query getSharingsByEmail($email: String!) {
    getSharingsByEmail(email: $email) {
      ...sharingsFields
    }
  }
  ${sharingsFragments}
`;


