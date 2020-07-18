import gql from "graphql-tag";

export default gql`
  fragment inboxFields on Inbox {
    id
    createdAt
    updatedAt
    teamId
  }
`;