import React from "react";
import { MultipleTextInput } from "Components/Forms/FormInputs";

export default function MultipleTextInputContainer({
  section,
  question,
  answers,
  setAnswers,
}) {
  let currentAnswers = answers.filter(
    ({ inputType, questionId }) =>
      inputType === "INPUT_MUTLIPLE_LINES" && questionId === question.id
  );

  function handleOnSubmit(data, event) {
    // New answer
    if (data.new) {
      if (!data.new.length) return;
      let answerNew = {
        inputType: question.inputType,
        questionId: question.id,
        sectionId: section.id,
        val: data.new,
      };
      answers = [...answers, answerNew];
      event.target.value = "";
    }

    // Updating answer
    if (!data.new) {
      // Remove old
      answers = answers.filter(
        a =>
          !(a.questionId === question.id && a.inputType === question.inputType)
      );

      // Add new
      for (let k in data) {
        if (k !== "new") {
          let answerNew = {
            inputType: question.inputType,
            questionId: question.id,
            sectionId: section.id,
            val: data[k],
          };
          answers = [...answers, answerNew];
        }
      }
    }
    setAnswers(answers);
  }

  async function handleOnDelete(index) {
    // Remove item we delete
    currentAnswers.splice(index, 1);

    // Remove old
    answers = answers.filter(
      a => !(a.questionId === question.id && a.inputType === question.inputType)
    );

    answers = [...answers, ...currentAnswers];

    setAnswers(answers);
  }

  return (
    <MultipleTextInput
      answers={currentAnswers}
      handleOnSubmit={handleOnSubmit}
      handleOnDelete={handleOnDelete}
    />
  );
}
