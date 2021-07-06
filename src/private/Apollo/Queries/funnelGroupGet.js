import gql from "graphql-tag";

import { funnelGroupFragments, funnelTagFragments } from "../Fragments";

export default gql`
  query funnelGroupGet {
    accountGet {
      funnelGroups {
        ...funnelGroupFields
        funnelTags {
          ...funnelTagFields
        }
      }
    }
  }
  ${funnelGroupFragments}
  ${funnelTagFragments}
`;
