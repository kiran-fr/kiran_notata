import gql from "graphql-tag";
import { evaluationQuestionFragments } from "../Fragments";

export default gql`
  query getEvaluationQuestions {
    getEvaluationQuestions {
      ...evaluationQuestionFields
    }
  }
  ${evaluationQuestionFragments}
`;
