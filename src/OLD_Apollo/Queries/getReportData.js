import gql from "graphql-tag";

export default gql`
  query getReportData {
    getReportData {
      id
      filters
      groups
      funnels
    }
  }
`;
