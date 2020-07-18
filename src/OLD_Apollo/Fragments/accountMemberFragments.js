import gql from "graphql-tag";

export default gql`
  fragment accountFields on Account {
    email
    given_name
    family_name
    role
    latestActivity
  }
`;
