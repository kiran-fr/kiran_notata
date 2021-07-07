import gql from "graphql-tag";
import fakeFragments from "../Fragments/fakeFragments";

export default gql`
  mutation fakeCreate($input: FakeInput!) {
    fakeCreate(input: $input) {
      ...fakeFields
    }
  }
  ${fakeFragments}
`;
