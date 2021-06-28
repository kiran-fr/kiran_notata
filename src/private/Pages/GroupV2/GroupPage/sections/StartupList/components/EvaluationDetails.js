import React, { useState } from "react";
import {
  getEvaluationsByTemplate,
  getSubjectiveScoreSummary,
} from "../../../../_helpers";
import EvaluationListByTemplate from "../../../../../StartupPage/TabPages/Evaluations/EvaluationListByTemplate";
import SubjectiveScoreList from "../../../../../StartupPage/TabPages/Evaluations/SubjectiveScoreList";
import { useHistory } from "react-router-dom";

export default function EvaluationDetails({ startup, group, adminView }) {
  const history = useHistory();

  const [viewDetails, setViewDetails] = useState(false);
  let evaluationsByTemplate = getEvaluationsByTemplate(startup);
  let subjectiveScoreSummary = getSubjectiveScoreSummary(startup);

  let settings = group?.settings;

  // Return if it's not enabled in settings
  if (!settings?.showUsers && !adminView) {
    return <span />;
  }

  return (
    <div className="group-startup-card__score-details">
      <div
        className="group-startup-card__content-section"
        onClick={() => setViewDetails(!viewDetails)}
      >
        <div className="group-startup-card__content-section__title">
          EVALUATION DETAILS
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
            <SubjectiveScoreList
              scores={startup.subjectiveScores}
              average={subjectiveScoreSummary?.average}
            />
          </div>

          <div className="row">
            {evaluationsByTemplate?.map(({ summary, evaluations }, i) => (
              <EvaluationListByTemplate
                key={i}
                summary={summary}
                evaluations={evaluations}
                connection={startup.connection}
                history={history}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
