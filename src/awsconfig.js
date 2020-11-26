import AWS from "aws-sdk/global";
import Amplify, { Auth } from "aws-amplify";
import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { AUTH_TYPE, createAuthLink } from "aws-appsync-auth-link";
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";
import { apolloInMemoryCache } from "./apollo-cache";

export const awsconfig = {
  region: "eu-west-1",
  IdentityPoolId: "eu-west-1:161784cd-ecc6-4dc5-b607-a4e288e83d00",
  UserPoolId: "eu-west-1_iSzNjqM0u",
  ClientId: "7flhi2kis1di7u9cdd1jtovtrn",
  loginProvider: "cognito-idp.eu-west-1.amazonaws.com/eu-west-1_iSzNjqM0u",
};

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
        name: "GoogleAuth",
        endpoint: "https://hkr5guxwhl.execute-api.eu-west-1.amazonaws.com",
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

// const dev_URL_id = "soaim5drvjdfplwdjyllz2ru6i";
// const dev_URL_id = "soaim5drvjdfplwdjyllz2ru6i";
// const prodtest_URL_id = "pm4namovdzgpboqy5s2vgafzjy";
const dev2_URL_id = "3mlk5clgsvdptfcfo7utvkqhim";
// const V2PROD_URL_id = "ahh7xy4e2vgsrmf6uyo4fxyk3y";

const appsync_URL_id = dev2_URL_id;

const appsyncUrl = `https://${appsync_URL_id}.appsync-api.eu-west-1.amazonaws.com/graphql`;

const config = {
  url: appsyncUrl,
  region: awsconfig.region,
  auth: {
    type: AUTH_TYPE.AWS_IAM,
    credentials: (...params) => Auth.currentCredentials(...params),
  },
  disableOffline: true,
};

export const appsyncClient = new ApolloClient({
  link: ApolloLink.from([
    createAuthLink(config),
    createSubscriptionHandshakeLink(config),
  ]),
  cache: new InMemoryCache(apolloInMemoryCache),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});
