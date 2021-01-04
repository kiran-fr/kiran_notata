import gql from "graphql-tag";
import { pageMetaFragments } from "../Fragments";
export default gql`
  query getPageMeta($url: String!) {
    getPageMeta(url: $url) {
      ...pageMetaFields
    }
  }
  ${pageMetaFragments}
`;
