import gql from "graphql-tag";
import {
  evaluationFragments,
  organizationFragments
} from '../Fragments';

export default gql`
  query getEvaluation($orgId: String!) {
    getEvaluation(orgId: $orgId) {
      ...evaluationFields
      organization {
        ...organizationFields
      }
    }
  }
  ${evaluationFragments}
  ${organizationFragments}
`;

