import gql from "graphql-tag";
import { publicEvaluationFragments } from "../Fragments";

export default gql`
  mutation publicEvaluationPut(
    $id: ID
    $connectionId: String
    $given_name: String
    $family_name: String
    $email: String
    $input: PublicEvaluationInput
  ) {
    publicEvaluationPut(
      id: $id
      connectionId: $connectionId
      input: $input
      given_name: $given_name
      family_name: $family_name
      email: $email
    ) {
      ...publicEvaluationFields
    }
  }
  ${publicEvaluationFragments}
`;
