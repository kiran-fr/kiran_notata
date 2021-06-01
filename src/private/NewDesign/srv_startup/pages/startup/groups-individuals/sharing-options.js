import React, { useEffect, useState } from "react";
import "./sharing-options.scss";
import InputCheckBox from "../../ui-kits/check-box";
import { useMutation } from "@apollo/client";
import {
  groupSubjectiveScoreAdd,
  groupSubjectiveScoreRemove,
  groupEvaluationAdd,
  groupEvaluationRemove,
} from "../../../../../Apollo/Mutations";

export default function SharingOptions({ group, startup }) {
  const [scoreAdd, scoreAddRes] = useMutation(groupSubjectiveScoreAdd);
  const [scoreRemove, scoreRemoveRes] = useMutation(groupSubjectiveScoreRemove);
  const [evaluationAdd, evaluationAddRes] = useMutation(groupEvaluationAdd);
  const [evaluationRemove, evaluationRemoveRes] = useMutation(
    groupEvaluationRemove
  );

  let isLoading =
    scoreAddRes.loading ||
    scoreRemoveRes.loading ||
    evaluationAddRes.loading ||
    evaluationRemoveRes.loading;

  const [initialShared, setInitialShared] = useState({});

  let sharedSubjectiveScore = startup?.subjectiveScores.find(
    ({ isMe }) => isMe
  );

  let evaluations =
    startup?.connection?.evaluations?.filter(({ isMe }) => isMe) || [];
  evaluations = evaluations.filter(({ template }) => template?.name);

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
      {isLoading && <div className="loader-blocker" />}

      <div className="question">What do you want to share?</div>
      <div className="options-container">
        <div className="option">
          <InputCheckBox
            checked={!!sharedSubjectiveScore}
            onChange={() => {
              if (isLoading) return;

              // Variables
              let variables = {
                groupId: group.id,
                creativeId: startup.creative.id,
              };

              // Remove subjective score
              if (sharedSubjectiveScore) {
                scoreRemove({ variables });
              }

              // Add subjective score
              if (!sharedSubjectiveScore) {
                scoreAdd({ variables });
              }
            }}
          />
          Subjective Score
        </div>

        {!evaluations.length && (
          <div className="option" style={{ paddingTop: "15px" }}>
            You have not evaluated this startup.
          </div>
        )}

        {!!evaluations.length && (
          <>
            <div className="option">
              {/*<InputCheckBox />*/}
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
                {evaluations.map(evaluation => {
                  let hasShared = !!startup?.evaluations?.find(
                    ev => ev.id === evaluation.id
                  );
                  return (
                    <div className="option" key={evaluation.id}>
                      <InputCheckBox
                        checked={hasShared}
                        onChange={() => {
                          if (isLoading) return;

                          // Variables
                          let variables = {
                            evaluationId: evaluation.id,
                            groupId: group.id,
                            creativeId: startup.creative.id,
                          };

                          // Remove evaluation
                          if (hasShared) {
                            evaluationRemove({ variables });
                          }

                          // Add evaluation
                          if (!hasShared) {
                            evaluationAdd({ variables });
                          }
                        }}
                      />
                      {evaluation?.template?.name || ""}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
