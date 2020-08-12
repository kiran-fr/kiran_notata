import gql from "graphql-tag";

import { creativeFragments } from "../Fragments";

export default gql`
  mutation publicCreativePut($id: ID!, $input: PublicCreativeInput) {
    publicCreativePut(id: $id, input: $input) {
      ...creativeFields
    }
  }
  ${creativeFragments}
`;
