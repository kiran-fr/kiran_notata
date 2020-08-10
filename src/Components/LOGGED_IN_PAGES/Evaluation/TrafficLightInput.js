import React from "react";
import { useMutation } from "@apollo/client";

import { InputTrafficLight } from "../../elements";

import { evaluationPut } from "../../../Apollo/Mutations";

export default function TrafficLightInput({
  section,
  question,
  templateId,
  evaluation,
}) {
  const [mutate, { loading }] = useMutation(evaluationPut);

  const answer = evaluation.answers.find(
    ({ inputType, questionId }) =>
      inputType === "TRAFFIC_LIGHTS" && questionId === question.id
  );

  return (
    <form className="notata_form">
      <div style={{ display: "flex", justifyContent: "center" }}>
        {["red", "yellow", "green"].map(color => (
          <InputTrafficLight
            key={color}
            color={color}
            active={!loading && answer && answer.val === color}
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
                  question: question.name,
                  val: color,
                };
              } else {
                variables.input.answerNew = {
                  inputType: question.inputType,
                  questionId: question.id,
                  question: question.name,
                  val: color,
                };
              }

              !loading &&
                mutate({
                  variables,
                });
            }}
          />
        ))}
      </div>
    </form>
  );
}
