import gql from "graphql-tag";
import { evaluationFragments_new, organizationFragments } from "../Fragments";

export default gql`
  mutation putEvaluation_new(
    $id: String
    $orgId: String
    $input: EvaluationInput_new
  ) {
    putEvaluation_new(id: $id, orgId: $orgId, input: $input) {
      ...evaluationFields_new
      organization {
        ...organizationFields
      }
    }
  }
  ${evaluationFragments_new}
  ${organizationFragments}
`;
