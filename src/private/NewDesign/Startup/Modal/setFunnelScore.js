import React from "react";
import { Funnel } from "Components/Funnel/Funnel";

import { Modal } from "Components/elements";

import AddFunnel from "../DealFlow/addFunnel";

export default function SetFunnelScore({ connection, close }) {
  return (
    <Modal title="Set Funnel score" close={close}>
      <AddFunnel connection={connection} />
    </Modal>
  );
}
