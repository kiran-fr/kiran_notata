import gql from "graphql-tag";
import { organizationFragments } from '../Fragments';

export default gql`
  mutation updateOrganization($orgId: String!, $input: UpdateOrganizationInput!) {
    updateOrganization(orgId: $orgId, input: $input) {
      ...organizationFields
    }
  }
  ${organizationFragments}
`;


