import React, { useState } from "react";
// API
import { useMutation } from "@apollo/client";
import { evaluationTemplateCreate } from "private/Apollo/Mutations";

// COMPONENTS
import TextBox from "../../../../../Components/UI_Kits/from_srv/text-box";
import { Modal } from "../../../../../Components/UI_Kits";
// OTHERS
import { evaluation_template_page } from "definitions";

export default function CreateNewTemplateModal({ history, close }) {
  // STATES
  const [name, setName] = useState(null);
  // MUTAIONS
  const [createTemplate, createTemplateRes] = useMutation(
    evaluationTemplateCreate
  );

  return (
    <Modal
      title="New Evaluation Template"
      loading={createTemplateRes.loading}
      submit={async () => {
        let res;
        try {
          let variables = { input: { name } };
          res = await createTemplate({ variables });
        } catch (error) {
          console.log("error", error);
        }

        let id = res?.data?.evaluationTemplateCreate?.id;

        if (id) {
          history.push(`${evaluation_template_page}/${id}`);
        } else {
          close();
        }
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
