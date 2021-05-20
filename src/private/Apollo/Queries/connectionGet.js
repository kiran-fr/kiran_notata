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
        answers {
          questionName
          questionId
          val
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
      }
      log {
        id
        createdAt
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
