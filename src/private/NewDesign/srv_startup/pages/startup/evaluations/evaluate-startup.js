import React from "react";
import "./evaluate-startup.scss";
import moment from "moment";

export default function EvaluateStartup({
  setEditEvaluation,
  accountData,
  evaluations,
  setSelectedTemplateToEvaluate,
  setActiveEvaluation,
}) {
  const { evaluationTemplates } = accountData;
  const callBack = (template, evaluation) => {
    setEditEvaluation();
    setSelectedTemplateToEvaluate(template);
    setActiveEvaluation(evaluation);
  };
  const getEvaluations = (templateId, myEvaluations) => {
    return (
      evaluations?.filter(
        data => data.templateId === templateId && data.isMe === myEvaluations
      ) || []
    );
  };
  return (
    <div className="evaluate-startup-container">
      {evaluationTemplates?.map(template => (
        <div className="row">
          <div className="col-sm-4 col-xs-8 eval-type-heading">
            {template.name}
          </div>
          {
            <div>
              {getEvaluations(template.id, true)?.map(evaluation => (
                <div className="row">
                  <div className="col-sm-4 col-xs-5 evaluated-on">
                    evaluated on {moment(evaluation.createdAt).format("ll")}
                  </div>
                  <div className="col-sm-3 col-xs-5 evaluate-action">
                    <button
                      onClick={() => {
                        callBack(template, evaluation);
                      }}
                    >
                      Edit evaluation
                    </button>
                  </div>
                </div>
              ))}
              {/* <div className="col-sm-3 col-xs-5 evaluate-action">
                  <button>+ New evaluation</button>
              </div> */}
            </div>
          }
        </div>
      ))}
    </div>
  );
}
