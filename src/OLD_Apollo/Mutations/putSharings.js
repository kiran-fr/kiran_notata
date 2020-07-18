import gql from "graphql-tag";
import { sharingsFragments } from '../Fragments';

export default gql`
  mutation putSharings($evaluationId: String!, $input: SharingInput!) {
    putSharings(evaluationId: $evaluationId, input: $input) {
      ...sharingsFields
    }
  }
  ${sharingsFragments}
`;


