import React from "react";
import { useForm } from "react-hook-form";

import moment from "moment";

import { LogItem } from "Apollo/Queries";

import styles from "./Log.module.css";
const classnames = require("classnames");

function LogInput({ submitMutation }: { submitMutation: Function }) {
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  function downHandler(event: React.KeyboardEvent) {
    const { key, shiftKey } = event;

    if (shiftKey && key === "Enter") handleSubmit(onSubmit)(event);
  }

  const onSubmit = async (data: any, event: any) => {
    if (data.val.length < 1) return;
    if (isSubmitting) return;

    submitMutation(data.val);

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
          {(!isSubmitting && <i className="fal fa-paper-plane" />) || (
            <i className="fal fa-spinner fa-spin" />
          )}

          <input type="submit" value="" />
        </div>
      </form>
    </div>
  );
}

export function Log({
  logs,
  user,
  submitMutation,
}: {
  logs: LogItem[];
  user: any;
  submitMutation: Function;
}) {
  return (
    <>
      <div className={styles.comments_section}>
        {logs.length ? (
          logs.map((logItem: LogItem) => (
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
                    styles.log_feed_type_SUBJECTIVE_SCORE
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

      <hr />
      <LogInput submitMutation={submitMutation} />
    </>
  );
}
