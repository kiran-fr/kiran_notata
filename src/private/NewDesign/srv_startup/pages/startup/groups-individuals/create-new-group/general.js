import React from "react";
import TextBox from "../../../ui-kits/text-box";

export default function General() {
  return (
    <div className="genral-contianer">
      <div className="group-name">
        Group Name<span className="asterik">*</span>
      </div>
      <div className="text">
        <TextBox placeholder="Group Name" />
      </div>
      <div className="group-name description">group Description</div>
      <textarea placeholder="Group Description" />
    </div>
  );
}
