import React from "react";
import "./evaluate-startup.scss";
import moment from "moment";

export default function EvaluateStartup({
  setEditEvaluation,
  accountData,
  setSelectedSectionsToEvaluate,
}) {
  const { evaluationTemplates } = accountData;
  const callBack = data => {
    setEditEvaluation();
    setSelectedSectionsToEvaluate(data);
  };
  return (
    <div className="evaluate-startup-container">
      {evaluationTemplates?.map(evaluation => (
        <div className="row">
          <div className="col-sm-4 col-xs-8 eval-type-heading">
            {evaluation.name}
          </div>
          <div className="col-sm-4 col-xs-5 evaluated-on">
            evaluated on {moment(evaluation.createdAt).format("ll")}
          </div>
          <div className="col-sm-3 col-xs-5 evaluate-action">
            <button
              onClick={() => {
                callBack(evaluation.sections);
              }}
            >
              Edit evaluation
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
