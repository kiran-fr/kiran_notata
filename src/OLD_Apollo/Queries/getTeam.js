import gql from "graphql-tag";

export default gql`
  query getTeam {
    getTeam {
      id
      members
      pending
      is_pending
    }
  }
`;
