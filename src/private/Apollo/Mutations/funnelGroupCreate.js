import gql from "graphql-tag";
import { funnelGroupFragments } from "../Fragments";

export default gql`
  mutation funnelGroupCreate($input: FunnelGroupInput!) {
    funnelGroupCreate(input: $input) {
      ...funnelGroupFields
    }
  }
  ${funnelGroupFragments}
`;
