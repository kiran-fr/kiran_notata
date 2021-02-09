import gql from "graphql-tag";

import { creativeFragments } from "../../Fragments";

export default gql`
  query creativeGet($id: ID!) {
    creativeGet(id: $id) {
      ...creativeFields
    }
  }
  ${creativeFragments}
`;
