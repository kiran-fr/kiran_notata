import gql from "graphql-tag";
import fakeFragments from "../Fragments/fakeFragments";

export default gql`
  query fakeGet($id: ID!) {
    fakeGet(id: $id) {
      ...fakeFields
    }
  }
  ${fakeFragments}
`;
