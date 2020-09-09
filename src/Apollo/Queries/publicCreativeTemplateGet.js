import gql from "graphql-tag";

export default gql`
  query publicCreativeTemplateGet($id: ID) {
    publicCreativeTemplateGet(id: $id) {
      id
      name
      description
      sections {
        id
        name
        description
        questions {
          id
          name
          description
          inputType
          options {
            val
            sid
          }
        }
      }
    }
  }
`;
