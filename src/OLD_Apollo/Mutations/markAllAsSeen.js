import gql from "graphql-tag";

export default gql`
  mutation markAllAsSeen {
    markAllAsSeen {
      message
    }
  }
`;
