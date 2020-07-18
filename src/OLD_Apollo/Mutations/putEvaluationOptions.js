import gql from "graphql-tag";
import { evaluationOptionFragments } from "../Fragments";

export default gql`
  mutation putEvaluationOptions(
    $id: ID!
    $delete_page: String
    $input: EvaluationOptionsInput
  ) {
    putEvaluationOptions(id: $id, delete_page: $delete_page, input: $input) {
      ...evaluationOptionFields
    }
  }
  ${evaluationOptionFragments}
`;
