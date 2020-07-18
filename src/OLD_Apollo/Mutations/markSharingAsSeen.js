import gql from "graphql-tag";
import { sharingsFragments } from "../Fragments";

export default gql`
  mutation markSharingAsSeen($evaluationId: ID) {
    markSharingAsSeen(evaluationId: $evaluationId) {
      ...sharingsFields
    }
  }
  ${sharingsFragments}
`;
