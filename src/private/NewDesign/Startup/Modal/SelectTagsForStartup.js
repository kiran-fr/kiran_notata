import React from "react";
import TagsModal from "../../srv_startup/pages/ui-kits/TagsModal";
import { Modal } from "../../../../Components/UI_Kits/Modal/Modal";

export default function SelectTagsForStartup({ close }) {
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
      children={<TagsModal></TagsModal>}
    ></Modal>
  );
}
