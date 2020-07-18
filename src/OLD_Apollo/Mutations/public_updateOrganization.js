import gql from "graphql-tag";
import { organizationFragments } from '../Fragments';

export default gql`
  mutation public_updateOrganization($id: String!, $email: String!, $input: UpdateOrganizationInput!) {
    public_updateOrganization(id: $id, email: $email, input: $input) {
      ...organizationFields
    }
  }
  ${organizationFragments}
`;


