import React, { useState } from "react";
import { getSubjectiveScoreSummary } from "../../../../_helpers";
import ScoreSummary from "../../../../generalComponents/ScoreSummary";

export default function EvaluationSummaries({ startup, group, adminView }) {
  // States
  const [viewDetails, setViewDetails] = useState(true);

  // Maps and reducers
  let subjectiveScoreSummary = getSubjectiveScoreSummary(startup);
  let settings = group?.settings;

  // Return if there are no scores
  if (!subjectiveScoreSummary) {
    return <span />;
  }

  // Return if it's not enabled in settings
  if (!settings?.showSummaries && !adminView) {
    return <span />;
  }

  return (
    <div className="group-startup-card__score-details">
      <div
        className="group-startup-card__content-section"
        onClick={() => setViewDetails(!viewDetails)}
      >
        <div className="group-startup-card__content-section__title">
          EVALUATION SUMMARIES
        </div>
        <i
          className={`group-startup-card__content-section__icon ${
            viewDetails ? "fa fa-chevron-down" : "fa fa-chevron-right"
          }`}
          aria-hidden="true"
        />
      </div>

      {viewDetails && (
        <div className="group-startup-card__content-inner">
          <div className="row">
            {/* subjective score summary */}
            {subjectiveScoreSummary && (
              <div className="col-xs-12 col-sm-6 col-md-4 group-startup-card__score-summaries__subjective-score">
                <ScoreSummary
                  title="Subjective Score"
                  score={subjectiveScoreSummary?.average}
                  highest={subjectiveScoreSummary?.max}
                  lowest={subjectiveScoreSummary?.min}
                  submissions={subjectiveScoreSummary?.submissions}
                />
              </div>
            )}

            {/* evaluation summaries */}
            {startup.evaluationSummaries?.map((summary, i) => (
              <div
                className="col-xs-12 col-sm-6 col-md-4"
                key={`evaluation-summary-${i}`}
              >
                <ScoreSummary
                  title={summary.templateName}
                  score={`${summary.averagePercentageScore}%`}
                  highest={summary.highestScore}
                  lowest={summary.lowestScore}
                  submissions={summary?.submissions}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
