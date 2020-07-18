import gql from "graphql-tag";
import { evaluationFragments_new, organizationFragments } from "../Fragments";

export default gql`
  query public_getSharedEvaluation($id: String!, $email: String!) {
    public_getSharedEvaluation(id: $id, email: $email) {
      ...evaluationFields_new
      organization {
        ...organizationFields
      }
    }
  }
  ${evaluationFragments_new}
  ${organizationFragments}
`;
