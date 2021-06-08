import React, { useState } from "react";
import StartupCard from "./StartupCard";
import SubmissionFullList from "../../../StartupPage/TabPages/Evaluations/submission-full-list";
import { Modal } from "Components/UI_Kits/Modal/Modal";

export default function StartupList({ group, history }) {
  const [fullListModal, setFullListModal] = useState(false);

  return (
    <>
      {group.startups?.map((startup, i) => (
        <StartupCard
          key={`startup-${i}`}
          group={group}
          startup={startup}
          setFullListModal={setFullListModal}
          history={history}
        />
      ))}

      {fullListModal && (
        <Modal
          title={`${fullListModal.summary.templateName} (${fullListModal.createdByUser.given_name} ${fullListModal.createdByUser.family_name})`}
          submit={() => {
            setFullListModal(undefined);
          }}
          close={() => {
            setFullListModal(undefined);
          }}
          submitTxt="OK"
          children={<SubmissionFullList obj={fullListModal} />}
        />
      )}
    </>
  );
}
