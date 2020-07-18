import gql from "graphql-tag";
import {
  accountFragments,
  accountMemberFragments
} from '../Fragments'

export default gql`
  query accountGet {
    accountGet {
      ...accountFields
      members {
        ...accountMemberFields
      }
    }
  }
  ${accountFragments}
  ${accountMemberFragments}
`;