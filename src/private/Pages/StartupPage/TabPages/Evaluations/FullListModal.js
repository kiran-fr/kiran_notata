import { Modal } from "../../../../../Components/UI_Kits";
import SubmissionFullList from "./submission-full-list";
import React from "react";

export default function FullListModal({ close, title, evaluation }) {
  return (
    <Modal
      title={title}
      submit={close}
      close={close}
      submitTxt="OK"
      children={<SubmissionFullList evaluation={evaluation} />}
    />
  );
}
