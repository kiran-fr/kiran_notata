import gql from "graphql-tag";
import { evaluationFragments } from "../../Fragments/public";

export default gql`
  mutation evaluationPut(
    $id: ID
    $connectionId: String
    $given_name: String
    $family_name: String
    $email: String
    $input: EvaluationInput
  ) {
    evaluationPut(
      id: $id
      connectionId: $connectionId
      input: $input
      given_name: $given_name
      family_name: $family_name
      email: $email
    ) {
      ...evaluationFields
    }
  }
  ${evaluationFragments}
`;
