import gql from "graphql-tag";

export default gql`
  query connectionsGet($filters: ConnectionFilters) {
    connectionsGet(filters: $filters) {
      id
      name
      createdAt
      updatedAt
      starred
      creativeId
      subjectiveScores {
        score
      }

      creative {
        name
      }

      tags {
        tagGroupId
        id
        name
      }

      funnelTags {
        id
        funnelGroupId
        name
        index
      }
    }
  }
`;
