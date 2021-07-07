import gql from "graphql-tag";

export default gql`
  fragment reportFields on Report {
    connectionCount

    subjectiveScoreStats {
      groupData {
        score
        connectionCount
      }
      personalData {
        score
        connectionCount
      }
    }

    evaluationStats {
      templateId
      templateName
      records {
        connectionId
        creativeId
        creativeName
        submissions
        averageScore
        possibleScore
        highestScore
        lowestScore
        averagePercentageScore
      }
    }

    groupStats {
      numberOfOpenGroups
      numberOfClosedGroups
      numberOfMyGroups
      numberOfGroups
      peopleInGroups
      startupsInGroups
    }

    tagStats {
      tagGroupId
      tagGroupName
      connectionCount
      tags {
        tagId
        tagName
        connectionCount
        records {
          creativeId
          connectionId
          creativeName
        }
      }
    }

    funnelStats {
      funnelGroupId
      funnelGroupName
      connectionCount
      funnelTags {
        funnelTagId
        funnelTagName
        connectionCount
        records {
          creativeId
          connectionId
          creativeName
        }
      }
    }
  }
`;
