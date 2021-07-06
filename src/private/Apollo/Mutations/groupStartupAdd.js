import gql from "graphql-tag";
import {
  evaluationTemplateFragments,
  evaluationTemplateSectionFragments,
  evaluationTemplateQuestionFragments,
  creativeFragments,
  evaluationV2Fragments,
} from "../Fragments";

export default gql`
  mutation groupStartupAdd($groupId: ID!, $creativeId: ID!) {
    groupStartupAdd(groupId: $groupId, creativeId: $creativeId) {
      id
      name
      iAmAdmin
      description
      createdAt
      updatedAt
      createdByUser {
        email
        given_name
        family_name
      }

      members {
        role
        joinedDate
        latestActivity
        user {
          email
          given_name
          family_name
          isMe
        }
      }

      pendingInvitations {
        createdAt
        email
        invitedByUser {
          email
          given_name
          family_name
        }
      }

      settings {
        chat
        isPublic
        showUsers
        showScores
        showSummaries
        addStartup
        addUser
        addEvaluation
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

      startups {
        sharedByUser {
          email
          given_name
          family_name
        }
        createdAt
        seen
        isInMyDealFlow

        creative {
          ...creativeFields
        }

        connection {
          id
        }

        evaluations {
          ...evaluationV2Fields
        }

        subjectiveScores {
          score
          createdAt
          isMe
          createdByUser {
            email
            given_name
            family_name
          }
        }

        log {
          id
          groupId
          creativeId
          createdByUser {
            email
            family_name
            given_name
          }
          createdAt
          updatedAt
          logType
          notifyUsers
          seenBy {
            email
            family_name
            given_name
          }
          reference {
            key
            val
          }
          dataPairs {
            key
            val
          }
          creative {
            id
            name
          }
          seen
        }

        evaluationSummaries {
          templateId
          templateName
          submissions
          averageScore
          possibleScore
          averagePercentageScore
          highestScore
          lowestScore
        }
      }
    }
  }
  ${evaluationTemplateFragments}
  ${evaluationTemplateSectionFragments}
  ${evaluationTemplateQuestionFragments}
  ${creativeFragments}
  ${evaluationV2Fragments}
`;
