import gql from "graphql-tag";

import {
  groupFragments,
  tagFragments,
  funnelTagFragments,
  creativeFragments,
  connectionFragments,
  evaluationFragments,
} from "../Fragments";

export default gql`
  query groupGet($id: ID!, $connectionId: ID) {
    groupGet(id: $id, connectionId: $connectionId) {
      ...groupFields

      evaluationTemplates {
        id
        name
        description
        sections {
          id
          name
        }
      }

      startups {
        connectionId
        creativeId
        sharedBy
        createdAt
        comments
        evaluations
        subjective_score
        tags
        seen

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

          evaluations {
            ...evaluationFields
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
  ${evaluationFragments}
`;
