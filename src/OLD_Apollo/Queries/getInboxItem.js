import gql from "graphql-tag";
import { inboxFragments, organizationFragments } from "../Fragments";

export default gql`
  query getInboxItem($id: ID!) {
    getInboxItem(id: $id) {
      ...inboxFields
      organization {
        ...organizationFields
      }
    }
  }
  ${inboxFragments}
  ${organizationFragments}
`;