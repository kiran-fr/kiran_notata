import React from "react";
import { useMutation } from "@apollo/client";
import { Modal } from "../../../../../../../Components/UI_Kits";

import { evaluationTemplateDelete } from "private/Apollo/Mutations";

export default function DeleteTemplateModal({ close, template }) {
  // Mutations
  const [deleteTemplate, deleteTemplateRes] = useMutation(
    evaluationTemplateDelete
  );

  return (
    <Modal
      title="Delete Evaluation Template"
      loading={deleteTemplateRes.loading}
      submit={async () => {
        try {
          let variables = { id: template?.id };
          await deleteTemplate({ variables });
        } catch (error) {
          console.log("error", error);
        }
        close();
      }}
      close={close}
      submitTxt="Delete"
      closeTxt="Cancel"
      children={
        <div className="delete-group-modal-container">
          <div className="description">
            Are you sure you want to delete this template permanently?
          </div>
          <div className="remember">Remember:</div>
          <div className="options">
            - All evaluations based on this template will be removed
            <br />
            - This cannot be undone
            <br />
          </div>
        </div>
      }
    />
  );
}
