import gql from "graphql-tag";

export default gql`
  fragment newsFields on News {
    id
    title
    blurb
    image
    content
    createdAt
    updatedAt
    createdByUser {
      email
      family_name
      given_name
    }
    tags
    isItUseful
    seen
  }
`;
