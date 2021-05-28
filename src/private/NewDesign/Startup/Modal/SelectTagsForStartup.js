import React from "react";
import Tags from "../../srv_startup/pages/ui-kits/tags";
import { Modal } from "../../../../Components/UI_Kits/Modal/Modal";

export default function SelectTagsForStartup({ connection, close }) {
  return (
    <Modal
      title="Add Tags"
      submit={() => {
        close();
      }}
      close={() => {
        close();
      }}
      submitTxt="Save"
      closeTxt="Cancel"
      children={<Tags></Tags>}
    ></Modal>
  );
}
