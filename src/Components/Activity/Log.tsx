import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";

import moment from "moment";

import { groupLogPut } from "Apollo/Mutations";
import { groupLogGet } from "Apollo/Queries";

import styles from "./Log.module.css";
const classnames = require("classnames");

function LogInput({ user, group }: { user: any; group: any }) {
  const [mutate] = useMutation(groupLogPut);
  const { register, handleSubmit } = useForm();

  function downHandler(event: any) {
    const { key, shiftKey } = event;

    if (shiftKey && key === "Enter") handleSubmit(onSubmit)(event);
  }

  const onSubmit = async (data: any, event: any) => {
    if (data.val.length < 1) return;

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
          // type="text"
          placeholder="Write a comment..."
          // rows={4}
          name="val"
          ref={register({ required: true })}
          onKeyDown={downHandler}
        />

        <div className="comment_sumbit">
          <i className="fas fa-arrow-alt-circle-up" />
          <input type="submit" value="" />
        </div>
      </form>
    </div>
  );
}

export function Log({ group, user }: { group: any; user: any }) {
  const logQuery = useQuery(groupLogGet, {
    variables: { groupId: group.id },
  });

  let log = [];
  if (!logQuery.error && !logQuery.loading && logQuery.data) {
    log = logQuery.data.groupLogGet;
  }

  log = log.filter((l: any) => l.logType === "COMMENT");

  return (
    <>
      {!log.length && (
        <div
          style={{ paddingBottom: "10px", color: "var(--color-gray-medium)" }}
        >
          No comments yet...
        </div>
      )}

      <div className={styles.comments_section}>
        {log.map((logItem: any, i: any) => (
          <div key={`log-${logItem.id}`} className={styles.log_feed_item}>
            <div className={styles.log_feed_byline}>
              <span className={styles.name}>
                {(logItem.createdBy === user?.cognitoIdentityId && "You ") || (
                  <span>
                    {`${logItem.createdByUser.given_name} ${logItem.createdByUser.family_name}`}
                  </span>
                )}
              </span>
              <span className={styles.date}>
                {moment(logItem.createdAt).format("lll")}
              </span>
            </div>

            <div
              className={classnames(
                styles.log_feed_text,
                logItem.logType !== "COMMENT" &&
                  styles.log_feed_type_SUBJECTIVE_SCORE
              )}
            >
              {logItem.dataPairs[0].val}
            </div>

            {logItem.createdAt !== logItem.updatedAt && (
              <div className={styles.log_item_edited}>(edited)</div>
            )}
          </div>
        ))}
      </div>

      <hr />
      <LogInput group={group} user={user} />
    </>
  );
}
