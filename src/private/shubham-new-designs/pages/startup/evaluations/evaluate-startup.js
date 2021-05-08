import React from "react";
import "./evaluate-startup.scss";

export default function EvaluateStartup() {
  return (
    <div className="evaluate-startup-container">
      <div className="row">
        <div className="col-sm-4 col-xs-6 eval-type-heading">
          First impression
        </div>
        <div className="col-sm-4 col-xs-7 evaluated-on">
          evaluated on 10.10.2020
        </div>
        <div className="col-sm-4 col-xs-4 evaluate-action">
          <button>Edit evaluation</button>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-4 col-xs-6 eval-type-heading"></div>
        <div className="col-sm-4 col-xs-7 evaluated-on">
          evaluated on 10.10.2020
        </div>
        <div className="col-sm-4 col-xs-4 evaluate-action">
          <button>Edit evaluation</button>
        </div>
        <div className="col-sm-12 evaluate-action">
          <button>+ New evaluation</button>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-4 col-xs-6 eval-type-heading">
          Before Pitching
        </div>
        <div className="col-sm-4 col-xs-7 evaluated-on"></div>
        <div className="col-sm-4 col-xs-4 evaluate-action">
          <button>Evaluate</button>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-4 col-xs-6 eval-type-heading">
          After Pitching
        </div>
        <div className="col-sm-4 col-xs-7 evaluated-on"></div>
        <div className="col-sm-4 col-xs-4 evaluate-action">
          <button>Evaluate</button>
        </div>
      </div>
    </div>
  );
}
