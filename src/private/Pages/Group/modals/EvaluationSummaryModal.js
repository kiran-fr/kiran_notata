import SubmissionFullList from "../../StartupPage/TabPages/Evaluations/submission-full-list";
import React from "react";
import { Modal } from "Components/UI_Kits";

export default function EvaluationSummaryModal({ evaluation, close }) {
  let { createdByUser, summary } = evaluation;

  return (
    <Modal
      title={`${summary.templateName} (${createdByUser.given_name} ${createdByUser.family_name})`}
      submit={close}
      close={close}
      submitTxt="OK"
      children={<SubmissionFullList obj={evaluation} />}
    />
  );
}
