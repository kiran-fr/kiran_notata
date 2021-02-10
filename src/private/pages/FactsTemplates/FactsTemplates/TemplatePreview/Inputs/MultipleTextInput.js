import React from "react";
import { MultipleTextInput } from "Components/Forms";

export default function MultipleTextInputContainer({ question, section }) {
  const answers = [];

  return (
    <MultipleTextInput
      answers={answers}
      handleOnSubmit={() => {}}
      handleOnDelete={() => {}}
    />
  );
}
