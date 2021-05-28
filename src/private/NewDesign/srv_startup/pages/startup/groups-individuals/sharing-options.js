import React, { useEffect, useState } from "react";
import "./sharing-options.scss";
import InputCheckBox from "../../ui-kits/check-box";

export default function SharingOptions({ group, startup }) {
  const [initialShared, setInitialShared] = useState({});

  let sharedSubjectiveScore = startup?.subjectiveScores.find(
    ({ isMe }) => isMe
  );

  let evaluations =
    startup?.connection?.evaluations?.filter(({ isMe }) => isMe) || [];

  useEffect(() => {
    for (let evaluation of evaluations) {
      let hit = startup?.evaluations?.find(ev => ev.id === evaluation.id);
      if (hit) {
        setInitialShared({
          ...initialShared,
          [evaluation.id]: true,
        });
      }
    }
  }, [startup]);

  const [showEvaluations, setShowEvaluations] = useState(true);
  return (
    <div className="sharing-opions-contianer">
      <div className="question">What do you want to share?</div>
      <div className="options-container">
        <div className="option">
          <InputCheckBox checked={!!sharedSubjectiveScore} />
          Subjective Score
        </div>

        <div className="option">
          <InputCheckBox />
          Evaluations{" "}
          <i
            class={`fa ${
              !showEvaluations ? "fa-chevron-up" : "fa-chevron-down"
            }`}
            aria-hidden="true"
            onClick={() => setShowEvaluations(!showEvaluations)}
          />
        </div>
        {showEvaluations && (
          <div className="evaluation-options-container">
            {evaluations.map(evaluation => (
              <div className="option" key={evaluation.id}>
                <InputCheckBox
                  checked={!!initialShared[evaluation.id]}
                  onChange={() => {
                    setInitialShared({
                      ...initialShared,
                      [evaluation.id]: !initialShared[evaluation.id],
                    });
                  }}
                />
                {evaluation?.template?.name || ""}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
