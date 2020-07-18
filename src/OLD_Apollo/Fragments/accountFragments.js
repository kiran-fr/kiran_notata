import gql from "graphql-tag";

export default gql`
  fragment accountFields on Account {
    id
    name
    createdBy
    createdAt
    updatedAt
  }
`;
