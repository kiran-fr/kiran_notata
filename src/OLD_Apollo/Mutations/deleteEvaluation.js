import gql from "graphql-tag";

export default gql`
  mutation deleteEvaluation($id: String) {
    deleteEvaluation(id: $id) {
      message
    }
  }
`;
