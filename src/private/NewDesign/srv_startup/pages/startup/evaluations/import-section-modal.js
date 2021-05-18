import React from "react";
import "./import-section-modal.scss";
import DropDown from "../../ui-kits/drop-down";
import InputCheckBox from "../../ui-kits/check-box";

export default function ImportSection() {
  const items = [
    {
      id: 1,
      name: "After Pitching",
      template: <span className="my-template">my template</span>,
    },
    {
      id: 2,
      name: "After Pitching 2",
      template: <span className="my-template">my template</span>,
    },
    {
      id: 3,
      name: "After Pitching 3",
      template: <span className="my-template">my template</span>,
    },
    {
      id: 4,
      name: "After Pitching 4",
      template: <span className="group-template">Big Group 1</span>,
    },
    {
      id: 5,
      name: "After Pitching 5",
      template: <span className="group-template">Big Group 1</span>,
    },
    {
      id: 6,
      name: "After Pitching 6",
      template: <span className="group-template">Big Group 1</span>,
    },
  ];
  const sections = [
    { id: 1, name: "Problem" },
    { id: 2, name: "Concept" },
    { id: 3, name: "Market" },
    { id: 4, name: "Team" },
  ];
  return (
    <div className="import-section-container">
      <div className="row">
        <div className="col-sm-4 col-xs-12">
          <div className="drop-down-heading">Evaluation template</div>
          <DropDown title="" items={items}></DropDown>
        </div>
        <div className="col-sm-2 col-xs-12">
          <div className="drop-down-heading">Sections</div>
          <div className="desktop_sections">
            <DropDown title="" items={sections}></DropDown>
          </div>
          <div className="mobile_sections">
            <div className="section">
              <InputCheckBox></InputCheckBox>
              <span className="section__text">Problem</span>
            </div>
            <div className="section">
              <InputCheckBox></InputCheckBox>
              <span className="section__text">Concept</span>
            </div>
            <div className="section">
              <InputCheckBox></InputCheckBox>
              <span className="section__text">Market</span>
            </div>
            <div className="section">
              <InputCheckBox></InputCheckBox>
              <span className="section__text">Team</span>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xs-12">
          <div className="drop-down-heading">Questions</div>
          <div className="question-container">
            <InputCheckBox></InputCheckBox>
            <span className="question-container__question">
              <div className="question-container__question__select-all">
                Select All
              </div>
            </span>
          </div>
          <div className="question-container">
            <InputCheckBox></InputCheckBox>
            <span className="question-container__question">
              <div className="question-container__question__text">
                Do you understand the problem??
              </div>
              <div className="question-container__question__type">
                Single answer: 2 options
              </div>
            </span>
          </div>
          <div className="question-container">
            <InputCheckBox></InputCheckBox>
            <span className="question-container__question">
              <div className="question-container__question__text">
                What products or services your business provide?
              </div>
              <div className="question-container__question__type">
                Single answer: 2 options
              </div>
            </span>
          </div>
          <div className="question-container">
            <InputCheckBox></InputCheckBox>
            <span className="question-container__question">
              <div className="question-container__question__text">
                What price positioning of your product or services?
              </div>
              <div className="question-container__question__type">
                Single answer: 2 options
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
