import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";

import { evaluationPut } from "../../../Apollo/Mutations";
import {
  comments_label,
  comments_list,
  comment_item,
  comment_delete,
} from "./CommentInput.module.css";

export default function CommentInput({
  section,
  question,
  connectionId,
  templateId,
  evaluation,
}) {
  const [mutate] = useMutation(evaluationPut);
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  async function onSubmit(data, event) {
    const variables = {
      id: evaluation.id,
      input: {
        name: section.name,
        description: section.description,
        templateId,
        answerNew: {
          inputType: "COMMENT",
          questionId: question.id,
          question: question.name,
          val: data.comment,
        },
      },
    };
    try {
      let res = await mutate({ variables });
      console.log("res", res);
    } catch (error) {
      console.log("error", error);
    }
    event.target.reset();
  }

  async function deleteComment({ val, id }) {
    const variables = {
      id: evaluation.id,
      input: {
        templateId,
        answerDelete: id,
      },
    };
    try {
      let res = await mutate({ variables });
      console.log("res", res);
    } catch (error) {
      console.log("error", error);
    }
  }

  const comments = (evaluation.answers || []).filter(
    ({ inputType, questionId }) =>
      inputType === "COMMENT" && questionId === question.id
  );

  return (
    <div className="comment_form" style={{ padding: "15px" }}>
      {!!comments.length && (
        <>
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
        </>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          placeholder="Write a comment..."
          rows="3"
          name="comment"
          ref={register}
          style={{ resize: "none" }}
        />

        <div className="comment_sumbit">
          <i className="fas fa-arrow-alt-circle-up" />
          <input type="submit" value="" disabled={isSubmitting} />
        </div>
      </form>
    </div>
  );
}
