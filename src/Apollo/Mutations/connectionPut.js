import gql from "graphql-tag";
import {
  connectionFragments,
  creativeFragments
} from "../Fragments";

export default gql`
  mutation connectionPut($id: ID, $creativeId: String, $input: ConnectionInput) {
    connectionPut(id: $id, creativeId: $creativeId, input: $input) {
      ...connectionFields
      creative {
        ...creativeFields  
      }
      
    }
  }
  ${connectionFragments}
  ${creativeFragments}
`;


