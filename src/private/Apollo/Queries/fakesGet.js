import gql from "graphql-tag";
import fakeFragments from "../Fragments/fakeFragments";

export default gql`
  query fakesGet {
    fakesGet {
      ...fakeFields
    }
  }
  ${fakeFragments}
`;
