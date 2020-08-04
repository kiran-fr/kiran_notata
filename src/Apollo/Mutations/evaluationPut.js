import gql from "graphql-tag";
import { evaluationFragments } from "../Fragments";

export default gql`
  mutation evaluationPut(
    $id: ID
    $connectionId: String
    $input: EvaluationInput
  ) {
    evaluationPut(id: $id, connectionId: $connectionId, input: $input) {
      ...evaluationFields
    }
  }
  ${evaluationFragments}
`;
