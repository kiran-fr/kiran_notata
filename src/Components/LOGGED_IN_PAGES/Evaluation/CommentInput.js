import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";

import { evaluationPut } from "../../../Apollo/Mutations";

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
    await mutate({
      variables: {
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
      },
    });

    event.target.reset();
  }

  return (
    <div>
      <div>
        <h3>Comments</h3>
        {evaluation.answers
          .filter(
            ({ inputType, questionId }) =>
              inputType === "COMMENT" && questionId === question.id
          )
          .map(({ val, id }) => (
            <p key={id}>{val}</p>
          ))}
      </div>
      <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
        <input ref={register} name="comment" />
        <input type="submit" value="comment" disabled={isSubmitting} />
      </form>
    </div>
  );
}
