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
    <form className="notata_form">
      {question.options.map(({ val }, i) => {
        return (
          <label key={i}>
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
                  };
                } else {
                  variables.input.answerNew = {
                    inputType: question.inputType,
                    questionId: question.id,
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
        );
      })}
    </form>
  );
}
