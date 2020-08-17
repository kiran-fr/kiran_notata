import React from "react";
import { useMutation } from "@apollo/client";

import { evaluationPut } from "../../../Apollo/Mutations";

export default function SingleChoiceInput({
  section,
  question,
  templateId,
  evaluation,
}) {
  const [mutate] = useMutation(evaluationPut);

  const answer = evaluation.answers.find(
    ({ inputType, questionId }) =>
      inputType === "RADIO" && questionId === question.id
  );

  return (
    <div style={{ padding: "10px" }}>
      <form className="notata_form">
        {question.options.map(({ val, sid }, i) => {
          return (
            <div key={i} className="check_container">
              <label>
                <input
                  type="radio"
                  checked={answer && answer.val === val}
                  onChange={() => {
                    const variables = {
                      id: evaluation.id,
                      input: {
                        name: section.name,
                        description: section.description,
                        templateId,
                      },
                    };

                    let optimisticResponse = {};
                    if (answer) {
                      variables.input.answerUpdate = {
                        id: answer.id,
                        question: question.name,
                        val,
                        sid,
                      };

                      optimisticResponse = {
                        __typename: "Mutation",
                        evaluationPut: {
                          __typename: "Evaluation",
                          ...evaluation,
                          answers: evaluation.answers.map(_answer => {
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
                        val,
                        sid,
                      };

                      optimisticResponse = {
                        __typename: "Mutation",
                        evaluationPut: {
                          __typename: "Evaluation",
                          ...evaluation,
                          answers: [
                            ...evaluation.answers,
                            {
                              __typename: "EvaluationAnswer",
                              id: "",
                              ...variables.input.answerNew,
                            },
                          ],
                        },
                      };
                    }

                    mutate({
                      variables,
                      optimisticResponse,
                    });
                  }}
                />
                {val}
              </label>
            </div>
          );
        })}
      </form>
    </div>
  );
}
