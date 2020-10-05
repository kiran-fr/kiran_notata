import gql from "graphql-tag";

import { groupFragments } from "../Fragments";

export default gql`
  query groupsGet {
    groupsGet {
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
          id
          creative {
            id
            name
          }
        }
      }
    }
  }
  ${groupFragments}
`;
