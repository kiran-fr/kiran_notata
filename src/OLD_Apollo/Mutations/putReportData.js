import gql from "graphql-tag";

export default gql`
  mutation putReportData($input: ReportDataInput!) {
    putReportData(input: $input) {
      id
      filters
      groups
      funnels
    }
  }
`;
