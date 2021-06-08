import React, { useEffect, useState } from "react";
import AddFunnel from "../DealFlow/addFunnel";
import Modal from "../DealFlow/modal";

export default function SetFunnelScore({ connection, close, updateFunnelTag, funnelLoad }) {
  const [funnelModal, setFunnelModal] = useState(false);
  const [funnelModalID, setFunnelModalID] = useState("");

  const handleSave = () => {
    setFunnelModal(true);
  };

  useEffect(() => {
    if(!funnelLoad && funnelModal) {
      close();
    }
  }, [funnelLoad && funnelModal]);

  return (
    <Modal disabled ={funnelModalID === "" ? true : false}
      load = {funnelLoad}
      title="Set Funnel Stage"
      saveModal={()=>handleSave()}
      closeModal={close}
    >
      <AddFunnel
        close={close}
        funnelModal={funnelModal}
        isModal={true}
        companyId={connection.id}
        funnelLoad = {funnelLoad}
        updateFunnelTag={updateFunnelTag}
      />
    </Modal>
  );
}
