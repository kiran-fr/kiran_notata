import gql from "graphql-tag";
import { evaluationTemplateQuestionFragments } from "../Fragments";

export default gql`
  mutation evaluationTemplateQuestionPut(
    $id: ID
    $sectionId: ID
    $input: EvaluationTemplateQuestionInput
  ) {
    evaluationTemplateQuestionPut(
      id: $id
      sectionId: $sectionId
      input: $input
    ) {
      ...evaluationTemplateQuestionFields
    }
  }
  ${evaluationTemplateQuestionFragments}
`;
