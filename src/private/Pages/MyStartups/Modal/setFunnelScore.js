import React from "react";

// COMPONENTS
import AddFunnel from "../DealFlow/addFunnel";
import { Modal } from "../../../../Components/UI_Kits";

export default function SetFunnelScore({ connection, close, updateFunnelTag }) {
  return (
    <Modal
      title="Set Funnel Stage"
      close={close}
      submit={close}
      submitTxt={"OK"}
    >
      <AddFunnel companyId={connection.id} updateFunnelTag={updateFunnelTag} />
    </Modal>
  );
}
