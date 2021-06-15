import React, { useState } from "react";
import "./submission-full-list.scss";

export default function SubmissionFullList({ evaluation }) {
  let details = {};
  let sec = evaluation?.summary?.sections?.map(item => {
    details[item.sectionId] = "collapse";
  });

  console.log("details", details);
  console.log("obj", evaluation);

  const [collapseDetailList, setCollapseDetailList] = useState(details);
  return (
    <div className="submission-details">
      <div className="row">
        <div className="col-sm-10 col-xs-10 summary">Summary</div>
        <div className="col-sm-2 col-xs-2 score">
          {evaluation?.summary?.scorePercent || 0}%
        </div>
      </div>
      {evaluation?.summary?.sections?.map(section => {
        return (
          <div key={section.sectionId}>
            <div className="row detail-type">
              <div className="col-sm-10 col-xs-10 detail-heading">
                <i
                  class={`fa ${
                    collapseDetailList[section.sectionId] === ""
                      ? "fa-chevron-up"
                      : "fa-chevron-down"
                  }`}
                  aria-hidden="true"
                  onClick={() => {
                    let collapseList = { ...collapseDetailList };
                    collapseList[section.sectionId] =
                      collapseList[section.sectionId] === "" ? "collapse" : "";
                    setCollapseDetailList(collapseList);
                  }}
                />
                {section.sectionName}
              </div>
              <div className="col-sm-2 col-xs-2 score">
                {section.scorePercent || 0}%
              </div>
            </div>
            <div
              className={`${collapseDetailList[section.sectionId]} detail-list`}
            >
              {section?.scorePerAnswer?.map((score, index) => {
                return (
                  <div className="row" key={`${section.sectionId}_${index}`}>
                    <div className="col-sm-10 col-xs-10 detail">
                      <p>{score.questionName}</p>
                    </div>
                    <div className="col-sm-2 col-xs-2 detail-score">
                      {score.score + "/" + score.possibleScore}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
