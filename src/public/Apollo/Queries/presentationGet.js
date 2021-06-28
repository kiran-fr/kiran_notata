import gql from "graphql-tag";
import presentationFragments from "../Fragments/presentationFragments";

export default gql`
  query presentationGet($email: String!, $id: ID!) {
    presentationGet(id: $id, email: $email) {
      ...presentationFields
    }
  }
  ${presentationFragments}
`;
