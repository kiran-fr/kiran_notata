import gql from "graphql-tag";
import { funnelTagFragments } from "../Fragments";

export default gql`
  mutation funnelTagUpdate($id: ID!, $input: FunnelTagInput!) {
    funnelTagUpdate(id: $id, input: $input) {
      ...funnelTagFields
    }
  }
  ${funnelTagFragments}
`;
