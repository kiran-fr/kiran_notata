import gql from "graphql-tag";

import { tagGroupFragments, tagFragments } from "../Fragments";

export default gql`
  query tagGroupGet {
    accountGet {
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
