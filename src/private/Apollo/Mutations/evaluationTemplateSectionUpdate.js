import gql from "graphql-tag";

export default gql`
  mutation evaluationTemplateSectionUpdate(
    $id: ID!
    $input: EvaluationTemplateSectionInput!
  ) {
    evaluationTemplateSectionUpdate(id: $id, input: $input) {
      id
      name
      description
    }
  }
`;
