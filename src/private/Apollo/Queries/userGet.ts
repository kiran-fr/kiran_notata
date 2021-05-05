import gql from "graphql-tag";
import { userFragments } from "Apollo/Fragments";

export interface User {
  cognitoIdentityId: string;
  email: string;
  given_name: string;
  family_name: string;
  phone_number: string;
  company: string;
  // MFA: String;
  // accountId: ID;
  // createdAt: Float;
  // latestActivity: Float;
  // groups: [ID];
  // q1_expertise: [String];
  // q2_whoAreYou: String;
  // q3_investment: [String];
  // q4_geography: [String];
  // q5_stage:[String];
  }
export default gql`
  query userGet {
    userGet {
      ...userFields
    }
  }
  ${userFragments}
`;
