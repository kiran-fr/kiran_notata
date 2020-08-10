import React from "react";
import { useMutation } from "@apollo/client";

import { evaluationPut } from "../../../Apollo/Mutations";

export default function SingleChoiceInput({
  section,
  question,
  templateId,
  evaluation,
}) {
  const [mutate, { loading }] = useMutation(evaluationPut);

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
                  disabled={loading}
                  checked={answer ? answer.val === val : false}
                  onChange={() => {
                    const variables = {
                      id: evaluation.id,
                      input: {
                        name: section.name,
                        description: section.description,
                        templateId,
                      },
                    };

                    if (answer) {
                      variables.input.answerUpdate = {
                        id: answer.id,
                        question: question.name,
                        val,
                        sid,
                      };
                    } else {
                      variables.input.answerNew = {
                        inputType: question.inputType,
                        questionId: question.id,
                        question: question.name,
                        val,
                        sid,
                      };
                    }

                    mutate({
                      variables,
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
