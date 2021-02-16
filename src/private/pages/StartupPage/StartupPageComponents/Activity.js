import React from "react";
import { useQuery, useMutation } from "@apollo/client";

import Activity from "Components/Activity/Activity";
import { logPut, logUpdate, logDelete } from "private/Apollo/Mutations";
import { logGet } from "private/Apollo/Queries";

export const StartupActivity = ({ user, connection }) => {
  const [mutateCreate] = useMutation(logPut);
  const [mutateUpdate] = useMutation(logUpdate);
  const [mutateDelete] = useMutation(logDelete);
  const logQuery = useQuery(logGet, {
    variables: { connectionId: connection.id },
  });

  let logs = [];
  if (!logQuery.error && !logQuery.loading && logQuery.data) {
    logs = logQuery.data.logGet;
  }

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

    mutateCreate({
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

  const updateMutation = value => {
    let variables = {
      id: value.id,
      input: {
        logType: "COMMENT",
        dataPairs: [
          {
            key: "TEXT",
            val: value.value,
          },
        ],
      },
    };

    mutateUpdate({
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
      update: (proxy, { data: { logUpdate } }) => {
        const data = proxy.readQuery({
          query: logGet,
          variables: { connectionId: connection.id },
        });

        proxy.writeQuery({
          query: logGet,
          variables: { connectionId: connection.id },
          data: {
            logGet: [
              ...data.logGet.filter(log => log.id !== value.id),
              logUpdate,
            ],
          },
        });
      },
    });
  };

  const deleteMutation = value => {
    let variables = { id: value };

    mutateDelete({
      variables,
      optimisticResponse: {
        __typename: "Mutation",
        logDelete: {
          __typename: "MessageResponse",
          message: "Log item successfully deleted",
        },
      },
      update: (cache, { data: { logDelete } }) => {
        const data = cache.readQuery({
          query: logGet,
          variables: { connectionId: connection.id },
        });

        cache.writeQuery({
          query: logGet,
          variables: { connectionId: connection.id },
          data: {
            logGet: [...data.logGet.filter(log => log.id !== value)],
          },
        });
      },
    });
  };

  return (
    <Activity
      user={user}
      logs={logs}
      submitMutation={submitMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
    />
  );
};
