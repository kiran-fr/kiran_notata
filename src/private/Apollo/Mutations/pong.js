import gql from "graphql-tag";

export default gql`
  mutation pong {
    pong {
      message
    }
  }
`;
