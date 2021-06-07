import React from "react";
import { Modal } from "../../../../../../../Components/UI_Kits";
import { omit, cloneDeep } from "lodash";
import { evaluationTemplateCreate } from "private/Apollo/Mutations";
import { evaluation_template_page } from "definitions";
import { useMutation } from "@apollo/client";

export default function CloneTemplateModal({ close, template, history }) {
  const [createTemplate, createTemplateRes] = useMutation(
    evaluationTemplateCreate
  );

  function getClonedTemplateData() {
    let newTemplate = {
      name: `${template.name} CLONED`,
    };

    if (template.description) {
      newTemplate.description = template.description;
    }

    let newSections = template.sections?.map(s => {
      let newSection = { name: s.name };
      if (s.description) {
        newSection.description = s.description;
      }

      let newQuestions = s.questions.map(q => {
        let newQuestion = { name: q.name };
        if (q.description) {
          newQuestion.description = q.description;
        }
        let newOptions = q.options.map(({ val, score, index }) => ({
          val,
          score,
          index,
        }));
        return {
          ...newQuestion,
          options: newOptions,
        };
      });

      return {
        ...newSection,
        questions: newQuestions,
      };
    });

    newTemplate.sections = newSections;

    return newTemplate;
  }

  async function cloneTemplate() {
    let res;
    try {
      let input = getClonedTemplateData();
      let variables = { input };
      res = await createTemplate({ variables });
    } catch (error) {
      console.log("error", error);
    }

    let id = res?.data?.evaluationTemplateCreate?.id;

    history.push(`${evaluation_template_page}/${id}`);

    close();
  }

  return (
    <Modal
      title="Clone Evaluation Template"
      loading={createTemplateRes.loading}
      submit={cloneTemplate}
      close={close}
      submitTxt="Clone"
      closeTxt="Cancel"
      children={
        <div className="delete-group-modal-container">
          <div className="description">
            Clone this template with all its content
          </div>
        </div>
      }
    />
  );
}
