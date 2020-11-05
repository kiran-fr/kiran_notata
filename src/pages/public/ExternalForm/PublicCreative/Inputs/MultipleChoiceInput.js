import React from "react";

import { MultipleChoiceInput } from "../../Forms";

export default function MultipleChoiceInputContainer({
  question,
  setAnswers,
  answers,
}) {
  const { options } = question;

  const answerAnswers = answers[question.id] || [];
  return (
    <MultipleChoiceInput
      options={options.map(({ val, sid }) => {
        const answer = answerAnswers.find(
          ({ sid: answersSid }) => answersSid === sid
        );
        return {
          val,
          key: sid,
          checked: answer && answer.val,
          handleOnClick: e => {
            let answersUpdated;
            if (e.target.checked) {
              const answerNew = {
                inputType: question.inputType,
                questionId: question.id,
                question: question.name,
                sid,
                val,
              };
              answersUpdated = [...answerAnswers, answerNew];
            } else {
              answersUpdated = answerAnswers.filter(
                ({ sid: answersSid }) => answersSid !== sid
              );
            }

            setAnswers({
              ...answers,
              [question.id]: answersUpdated,
            });
          },
        };
      })}
    />
  );
}
