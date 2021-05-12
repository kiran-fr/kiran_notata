import React from "react";
import "./evaluate-startup.scss";

export default function EvaluateStartup({ setEditEvaluation }) {
  return (
    <div className="evaluate-startup-container">
      <div className="row">
        <div className="col-sm-4 col-xs-8 eval-type-heading">
          First impression
        </div>
        <div className="col-sm-4 col-xs-5 evaluated-on">
          evaluated on 10.10.2020
        </div>
        <div className="col-sm-3 col-xs-5 evaluate-action">
          <button onClick={setEditEvaluation}>Edit evaluation</button>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-4 col-xs-8 eval-type-heading"></div>
        <div className="col-sm-4 col-xs-5 evaluated-on">
          evaluated on 10.10.2020
        </div>
        <div className="col-sm-3 col-xs-5 evaluate-action">
          <button onClick={setEditEvaluation}>Edit evaluation</button>
        </div>
        <div className="col-sm-4 col-xs-8 eval-type-heading"></div>
        <div className="col-sm-4 col-xs-5 evaluated-on"></div>
        <div className="col-sm-3 col-xs-5 evaluate-action new-evaluation">
          <button onClick={setEditEvaluation}>+ New evaluation</button>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-4 col-xs-8 eval-type-heading">
          Before Pitching
        </div>
        <div className="col-sm-4 col-xs-5 evaluated-on"></div>
        <div className="col-sm-3 col-xs-5 evaluate-action">
          <button onClick={setEditEvaluation}>Evaluate</button>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-4 col-xs-8 eval-type-heading">
          After Pitching
        </div>
        <div className="col-sm-4 col-xs-5 evaluated-on"></div>
        <div className="col-sm-3 col-xs-5 evaluate-action">
          <button onClick={setEditEvaluation}>Evaluate</button>
        </div>
      </div>
    </div>
  );
}