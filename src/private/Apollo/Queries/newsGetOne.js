import gql from "graphql-tag";
import { newsFragments } from "../Fragments";

export default gql`
  query newsGetOne($id: ID!) {
    newsGetOne(id: $id) {
      ...newsFields
    }
  }
  ${newsFragments}
`;
