import gql from "graphql-tag";
import { newsFragments } from "../Fragments";

export default gql`
  query newsGet {
    newsGet {
      ...newsFields
    }
  }
  ${newsFragments}
`;
