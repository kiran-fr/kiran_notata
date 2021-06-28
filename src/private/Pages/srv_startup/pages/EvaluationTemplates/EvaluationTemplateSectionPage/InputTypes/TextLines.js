import React from "react";
// COMPONENTS 
import TextBox from "../../../ui-kits/text-box";
// STYLES
import "./FreeText.scss";

export default function TextLines({ questions, question, setQuestions }) {
  return (
    <div className="text-lines-conatiner">
      <div className="col-sm-12">
        <TextBox placeholder="Text line name" />
      </div>
      <div className="col-sm-11 col-xs-10">
        <TextBox />
      </div>
      <div className="col-sm-1 col-xs-1">
        <span className="material-icons cancel">cancel</span>
      </div>
      <div className="col-sm-12 col-xs-12">
        <span className="material-icons add">add_circle</span>
      </div>
    </div>
  );
}
