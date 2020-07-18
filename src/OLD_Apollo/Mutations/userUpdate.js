import gql from "graphql-tag";
import { userFragments } from '../Fragments'

export default gql`
  mutation userUpdate($input: UserInput!) {
    userUpdate(input: $input) {
      ...userFields
    }
  }
  ${userFragments}
`;