import gql from "graphql-tag";
import { presentationFragments } from "../Fragments";

export default gql`
  query presentationsGet($connectionId: ID) {
    presentationsGet(connectionId: $connectionId) {
      ...presentationFields
    }
  }
  ${presentationFragments}
`;
