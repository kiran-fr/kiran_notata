import React, { useState } from "react";
// API
import { useMutation } from "@apollo/client";
import { evaluationTemplateSectionCreate } from "private/Apollo/Mutations";

// COMPONENTS
import { Modal } from "../../../../../Components/UI_Kits";
import TextBox from "../../../../../Components/UI_Kits/from_srv/text-box";

// OTHERS
import { evaluation_template_page } from "definitions";

export default function AddSectionModal({ templateId, history, close }) {
  // STATES
  const [name, setName] = useState("");

  // MUTATIONS
  const [createSection, createSectionRes] = useMutation(
    evaluationTemplateSectionCreate
  );
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
