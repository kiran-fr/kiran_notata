import gql from "graphql-tag";

export default gql`
  query connectionGet($id: ID!) {
    connectionGet(id: $id) {
      id
      name
      createdAt
      updatedAt
      starred
      creativeId

      subjectiveScores {
        createdBy
        createdAt
        score
        isMe
      }

      creative {
        id
        name
        accountId
        sharedWithEmail
        logo
        answers {
          inputType
          sectionId
          sectionName
          questionId
          questionName
          questionId
          val
          sid
        }
      }

      tags {
        tagGroupId
        id
        name
        group {
          id
          name
        }
      }

      funnelTags {
        id
        funnelGroupId
        name
        index
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
          isMe
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
      groupSharingInfo {
        group {
          id
          name
        }
        evaluationSummaries {
          templateId
          templateName
          submissions
          averagePercentageScore
        }

        evaluations {
          id
          name
          createdByUser {
            given_name
            family_name
            email
            isMe
          }
          template {
            id
            name
          }
        }

        subjectiveScores {
          isMe
        }
      }
      log {
        id
        isMe
        createdAt
        updatedAt
        createdByUser {
          family_name
          given_name
        }
        logType
        dataPairs {
          val
          key
        }
      }
    }
  }
`;
