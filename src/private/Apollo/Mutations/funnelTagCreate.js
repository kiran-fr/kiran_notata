import gql from "graphql-tag";
import { funnelTagFragments } from "Apollo/Fragments";

export default gql`
  mutation funnelTagCreate($funnelGroupId: ID!, $input: FunnelTagInput!) {
    funnelTagCreate(funnelGroupId: $funnelGroupId, input: $input) {
      ...funnelTagFields
    }
  }
  ${funnelTagFragments}
`;
