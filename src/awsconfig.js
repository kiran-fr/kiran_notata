import AWS from "aws-sdk";
import AWSAppSyncClient from "aws-appsync";
import Amplify, { Auth } from "aws-amplify";
import { AUTH_TYPE } from "aws-appsync/lib/link/auth-link";

const STAGE = process.env.REACT_APP_STAGE;


export const awsconfig = {
  region: "eu-west-1",
  IdentityPoolId: "eu-west-1:161784cd-ecc6-4dc5-b607-a4e288e83d00",
  UserPoolId: "eu-west-1_iSzNjqM0u",
  ClientId: "7flhi2kis1di7u9cdd1jtovtrn",
  loginProvider: "cognito-idp.eu-west-1.amazonaws.com/eu-west-1_iSzNjqM0u"
};

export const initializeAwsConfig = () => {
  AWS.config.region = awsconfig.region;
  const cognitoIdentityCredentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: awsconfig.IdentityPoolId
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
    mandatorySignIn: false
  },
  API: {
    endpoints: [
      {
        name: "GoogleAuth",
        endpoint: "https://hkr5guxwhl.execute-api.eu-west-1.amazonaws.com",
        region: awsconfig.region
      }
    ]
  },
  Storage: {
    AWSS3: {
      // bucket: "adbooker.userfiles",
      // region: "eu-west-1",
    }
  }
});



// const devURL = "https://gwv2lgcqinetjg3ariygacjv64.appsync-api.eu-west-1.amazonaws.com/graphql";
// const prodURL = "https://kiyq3umvb5h2vc7w2cmjxmdneq.appsync-api.eu-west-1.amazonaws.com/graphql";
// let appsyncUrl = STAGE === 'dev' ? devURL : prodURL;

const dev2URL = "https://qisjxuphbjaihfdty2yc7wwjam.appsync-api.eu-west-1.amazonaws.com/graphql"
let appsyncUrl = dev2URL;

const config = {
  url: appsyncUrl,
  region: awsconfig.region,
  auth: {
    type: AUTH_TYPE.AWS_IAM,
    credentials: () => Auth.currentCredentials()
  },
  complexObjectsCredentials: () => Auth.currentCredentials(),
  disableOffline: true
};
const options = {
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network"
    }
  }
};

export const appsyncClient = new AWSAppSyncClient(config, options);


