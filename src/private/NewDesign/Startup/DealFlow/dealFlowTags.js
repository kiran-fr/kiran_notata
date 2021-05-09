import React, { useState } from "react";
import { Modal } from "Components/UI_Kits";

export default function DealFLowTag({ value }) {
  const [open, setOpen] = useState(value || false);

  const handleModal = val => {
    setOpen(!open);
  };

  return (
    <>
      {open && (
        <Modal
          title="Set Subjective Score"
          close={() => handleModal(false)}
          submit={() => handleModal(false)}
          disableFoot={false}
          loading={false}
          submitTxt={"SAVE"}
          closeTxt={"CANCEl"}
          showScrollBar={false}
        ></Modal>
      )}
    </>
  );
}