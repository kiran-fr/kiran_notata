import gql from "graphql-tag";

export default gql`
  mutation fakeDelete($id: ID!) {
    fakeDelete(id: $id) {
      message
    }
  }
`;
