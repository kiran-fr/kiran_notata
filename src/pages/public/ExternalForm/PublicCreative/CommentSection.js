import React from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { publicCreativePut } from "Apollo/Mutations";
import {
  comments_label,
  comments_list,
  comment_item,
  comment_delete,
} from "./CommentSection.module.css";

export function CommentSection({ question, creative }) {
  const [mutate] = useMutation(publicCreativePut);
  const { formState } = useForm();
  const { isSubmitting } = formState;

  async function deleteComment({ val, id }) {
    const variables = {
      id: creative.id,
      input: {
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

  const comments = (creative.answers || []).filter(
    ({ inputType, questionId }) =>
      inputType === "COMMENT" && questionId === question.id
  );

  return (
    <div className="comment_form" style={{ padding: "15px" }}>
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
      <div>
        <textarea
          placeholder="Write a comment..."
          rows="3"
          name="comment"
          style={{ resize: "none" }}
        />

        {creative.id && (
          <div className="comment_sumbit">
            <i className="fas fa-arrow-alt-circle-up" />
            <input type="submit" value="" disabled={isSubmitting} />
          </div>
        )}
      </div>
    </div>
  );
}

// import React, { useEffect, useState, useCallback } from "react";
// import { useMutation } from "@apollo/client";
// import { useForm } from "react-hook-form";
// import { publicCreativePut } from "Apollo/Mutations";
// import { debounce } from "lodash";

// export function CommentSection({ question, creative }) {

//   const { register, handleSubmit, formState } = useForm();
//   const { isSubmitting } = formState;

//   const onSubmit = async (data, event) => {
//     console.log("data", data);
//   };

//   return (
//     <div className="comment_form" style={{ padding: "15px" }}>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <textarea
//           placeholder="Add comment..."
//           rows="3"
//           name="val"
//           ref={register}
//           style={{ resize: "none" }}
//         />
//       </form>
//     </div>
//   );
// }
