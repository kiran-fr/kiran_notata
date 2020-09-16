import gql from "graphql-tag";

export default gql`
  query connectionsGet($filters: ConnectionFilters) {
    connectionsGet(filters: $filters) {
      id
      name
      createdAt
      updatedAt
      starred
      subjectiveScores {
        score
      }

      creative {
        name
      }

      tags {
        id
        name
      }

      funnelTags {
        name
        index
      }
    }
  }
`;
