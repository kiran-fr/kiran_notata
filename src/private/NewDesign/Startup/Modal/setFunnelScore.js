import React from "react";
import AddFunnel from "../DealFlow/addFunnel";
import Modal from "../DealFlow/modal";

export default function SetFunnelScore({ connection, close }) {
  return (
    <Modal title="Set Funnel Stage" closeModal={close}>
      <AddFunnel />
    </Modal>
  );
}
