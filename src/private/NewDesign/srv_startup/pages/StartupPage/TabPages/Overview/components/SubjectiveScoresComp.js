import React, { useState } from "react";
import moment from "moment";
import SubjectiveScoreModal from "../../../../../../Startup/Modal/SubjectiveScoreModal";

const getFilteredArray = (scores, isMe) => {
  return scores?.filter(i => i.isMe === isMe) || [];
};

const getScore = (scores, getMax) => {
  if (Array.isArray(scores) && scores.length > 0) {
    return getMax
      ? Math.max(...scores?.map(i => i.score || 0))
      : Math.min(...scores?.map(i => i.score || 0));
  }
  return 0;
};

const getTotalScore = arr => {
  if (Array.isArray(arr) && arr.length > 0) {
    return arr?.reduce((acc, obj) => {
      return acc + (obj.score || 0);
    }, 0);
  }
  return 0;
};

export default function SubjectiveScoresComp({ connection }) {
  const [showSubjectiveScore, setShowSubjectiveScore] = useState();

  let teamScoreArr = getFilteredArray(connection.subjectiveScores, false);
  let teamMaxScore = getScore(teamScoreArr, true);
  let teamMinScore = getScore(teamScoreArr, false);
  let teamAvg = (
    getTotalScore(teamScoreArr) / teamScoreArr.length || 0
  ).toFixed(1);

  let myScoreArr = getFilteredArray(connection.subjectiveScores, true);
  let myAvgScore = (getTotalScore(myScoreArr) / myScoreArr.length || 0).toFixed(
    1
  );

  return (
    <>
      <div className="row overview-container__scores">
        <div className="overview-container__scores__heading">
          Subjective Scores
        </div>
        <div className="col-sm-6 col-md-3 col-xs-12 overview-container__scores__label">
          <div>
            You
            <span className="your_updated-date-tag">
              {connection?.updatedAt
                ? moment(connection?.updatedAt).format("ll")
                : ""}
            </span>
          </div>

          <div>
            <span className="score selected you">{parseFloat(myAvgScore)}</span>
            <i
              onClick={() => setShowSubjectiveScore(true)}
              className=" editMarker fas fa-pen"
            />
          </div>
        </div>

        <div className="col-sm-6 col-md-4 col-xs-6 overview-container__scores__label">
          <div>Your Team</div>
          <div className="score">{parseFloat(teamAvg)}</div>
          <div className="highest-score">
            {teamMaxScore} <span className="highest">HIGHEST</span>
          </div>
          <div className="lowest-score">
            {teamMinScore} <span className="lowest">LOWEST</span>
          </div>
        </div>
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
