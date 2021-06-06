import gql from "graphql-tag";

export default gql`
  mutation groupUserInvitationResponse(
    $groupId: ID!
    $email: String!
    $response: AcceptReject!
  ) {
    groupUserInvitationResponse(
      groupId: $groupId
      email: $email
      response: $response
    ) {
      id
      name
      createdByUser {
        email
        given_name
        family_name
      }
    }
  }
`;
