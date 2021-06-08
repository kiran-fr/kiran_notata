import gql from "graphql-tag";
import { newsFragments } from "../../../Apollo/Fragments";

export default gql`
  mutation newsSet($useful: Boolean, $id: ID!) {
    newsSet(useful: $useful, id: $id) {
      ...newsFields
    }
  }
  ${newsFragments}
`;
