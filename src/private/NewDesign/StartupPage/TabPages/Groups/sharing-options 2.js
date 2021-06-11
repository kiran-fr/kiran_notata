import React, { useEffect, useState } from "react";
import "./sharing-options.scss";
import InputCheckBox from "../../../srv_startup/pages/ui-kits/check-box";
import { useMutation } from "@apollo/client";
import {
  groupSubjectiveScoreAdd,
  groupSubjectiveScoreRemove,
  groupEvaluationAdd,
  groupEvaluationRemove,
} from "../../../../Apollo/Mutations";

export default function SharingOptions({
  groupId,
  creativeId,
  connection,
  sharedSubjectiveScore,
  sharedEvaluations,
}) {
  let myEvaluations = connection?.evaluations?.filter(({ isMe }) => isMe) || [];
  myEvaluations = myEvaluations.filter(({ template }) => template?.name);

  // Mutations
  const [scoreAdd, scoreAddRes] = useMutation(groupSubjectiveScoreAdd);
  const [scoreRemove, scoreRemoveRes] = useMutation(groupSubjectiveScoreRemove);
  const [evaluationAdd, evaluationAddRes] = useMutation(groupEvaluationAdd);
  const [evaluationRemove, evaluationRemoveRes] = useMutation(
    groupEvaluationRemove
  );

  // Define loading state
  let isLoading =
    scoreAddRes.loading ||
    scoreRemoveRes.loading ||
    evaluationAddRes.loading ||
    evaluationRemoveRes.loading;

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
                groupId: groupId,
                creativeId: creativeId,
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

        {!myEvaluations.length && (
          <div className="option" style={{ paddingTop: "15px" }}>
            You have not evaluated this startup.
          </div>
        )}

        {!!myEvaluations.length && (
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
                {myEvaluations.map(evaluation => {
                  let hasShared = !!sharedEvaluations?.find(
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
                            groupId: groupId,
                            creativeId: creativeId,
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
