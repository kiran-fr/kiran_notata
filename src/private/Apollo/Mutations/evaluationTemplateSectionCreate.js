import gql from "graphql-tag";

export default gql`
  mutation evaluationTemplateSectionCreate(
    $templateId: ID!
    $input: EvaluationTemplateSectionInput!
  ) {
    evaluationTemplateSectionCreate(templateId: $templateId, input: $input) {
      id
      name
      description
    }
  }
`;
