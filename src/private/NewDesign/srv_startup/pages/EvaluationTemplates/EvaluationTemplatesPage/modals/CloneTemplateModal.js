import React from "react";
import { Modal } from "../../../../../../../Components/UI_Kits";

export default function CloneTemplateModal({ close, template }) {
  return (
    <Modal
      title="Clone Evaluation Template"
      // loading={deleteTemplateRes.loading}
      submit={async () => {
        // try {
        //   let variables = { id: template?.id }
        //   await deleteTemplate({variables})
        // } catch (error) {
        //   console.log('error', error)
        // }
        close();
      }}
      close={close}
      submitTxt="OK"
      closeTxt="Cancel"
      children={
        <div className="delete-group-modal-container">
          <div className="description">Only sheep can get cloned?</div>
        </div>
      }
    />
  );
}
