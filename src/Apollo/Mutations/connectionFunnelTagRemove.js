import gql from "graphql-tag";
import { connectionFragments } from "../Fragments";

export default gql`
  mutation connectionFunnelTagRemove(
    $connectionId: ID!
    $funnelTagId: String!
  ) {
    connectionFunnelTagRemove(
      connectionId: $connectionId
      funnelTagId: $funnelTagId
    ) {
      ...connectionFields
    }
  }
  ${connectionFragments}
`;
