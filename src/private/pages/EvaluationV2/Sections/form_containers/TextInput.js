import React from "react";
import { TextInput } from "Components/Forms";

export default function TextInputContainer({
  section,
  question,
  answers,
  setAnswers,
}) {
  const answer = answers.find(
    ({ inputType, questionId }) =>
      inputType === "INPUT_TEXT" && questionId === question.id
  );

  return (
    <TextInput
      rows={7}
      style={{ resize: "none" }}
      placeholder="Say something..."
      defaultValue={answer && answer.val}
      onChange={event => {
        let newAnswer = {
          inputType: question.inputType,
          questionId: question.id,
          sectionId: section.id,
          val: event.target.value,
        };
        if (answer) {
          answers = answers.map(a =>
            a.questionId === newAnswer.questionId &&
            a.inputType === newAnswer.inputType
              ? newAnswer
              : a
          );
        }
        if (!answer) {
          answers = [...answers, newAnswer];
        }
        setAnswers(answers);
      }}
    />
  );
}
