import gql from "graphql-tag";
import {
  evaluationTemplateFragments,
  evaluationTemplateSectionFragments,
  evaluationTemplateQuestionFragments,
  creativeFragments,
  evaluationV2Fragments,
} from "../Fragments";

export default gql`
  query {
    groupsPublicGet {
      id
      name
      iAmAdmin
      iAmMember
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
        createdAt
        seen
        isInMyDealFlow

        sharedByUser {
          email
          given_name
          family_name
        }

        creative {
          id
          name
        }

        connection {
          id
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
          seenBy {
            family_name
            given_name
            email
          }
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

        evaluations {
          ...evaluationV2Fields
        }
      }
    }
  }

  ${evaluationTemplateFragments}
  ${evaluationTemplateSectionFragments}
  ${evaluationTemplateQuestionFragments}
  ${evaluationV2Fragments}
`;

// ${creativeFragments}
