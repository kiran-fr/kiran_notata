import gql from "graphql-tag";

import { tagGroupFragments, tagFragments } from "../Fragments";

export default gql`
  query tagGroupGet {
    accountGet {
      id
      tagGroups {
        ...tagGroupFields
        tags {
          ...tagFields
        }
      }
    }
  }
  ${tagGroupFragments}
  ${tagFragments}
`;
