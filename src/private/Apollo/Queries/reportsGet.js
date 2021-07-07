import gql from "graphql-tag";
import { reportFragments } from "../Fragments";

export default gql`
  query reportsGet($filters: ReportFilters) {
    reportsGet(filters: $filters) {
      ...reportFields
    }
  }
  ${reportFragments}
`;
