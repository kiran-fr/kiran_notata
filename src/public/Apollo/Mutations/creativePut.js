import gql from "graphql-tag";

import creativeFragments from "../Fragments/creativeFragments";

export default gql`
  mutation creativePut($id: ID, $accountId: ID, $input: CreativeInput) {
    creativePut(id: $id, accountId: $accountId, input: $input) {
      ...creativeFields
    }
  }
  ${creativeFragments}
`;
