import gql from "graphql-tag";

export default gql`
  mutation groupStartupAdd($groupId: ID!, $creativeId: ID!) {
    groupStartupAdd(groupId: $groupId, creativeId: $creativeId) {
      id
      name
    }
  }
`;
