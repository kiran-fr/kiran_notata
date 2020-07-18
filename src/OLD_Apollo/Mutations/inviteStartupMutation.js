import gql from "graphql-tag";
import { organizationFragments } from '../Fragments';

export default gql`
  mutation inviteStartup($email: String!, $orgId: String!, $subject: String!, $body: String!) {
    inviteStartup(email: $email, orgId: $orgId, subject: $subject, body: $body) {
      ...organizationFields
    }
  }
  ${organizationFragments}
`;