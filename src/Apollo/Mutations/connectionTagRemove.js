import gql from "graphql-tag";
import { tagFragments } from "../Fragments";

export default gql`
  mutation connectionTagRemove($connectionId: ID!, $tagId: String!) {
    connectionTagRemove(connectionId: $connectionId, tagId: $tagId) {
      tags {
        ...tagFields
      }
    }
  }
  ${tagFragments}
`;
