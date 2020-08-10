import gql from "graphql-tag";

import { creativeFragments } from "../Fragments";

export default gql`
  query publicCreativeGet($id: ID!) {
    publicCreativeGet(id: $id) {
      ...creativeFields
    }
  }
  ${creativeFragments}
`;
