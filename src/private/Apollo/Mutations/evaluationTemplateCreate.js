import gql from "graphql-tag";

export default gql`
  mutation evaluationTemplateCreate($input: EvaluationTemplateInput!) {
    evaluationTemplateCreate(input: $input) {
      id
      name
      description
    }
  }
`;
