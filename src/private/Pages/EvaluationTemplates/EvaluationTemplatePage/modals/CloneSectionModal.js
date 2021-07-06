import React from "react";
// API
import { useMutation } from "@apollo/client";
import { evaluationTemplateSectionCreate } from "private/Apollo/Mutations";
// COMPONENTS
import { Modal } from "../../../../../Components/UI_Kits";

// OTHERS
import { evaluation_template_page } from "definitions";

export default function CloneSectionModal({
  templateId,
  section,
  history,
  close,
}) {
  // MUTAIONS
  const [createSection, createSectionRes] = useMutation(
    evaluationTemplateSectionCreate
  );

  let newSection = {
    name: `${section.name} COPY`,
  };
  if (section.description) {
    newSection.description = section.description;
  }

  // DATA MAPS
  newSection.questions = section.questions?.map(q => ({
    name: q.name,
    description: q.description,
    inputType: q.inputType,
    options: q.options.map(({ index, score, val }) => ({ index, score, val })),
  }));

  return (
    <Modal
      title="Clone Evaluation Template"
      loading={createSectionRes.loading}
      submit={async () => {
        let res;
        try {
          let variables = {
            templateId,
            input: newSection,
          };
          res = await createSection({ variables });
        } catch (error) {
          return console.log("error", error);
        }
        let id = res?.data?.evaluationTemplateSectionCreate?.id;
        history.push(`${evaluation_template_page}/${templateId}/section/${id}`);
        close();
      }}
      close={close}
      submitTxt="Clone"
      closeTxt="Cancel"
      children={
        <div className="delete-group-modal-container">
          <div className="description">Clone this section</div>
        </div>
      }
    />
  );
}
