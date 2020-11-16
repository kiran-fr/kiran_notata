import React, { useCallback } from "react";
import { debounce } from "lodash";
import { TextInput } from "Components/Forms";

export default function TextInputContainer({ question, section }) {
  const answer = {};

  return (
    <TextInput
      rows={7}
      style={{ resize: "none", height: "150px" }}
      placeholder="Say something..."
      defaultValue={answer && answer.val}
      onChange={event => {}}
    />
  );
}
