import React from "react";
import { TextInput } from "Components/Forms";

export default function TextInputContainer({ question, setAnswers, answers }) {
  const answer = answers[question.id] || {};

  return (
    <TextInput
      rows={7}
      style={{ resize: "none", height: "150px" }}
      placeholder="Say something..."
      defaultValue={answer && answer.val}
      onBlur={event => {
        const answerNew = {
          inputType: question.inputType,
          questionId: question.id,
          question: question.name,
          val: event.target.value,
        };
        setAnswers({
          ...answers,
          [question.id]: {
            ...answerNew,
          },
        });
      }}
    />
  );
}
