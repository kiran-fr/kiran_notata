import gql from "graphql-tag";

import {
  tagFragments,
  funnelTagFragments,
  creativeFragments,
  connectionFragments,
  evaluationFragments,
} from "../Fragments";

export default gql`
  query connectionGet($id: ID!) {
    connectionGet(id: $id) {
      ...connectionFields

      sharedWithMe {
        sharedBy
        createdAt
        groupName
        groupId

        comments
        evaluations
        subjective_score
        tags

        connection {
          subjectiveScores {
            score
            createdByUser {
              email
              family_name
              given_name
            }
          }

          evaluations {
            id
            name
            description
            createdAt
            updatedAt
            createdBy
            templateId
            answers {
              id
              inputType
              questionId
              sid
              question
              val
            }
            createdByUser {
              email
              given_name
              family_name
            }
            summary {
              templateName
              sections {
                name
                score
                possibleScore
                scorePerAnswer {
                  score
                  possibleScore
                  questionId
                  question
                }
              }
              totalScore
              possibleScore
            }
          }
        }
      }

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
  ${tagFragments}
  ${funnelTagFragments}
  ${creativeFragments}
  ${connectionFragments}
  ${evaluationFragments}
`;
