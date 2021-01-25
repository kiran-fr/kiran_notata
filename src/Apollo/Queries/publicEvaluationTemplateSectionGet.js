import gql from "graphql-tag";

import {} from "../Fragments";

export default gql`
  query publicEvaluationTemplateSectionGet($id: ID!) {
    publicEvaluationTemplateSectionGet(id: $id) {
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
`;
