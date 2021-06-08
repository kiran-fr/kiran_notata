import React from "react";
import { Modal } from "Components/UI_Kits/Modal/Modal";
import CreateNewGroup from "../../Groups/create-new-group/create-new-group";

export default function CreateNewGroupModal({ close }) {
  return (
    <Modal
      title="Create new group"
      submit={close}
      close={close}
      submitTxt="Create"
      closeTxt="Cancel"
      children={<CreateNewGroup />}
    />
  );
}
