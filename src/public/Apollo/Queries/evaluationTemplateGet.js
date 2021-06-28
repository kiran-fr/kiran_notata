import gql from "graphql-tag";

import evaluationTemplateFragments from "../Fragments/evaluationTemplateFragments";
import evaluationTemplateSectionFragments from "../Fragments/evaluationTemplateSectionFragments";
import evaluationTemplateQuestionFragments from "../Fragments/evaluationTemplateQuestionFragments";

export default gql`
  query evaluationTemplateGet($id: ID!) {
    evaluationTemplateGet(id: $id) {
      ...evaluationTemplateFields
      sections {
        ...evaluationTemplateSectionFields
        questions {
          ...evaluationTemplateQuestionFields
        }
      }
    }
  }
  ${evaluationTemplateFragments}
  ${evaluationTemplateSectionFragments}
  ${evaluationTemplateQuestionFragments}
`;
