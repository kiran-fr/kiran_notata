import gql from "graphql-tag";

import {
  evaluationTemplateSectionFragments,
  evaluationTemplateQuestionFragments,
} from "../Fragments";
export default gql`
  mutation evaluationTemplateSectionUpdate(
    $id: ID!
    $input: EvaluationTemplateSectionInput!
  ) {
    evaluationTemplateSectionUpdate(id: $id, input: $input) {
      ...evaluationTemplateSectionFields
      questions {
        ...evaluationTemplateQuestionFields
      }
    }
  }
  ${evaluationTemplateSectionFragments}
  ${evaluationTemplateQuestionFragments}
`;
