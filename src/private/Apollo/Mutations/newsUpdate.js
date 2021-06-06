import gql from "graphql-tag";
import { newsFragments } from "../../../Apollo/Fragments";

export default gql`
  mutation newsUpdate($id: ID!, $input: NewsCreateInput!) {
    newsUpdate(id: $id, input: $input) {
      ...newsFields
    }
  }
  ${newsFragments}
`;
