import gql from "graphql-tag";
import fakeFragments from "../Fragments/fakeFragments";

export default gql`
  mutation fakeUpdate($id: ID!, $input: FakeInput!) {
    fakeUpdate(id: $id, input: $input) {
      ...fakeFields
    }
  }
  ${fakeFragments}
`;
