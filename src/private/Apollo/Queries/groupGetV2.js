import gql from "graphql-tag";
import {
  evaluationTemplateFragments,
  evaluationTemplateSectionFragments,
  evaluationTemplateQuestionFragments,
  creativeFragments,
  evaluationV2Fragments,
} from "Apollo/Fragments";

export default gql`
  query groupGetV2($id: ID!) {
    groupGetV2(id: $id) {
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
          subjectiveScores {
            createdBy
            createdAt
            score
            isMe
          }
          evaluationSummaries {
            templateId
            templateName
            averagePercentageScore
            highestScore
            lowestScore
            submissions
          }
          evaluations {
            id
            isMe
            createdAt
            templateId
            template {
              id
              name
            }
            createdByUser {
              family_name
              given_name
              email
            }
            summary {
              scorePercent
              sections {
                sectionId
                sectionName
                scorePercent
                scorePerAnswer {
                  questionName
                  possibleScore
                  score
                }
              }
            }
          }
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
          seenBy
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
