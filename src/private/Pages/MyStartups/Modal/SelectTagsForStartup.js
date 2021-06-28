import React from "react";

// COMPONENTS
import TagsModal from "../../../../Components/UI_Kits/from_srv/TagsModal";
import { Modal } from "../../../../Components/UI_Kits/Modal/Modal";

export default function SelectTagsForStartup({ connection, close }) {
  return (
    <Modal
      title="Add Tags"
      disableFoot={true}
      submit={() => {
        close();
      }}
      close={() => {
        close();
      }}
      submitTxt="Save"
      closeTxt="Cancel"
      children={<TagsModal connection={connection} />}
    />
  );
}
