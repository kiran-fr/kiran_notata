import gql from "graphql-tag";
import { creativeFragments } from "Apollo/Fragments";

export default gql`
  mutation creativeUpdate($id: ID!, $input: CreativeInput!) {
    creativeUpdate(id: $id, input: $input) {
      ...creativeFields
    }
  }
  ${creativeFragments}
`;
