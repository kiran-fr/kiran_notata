import React from "react";
import { SingleChoiceInput } from "../../Forms";

export default function SingleChoiceInputContainer({
  question,
  setAnswers,
  answers,
}) {
  const { options } = question;
  const answer = answers[question.id] || {};

  return (
    <SingleChoiceInput
      options={options.map(({ val, sid }) => ({
        val,
        checked: answer ? answer.val === val : false,
        handleOnChange: () => {
          const answerNew = {
            inputType: question.inputType,
            questionId: question.id,
            question: question.name,
            sid,
            val,
          };

          setAnswers({
            ...answers,
            [question.id]: {
              ...answerNew,
            },
          });
        },
      }))}
    />
  );
}
