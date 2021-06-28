import React, { useEffect, useState } from "react";
// API
import { useMutation } from "@apollo/client";
import { evaluationTemplateUpdate } from "private/Apollo/Mutations";

// COMPONENTS
import TextBox from "../../../../../Components/UI_Kits/from_srv/text-box";
import { Modal } from "../../../../../Components/UI_Kits";

export default function EditTemplateModal({ close, template }) {
  // STATES
  const [name, setName] = useState("");

  // EFFECTS
  useEffect(() => {
    if (template.name) {
      setName(template.name);
    }
  }, [template]);

  // MUTAIONS
  const [updateTemplate, updateTemplateRes] = useMutation(
    evaluationTemplateUpdate
  );

  return (
    <Modal
      title="Update Evaluation Template"
      loading={updateTemplateRes.loading}
      submit={async () => {
        try {
          let variables = {
            id: template?.id,
            input: { name },
          };
          await updateTemplate({ variables });
        } catch (error) {
          console.log("error", error);
        }
        close();
      }}
      close={close}
      submitTxt="Save"
      closeTxt="Cancel"
      children={
        <TextBox
          name="name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Evaluation Template Name"
        />
      }
    />
  );
}
