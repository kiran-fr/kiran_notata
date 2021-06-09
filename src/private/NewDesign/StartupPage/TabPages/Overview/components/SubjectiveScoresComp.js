import React, { useState } from "react";
import SubjectiveScoreModal from "../../../../Startup/Modal/SubjectiveScoreModal";
import { AddScore } from "../../../../Startup/DealFlow/addScore";

const getScoreSummaries = scores => {
  if (Array.isArray(scores) && scores.length > 0) {
    let max = Math.max(...scores?.map(i => i.score || 0));
    let min = Math.min(...scores?.map(i => i.score || 0));

    let total = scores?.reduce((scores, obj) => {
      return scores + (obj.score || 0);
    }, 0);

    let average = (total / (scores.length || 0)).toFixed(1);

    let myScore = scores.find(({ isMe }) => isMe)?.score;

    return {
      max,
      min,
      total,
      average,
      myScore,
    };
  }

  return {};
};

export default function SubjectiveScoresComp({ connection, user, account }) {
  const [showSubjectiveScore, setShowSubjectiveScore] = useState();

  let isTeamAccount = account?.members?.length !== 1;

  let { min, max, average } = getScoreSummaries(connection.subjectiveScores);

  return (
    <>
      <div className="row overview-container__scores">
        <div className="overview-container__scores__heading">
          Subjective Scores
        </div>

        <div className="col-sm-12 col-md-12 col-xs-12 overview-container__scores__selector">
          <AddScore connection={connection} />
        </div>

        {isTeamAccount && connection.subjectiveScores?.length > 1 && (
          <div className="col-sm-6 col-md-4 col-xs-6 overview-container__scores__label">
            <div>Your Team</div>
            <div className="score">{average}</div>
            <div className="highest-score">
              {max} <span className="highest">HIGHEST</span>
            </div>
            <div className="lowest-score">
              {min} <span className="lowest">LOWEST</span>
            </div>
          </div>
        )}
      </div>

      {showSubjectiveScore && (
        <SubjectiveScoreModal
          connection={connection}
          close={() => setShowSubjectiveScore(undefined)}
        />
      )}
    </>
  );
}
