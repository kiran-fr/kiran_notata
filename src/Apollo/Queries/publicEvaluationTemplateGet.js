import gql from "graphql-tag";

import {
  evaluationTemplateFragments,
  evaluationTemplateSectionFragments,
  evaluationQuestionFragments,
} from "../Fragments";

export default gql`
  query publicEvaluationTemplateGet($id: ID!) {
    publicEvaluationTemplateGet(id: $id) {
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
