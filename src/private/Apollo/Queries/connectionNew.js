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
      }
      groupSharingInfo {
        group {
          id
          name
        }
      }
    }
  }
`;
