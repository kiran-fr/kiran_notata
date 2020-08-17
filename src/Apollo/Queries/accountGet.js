import gql from "graphql-tag";

import {
  accountFragments,
  accountMemberFragments,
  evaluationTemplateFragments,
  evaluationTemplateSectionFragments,
  evaluationQuestionFragments,
  tagGroupFragments,
  tagFragments,
  funnelGroupFragments,
  funnelTagFragments,
} from "../Fragments";

export default gql`
  query accountGet {
    accountGet {
      ...accountFields

      members {
        ...accountMemberFields
      }

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
  ${evaluationQuestionFragments}
  ${tagGroupFragments}
  ${tagFragments}
  ${funnelGroupFragments}
  ${funnelTagFragments}
`;
