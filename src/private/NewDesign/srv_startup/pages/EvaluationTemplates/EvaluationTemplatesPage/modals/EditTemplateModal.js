import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import TextBox from "../../../ui-kits/text-box";
import { evaluationTemplateUpdate } from "private/Apollo/Mutations";
import { Modal } from "../../../../../../../Components/UI_Kits";

export default function EditTemplateModal({ close, template }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (template.name) {
      setName(template.name);
    }
  }, [template]);

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
