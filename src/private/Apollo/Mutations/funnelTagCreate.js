import gql from "graphql-tag";
import { funnelTagFragments } from "Apollo/Fragments";

export default gql`
  mutation funnelTagCreate($id: ID!, $input: FunnelTagInput!) {
    funnelTagCreate(id: $id, input: $input) {
      ...funnelTagFields
    }
  }
  ${funnelTagFragments}
`;
