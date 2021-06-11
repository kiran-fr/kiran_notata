import React from "react";
import "./evaluate-startup.scss";
import moment from "moment";
import { evaluate_page } from "../../../../../definitions";

export default function EvaluateStartupSelector({
  connection,
  account,
  history,
}) {
  const { evaluationTemplates } = account;

  const getEvaluations = (templateId, myEvaluations) => {
    return (
      connection?.evaluations?.filter(
        data => data.templateId === templateId && data.isMe === myEvaluations
      ) || []
    );
  };

  return (
    <div className="evaluate-startup-container">
      {evaluationTemplates?.map(template => (
        <div className="row" key={template.id}>
          <div className="col-sm-4 col-xs-8 eval-type-heading">
            {template.name}
          </div>

          {
            <div>
              {getEvaluations(template.id, true)?.map(evaluation => (
                <div className="row" key={`${template.id}=${evaluation.id}`}>
                  <div className="col-sm-4 col-xs-8 eval-type-heading">
                    {""}
                  </div>

                  <div className="col-sm-4 col-xs-5 evaluated-on">
                    evaluated on {moment(evaluation.createdAt).format("lll")}
                  </div>

                  <div className="col-sm-3 col-xs-5 evaluate-action">
                    <button
                      onClick={() => {
                        history.push(
                          `${evaluate_page}/${connection.id}/${template.id}/${evaluation.id}`
                        );
                      }}
                    >
                      Edit evaluation
                    </button>
                  </div>
                </div>
              ))}
              <div className="col-sm-4 col-xs-8 eval-type-heading"> </div>
              <div className="col-sm-4 col-xs-5 evaluated-on"> </div>
              <div className="col-sm-3 col-xs-5 evaluate-action">
                <button
                  onClick={() => {
                    history.push(
                      `${evaluate_page}/${connection.id}/${template.id}`
                    );
                  }}
                >
                  + New evaluation
                </button>
              </div>
            </div>
          }
        </div>
      ))}
    </div>
  );
}
