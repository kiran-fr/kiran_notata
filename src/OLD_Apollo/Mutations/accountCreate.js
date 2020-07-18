import gql from "graphql-tag";
import {
  accountFragments,
  accountMemberFragments
} from '../Fragments'

export default gql`
  mutation accountCreate {
    accountCreate {
      ...accountFields
      members {
        ...accountMemberFields
      }
    }
  }
  ${accountFragments}
  ${accountMemberFragments}
`;