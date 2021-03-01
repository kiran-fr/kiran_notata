import React from "react";
import { MultipleChoiceInput } from "Components/Forms";

export default function MultipleChoiceInputContainer({
  section,
  question,
  answers,
  setAnswers,
}) {
  const currentAnswers = answers.filter(
    ({ inputType, questionId }) =>
      inputType === "CHECK" && questionId === question.id
  );

  return (
    <MultipleChoiceInput
      style={{ padding: "10px" }}
      options={question.options.map(({ val, sid }) => {
        const answer = currentAnswers.find(
          ({ sid: answersSid }) => answersSid === sid
        );

        return {
          val,
          key: sid,
          checked: answer && answer.val,
          handleOnClick: () => {
            let newAnswer = {
              inputType: question.inputType,
              questionId: question.id,
              sectionId: section.id,
              sid: sid,
              val: val,
            };

            if (answer) {
              answers = answers.filter(a => a !== answer);
            }

            if (!answer) {
              answers = [...answers, newAnswer];
            }

            setAnswers(answers);
          },
        };
      })}
    />
  );
}
