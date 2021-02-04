import gql from "graphql-tag";
import { evaluationTemplateQuestionFragments } from "../Fragments";

export default gql`
  mutation evaluationTemplateQuestionPut(
    $id: ID
    $sectionId: ID
    $input: evaluationTemplateQuestionInput
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
