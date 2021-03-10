import React from "react";
import { useMutation } from "@apollo/client";

import { MultipleTextInput } from "Components/Forms";

import { creativePut } from "private/Apollo/Mutations";

export default function MultipleTextInputContainer({
  templateId,
  section,
  question,
  answers,
  setAnswers,
}) {
  // const [mutate] = useMutation(creativePut);
  //
  // const currentAnswers = answers.filter(
  //   ({ inputType, questionId }) =>
  //     inputType === "INPUT_MUTLIPLE_LINES" && questionId === question.id
  // );

  // async function handleOnSubmit(data, event) {
  //
  //   const variables = {
  //     id: creative.id,
  //     input: {},
  //   };
  //
  //   if (data.new) {
  //     if (!data.new.length) return;
  //
  //     variables.input.answerNew = {
  //       inputType: question.inputType,
  //       questionId: question.id,
  //       question: question.name,
  //       val: data.new,
  //     };
  //
  //     mutate({
  //       variables,
  //       optimisticResponse: {
  //         __typename: "Mutation",
  //         creativePut: {
  //           __typename: "Creative",
  //           ...creative,
  //           answers: [
  //             ...creative.answers,
  //             {
  //               __typename: "CreativeAnswer",
  //               id: "",
  //               sid: "",
  //               ...variables.input.answerNew,
  //             },
  //           ],
  //         },
  //       },
  //     });
  //
  //     event.target.value = "";
  //   } else {
  //     let hit = answers.find(answer => answer.val !== data[answer.id]);
  //     if (!hit) return;
  //     variables.input.answerUpdate = {
  //       id: hit.id,
  //       question: question.name,
  //       val: data[hit.id],
  //     };
  //
  //     try {
  //       await mutate({ variables });
  //     } catch (error) {
  //       console.log("error", error);
  //     }
  //   }
  // }

  function handleOnSubmit(data, event) {
    console.log("data", data);

    if (data.new) {
      // Return if string is empty
      if (!data.new.length) {
        return;
      }

      // Return if duplicate
      if (answers.find(({ val }) => val === data.new)) {
        return;
      }

      // Create new answer data
      let newAnswer = {
        templateId: templateId,
        sectionId: section.id,
        questionId: question.id,
        sectionName: section.name,
        questionName: question.name,
        inputType: question.inputType,
        sid: "",
        val: data.new,
      };

      // Join data
      let newAnswers = [...answers, newAnswer];

      // Set data
      setAnswers(newAnswers);
    }
  }

  function handleOnDelete(id) {
    console.log("delete", id);

    // answers.filter(({ id: _id }) => _id !== id)
  }

  return (
    <MultipleTextInput
      answers={answers}
      handleOnSubmit={handleOnSubmit}
      handleOnDelete={handleOnDelete}
    />
  );
}
