import gql from "graphql-tag";
import {
  organizationFragments,
  userFragments
} from '../Fragments';

export default gql`
  query getUserAndOrganization($id: String!) {

    getOrganization(id: $id) {
      ...organizationFields
    }

    getUser {
      ...userFields
    }

  }
  ${organizationFragments}
  ${userFragments}
`;

