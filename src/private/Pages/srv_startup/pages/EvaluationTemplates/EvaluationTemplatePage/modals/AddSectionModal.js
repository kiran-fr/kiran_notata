import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Modal } from "../../../../../../../Components/UI_Kits";
import TextBox from "../../../ui-kits/text-box";
import { evaluation_template_page } from "definitions";
import { evaluationTemplateSectionCreate } from "private/Apollo/Mutations";

export default function AddSectionModal({ templateId, history, close }) {
  const [createSection, createSectionRes] = useMutation(
    evaluationTemplateSectionCreate
  );

  const [name, setName] = useState("");
  return (
    <Modal
      title="New Section"
      loading={createSectionRes.loading}
      submit={async () => {
        let res;
        try {
          let variables = {
            templateId,
            input: {
              name: name,
            },
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
      submitTxt="Save"
      closeTxt="Cancel"
      children={
        <TextBox
          name="sectionName"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Evaluation Section Name"
        />
      }
    />
  );
}
