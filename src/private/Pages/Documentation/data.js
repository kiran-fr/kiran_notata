export default [
  {
    tableName: "[stage]-notata-news",
    typeName: "News",
    description:
      "Holds news items that we display on the dashboard. Only people that's part of the notata team has write access to this table - something that is hardcoded in the server. However, we have added a GSI for accountId, so that we will be able to query out news articles based on user account in the future.",
    keyAttributes: ["id", "accountId"],
    keySchema: ["id"],
    globalSecondaryIndexes: [
      {
        indexName: "accountGSI",
        keySchema: "accountId",
      },
    ],
    relatedQueries: [
      "newsGet",
      "newsGetOne",
      "newsCreate",
      "newsDelete",
      "newsDeleteImage",
      "newsSet",
      "newsUpdate",
    ],
    relatedSubQueries: ["News"],
  },

  {
    tableName: "[stage]-notata-notification",
    typeName: "Notification",
    description:
      "The notifications table holds notifications for each user (not account). Every time a mutation is being made a notification handler function located in the server.js file will decide who will get notified, and puts the notification on a SQS queue (which is a separate repository) on GitHub. Because of this there might be up to a 60 seconds delay from the excecution of the mutation till the notification is being saved.",
    keyAttributes: ["id", "cognitoIdentityId"],
    keySchema: ["id"],
    globalSecondaryIndexes: [
      {
        indexName: "userGSI",
        keySchema: "cognitoIdentityId",
      },
    ],
    relatedQueries: [
      "notificationsGet",
      "notificationsMarkAsSeen",
      "notificationsMarkAllAsSeen",
      "notificationMarkAsResolved",
    ],
    relatedSubQueries: [],
  },

  {
    tableName: "[stage]-notata-groupLogTable",
    typeName: "GroupLog",
    description:
      "This is where the group communication/chat is being stored. We've added both group GSI and creative GSI so that we can query all comments for group, or just comments for a specific startup in that group.",
    keyAttributes: ["id", "groupId", "creativeId"],
    keySchema: ["id"],
    globalSecondaryIndexes: [
      {
        indexName: "groupGSI",
        keySchema: "groupId",
      },
      {
        indexName: "creativeGSI",
        keySchema: "creativeId",
      },
    ],
    relatedQueries: [
      "groupLogGet",
      "groupLogCreate",
      "groupLogDelete",
      "groupLogUpdate",
      "groupLogMarkConversationAsSeen",
    ],
    relatedSubQueries: ["GroupLogItem"],
  },

  {
    tableName: "[stage]-notata-creativeTemplate",
    typeName: "CreativeTemplate",
    description:
      "This is the template for the startup information that you find in the external form, and the startup info tab on the startup page. At the moment we don't have any front end capabilities to make mutations on this, so everybody will get served the default template.",
    keyAttributes: ["id", "accountId"],
    keySchema: ["id"],
    globalSecondaryIndexes: [
      {
        indexName: "accountGSI",
        keySchema: "accountId",
      },
      {
        indexName: "creativeGSI",
        keySchema: "creativeId",
      },
    ],
    relatedQueries: ["creativeTemplateGet"],
    relatedSubQueries: [],
  },

  {
    tableName: "[stage]-notata-log",
    typeName: "Log",
    description:
      "The log item is connected to the Connection object, and is the comments/chat that you see on the overview tab on the startup page.",
    keyAttributes: ["id", "connectionId"],
    keySchema: ["id"],
    globalSecondaryIndexes: [
      {
        indexName: "connectionGSI",
        keySchema: "connectionId",
      },
    ],
    relatedQueries: ["logGet", "logCreate", "logDelete", "logUpdate"],
    relatedSubQueries: ["LogItem"],
  },

  {
    tableName: "[stage]-notata-evaluation2",
    typeName: "Evaluation",
    description:
      "The evaluation object is the actual evaluation of the startup. It uses the corresponding evalutionTemplate to calculate the score.",
    keyAttributes: ["id", "accountId", "connectionId"],
    keySchema: ["id"],
    globalSecondaryIndexes: [
      {
        indexName: "accountGSI",
        keySchema: "accountId",
      },
      {
        indexName: "connectionGSI",
        keySchema: "connectionId",
      },
    ],
    relatedQueries: [
      "evaluationGet",
      "evaluationCreate",
      "evaluationUpdate",
      "evaluationDelete",
    ],
    relatedSubQueries: ["Evaluation"],
  },

  {
    tableName: "[stage]-notata-connection",
    typeName: "Connection",
    description:
      'This is the "mother" object for the startups in your deal flow / list of startups. It\'s a container that holds a creative object, tags, funnels, subjective scores, impact goals etc.',
    keyAttributes: ["id", "accountId", "creativeId"],
    keySchema: ["id"],
    globalSecondaryIndexes: [
      {
        indexName: "accountGSI",
        keySchema: "accountId",
      },
      {
        indexName: "creativeGSI",
        keySchema: "creativeId",
      },
    ],
    relatedQueries: [
      "connectionGet",
      "connectionsGet",
      "connectionPagesGet",
      "connectionAutoCompleteName",
      "connectionCreate",
      "connectionUpdate",
      "connectionDelete",
      "connectionSetStar",
      "connectionSubjectiveScorePut",
      "connectionTagAdd",
      "connectionTagRemove",
      "connectionFunnelTagAdd",
      "connectionFunnelTagRemove",
    ],
    relatedSubQueries: ["Connection", "GroupSharingInfo", "SubjectiveScore"],
  },

  {
    tableName: "[stage]-notata-creative",
    typeName: "Creative",
    description:
      "This is the object that holds factual information about the company, such as the name of the company, contact information etc. The data in the creative object is based on the creativeTemplate object, and is available through the public API so that we can give access to startups to complete the information for us.",
    keyAttributes: ["id", "accountId"],
    keySchema: ["id"],
    globalSecondaryIndexes: [
      {
        indexName: "accountGSI",
        keySchema: "accountId",
      },
    ],
    relatedQueries: [
      "creativeGet",
      "creativesGet",
      "creativeCreate",
      "creativeUpdate",
      "creativeDelete",
    ],
    relatedSubQueries: ["Creative"],
  },

  {
    tableName: "[stage]-notata-funnelGroup",
    typeName: "FunnelGroup",
    description:
      "This is the funnels for the account. It does not have it's own query, so you have to fetch it from accountGet { funnelGroups }.",
    keyAttributes: ["id", "accountId"],
    keySchema: ["id"],
    globalSecondaryIndexes: [
      {
        indexName: "accountGSI",
        keySchema: "accountId",
      },
    ],
    relatedQueries: [
      "funnelGroupCreate",
      "funnelGroupUpdate",
      "funnelGroupDelete",
    ],
    relatedSubQueries: ["FunnelGroup"],
  },

  {
    tableName: "[stage]-notata-funnelTag",
    typeName: "FunnelTag",
    description:
      'The actual "tags" or stages under the funnel group. The tags themselves does not have a root query, but can be fetched through funnelGroup { funnelTag }',
    keyAttributes: ["id", "funnelGroupId", "accountId"],
    keySchema: ["id"],
    globalSecondaryIndexes: [
      {
        indexName: "funnelGroupGSI",
        keySchema: "funnelGroupId",
      },
      {
        indexName: "accountGSI",
        keySchema: "accountId",
      },
    ],
    relatedQueries: ["funnelTagCreate", "funnelTagUpdate", "funnelTagDelete"],
    relatedSubQueries: ["FunnelTag"],
  },

  {
    tableName: "[stage]-notata-tagGroup",
    typeName: "TagGroup",
    description: "Tag groups for account.",
    keyAttributes: ["id", "accountId"],
    keySchema: ["id"],
    globalSecondaryIndexes: [
      {
        indexName: "accountGSI",
        keySchema: "accountId",
      },
    ],
    relatedQueries: [
      "tagGroupsGet",
      "tagGroupCreate",
      "tagGroupUpdate",
      "tagGroupDelete",
    ],
    relatedSubQueries: ["TagGroup"],
  },

  {
    tableName: "[stage]-notata-tag",
    typeName: "Tag",
    description:
      "Tags within the tag group. Does not have it's own query, but can be fetched from tagGroup { tag }",
    keyAttributes: ["id", "tagGroupId", "accountId"],
    keySchema: ["id"],
    globalSecondaryIndexes: [
      {
        indexName: "tagGroupGSI",
        keySchema: "tagGroupId",
      },
      {
        indexName: "accountGSI",
        keySchema: "accountId",
      },
    ],
    relatedQueries: ["tagCreate", "tagUpdate", "tagDelete"],
    relatedSubQueries: ["Tag"],
  },

  {
    tableName: "[stage]-notata-evaluationTemplate",
    typeName: "EvaluationTemplate",
    description: "Evaluation template which evaluation object is based on.",
    keyAttributes: ["id", "accountId"],
    keySchema: ["id"],
    globalSecondaryIndexes: [
      {
        indexName: "accountGSI",
        keySchema: "accountId",
      },
    ],
    relatedQueries: [
      "evaluationTemplateGet",
      "evaluationTemplateCreate",
      "evaluationTemplateDelete",
      "evaluationTemplateUpdate",
    ],
    relatedSubQueries: ["EvaluationTemplate"],
  },

  {
    tableName: "[stage]-notata-evaluationTemplateSection",
    typeName: "EvaluationTemplateSection",
    description: "Each section withing the evaluation template.",
    keyAttributes: ["id", "templateId"],
    keySchema: ["id"],
    globalSecondaryIndexes: [
      {
        indexName: "templateGSI",
        keySchema: "templateId",
      },
    ],
    relatedQueries: [
      "evaluationTemplateSectionGet",
      "evaluationTemplateSectionCreate",
      "evaluationTemplateSectionDelete",
      "evaluationTemplateSectionUpdate",
    ],
    relatedSubQueries: [
      "EvaluationTemplateSection",
      "EvaluationTemplateQuestion",
    ],
  },

  {
    tableName: "[stage]-notata-account",
    typeName: "Account",
    description:
      "Every user belongs to an accout, and we verify a users access with either the user cognito idenitity id, or the account id for the user. A user can only be part of one account at the time.",
    keyAttributes: ["id"],
    keySchema: ["id"],
    globalSecondaryIndexes: [],
    relatedQueries: ["accountGet", "accountUserRemove"],
    relatedSubQueries: ["Account", "AccountInvitation"],
  },

  {
    tableName: "[stage]-notata-invitation",
    typeName: "Invitation",
    description:
      'The invitation table is closely related to the account table and the user table, and has overlapping queries with both of those tables. Instead of "id" it has "email" as its primary key, meaning that a user can query out their own invitations, at the same time as the account that created the invitation can query them out through the account GSI.',
    keyAttributes: ["email", "accountId"],
    keySchema: ["email", "accountId"],
    globalSecondaryIndexes: [
      {
        indexName: "accountGSI",
        keySchema: "accountId",
      },
    ],
    relatedQueries: [
      "accountInvitationsGet",
      "accountInviteCreate",
      "accountInviteDelete",
      "userInvitationsGet",
      "userInvitationResponse",
    ],
    relatedSubQueries: ["Account", "AccountInvitation", "UserInvitation"],
  },

  {
    tableName: "[stage]-notata-user",
    typeName: "User",
    description:
      'The user object. It corresponds with the user object in the federated user pool in AWS, and has to have the rather obscure "cognitoIdentityId" property. Every request that comes to the server is signed with this ID, and we use to identify the user.',
    keyAttributes: ["cognitoIdentityId", "email"],
    keySchema: ["cognitoIdentityId"],
    globalSecondaryIndexes: [
      {
        indexName: "emailGSI",
        keySchema: "email",
      },
    ],
    relatedQueries: ["userGet", "userUpdate"],
    relatedSubQueries: [],
  },

  {
    tableName: "[stage]-notata-group2",
    typeName: "GroupV2",
    description:
      "This is a quite large object that holds all the group information. We might need to split this into more sizable chunks after a while, but for now it works.",
    keyAttributes: ["id"],
    keySchema: ["id"],
    globalSecondaryIndexes: [],
    relatedQueries: [
      "groupGetV2",
      "groupsGetV2",
      "groupPublicGet",
      "groupsPublicGet",
      "groupInvitationsGet",
      "groupGetRecentlyAddedStartups",
      "groupUsersInvite",
      "groupUserSetRole",
      "groupUserRemove",
      "groupUserInvite",
      "groupUserInvitationResponse",
      "groupUserInvitationRemove",
      "groupUpdate",
      "groupTemplateRemove",
      "groupTemplateAdd",
      "groupSubjectiveScoreRemove",
      "groupSubjectiveScoreAdd",
      "groupStartupsAdd",
      "groupStartupRemove",
      "groupStartupAdd",
      "groupSettingsSet",
      "groupPublicJoin",
      "groupMarkAsSeenV2",
      "groupLeave",
      "groupEvaluationRemove",
      "groupEvaluationAdd",
      "groupDelete",
      "groupCreate",
    ],
    relatedSubQueries: [
      "GroupMemberV2",
      "GroupPendingInvitation",
      "GroupRecentlyAddedStartup",
      "GroupStartupListV2",
      "GroupStartupV2",
      "GroupV2",
    ],
  },
];

