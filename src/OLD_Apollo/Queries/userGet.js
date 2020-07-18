import gql from "graphql-tag";
import { userFragments } from '../Fragments'

export default gql`
  query userGet {
    userGet {
      ...userFields
    }
  }
  ${userFragments}
`;