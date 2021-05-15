import React, { useState } from "react";
import "./submission-full-list.scss";

export default function SubmissionFullList({ obj }) {
  let details = {};
  obj.details.map(item => {
    details[item.id] = "collapse";
  });
  console.log(",,,,,,,,,,,", details);
  const [collapseDetailList, setCollapseDetailList] = useState(details);
  return (
    <div className="submission-details">
      <div className="row">
        <div className="col-sm-10 col-xs-10 summary">Summary</div>
        <div className="col-sm-2 col-xs-2 score">{obj.summary}</div>
      </div>
      {obj.details.map(item => {
        return (
          <div key={item.id}>
            <div className="row detail-type">
              <div className="col-sm-10 col-xs-10 detail-heading">
                <i
                  class={`fa ${
                    collapseDetailList[item.id] === ""
                      ? "fa-chevron-up"
                      : "fa-chevron-down"
                  }`}
                  aria-hidden="true"
                  onClick={() => {
                    let collapseList = { ...collapseDetailList };
                    collapseList[item.id] =
                      collapseList[item.id] === "" ? "collapse" : "";
                    setCollapseDetailList(collapseList);
                  }}
                ></i>
                {item.name}
              </div>
              <div className="col-sm-2 col-xs-2 score">{item.value}</div>
            </div>
            <div className={`${collapseDetailList[item.id]} detail-list`}>
              {item.detail.map((detail, index) => {
                return (
                  <div className="row" key={`${item.id}_${index}`}>
                    <div className="col-sm-10 col-xs-10 detail">
                      <p>{detail.key}</p>
                    </div>
                    <div className="col-sm-2 col-xs-2 detail-score">
                      {detail.value}
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
