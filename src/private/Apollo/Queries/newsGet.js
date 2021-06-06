import gql from "graphql-tag";
import { newsFragments } from "../../../Apollo/Fragments";

export default gql`
  query newsGet {
    newsGet {
      ...newsFields
    }
  }
  ${newsFragments}
`;
