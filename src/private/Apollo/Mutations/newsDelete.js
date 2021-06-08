import gql from "graphql-tag";

export default gql`
  mutation newsDelete($id: ID!) {
    newsDelete(id: $id) {
      message
    }
  }
`;
