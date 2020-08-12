import React, { useEffect, useState, useCallback } from "react";
import { useMutation } from "@apollo/client";
import { creativePut } from "../../../../../Apollo/Mutations";
import { debounce } from "lodash";

export function TextInput({ question, section, creative }) {
  const [mutate, { loading }] = useMutation(creativePut);

  const delayedMutation = useCallback(
    debounce(q => mutate(q), 1000),
    []
  );

  const answer = (creative.answers || []).find(
    ({ inputType, questionId }) =>
      inputType === "INPUT_TEXT" && questionId === question.id
  );

  return (
    <form onSubmit={e => e.preventDefault()} className="notata_form">
      <textarea
        rows={7}
        style={{ resize: "none" }}
        placeholder="Say something..."
        disabled={loading}
        defaultValue={answer && answer.val}
        style={{
          resize: "none",
          height: "150px",
        }}
        onChange={event => {
          const variables = {
            id: creative.id,
            input: {},
          };

          if (answer) {
            variables.input.answerUpdate = {
              id: answer.id,
              question: question.name,
              val: event.target.value,
            };
          } else {
            variables.input.answerNew = {
              inputType: question.inputType,
              questionId: question.id,
              question: question.name,
              val: event.target.value,
            };
          }
          delayedMutation({
            variables,
          });
        }}
      />
    </form>
  );
}
