import React, { useState } from "react";
import moment from "moment";
import { evaluate_page } from "definitions";
import FullListModal from "./FullListModal";
import "./EvaluationListByTemplate.scss";

export default function EvaluationListByTemplate({
  summary,
  evaluations,
  connection,
  history,
}) {
  const [vewSummaryModalForEvaluation, setViewSummaryModal] = useState(
    undefined
  );

  return (
    <>
      <div className="evaluation-list">
        <div className="row evaluation-list__header-row">
          <div className="col-sm-5 col-xs-9 eval-score-heading">
            {summary?.templateName}
          </div>

          <div className="col-sm-4 col-xs-9 submissions">
            {summary?.submissions} Submissions
          </div>

          <div className="col-sm-3 col-xs-3 score">
            <div className="score-content">
              {summary?.averagePercentageScore}%
            </div>
          </div>
        </div>

        <div className={"submission-section"}>
          {evaluations.map(evaluation => (
            <div
              key={evaluation.id}
              className={`row evaluation-list__each-row`}
            >
              <div className="col-sm-5 col-xs-9 evaluation-list__each-row__name">
                {evaluation?.createdByUser?.given_name}{" "}
                {evaluation?.createdByUser?.family_name}
                {evaluation?.createdByUser?.isMe && " (you) "}
                {evaluation?.createdByUser?.isMe && (
                  <i
                    className="fas fa-pen"
                    onClick={() => {
                      history.push(
                        `${evaluate_page}/${connection?.id}/${evaluation?.templateId}/${evaluation.id}`
                      );
                    }}
                  />
                )}
              </div>

              <div className="col-sm-4 col-xs-9 evaluation-list__each-row__date">
                {moment(evaluation.createdAt).format("ll")}
              </div>

              <div className="col-sm-3 col-xs-3 evaluation-list__each-row__score">
                <div className="score-content">
                  {evaluation?.summary?.scorePercent || 0}%
                  <div className="action-icons">
                    <i
                      className="fa fa-eye"
                      aria-hidden="true"
                      onClick={() => setViewSummaryModal(evaluation)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {vewSummaryModalForEvaluation && (
        <FullListModal
          title={`${vewSummaryModalForEvaluation?.summary?.templateName} (${vewSummaryModalForEvaluation?.createdByUser?.given_name} ${vewSummaryModalForEvaluation?.createdByUser?.family_name})`}
          close={() => setViewSummaryModal(undefined)}
          evaluation={vewSummaryModalForEvaluation}
        />
      )}
    </>
  );
}
