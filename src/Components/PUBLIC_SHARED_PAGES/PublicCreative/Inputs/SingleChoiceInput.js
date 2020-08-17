import React from "react";
import { useMutation } from "@apollo/client";

import { publicCreativePut } from "../../../../Apollo/Mutations";

export function SingleChoiceInput({ question, section, creative }) {
  const { options } = question;
  const [mutate] = useMutation(publicCreativePut);
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

                  let optimisticResponse = {};
                  if (answer) {
                    variables.input.answerUpdate = {
                      id: answer.id,
                      question: question.name,
                      sid,
                      val,
                    };

                    optimisticResponse = {
                      __typename: "Mutation",
                      creativePut: {
                        __typename: "Creative",
                        ...creative,
                        answers: creative.answers.map(_answer => {
                          if (answer.id === _answer.id) {
                            return {
                              ..._answer,
                              val,
                              sid,
                            };
                          }
                          return _answer;
                        }),
                      },
                    };
                  } else {
                    variables.input.answerNew = {
                      inputType: question.inputType,
                      questionId: question.id,
                      question: question.name,
                      sid,
                      val,
                    };

                    optimisticResponse = {
                      __typename: "Mutation",
                      creativePut: {
                        __typename: "Creative",
                        ...creative,
                        answers: [
                          ...creative.answers,
                          {
                            __typename: "CreativeAnswer",
                            id: "",
                            ...variables.input.answerNew,
                          },
                        ],
                      },
                    };
                  }
                  mutate({ variables, optimisticResponse });
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
