import gql from "graphql-tag";

export default gql`
  mutation evaluationDelete($id: String!) {
    evaluationDelete(id: $id) {
      message
    }
  }
`;
