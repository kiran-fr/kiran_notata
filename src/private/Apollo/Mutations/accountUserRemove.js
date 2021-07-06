import gql from "graphql-tag";
import {
  accountFragments,
  accountMemberFragments,
  evaluationTemplateFragments,
  evaluationTemplateSectionFragments,
  evaluationTemplateQuestionFragments,
  tagGroupFragments,
  tagFragments,
  funnelGroupFragments,
  funnelTagFragments,
} from "../Fragments";

export default gql`
  mutation accountUserRemove($email: String) {
    accountUserRemove(email: $email) {
      ...accountFields

      members {
        ...accountMemberFields
      }

      evaluationTemplates {
        ...evaluationTemplateFields
        sections {
          ...evaluationTemplateSectionFields
          questions {
            ...evaluationTemplateQuestionFields
          }
        }
      }

      evaluationTemplateQuestions {
        ...evaluationTemplateQuestionFields
      }

      tagGroups {
        ...tagGroupFields
        tags {
          ...tagFields
        }
      }

      funnelGroups {
        ...funnelGroupFields
        funnelTags {
          ...funnelTagFields
        }
      }
    }
  }
  ${accountFragments}
  ${accountMemberFragments}
  ${evaluationTemplateFragments}
  ${evaluationTemplateSectionFragments}
  ${evaluationTemplateQuestionFragments}
  ${tagGroupFragments}
  ${tagFragments}
  ${funnelGroupFragments}
  ${funnelTagFragments}
`;
