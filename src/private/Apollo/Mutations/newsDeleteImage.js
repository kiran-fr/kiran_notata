import gql from "graphql-tag";
import { newsFragments } from "../Fragments";

export default gql`
  mutation newsDeleteImage($id: ID!) {
    newsDeleteImage(id: $id) {
      ...newsFields
    }
  }
  ${newsFragments}
`;
