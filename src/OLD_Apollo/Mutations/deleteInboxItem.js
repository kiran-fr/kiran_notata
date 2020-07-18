import gql from "graphql-tag";

export default gql`
  mutation deleteInboxItem($id: ID!) {
    deleteInboxItem(id: $id) {
      message
    }
  }
`;