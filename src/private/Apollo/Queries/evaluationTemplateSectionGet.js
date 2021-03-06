import gql from "graphql-tag";

import {} from "../Fragments";

export default gql`
  query evaluationTemplateSectionGet($id: ID!) {
    evaluationTemplateSectionGet(id: $id) {
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
          score
        }
      }
    }
  }
`;
