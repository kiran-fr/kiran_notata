import React from "react";
import { useMutation } from "@apollo/client";

import TextAreaAutoHeight from "../../../elements/TextAreaAutoHeight";

import { evaluationTemplateSectionPut } from "../../../../Apollo/Mutations";

import { focus_form } from "../../../elements/Style.module.css";

export default function NameAndDescription({ template, section }) {
  const [mutate] = useMutation(evaluationTemplateSectionPut);

  let { name, description } = section;

  return (
    <form onSubmit={e => e.preventDefault()} className={focus_form}>
      <div
        style={{
          marginTop: "50px",
          textAlign: "center"
        }}
      >
        <h1>
          <TextAreaAutoHeight
            placeholder='I.e. "Early stage evaluations"'
            value={name || ""}
            onBlur={value => {
              if (name === value) return;
              let variables = {
                id: section.id,
                input: {
                  name: value
                }
              };

              mutate({
                variables,
                optimisticResponse: {
                  __typename: "Mutation",
                  evaluationTemplateSectionPut: {
                    ...template,
                    name: value,
                    __typename: "EvaluationTemplateSection"
                  }
                }
              });
            }}
          />
          <span />
        </h1>
      </div>

      <div
        style={{
          marginTop: "50px",
          textAlign: "center"
        }}
      >
        <p>
          <TextAreaAutoHeight
            placeholder='I.e. "Template for evaluating early stage startups"'
            value={description || ""}
            onBlur={value => {
              if (description === value) return;
              let variables = {
                id: section.id,
                input: {
                  description: value
                }
              };
              mutate({
                variables,
                optimisticResponse: {
                  __typename: "Mutation",
                  evaluationTemplateSectionPut: {
                    ...template,
                    description: value,
                    __typename: "EvaluationTemplateSection"
                  }
                }
              });
            }}
          />
          <span />
        </p>
      </div>
    </form>
  );
}
