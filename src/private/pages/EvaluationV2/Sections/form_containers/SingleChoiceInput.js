import React from "react";
import { SingleChoiceInput } from "Components/Forms";

export default function SingleChoiceInputContainer({
  section,
  question,
  answers,
  setAnswers,
}) {
  const answer = answers.find(
    ({ inputType, questionId }) =>
      inputType === "RADIO" && questionId === question.id
  );

  return (
    <SingleChoiceInput
      style={{ padding: "10px" }}
      options={question.options.map(({ val, sid }) => ({
        val,
        checked: answer ? answer.val === val : false,
        handleOnChange: () => {
          let newAnswer = {
            inputType: question.inputType,
            questionId: question.id,
            sectionId: section.id,
            sid: sid,
            val: val,
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
        },
      }))}
    />
  );
}
