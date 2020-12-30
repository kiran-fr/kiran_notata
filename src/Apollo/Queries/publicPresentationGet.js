import gql from "graphql-tag";
import { presentationFragments } from "../Fragments";

export default gql`
  query publicPresentationGet($email: String!, $id: ID!) {
    publicPresentationGet(id: $id, email: $email) {
      ...presentationFields
    }
  }
  ${presentationFragments}
`;
