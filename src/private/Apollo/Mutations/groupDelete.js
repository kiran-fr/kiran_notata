import gql from "graphql-tag";

export default gql`
  mutation groupDelete($id: ID!) {
    groupDelete(id: $id) {
      message
    }
  }
`;
