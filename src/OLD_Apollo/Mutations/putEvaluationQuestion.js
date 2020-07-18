import gql from "graphql-tag";
import { evaluationQuestionFragments } from "../Fragments";

export default gql`
  mutation putEvaluationQuestion($id: ID, $input: EvaluationQuestionInput!) {
    putEvaluationQuestion(id: $id, input: $input) {
      ...evaluationQuestionFields
    }
  }
  ${evaluationQuestionFragments}
`;