// {
//   "tableName": "[stage]-notata-externalResource",
//   "depreciated": true,
//   "keyAttributes": [
//     "id",
//     "connectionId"
//   ],
//   "keySchema": [
//     "id"
//   ],
//   "globalSecondaryIndexes": [
//     {
//       "indexName": "connectionGSI",
//       "keySchema": "connectionId"
//     }
//   ]
// },

// {
//   "tableName": "[stage]-notata-impactGoals",
//   "keyAttributes": [
//     "id"
//   ],
//   "keySchema": [
//     "id"
//   ],
//   "globalSecondaryIndexes": []
// },

// {
//     "tableName": "[stage]-notata-task",
//     "description": "This",
//     "keyAttributes": [
//       "id",
//       "accountId",
//       "cognitoIdentityId"
//     ],
//     "keySchema": [
//       "id"
//     ],
//     "globalSecondaryIndexes": [
//       {
//         "indexName": "accountGSI",
//         "keySchema": "accountId"
//       },
//       {
//         "indexName": "userGSI",
//         "keySchema": "cognitoIdentityId"
//       }
//     ],
//     "relatedQueries": [],
//     "relatedSubQueries": []
//   },

// {
//   "tableName": "[stage]-notata-publicEvaluation",
//   "description": "",
//   "keyAttributes": [
//     "id",
//     "email",
//     "connectionId"
//   ],
//   "keySchema": [
//     "id"
//   ],
//   "globalSecondaryIndexes": [
//     {
//       "indexName": "emailGSI",
//       "keySchema": "email"
//     },
//     {
//       "indexName": "connectionGSI",
//       "keySchema": "connectionId"
//     }
//   ],
//   "relatedQueries": [],
//   "relatedSubQueries": []
// },

