import gql from "graphql-tag";
import { evaluationFragments_new, organizationFragments } from "../Fragments";

export default gql`
  mutation putEvaluation(
    $orgId: String
    $evaluationId: String
    $input: EvaluationInput_new
  ) {
    putEvaluation(orgId: $orgId, evaluationId: $evaluationId, input: $input) {
      ...evaluationFields_new
      organization {
        ...organizationFields
      }
    }
  }
  ${evaluationFragments_new}
  ${organizationFragments}
`;
