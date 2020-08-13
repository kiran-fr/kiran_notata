import gql from "graphql-tag";
import {
  evaluationTemplateFragments,
  evaluationTemplateSectionFragments,
  evaluationQuestionFragments,
} from "../Fragments";

export default gql`
  mutation evaluationTemplatePut($id: ID, $input: EvaluationTemplateInput) {
    evaluationTemplatePut(id: $id, input: $input) {
      ...evaluationTemplateFields

      sections {
        ...evaluationTemplateSectionFields

        questions {
          ...evaluationQuestionFields
        }
      }
    }
  }
  ${evaluationTemplateFragments}
  ${evaluationTemplateSectionFragments}
  ${evaluationQuestionFragments}
`;
