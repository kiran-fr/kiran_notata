import AWS from "aws-sdk/global";
import Amplify, { Auth } from "aws-amplify";
import API from "@aws-amplify/api";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { AUTH_TYPE, createAuthLink } from "aws-appsync-auth-link";
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";
import { apolloInMemoryCache } from "./apollo-cache";
// import { CognitoUserPool } from "amazon-cognito-identity-js";

export const awsconfig = {
  region: "eu-west-1",
  IdentityPoolId: "eu-west-1:161784cd-ecc6-4dc5-b607-a4e288e83d00",
  UserPoolId: "eu-west-1_iSzNjqM0u",
  ClientId: "7flhi2kis1di7u9cdd1jtovtrn",
  loginProvider: "cognito-idp.eu-west-1.amazonaws.com/eu-west-1_iSzNjqM0u",
};

// const userPool = new CognitoUserPool({
//   UserPoolId: awsconfig.UserPoolId,
//   ClientId: awsconfig.ClientId,
// });

// const cognitoUser = userPool.getCurrentUser();
// cognitoUser.getSession(function (err, session) {
//   let token = session.getIdToken().getJwtToken();
//   let expiration = session.getAccessToken().getExpiration();
//   console.log("token", token);
//   console.log("expiration", expiration);
// });

export const initializeAwsConfig = () => {
  AWS.config.region = awsconfig.region;
  const cognitoIdentityCredentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: awsconfig.IdentityPoolId,
  });
  cognitoIdentityCredentials.clearCachedId();
  AWS.config.credentials = cognitoIdentityCredentials;
};

Amplify.configure({
  Auth: {
    identityPoolId: awsconfig.IdentityPoolId,
    region: awsconfig.region,
    userPoolId: awsconfig.UserPoolId,
    userPoolWebClientId: awsconfig.ClientId,
    mandatorySignIn: false,
  },

  API: {
    endpoints: [
      /* **** */
      /* dev2 */
      /* **** */

      {
        // private
        name: "GQL_APIG_PRIVATE_dev2",
        endpoint: "https://9vtydtu114.execute-api.eu-west-1.amazonaws.com",
        region: awsconfig.region,
      },

      {
        // public
        name: "GQL_APIG_PUBLIC_dev2",
        endpoint: "https://v29pv4mmz3.execute-api.eu-west-1.amazonaws.com",
        region: awsconfig.region,
      },

      /* ****** */
      /* v2prod */
      /* ****** */

      {
        // private
        name: "GQL_APIG_PRIVATE_v2prod",
        endpoint: "https://65x7mif1h9.execute-api.eu-west-1.amazonaws.com",
        region: awsconfig.region,
      },

      {
        // public
        name: "GQL_APIG_PUBLIC_v2prod",
        endpoint: "https://jpu8yabr6h.execute-api.eu-west-1.amazonaws.com",
        region: awsconfig.region,
      },

      /* ***** */
      /* local */
      /* ***** */

      {
        // private
        name: "GQL_APIG_PRIVATE_local",
        endpoint: "http://localhost:4001",
        region: awsconfig.region,
      },

      {
        // public
        name: "GQL_APIG_PUBLIC_local",
        endpoint: "http://localhost:4002",
        region: awsconfig.region,
      },
    ],
  },
  Storage: {
    AWSS3: {
      // bucket: "adbooker.userfiles",
      // region: "eu-west-1",
    },
  },
});

// ********************************* //
// * GQL LAMBDA API GATEWAY TESTER * //
// ********************************* //

const STAGE = "dev2";
const isLocal = false;

const GQL = {
  private: {
    path: `/${STAGE}/private_graphql`,
    endpoint: `GQL_APIG_PRIVATE_${isLocal ? "local" : STAGE}`,
  },

  public: {
    path: `/${STAGE}/public_graphql`,
    endpoint: `GQL_APIG_PUBLIC_${isLocal ? "local" : STAGE}`,
  },
};

console.log("GQL.private.endpoint", GQL.private.endpoint);
console.log("GQL.private.path", GQL.private.path);

const awsGraphqlFetch = (uri, options) => {
  return API.post(GQL.private.endpoint, GQL.private.path, {
    body: JSON.parse(options.body),
  }).then(response => {
    const result = {};
    result.ok = true;
    result.status = 200;
    result.body = {};
    result.text = () =>
      new Promise((resolve, reject) => {
        resolve(JSON.stringify(response));
      });
    return result;
  });
};
export const appsyncClient = new ApolloClient({
  link: ApolloLink.from([
    new HttpLink({
      fetch: awsGraphqlFetch,
    }),
  ]),
  cache: new InMemoryCache(apolloInMemoryCache),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});
