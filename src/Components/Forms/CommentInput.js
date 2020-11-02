import React from "react";
import { useForm } from "react-hook-form";

import {
  comments_label,
  comments_list,
  comment_item,
  comment_delete,
} from "./CommentInput.module.css";

export default function CommentInput({
  rows,
  style,
  comments,
  placeholder,
  handleOnSubmit,
  handleDeleteComment,
}) {
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  async function onSubmit(data, event) {
    await handleOnSubmit(data);
    // event.target.reset();
  }

  async function deleteComment(...params) {
    await handleDeleteComment(...params);
  }

  const handleKeyDown = e => {
    if (e.key === "Enter" && e.shiftKey) return;
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(onSubmit)(e);
    }
  };

  return (
    <div className="comment_form" style={style}>
      {!!comments.length && (
        <div className={comments_list}>
          <div className={comments_label}>Comments</div>
          {comments.map(({ val, id }) => (
            <div key={id} className={comment_item}>
              {val}
              <div
                className={comment_delete}
                onClick={() => deleteComment({ val, id })}
              >
                delete
              </div>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          placeholder={placeholder || "Write a comment..."}
          rows={rows | 3}
          name="comment"
          ref={register({ required: true })}
          style={{ resize: "none" }}
          onKeyDown={handleKeyDown}
        />

        <div className="comment_sumbit">
          {isSubmitting ? (
            <i className="fa fa-spinner fa-spin" />
          ) : (
            <i className="fas fa-arrow-alt-circle-up" />
          )}
          <input type="submit" value="" disabled={isSubmitting} />
        </div>
      </form>
    </div>
  );
}
