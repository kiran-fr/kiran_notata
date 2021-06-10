import { Modal } from "../../../../../Components/UI_Kits";
import SubmissionFullList from "./submission-full-list";
import React from "react";

export default function FullListModal({ close, evaluation }) {
  return (
    <Modal
      title={`${evaluation?.template?.name} (${evaluation?.createdByUser?.given_name})`}
      submit={close}
      close={close}
      submitTxt="OK"
      children={<SubmissionFullList evaluation={evaluation} />}
    />
  );
}
