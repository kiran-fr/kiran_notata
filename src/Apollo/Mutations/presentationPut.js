import gql from "graphql-tag";
import { presentationFragments } from "../Fragments";

export default gql`
  mutation presentationPut(
    $id: ID
    $input: PresentationInput
    $delete: Boolean
    $markAsSeen: AWSTimestamp
  ) {
    presentationPut(
      id: $id
      input: $input
      delete: $delete
      markAsSeen: $markAsSeen
    ) {
      ...presentationFields
    }
  }
  ${presentationFragments}
`;
