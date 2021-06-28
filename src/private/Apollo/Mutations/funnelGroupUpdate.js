import gql from "graphql-tag";
import { funnelGroupFragments } from "../Fragments";

export default gql`
  mutation funnelGroupUpdate($id: ID!, $input: FunnelGroupInput!) {
    funnelGroupUpdate(id: $id, input: $input) {
      ...funnelGroupFields
    }
  }
  ${funnelGroupFragments}
`;
