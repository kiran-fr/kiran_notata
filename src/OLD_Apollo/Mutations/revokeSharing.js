import gql from "graphql-tag";

export default gql`
  mutation revokeSharing($email: String!, $evaluationId: String!) {
    revokeSharing(email: $email, evaluationId: $evaluationId) {
      message
    }
  }
`;


