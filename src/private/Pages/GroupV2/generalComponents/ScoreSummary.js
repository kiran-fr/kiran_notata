import React from "react";

import "./ScoreSummary.scss";

export default function ScoreSummary({
  title,
  score,
  highest,
  lowest,
  submissions,
}) {
  return (
    <div className="score-summary">
      <div className="score-summary__title">{title}</div>

      <div className="score-summary__entries">
        {submissions === 1 ? submissions + " entry" : submissions + " entries"}
      </div>

      <div className="score-summary__scores-container">
        <div className="score-summary__scores-container__score">{score}</div>

        <div className="score-summary__scores-container__highest-lowest-score">
          <div className="score-summary__scores-container__highest-lowest-score__record">
            <div className="score-summary__scores-container__highest-lowest-score__score highest">
              {highest}
            </div>
            <div className="score-summary__scores-container__highest-lowest-score__type">
              highest
            </div>
          </div>

          <div className="score-summary__scores-container__highest-lowest-score__record">
            <div className="score-summary__scores-container__highest-lowest-score__score lowest">
              {lowest}
            </div>
            <div className="score-summary__scores-container__highest-lowest-score__type">
              lowest
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
