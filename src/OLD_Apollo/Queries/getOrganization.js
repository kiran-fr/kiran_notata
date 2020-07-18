import gql from "graphql-tag";
import { organizationFragments } from '../Fragments'

export default gql`
  query getOrganization($id: String!) {
    getOrganization(id: $id) {
      ...organizationFields
    }
  }
  ${organizationFragments}
`;
