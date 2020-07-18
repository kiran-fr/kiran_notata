import gql from "graphql-tag";
import { organizationFragments } from '../Fragments'

export default gql`
  query public_getOrganization($id: String!, $email: String!) {
    public_getOrganization(id: $id, email: $email) {
      ...organizationFields
    }
  }
  ${organizationFragments}
`;
