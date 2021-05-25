import gql from "graphql-tag";

export default gql`
  mutation evaluationTemplateUpdate(
    $id: ID!
    $input: EvaluationTemplateInput!
  ) {
    evaluationTemplateUpdate(id: $id, input: $input) {
      id
      name
      description
    }
  }
`;
