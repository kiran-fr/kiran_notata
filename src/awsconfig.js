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
      {
        name: "GQL_APIG_V2PROD",
        endpoint: "https://65x7mif1h9.execute-api.eu-west-1.amazonaws.com",
        region: awsconfig.region,
      },
      {
        name: "GQL_APIG_DEV2",
        endpoint: "https://9vtydtu114.execute-api.eu-west-1.amazonaws.com",
        region: awsconfig.region,
      },
      {
        name: "GQL_LOCAL",
        endpoint: "http://localhost:4001",
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

const GQL = {
  dev2: {
    endpoint: "GQL_APIG_DEV2",
    path: `/dev2/private_graphql`,
  },
  v2prod: {
    endpoint: "GQL_APIG_V2PROD",
    path: `/v2prod/private_graphql`,
  },
  local: {
    endpoint: "GQL_LOCAL",
    path: `/dev2/private_graphql`,
  },
};

const STAGE = "dev2";

const awsGraphqlFetch = (uri, options) => {
  return API.post(GQL[STAGE].endpoint, GQL[STAGE].path, {
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

// const dev2_URL_id = "3mlk5clgsvdptfcfo7utvkqhim";
// const V2PROD_URL_id = "ahh7xy4e2vgsrmf6uyo4fxyk3y";
// const appsync_URL_id = V2PROD_URL_id;
//
// const appsyncUrl = `https://${appsync_URL_id}.appsync-api.eu-west-1.amazonaws.com/graphql`;
//
// const config = {
//   url: appsyncUrl,
//   region: awsconfig.region,
//   auth: {
//     type: AUTH_TYPE.AWS_IAM,
//     credentials: (...params) => Auth.currentCredentials(...params),
//   },
//   disableOffline: true,
// };
//
// export const appsyncClient = new ApolloClient({
//   link: ApolloLink.from([
//     createAuthLink(config),
//     createSubscriptionHandshakeLink(config),
//   ]),
//   cache: new InMemoryCache(apolloInMemoryCache),
//   defaultOptions: {
//     watchQuery: {
//       fetchPolicy: "cache-and-network",
//     },
//   },
// });
