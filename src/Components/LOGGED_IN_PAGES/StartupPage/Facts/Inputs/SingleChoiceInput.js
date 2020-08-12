import React, { useEffect, useState, useCallback } from "react";
import { useMutation } from "@apollo/client";
import { creativePut } from "../../../../../Apollo/Mutations";

export function SingleChoiceInput({ question, section, creative }) {
  const { options } = question;
  const [mutate, { loading }] = useMutation(creativePut);
  const answer = (creative.answers || []).find(({ inputType, questionId }) => {
    return inputType === "RADIO" && questionId === question.id;
  });

  return (
    <form onSubmit={e => e.preventDefault()} className="notata_form">
      {options.map(({ val, sid }, i) => {
        return (
          <div className="check_container" key={`o-${i}`}>
            <label>
              <input
                type="radio"
                checked={answer ? answer.val === val : false}
                onChange={() => {
                  const variables = {
                    id: creative.id,
                    input: {},
                  };
                  if (answer) {
                    variables.input.answerUpdate = {
                      id: answer.id,
                      question: question.name,
                      sid,
                      val,
                    };
                  } else {
                    variables.input.answerNew = {
                      inputType: question.inputType,
                      questionId: question.id,
                      question: question.name,
                      sid,
                      val,
                    };
                  }
                  mutate({ variables });
                }}
              />
              {val}
            </label>
          </div>
        );
      })}
    </form>
  );
}
