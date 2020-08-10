import gql from "graphql-tag";

import {
  groupFragments,
  tagFragments,
  funnelTagFragments,
  creativeFragments,
  connectionFragments,
} from "../Fragments";

export default gql`
  query publicGroupGet($id: ID!) {
    publicGroupGet(id: $id) {
      ...groupFields

      startups {
        connectionId
        sharedBy
        createdAt
        comments
        evaluations
        subjective_score
        tags

        connection {
          ...connectionFields

          creative {
            ...creativeFields
          }

          tags {
            ...tagFields
          }

          funnelTags {
            ...funnelTagFields
          }
        }
      }
    }
  }
  ${groupFragments}
  ${tagFragments}
  ${funnelTagFragments}
  ${creativeFragments}
  ${connectionFragments}
`;
