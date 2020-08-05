import gql from "graphql-tag";

import { groupFragments } from "../Fragments";

export default gql`
  query groupsGet {
    groupsGet {
      ...groupFields

      startups {
        connectionId
        sharedBy
        createdAt
        createdAt
        comments
        evaluations
        subjective_score
        tags
      }
    }
  }
  ${groupFragments}
`;
