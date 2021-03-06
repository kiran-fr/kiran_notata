import gql from "graphql-tag";
import { funnelGroupFragments } from "../Fragments";

export default gql`
  mutation funnelGroupPut($id: ID, $input: FunnelGroupInput) {
    funnelGroupPut(id: $id, input: $input) {
      ...funnelGroupFields
    }
  }
  ${funnelGroupFragments}
`;
