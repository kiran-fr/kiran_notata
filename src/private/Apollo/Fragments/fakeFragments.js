import gql from "graphql-tag";

export default gql`
  fragment fakeFields on Fake {
    id
    createdBy
    createdAt
    title
  }
`;
