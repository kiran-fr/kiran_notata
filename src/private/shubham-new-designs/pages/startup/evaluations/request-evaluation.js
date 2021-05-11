import React, { useState } from "react";
import "../evaluations/request-evaluation.scss";
import TextBox from "../../ui-kits/text-box";
import RadioButton from "../../ui-kits/radio-button";

export default function RequestEvaluation() {
  const [shareEmailCount, setShareEmailCount] = useState(1);

  return (
    <div className="request-modal">
      <div className="request-modal__heading">Email</div>
      <TextBox placeholder="ana@leverageUX.com"></TextBox>
      <i class="fa fa-times" aria-hidden="true"></i>
      {[...Array(shareEmailCount)].map((item, index) => {
        return (
          <div>
            <TextBox></TextBox>
            {index === shareEmailCount - 1 && (
              <i
                class="fa fa-plus"
                aria-hidden="true"
                onClick={() => setShareEmailCount(shareEmailCount + 1)}
              ></i>
            )}
          </div>
        );
      })}

      <div className="request-modal__heading">Evaluation</div>
      <div className="radio-button-section">
        <div>
          <RadioButton
            name="eval-types"
            label="First Impression"
            id="first-impression"
            checked={false}
          ></RadioButton>
        </div>
        <div>
          <RadioButton
            name="eval-types"
            label="Before Pitching"
            id="before-pitching"
            checked={false}
          ></RadioButton>
        </div>
        <div>
          <RadioButton
            name="eval-types"
            label="After Pitching"
            id="after-pitching"
            checked={false}
          ></RadioButton>
        </div>
      </div>
    </div>
  );
}
