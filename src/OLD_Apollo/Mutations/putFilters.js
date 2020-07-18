import gql from "graphql-tag";

export default gql`
  mutation putFilters($input: FiltersInput!) {
    putFilters(input: $input) {
      id
      filters
      sortBy
      sortDirection
    }
  }
`;
