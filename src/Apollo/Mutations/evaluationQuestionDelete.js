import gql from "graphql-tag";

export default gql`
  mutation evaluationQuestionDelete($id: ID!) {
    evaluationQuestionDelete(id: $id) {
      message
    }
  }
`;
