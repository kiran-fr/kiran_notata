import gql from "graphql-tag";

import { creativeFragments } from "../Fragments";

export default gql`
  mutation publicCreativePut(
    $id: ID
    $accountId: ID
    $input: PublicCreativeInput
  ) {
    publicCreativePut(id: $id, accountId: $accountId, input: $input) {
      ...creativeFields
    }
  }
  ${creativeFragments}
`;
