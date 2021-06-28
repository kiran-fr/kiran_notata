import moment from "moment";
import React from "react";
import { getSubjectiveScoreSummary } from "../../../../_helpers";

export default function SubjectiveScore({ startup }) {
  let subjectiveScoreSummary = getSubjectiveScoreSummary(startup);
  return (
    <>
      {/* subjective score */}
      <div className="row subjective-score-evaluation-container">
        <i
          className={`subjective-score-evaluation-container__icon fa fa-chevron-down`}
          aria-hidden="true"
          onClick={() => null}
        />
        <div className="col-sm-6 col-xs-9 subjective-score-evaluation-container__name">
          Subjective Score
        </div>

        <div className="col-sm-3 col-xs-9 subjective-score-evaluation-container__submitions">
          {startup.subjectiveScores?.length} submissions
        </div>
        <div className="col-sm-3 col-xs-3 subjective-score-evaluation-container__score">
          {subjectiveScoreSummary?.average}
        </div>
      </div>

      {/* Evaluations */}
      <div className="row evaluation-container">
        <div className="col-sm-12 evaluation-container__heading">
          EVALUATIONS
        </div>
      </div>

      {evaluationsByTemplate?.map(({ summary, evaluations }) => {
        return (
          <>
            <div className="row evaluation-container" key={summary.templateId}>
              {/* toggle open */}
              <i
                className={`subjective-score-evaluation-container__icon 
                            ${
                              expandedTemplates[summary.templateId]
                                ? "fa fa-chevron-up"
                                : "fa fa-chevron-down"
                            }`}
                aria-hidden="true"
                onClick={() =>
                  setExpandedTemplates({
                    ...expandedTemplates,
                    [summary.templateId]: !expandedTemplates[
                      summary.templateId
                    ],
                  })
                }
              />

              <div className="col-sm-6 col-xs-9 subjective-score-evaluation-container__name">
                {summary.templateName}
              </div>
              <div className="col-sm-3 col-xs-9 subjective-score-evaluation-container__submitions">
                {evaluations.length} submissions
              </div>
              <div className="col-sm-3 col-xs-3 subjective-score-evaluation-container__score">
                {summary.averagePercentageScore}%
              </div>
            </div>

            {expandedTemplates[summary.templateId] &&
              evaluations.map(evaluation => {
                return (
                  <div
                    className="row evaluation-list-container"
                    key={evaluation.id}
                  >
                    <div className="col-sm-6 col-xs-9 subjective-score-evaluation-container__username">
                      {evaluation.createdByUser?.given_name}{" "}
                      {evaluation.createdByUser?.family_name}
                    </div>
                    <div className="col-sm-3 col-xs-9 subjective-score-evaluation-container__submitions">
                      {moment(evaluation.updatedAt).format("ll")}
                    </div>
                    <div className="col-sm-3 col-xs-3 subjective-score-evaluation-container__score">
                      {evaluation.summary?.scorePercent}%{" "}
                      <span
                        className="full-list"
                        onClick={() => setFullListModal(evaluation)}
                      >
                        Full list
                      </span>
                    </div>
                  </div>
                );
              })}
          </>
        );
      })}
    </>
  );
}
