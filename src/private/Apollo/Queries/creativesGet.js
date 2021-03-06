import gql from "graphql-tag";

import { creativeFragments } from "../Fragments";

export default gql`
  query creativesGet {
    creativesGet {
      ...creativeFields
    }
  }
  ${creativeFragments}
`;
