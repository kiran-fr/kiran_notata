import gql from "graphql-tag";

export default gql`
  mutation connectionPut(
    $id: ID
    $creativeId: String
    $input: ConnectionInput!
  ) {
    connectionPut(id: $id, creativeId: $creativeId, input: $input) {
      id
      archived
      creative {
        name
      }
    }
  }
`;
