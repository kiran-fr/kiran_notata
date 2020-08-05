import gql from "graphql-tag";

export default gql`
  fragment groupFields on Group {
    id
    name
    description
    createdAt
    updatedAt
    createdBy
    members {
      email
      role
      joinedDate
      latestActivity
    }
    settings {
      name
    }
  }
`;
