import gql from "graphql-tag";
import { newsFragments } from "../../../Apollo/Fragments";

export default gql`
  mutation newsDeleteImage($id: ID!) {
    newsDeleteImage(id: $id) {
      ...newsFields
    }
  }
  ${newsFragments}
`;
