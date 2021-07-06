import React from "react";
import "./FreeText.scss";

export default function FreeText({ questions, question, setQuestions }) {
  return (
    <div className="free-text-conatiner">
      <div className="row">
        <div className="col-sm-12 text-container">
          <textarea rows="4" cols="50" />
        </div>
      </div>
    </div>
  );
}
