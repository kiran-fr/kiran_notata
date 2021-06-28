import React from "react";
import moment from "moment";
import "./EvaluationListByTemplate.scss";

export default function SubjectiveScoreList({ scores, average }) {
  return (
    <>
      <div className="evaluation-list">
        <div className="row evaluation-list__header-row">
          <div className="col-sm-5 col-xs-9 eval-score-heading">
            Subjective Scores
          </div>

          <div className="col-sm-4 submissions">
            {scores.length === 1
              ? scores.length + " Entry"
              : scores.length + " Entries"}
          </div>

          <div className="col-sm-3 col-xs-3 score">
            <div className="score-content">{average}</div>
          </div>
        </div>

        <div className={"submission-section"}>
          {scores.map((score, i) => (
            <div key={i} className={`row evaluation-list__each-row`}>
              <div className="col-sm-5 col-xs-9 evaluation-list__each-row__name">
                {score?.createdByUser?.given_name}{" "}
                {score?.createdByUser?.family_name}
                {score?.createdByUser?.isMe && " (you)"}
              </div>

              <div className="col-sm-4 evaluation-list__each-row__date">
                {moment(score.createdAt).format("ll")}
              </div>

              <div className="col-sm-3 col-xs-3 evaluation-list__each-row__score">
                <div className="score-content">{score.score}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
