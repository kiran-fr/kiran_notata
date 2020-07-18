import gql from "graphql-tag";
import { inboxFragments, organizationFragments } from "../Fragments";

export default gql`
  query getInbox {
    getInbox {
      ...inboxFields
      organization {
        ...organizationFields
      }
    }
  }
  ${inboxFragments}
  ${organizationFragments}
`;