import gql from "graphql-tag";

export default gql`
  query {
    groupsGetV2 {
      id
      name
    }
  }
`;
