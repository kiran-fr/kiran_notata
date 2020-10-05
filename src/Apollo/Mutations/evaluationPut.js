import gql from "graphql-tag";
import { evaluationFragments } from "../Fragments";

export default gql`
  mutation evaluationPut(
    $id: ID
    $connectionId: String
    $groupId: String
    $input: EvaluationInput
  ) {
    evaluationPut(
      id: $id
      connectionId: $connectionId
      groupId: $groupId
      input: $input
    ) {
      ...evaluationFields
    }
  }
  ${evaluationFragments}
`;
