import gql from "graphql-tag";

export default gql`
  fragment formFields on Form {
    id
    teamId
    createdBy
    createdAt
    updatedAt

    name
    description
    terms

    customFields {
      section
      title
      type
      field
      options {
        text
        val
      }
    }
    fields {
      section
      title
      type
      field
      options {
        text
        val
      }
    }
    hiddenFields
  }
`;
