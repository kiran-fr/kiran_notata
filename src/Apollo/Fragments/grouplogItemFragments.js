import gql from "graphql-tag";

export default gql`
  fragment grouplogItemFragments on GroupLogItem {
    id
    createdBy
    groupId
    creativeId
    createdAt
    updatedAt
    logType
    dataPairs {
      key
      val
    }
    createdByUser {
      email
      given_name
      family_name
    }
  }
`;
