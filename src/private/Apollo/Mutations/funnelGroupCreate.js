import gql from "graphql-tag";
import { funnelGroupFragments } from "Apollo/Fragments";

export default gql`
  mutation funnelGroupCreate($input: FunnelGroupInput!) {
    funnelGroupCreate(input: $input) {
      ...funnelGroupFields
    }
  }
  ${funnelGroupFragments}
`;
