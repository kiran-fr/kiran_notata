import gql from "graphql-tag";

export default gql`
  mutation groupLeave($id: ID!) {
    groupLeave(id: $id) {
      message
    }
  }
`;
