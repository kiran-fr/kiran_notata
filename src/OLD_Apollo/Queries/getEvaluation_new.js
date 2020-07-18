import gql from "graphql-tag";
import { evaluationFragments_new, organizationFragments } from "../Fragments";

export default gql`
  query getEvaluation_new($id: String!) {
    getEvaluation_new(id: $id) {
      ...evaluationFields_new
      organization {
        ...organizationFields
      }
    }
  }
  ${evaluationFragments_new}
  ${organizationFragments}
`;
