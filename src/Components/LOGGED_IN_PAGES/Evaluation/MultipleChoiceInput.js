import React from "react";
import { useMutation } from "@apollo/client";

import { evaluationPut } from "../../../Apollo/Mutations";

export default function MultipleChoiceInput({
  section,
  question,
  templateId,
  evaluation,
}) {
  const [mutate, { loading }] = useMutation(evaluationPut);

  const answers = evaluation.answers.filter(
    ({ inputType, questionId }) =>
      inputType === "CHECK" && questionId === question.id
  );

  return (
    <div style={{ padding: "10px" }}>
      <form className="notata_form">
        {question.options.map(({ val, sid }) => {
          const answer = answers.find(
            ({ sid: answersSid }) => answersSid === sid
          );

          return (
            <div className="check_container" key={sid}>
              <label>
                <input
                  type="checkbox"
                  value={val}
                  disabled={loading}
                  defaultChecked={answer && answer.val}
                  onClick={() => {
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
                        sid: sid,
                        question: question.name,
                        val: "",
                      };
                    } else {
                      variables.input.answerNew = {
                        inputType: question.inputType,
                        questionId: question.id,
                        sid: sid,
                        question: question.name,
                        val,
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
