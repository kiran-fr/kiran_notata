import gql from "graphql-tag";
import { funnelGroupFragments } from "Apollo/Fragments";

export default gql`
  mutation funnelGroupCreate($id: ID, $input: FunnelGroupInput) {
    funnelGroupCreate(id: $id, input: $input) {
      ...funnelGroupFields
    }
  }
  ${funnelGroupFragments}
`;
