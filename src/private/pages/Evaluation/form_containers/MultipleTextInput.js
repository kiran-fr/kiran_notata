import React from "react";
import { useMutation } from "@apollo/client";
import { MultipleTextInput } from "Components/Forms";
import { evaluationPut } from "private/Apollo/Mutations";

export default function MultipleTextInputContainer({
  section,
  question,
  templateId,
  evaluation,
  connectionId,
}) {
  const [mutate] = useMutation(evaluationPut);

  const answers = (evaluation.answers || []).filter(
    ({ inputType, questionId }) =>
      inputType === "INPUT_MUTLIPLE_LINES" && questionId === question.id
  );

  async function handleOnSubmit(data, event) {
    const variables = {
      id: evaluation.id,
      input: {},
    };

    if (data.new) {
      if (!data.new.length) return;

      variables.input.answerNew = {
        inputType: question.inputType,
        questionId: question.id,
        question: question.name,
        val: data.new,
      };

      mutate({
        variables,
        optimisticResponse: {
          __typename: "Mutation",
          evaluationPut: {
            __typename: "Evaluation",
            ...evaluation,
            answers: [
              ...evaluation.answers,
              {
                __typename: "EvaluationAnswer",
                id: "",
                sid: "",
                ...variables.input.answerNew,
              },
            ],
          },
        },
      });

      event.target.value = "";
    } else {
      let hit = answers.find(answer => answer.val !== data[answer.id]);
      if (!hit) return;
      variables.input.answerUpdate = {
        id: hit.id,
        question: question.name,
        val: data[hit.id],
      };

      try {
        await mutate({ variables });
      } catch (error) {
        console.log("error", error);
      }
    }
  }

  async function handleOnDelete(id) {
    const variables = {
      id: evaluation.id,
      input: { answerDelete: id },
    };
    try {
      await mutate({
        variables,
        optimisticResponse: {
          __typename: "Mutation",
          evaluationPut: {
            __typename: "Evaluation",
            ...evaluation,
            answers: evaluation.answers.filter(({ id: _id }) => _id !== id),
          },
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <MultipleTextInput
      answers={answers}
      handleOnSubmit={handleOnSubmit}
      handleOnDelete={handleOnDelete}
    />
  );
}