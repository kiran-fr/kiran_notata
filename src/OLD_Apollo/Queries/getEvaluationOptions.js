import gql from "graphql-tag";
import { evaluationOptionFragments } from "../Fragments";

export default gql`
  query getEvaluationOptions {
    getEvaluationOptions {
      ...evaluationOptionFields
    }
  }
  ${evaluationOptionFragments}
`;
