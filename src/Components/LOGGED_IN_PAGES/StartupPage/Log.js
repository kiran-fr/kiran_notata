import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";

import classnames from "classnames";
import moment from "moment";

import { logPut } from "../../../Apollo/Mutations";
import { logGet } from "../../../Apollo/Queries";

import {
  container,
  log_feed,
  log_feed_item,
  log_feed_byline,
  name,
  date,
  submit_wrapper,
  log_feed_text,
  log_item_edited,
  input_form,
  not_ready,
  log_feed_type_SUBJECTIVE_SCORE,
  event_toggle_button,
  empty_message,
} from "./Log.module.css";

function LogInput({ user, connection }) {
  const [mutate, { data }] = useMutation(logPut);
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  function downHandler({ key }) {
    if (key === "Enter") {
      console.log("submit");
      handleSubmit(onSubmit);
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, []);

  const onSubmit = async (data, event) => {
    if (data.val.length < 1) return;

    let variables = {
      connectionId: connection.id,
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
              val: data.val,
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

    event.target.reset();
  };

  return (
    <div className={input_form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          placeholder="Write a comment..."
          rows="4"
          name="val"
          ref={register({ required: true })}
        />

        <div className={submit_wrapper}>
          <i className="fas fa-arrow-alt-circle-up" />
          <input
            type="submit"
            value=""
            className={isSubmitting ? not_ready : ""}
          />
        </div>
      </form>
    </div>
  );
}

export function Log({ connection, user }) {
  const [viewEvents, setViewEvents] = useState(false);
  const logQuery = useQuery(logGet, {
    variables: { connectionId: connection.id },
  });

  let log = [];
  if (!logQuery.error && !logQuery.loading && logQuery.data) {
    log = logQuery.data.logGet;
  }

  log = (log || []).filter(l =>
    viewEvents ? l : l.dataPairs[0].key === "TEXT"
  );

  return (
    <div>
      {log.map((logItem, i) => (
        <div key={`log-${logItem.id}`} className={log_feed_item}>
          <div className={log_feed_byline}>
            <span className={name}>
              {(logItem.createdBy === user.cognitoIdentityId && (
                <span>You</span>
              )) || (
                <span>
                  {logItem.createdByUser.given_name}{" "}
                  {logItem.createdByUser.family_name}
                </span>
              )}
            </span>
            <span className={date}>
              {" "}
              {moment(logItem.createdAt).format("lll")}
            </span>
            <span className={date}>
              {" "}
              ({moment(logItem.createdAt).fromNow()})
            </span>
          </div>

          <div
            className={classnames(
              log_feed_text,
              logItem.dataPairs[0].key === "SUBJECTIVE_SCORE" &&
                log_feed_type_SUBJECTIVE_SCORE
            )}
          >
            {logItem.dataPairs[0].val}
          </div>

          {logItem.createdAt !== logItem.updatedAt && (
            <div className={log_item_edited}>(edited)</div>
          )}
        </div>
      ))}

      <div
        className={event_toggle_button}
        onClick={() => setViewEvents(!viewEvents)}
      >
        {viewEvents ? "hide events" : "show events"}
      </div>

      <LogInput connection={connection} user={user} />
    </div>
  );
}