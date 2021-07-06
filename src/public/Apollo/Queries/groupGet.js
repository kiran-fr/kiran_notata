import gql from "graphql-tag";

import groupFragments from "../Fragments/groupFragments";
import tagFragments from "../Fragments/tagFragments";
import funnelTagFragments from "../Fragments/funnelTagFragments";
import creativeFragments from "../Fragments/creativeFragments";
import connectionFragments from "../Fragments/connectionFragments";

export default gql`
  query groupGet($id: ID!) {
    groupGet(id: $id) {
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
