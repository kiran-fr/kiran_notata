import React, { useState, useRef, useEffect } from "react";
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

const isViewable = (parent: HTMLDivElement, child: HTMLDivElement): boolean => {
  const parentRect = parent.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();

  return (
    childRect.top >= parentRect.top &&
    childRect.top - (parentRect.top + parent.clientHeight) <= 90
  );
};

export function Log({
  logs,
  user,
  submitMutation,
}: {
  logs: LogItem[];
  user: any;
  submitMutation: Function;
}) {
  const [viewEvents, setViewEvents] = useState(false);
  const ref = useRef(null);
  const parentRef = useRef(null);

  logs = logs.filter(l => (viewEvents ? l : l.logType === "COMMENT"));

  const scrollToBottom = () => {
    const node: HTMLDivElement | null = ref.current;
    if (node) {
      const isChildViewable = isViewable(
        parentRef.current! as HTMLDivElement,
        ref.current! as HTMLDivElement
      );
      if (isChildViewable) (node as any).scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(scrollToBottom, [logs]);

  return (
    <>
      <div className={styles.tabs}>
        <div
          className={`${styles.tab} ${!viewEvents && styles.selected_tab}`}
          onClick={() => setViewEvents(false)}
        >
          COMMENTS
        </div>
        <div
          className={`${styles.tab} ${viewEvents && styles.selected_tab}`}
          onClick={() => setViewEvents(true)}
        >
          ACTIVITIES
        </div>
      </div>
      <div ref={parentRef} className={styles.comments_section}>
        {logs.length ? (
          logs.map((logItem: LogItem) => (
            <div
              ref={ref}
              key={`log-${logItem.id}`}
              className={styles.log_feed_item}
            >
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
