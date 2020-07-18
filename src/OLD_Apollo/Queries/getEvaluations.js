import gql from "graphql-tag";
import { evaluationFragments_new, organizationFragments } from "../Fragments";

export default gql`
  query getEvaluations {
    getEvaluations {
      ...evaluationFields_new
      organization {
        ...organizationFields
      }
    }

    getEvaluationsSharedWithMe {
      ...evaluationFields_new
      organization {
        ...organizationFields
      }
    }
  }
  ${evaluationFragments_new}
  ${organizationFragments}
`;
