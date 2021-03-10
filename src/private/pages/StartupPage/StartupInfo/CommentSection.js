import React from "react";

// Styles
import styles from "./CommentSection.module.css";
import classnames from "classnames";

// *****************
// * Main function *
// *****************

export function CommentSection({ questionId, creative }) {
  // Get answers from creative
  const answers = creative.answers || [];

  // Isolate comments
  const comments = answers.filter(
    ({ inputType, questionId: id }) =>
      inputType === "COMMENT" && id === questionId
  );

  return (
    <div className={classnames("comment_form", styles.container)}>
      {!!comments.length && (
        <>
          <div className={styles.list}>
            <div className={styles.label}>Comments</div>

            {comments.map(({ val, id }) => (
              <div key={id} className={styles.item}>
                {val}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
