import React from "react";
import Modal from "../DealFlow/modal";
import { AddScore } from "../DealFlow/addScore";

export default function SubjectiveScoreModal({ connection, close }) {
  return (
    <Modal title="Set subjective score" closeModal={close}>
      <AddScore connection={connection} />
    </Modal>
  );
}
