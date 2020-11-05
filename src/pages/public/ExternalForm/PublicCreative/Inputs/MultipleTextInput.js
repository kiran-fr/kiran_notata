import React from "react";

import { MultipleTextInput } from "../../Forms";

export default function MultipleTextInputContainer({
  question,
  setAnswers,
  answers,
}) {
  return (
    <MultipleTextInput
      setAnswers={setAnswers}
      question={question}
      answers={answers}
    />
  );
}
