import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";

import moment from "moment";

import { groupLogPut } from "Apollo/Mutations";
import { groupLogGet } from "Apollo/Queries";
import { groupLogSubscription } from "Apollo/Subscriptions";

import styles from "./Log.module.css";
import { useSubscription } from "@apollo/client";

const classnames = require("classnames");

function LogInput({ user, group }: { user: any; group: any }) {
  const [mutate] = useMutation(groupLogPut);
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  function downHandler(event: any) {
    const { key, shiftKey } = event;

    if (shiftKey && key === "Enter") handleSubmit(onSubmit)(event);
  }

  const onSubmit = async (data: any, event: any) => {
    if (data.val.length < 1) return;
    if (isSubmitting) return;

    let variables = {
      groupId: group.id,
      input: {
        logType: "COMMENT",
        dataPairs: [
          {
            key: "TEXT",
            val: data.val,
          },
        ],
      },
    };

    mutate({
      variables,
      // optimisticResponse: {
      //   __typename: "Mutation",
      //   groupLogPut: {
      //     __typename: "GroupLogItem",
      //     id: "",
      //     groupId: group.id,
      //     createdByUser: {
      //       __typename: "SimpleUser",
      //       given_name: user.given_name,
      //       family_name: user.family_name,
      //       email: user.email,
      //     },
      //     dataPairs: [
      //       {
      //         key: "TEXT",
      //         val: data.val,
      //         __typename: "KeyVal",
      //       },
      //     ],
      //   },
      // },
      update: (proxy, { data: { groupLogPut } }) => {
        const data: any = proxy.readQuery({
          query: groupLogGet,
          variables: { groupId: group.id },
        });

        proxy.writeQuery({
          query: groupLogGet,
          variables: { groupId: group.id },
          data: {
            groupLogGet: [...data?.groupLogGet, groupLogPut],
          },
        });
      },
    });

    if (event.type === "submit") {
      event.target.reset();
    } else {
      event.target.value = "";
    }
  };

  return (
    <div className={styles.comment_form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          className={styles.comment_input}
          placeholder="Write a comment..."
          autoComplete="off"
          name="val"
          ref={register({ required: true })}
          onKeyDown={downHandler}
        />

        <div className={styles.comment_submit}>
          {(!isSubmitting && <i className="fal fa-paper-plane"/>) || (
            <i className="fal fa-spinner fa-spin"/>
          )}

          <input type="submit" value=""/>
        </div>
      </form>
    </div>
  );
}

export function Log({ group, user }: { group: any; user: any }) {
  const logQuery = useQuery(groupLogGet, {
    variables: { groupId: group.id },
  });
  const [logsState, setLogsState] = useState<any[]>([]);

  useSubscription(groupLogSubscription, {
      onSubscriptionData: ({ client, subscriptionData: { data } }) => {
        if (!data ||
          data.subscribeToAllGroupLogPutEvents.groupId !== group.id ||
          data.subscribeToAllGroupLogPutEvents.createdByUser.email === user.email) {
          return;
        }
        const groupLogs = client.readQuery({ query: groupLogGet, variables: { groupId: group.id } });
        client.writeQuery({
          query: groupLogGet,
          variables: { groupId: group.id },
          data: {
            groupLogGet: [...groupLogs.groupLogGet, data.subscribeToAllGroupLogPutEvents],
          },
        });
        setLogsState([...groupLogs.groupLogGet, data.subscribeToAllGroupLogPutEvents].filter((l) => l.logType === "COMMENT"))
      },
    },
  );

  useEffect(() => {
    if (logQuery.data?.groupLogGet) {
      setLogsState(logQuery.data.groupLogGet.filter((l: any) => l.logType === "COMMENT"));
    }
  }, [logQuery.data]);

  return (
    <>
      <div className={styles.comments_section}>
        {logsState.length ? (
          logsState.map((logItem: any, i: any) => (
            <div key={`log-${logItem.id}`} className={styles.log_feed_item}>
              <div className={styles.log_feed_byline}>
                <span className={styles.name}>
                  {(logItem.createdBy === user?.cognitoIdentityId &&
                    "You ") || (
                    <span>
                      {`${logItem.createdByUser.given_name} ${logItem.createdByUser.family_name} `}
                    </span>
                  )}
                </span>
                <span className={styles.date}>
                  {`– ${moment(logItem.createdAt).format("lll")}`}
                </span>
              </div>

              <div
                className={classnames(
                  styles.log_feed_text,
                  logItem.logType !== "COMMENT" &&
                  styles.log_feed_type_SUBJECTIVE_SCORE,
                )}
              >
                {logItem.dataPairs[0].val}
              </div>

              {logItem.createdAt !== logItem.updatedAt && (
                <div className={styles.log_item_edited}>(edited)</div>
              )}
            </div>
          ))
        ) : (
          <div style={{ color: "var(--color-gray-medium)" }}>
            No comments yet...
          </div>
        )}
      </div>

      <hr/>
      <LogInput group={group} user={user}/>
    </>
  );
}
