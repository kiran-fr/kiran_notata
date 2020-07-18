import gql from "graphql-tag";
import {
  evaluationQuestionFragments
} from "../Fragments";

export default gql`
  mutation evaluationQuestionPut(
    $id: ID,
    $sectionId: ID,
    $input: EvaluationQuestionInput
  ) {
    evaluationQuestionPut(
      id: $id,
      sectionId: $sectionId,
      input: $input
    ) {
      ...evaluationQuestionFields
    }
  }
  ${evaluationQuestionFragments}
`;
