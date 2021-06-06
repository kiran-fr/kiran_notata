import gql from "graphql-tag";

export default gql`
  query {
    groupGetRecentlyAddedStartups {
      group {
        id
        name
      }
      creative {
        id
        name
      }
    }
  }
`;
