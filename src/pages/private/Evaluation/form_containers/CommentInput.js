import React from "react";
import { useMutation } from "@apollo/client";
import { CommentInput } from "Components/Forms";
import { evaluationPut } from "Apollo/Mutations";

export default function CommentInputContainer({
  section,
  question,
  connectionId,
  templateId,
  evaluation,
}) {
  const [mutate] = useMutation(evaluationPut);

  async function handleOnSubmit(data) {
    const answerNew = {
      inputType: "COMMENT",
      questionId: question.id,
      question: question.name,
      val: data.comment,
    };

    const variables = {
      id: evaluation.id,
      input: {
        name: section.name,
        description: section.description,
        templateId,
        answerNew,
      },
    };

    mutate({
      variables,
      optimisticResponse: {
        __typename: "Mutation",
        evaluationPut: {
          __typename: "Evaluation",
          ...evaluation,
          answers: [...evaluation.answers, { id: "", sid: "", ...answerNew }],
        },
      },
    });
  }

  async function handleDeleteComment({ id }) {
    const variables = {
      id: evaluation.id,
      input: {
        templateId,
        answerDelete: id,
      },
    };
    try {
      await mutate({
        variables,
        optimisticResponse: {
          __typename: "Mutation",
          evaluationPut: {
            __typename: "Evaluation",
            ...evaluation,
            answers: evaluation.answers.filter(({ id: _id }) => id !== _id),
          },
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  }

  const comments = (evaluation.answers || []).filter(
    ({ inputType, questionId }) =>
      inputType === "COMMENT" && questionId === question.id
  );

  return (
    <CommentInput
      comments={comments}
      style={{ padding: "15px" }}
      handleDeleteComment={handleDeleteComment}
      handleOnSubmit={handleOnSubmit}
    />
  );
}
