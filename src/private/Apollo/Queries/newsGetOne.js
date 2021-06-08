import gql from "graphql-tag";
import { newsFragments } from "../../../Apollo/Fragments";

export default gql`
  query newsGetOne($id: ID!) {
    newsGetOne(id: $id) {
      ...newsFields
    }
  }
  ${newsFragments}
`;
