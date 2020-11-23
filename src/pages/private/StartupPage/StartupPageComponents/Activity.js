import React from "react";
import { useQuery, useMutation } from "@apollo/client";

import Activity from "Components/Activity/Activity";
import { logPut } from "Apollo/Mutations";
import { logGet } from "Apollo/Queries";

export const StartupActivity = ({ user, connection }) => {
  const [mutate] = useMutation(logPut);
  const logQuery = useQuery(logGet, {
    variables: { connectionId: connection.id },
  });

  let logs = [];
  if (!logQuery.error && !logQuery.loading && logQuery.data) {
    logs = logQuery.data.logGet;
  }

  logs = (logs || []).filter(l => l.logType === "COMMENT");

  const submitMutation = value => {
    let variables = {
      connectionId: connection.id,
      input: {
        logType: "COMMENT",
        dataPairs: [
          {
            key: "TEXT",
            val: value,
          },
        ],
      },
    };

    mutate({
      variables,
      optimisticResponse: {
        __typename: "Mutation",
        logPut: {
          __typename: "LogItem",
          accountId: "",
          id: "",
          seenBy: null,
          reference: null,
          notifyUsers: null,
          connectionId: connection.id,
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime(),
          createdBy: user.cognitoIdentityId,
          logType: "COMMENT",
          createdByUser: {
            __typename: "SimpleUser",
            given_name: user.given_name,
            family_name: user.family_name,
            email: user.email,
          },
          dataPairs: [
            {
              key: "TEXT",
              val: value,
              __typename: "KeyVal",
            },
          ],
        },
      },
      update: (proxy, { data: { logPut } }) => {
        const data = proxy.readQuery({
          query: logGet,
          variables: { connectionId: connection.id },
        });

        proxy.writeQuery({
          query: logGet,
          variables: { connectionId: connection.id },
          data: {
            logGet: [...data.logGet, logPut],
          },
        });
      },
    });
  };

  return <Activity user={user} logs={logs} submitMutation={submitMutation} />;
};
