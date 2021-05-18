import React from "react";
import TextBox from "../../ui-kits/text-box";
import RadioButton from "../../ui-kits/radio-button";

export default function SingleAndMultiPleAnswer() {
  const noOfRows = 3;
  return (
    <>
      {[...Array(noOfRows)].map((elementInArray, index) => {
        return (
          <div
            className="row single-answer-option"
            key={`single-option-id-${index}`}
          >
            <div className="col-sm-1 col-xs-1">
              <RadioButton
                name="single-answer-option"
                id="option-1"
              ></RadioButton>
            </div>
            <div className="col-sm-7 col-xs-10">
              <TextBox placeholder="Option 1"></TextBox>
            </div>
            <div className="col-sm-1 points-text col-xs-5">
              <span className="points">Points</span>
            </div>
            <div className="col-sm-2 col-xs-6 incre-decre-icons">
              <span class="material-icons remove">remove_circle</span>
              <span className="no-of-points">1</span>
              <span class="material-icons add">add_circle</span>
              <span class="material-icons cancel">cancel</span>
            </div>
          </div>
        );
      })}
      <div className="row single-answer-option add-option-container">
        <div className="col-sm-1 col-xs-1">
          <RadioButton name="single-answer-option" id="add-other"></RadioButton>
        </div>
        <div className="col-sm-10 col-xs-10">
          <div className="add-option-text">
            <span className="add-option">Add Option</span>
            <span className="or">or</span>
            <span className="add-other">Add “Other”</span>
          </div>
        </div>
      </div>
    </>
  );
}
