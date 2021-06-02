import React, { useState } from "react";
import "./sharing-options.scss";
import InputCheckBox from "../../ui-kits/check-box";

export default function SharingOptions() {
  const [showEvaluations, setShowEvaluations] = useState(true);
  return (
    <div className="sharing-opions-contianer">
      <div className="question">What do you want to share?</div>
      <div className="options-container">
        <div className="option">
          <InputCheckBox />
          Subjective Score
        </div>
        <div className="option">
          <InputCheckBox />
          Evaluations{" "}
          <i
            class={`fa ${
              !showEvaluations ? "fa-chevron-up" : "fa-chevron-down"
            }`}
            aria-hidden="true"
            onClick={() => setShowEvaluations(!showEvaluations)}
          />
        </div>
        {showEvaluations && (
          <div className="evaluation-options-container">
            <div className="option">
              <InputCheckBox />
              First Impression
            </div>
            <div className="option">
              <InputCheckBox />
              Before Pitching
            </div>
            <div className="option">
              <InputCheckBox />
              After Pitching
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
