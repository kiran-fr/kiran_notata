import React, { useEffect, useState } from "react";
import AddFunnel from "../DealFlow/addFunnel";
import Modal from "../DealFlow/modal";

export default function SetFunnelScore({ connection, close, updateFunnelTag }) {
  const [funnelUpdate, setFunnelUpdate] = useState(false);

  const handleSave = () => {
    setFunnelUpdate(true);
  };

  return (
    <Modal title="Set Funnel Stage" saveModal={handleSave} closeModal={close}>
      <AddFunnel
        close={close}
        funnelUpdate={funnelUpdate}
        companyId={connection.id}
        updateFunnelTag={updateFunnelTag}
      />
    </Modal>
  );
}
