import React from "react";

// COMPONENTS
import { AddScore } from "../DealFlow/addScore";
import { Modal } from "../../../../Components/UI_Kits";

export default function SubjectiveScoreModal({ connection, close }) {
  return (
    <Modal
      title="Set subjective score"
      close={close}
      submit={close}
      submitTxt={"OK"}
    >
      <AddScore connection={connection} />
    </Modal>
  );
}
