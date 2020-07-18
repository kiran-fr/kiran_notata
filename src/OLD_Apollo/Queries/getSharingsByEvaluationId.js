import gql from "graphql-tag";
import { sharingsFragments } from '../Fragments';

export default gql`
  query getSharingsByEvaluationId($evaluationId: String!) {
    getSharingsByEvaluationId(evaluationId: $evaluationId) {
      ...sharingsFields
    }
  }
  ${sharingsFragments}
`;


