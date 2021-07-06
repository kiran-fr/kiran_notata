import gql from "graphql-tag";

import { tagGroupFragments, tagFragments } from "../Fragments";

export default gql`
  query tagGroupsGet {
    tagGroupsGet {
      ...tagGroupFields
      tags {
        ...tagFields
      }
    }
  }
  ${tagGroupFragments}
  ${tagFragments}
`;
