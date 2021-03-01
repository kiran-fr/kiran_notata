import React from "react";
import { TrafficLightInput } from "Components/Forms";

export default function TrafficLightInputContainer({
  section,
  question,
  answers,
  setAnswers,
}) {
  const answer = (answers || []).find(
    ({ inputType, questionId }) =>
      inputType === "TRAFFIC_LIGHTS" && questionId === question.id
  );

  return (
    <TrafficLightInput
      value={answer && answer.val}
      handleOnClick={color => {
        let newAnswer = {
          sectionId: section.id,
          inputType: question.inputType,
          questionId: question.id,
          val: color,
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
