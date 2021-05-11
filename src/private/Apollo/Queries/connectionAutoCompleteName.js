import gql from "graphql-tag";

export default gql`
  query connectionAutoCompleteName($search: String!) {
    connectionAutoCompleteName(search: $search) {
      creativeName
      creativeId
      connectionId
    }
  }
`;
