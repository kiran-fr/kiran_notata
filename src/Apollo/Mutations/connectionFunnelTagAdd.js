import gql from "graphql-tag";
import { connectionFragments, funnelTagFragments } from "../Fragments";

export default gql`
  mutation connectionFunnelTagAdd($connectionId: ID!, $funnelTagId: String!) {
    connectionFunnelTagAdd(
      connectionId: $connectionId
      funnelTagId: $funnelTagId
    ) {
      ...connectionFields
      funnelTags {
        ...funnelTagFields
      }
    }
  }
  ${connectionFragments}
  ${funnelTagFragments}
`;
