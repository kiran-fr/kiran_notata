import React from "react";

export default function EvaluationSummariesComp({ connection }) {
  return (
    <div className="row overview-container__scores evaluations-scores">
      <div className="overview-container__scores__heading">
        Evaluation summaries
      </div>
      {connection?.evaluationSummaries?.map(evaluation => {
        return (
          <div
            className="col-sm-6 col-md-6 col-xs-6 overview-container__scores__label"
            key={evaluation.templateId}
          >
            <div>{evaluation.templateName}</div>
            <div className="score">{`${
              evaluation.averagePercentageScore || 0
            }%`}</div>
            <div className="highest-score">
              {`${evaluation.highestScore || 0}%`}{" "}
              <span className="highest">HIGHEST</span>
            </div>
            <div className="lowest-score">
              {`${evaluation.lowestScore || 0}%`}{" "}
              <span className="lowest">LOWEST</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
