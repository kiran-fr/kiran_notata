import gql from "graphql-tag";

export default gql`
  fragment tagFields on Tag {
    id
    createdBy
    updatedAt
    name
    group
    tag_type
    data
    index
  }
`;
