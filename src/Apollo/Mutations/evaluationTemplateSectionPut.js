import gql from "graphql-tag";
import {
  evaluationTemplateSectionFragments,
  evaluationQuestionFragments
} from "../Fragments";

export default gql`
  mutation evaluationTemplateSectionPut(
    $id: ID
    $templateId: ID
    $input: EvaluationTemplateSectionInput
  ) {
    evaluationTemplateSectionPut(
      id: $id
      templateId: $templateId
      input: $input
    ) {
      ...evaluationTemplateSectionFields

      questions {
        ...evaluationQuestionFields
      }
    }
  }
  ${evaluationTemplateSectionFragments}
  ${evaluationQuestionFragments}
`;

// import {
//   evaluationTemplateFragments,
//   evaluationTemplateSectionFragments,
//   evaluationQuestionFragments
// } from "../Fragments";

// export default gql`
//   mutation evaluationTemplateSectionPut($id: ID, $templateId: ID, $input: EvaluationTemplateSectionInput) {
//     evaluationTemplateSectionPut(id: $id, templateId: $templateId, input: $input) {

//       ...evaluationTemplateFields

//       sections {

//         ...evaluationTemplateSectionFields

//         questions {

//           ...evaluationQuestionFields

//         }

//       }

//     }
//   }
//   ${evaluationTemplateFragments}
//   ${evaluationTemplateSectionFragments}
//   ${evaluationQuestionFragments}
// `;
