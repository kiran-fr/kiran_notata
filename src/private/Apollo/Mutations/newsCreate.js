import gql from "graphql-tag";
import { newsFragments } from "../../../Apollo/Fragments";

export default gql`
  mutation newsCreate($input: NewsCreateInput!) {
    newsCreate(input: $input) {
      ...newsFields
    }
  }
  ${newsFragments}
`;
