import gql from "graphql-tag";

import {
  evaluationTemplateFragments,
  evaluationTemplateSectionFragments,
  evaluationQuestionFragments,
} from "../Fragments";

export default gql`
  query evaluationTemplatesGet {
    accountGet {
      evaluationTemplates {
        ...evaluationTemplateFields

        sections {
          ...evaluationTemplateSectionFields

          questions {
            ...evaluationQuestionFields
          }
        }
      }

      evaluationQuestions {
        ...evaluationQuestionFields
      }
    }
  }
  ${evaluationTemplateFragments}
  ${evaluationTemplateSectionFragments}
  ${evaluationQuestionFragments}
`;
