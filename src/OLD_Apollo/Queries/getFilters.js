import gql from "graphql-tag";

export default gql`
  query getFilters {
    getFilters {
      id
      filters
      sortBy
      sortDirection
    }
  }
`;
