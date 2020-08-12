import React, { useEffect, useState, useCallback } from "react";
import { useMutation } from "@apollo/client";
import { publicCreativePut } from "../../../../Apollo/Mutations";

export function MultipleChoiceInput({ question, section, creative }) {
  const { options } = question;
  const [mutate, { loading }] = useMutation(publicCreativePut);

  const answers = (creative.answers || []).filter(
    ({ inputType, questionId }) => {
      return inputType === "CHECK" && questionId === question.id;
    }
  );

  console.log("creative.answers", creative.answers);

  return (
    <form onSubmit={e => e.preventDefault()} className="notata_form">
      {options.map(({ val, sid }, i) => {
        console.log("sid", sid);

        const answer = answers.find(
          ({ sid: answersSid }) => answersSid === sid
        );
        return (
          <div className="check_container" key={`o-${i}`}>
            <label>
              <input
                type="checkbox"
                value={val}
                disabled={loading}
                defaultChecked={answer && answer.val}
                onClick={() => {
                  const variables = {
                    id: creative.id,
                    input: {},
                  };
                  if (answer) {
                    variables.input.answerDelete = answer.id;
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
