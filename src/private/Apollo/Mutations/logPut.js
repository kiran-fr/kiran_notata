import gql from "graphql-tag";
import { logItemFragments } from "../Fragments";

export default gql`
  mutation logPut($id: ID, $connectionId: String, $input: LogItemInput!) {
    logPut(id: $id, connectionId: $connectionId, input: $input) {
      ...logItemFields
    }
  }
  ${logItemFragments}
`;
