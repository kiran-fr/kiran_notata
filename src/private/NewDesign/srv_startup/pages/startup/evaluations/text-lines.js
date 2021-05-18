import React from "react";
import "./free-text.scss";
import TextBox from "../../ui-kits/text-box";

export default function TextLines() {
  return (
    <div className="text-lines-conatiner">
      <div className="col-sm-12">
        <TextBox placeholder="Text line name"></TextBox>
      </div>
      <div className="col-sm-11 col-xs-10">
        <TextBox></TextBox>
      </div>
      <div className="col-sm-1 col-xs-1">
        <span class="material-icons cancel">cancel</span>
      </div>
      <div className="col-sm-12 col-xs-12">
        <span class="material-icons add">add_circle</span>
      </div>
    </div>
  );
}
