import gql from "graphql-tag";
import { evaluationFragments_new, organizationFragments } from "../Fragments";

export default gql`
  mutation createOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      ...evaluationFields_new
      organization {
        ...organizationFields
      }
    }
  }
  ${evaluationFragments_new}
  ${organizationFragments}
`;
