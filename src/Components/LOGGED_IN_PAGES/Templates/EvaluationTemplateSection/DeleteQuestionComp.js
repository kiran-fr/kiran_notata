import React from "react";
import { Mutation } from "@apollo/client/react/components";

import { evaluationTemplateGet } from "../../../../Apollo/Queries";

import { evaluationQuestionDelete } from "../../../../Apollo/Mutations";

import { GhostLoader } from "../../../elements/GhostLoader";

import { delete_option } from "./EvaluationTemplateSection.module.css";

const DeleteQuestion = ({ templateId, sectionId, question }) => (
  <Mutation mutation={evaluationQuestionDelete}>
    {(mutate, { error, loading, data }) => {
      if (loading) {
        return <GhostLoader />;
      }

      return (
        <div
          className={delete_option}
          style={{ top: "-20px", right: "0px" }}
          onClick={() => {
            if (
              ["RADIO", "CHECK"].some(s => s === question.inputType) &&
              question.options.length
            ) {
              return window.alert(
                "You have to delete the options below before you can delete this question:\n\n" +
                  question.options.map(o => `"${o.val}"`).join(", ")
              );
            }
            if (
              window.confirm(
                "Are you sure you want to delte this question permanently?"
              )
            ) {
              let variables = { id: question.id };
              mutate({
                variables,
                update: (proxy, { data: { evaluationQuestionDelete } }) => {
                  let data = proxy.readQuery({
                    query: evaluationTemplateGet,
                    variables: { id: templateId }
                  });
                  let sections = data.evaluationTemplateGet.sections;
                  data.evaluationTemplateGet.sections = sections.map(s => {
                    if (s.id !== sectionId) return s;
                    return {
                      ...s,
                      questions: s.questions.filter(q => q.id !== question.id)
                    };
                  });
                },
                refetchQueries: [
                  {
                    query: evaluationTemplateGet,
                    variables: { id: templateId }
                  }
                ]
              });
            }
          }}
        >
          DELETE QUESTION
        </div>
      );
    }}
  </Mutation>
);

export default DeleteQuestion;
