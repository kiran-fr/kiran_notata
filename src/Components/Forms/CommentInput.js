import React, { useState } from "react";
import { useForm } from "react-hook-form";

import {
  comments_label,
  comments_list,
  comment_item,
  comment_delete,
} from "./CommentInput.module.css";

import { Button, Modal } from "Components/elements";

export default function CommentInput({
  rows,
  style,
  comments,
  placeholder,
  handleOnSubmit,
  handleUpdateComment,
  handleDeleteComment,
}) {
  const [showModal, setShowModal] = useState(undefined);

  const { register, handleSubmit, formState, setValue } = useForm();
  const { isSubmitting } = formState;

  async function onSubmit(data, event) {
    if (showModal.id && handleUpdateComment) {
      await handleUpdateComment({ id: showModal.id, val: data.comment });
    } else {
      await handleOnSubmit(data);
    }

    setShowModal(undefined);
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
    <>
      <div className="comment_form" style={style}>
        {!!comments.length && (
          <div className={comments_list}>
            <div className={comments_label}>Comments</div>
            {comments.map(({ val, id }) => (
              <div key={id} className={comment_item}>
                {val}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "7px",
                    paddingBottom: "3px",
                  }}
                >
                  <div
                    className={comment_delete}
                    onClick={() => deleteComment({ val, id })}
                  >
                    delete comment
                  </div>

                  <div
                    className={comment_delete}
                    onClick={() => {
                      setShowModal({ id, val });
                    }}
                  >
                    edit
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            marginLeft: "-15px",
            marginRight: "-15px",
            textAlign: "right",
          }}
        >
          <Button
            size="small"
            buttonStyle="secondary"
            onClick={() => setShowModal({})}
          >
            Add comment
          </Button>
        </div>
      </div>

      {showModal && (
        <Modal
          title="Add comment"
          close={() => setShowModal(undefined)}
          disableFoot={true}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="notata_form">
            <textarea
              placeholder={placeholder || "Write a comment..."}
              rows={rows | 12}
              name="comment"
              ref={register({ required: true })}
              defaultValue={showModal?.val}
              style={{ resize: "none" }}
              onKeyDown={handleKeyDown}
            />

            <div>
              <div style={{ textAlign: "right" }}>
                <Button
                  type="input"
                  loading={isSubmitting}
                  value="save comment"
                />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
