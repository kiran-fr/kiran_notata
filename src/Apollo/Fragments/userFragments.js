import gql from "graphql-tag";

export default gql`
  fragment userFields on User {
    cognitoIdentityId
    email
    accountId
    given_name
    family_name
    phone_number
    company
    MFA
    accountId
    createdAt
    latestActivity
    groups
    q1_expertise
    q2_whoAreYou
    q3_investment
    q4_geography
    q5_stage
    columnSettings {
      groups
      tags
      funnels
      subjectiveScore
      evaluationTemplates
    }
  }
`;
