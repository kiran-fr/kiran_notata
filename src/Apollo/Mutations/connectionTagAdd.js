import gql from "graphql-tag";
import { tagFragments } from "../Fragments";

export default gql`
  mutation connectionTagAdd($connectionId: ID!, $tagId: String!) {
    connectionTagAdd(connectionId: $connectionId, tagId: $tagId) {
      tags {
        ...tagFields
      }
    }
  }
  ${tagFragments}
`;
