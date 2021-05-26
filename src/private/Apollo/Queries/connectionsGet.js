import gql from "graphql-tag";

export default gql`
  query connectionsGet($filters: ConnectionFilters, $LastEvaluatedId: String) {
    connectionsGet(filters: $filters, LastEvaluatedId: $LastEvaluatedId) {
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
      }

      creative {
        id
        name
        logo
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
        group {
          id
          name
          funnelTags {
            id
            name
          }
        }
      }
      evaluationSummaries {
        templateId
        templateName
        averagePercentageScore
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