// {
//   "tableName": "[stage]-notata-publicPresentation",
//   "keyAttributes": [
//     "id",
//     "email",
//     "connectionId"
//   ],
//   "keySchema": [
//     "id"
//   ],
//   "globalSecondaryIndexes": [
//     {
//       "indexName": "emailGSI",
//       "keySchema": "email"
//     },
//     {
//       "indexName": "connectionGSI",
//       "keySchema": "connectionId"
//     }
//   ]
// },

// {
//   "tableName": "[stage]-notata-pending",
//   "keyAttributes": [
//     "id",
//     "email"
//   ],
//   "keySchema": [
//     "id"
//   ],
//   "globalSecondaryIndexes": [
//     {
//       "indexName": "emailGSI",
//       "keySchema": "email"
//     }
//   ],
//   "relatedQueries": [
//     "creativeTemplateGet"
//   ],
//   "relatedSubQueries": [
//   ]
// },

// {
//     "tableName": "[stage]-notata-evaluationQuestion",
//     "keyAttributes": [
//       "id",
//       "accountId"
//     ],
//     "keySchema": [
//       "id"
//     ],
//     "globalSecondaryIndexes": [
//       {
//         "indexName": "accountGSI",
//         "keySchema": "accountId"
//       }
//     ]
//   },

// {
//   "tableName": "[stage]-notata-group",
//   "keyAttributes": [
//     "id"
//   ],
//   "keySchema": [
//     "id"
//   ],
//   "globalSecondaryIndexes": []
// },
