import { Modal } from "Components/UI_Kits";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  groupEvaluationAdd,
  groupEvaluationRemove,
  groupSubjectiveScoreAdd,
  groupSubjectiveScoreRemove,
} from "../../../Apollo/Mutations";
import InputCheckBox from "../../srv_startup/pages/ui-kits/check-box";

export default function SharingOptionsModal({ startup, group, close }) {
  let { connection } = startup;

  const [showEvaluations, setShowEvaluations] = useState(true);

  // Mutations
  const [scoreAdd, scoreAddRes] = useMutation(groupSubjectiveScoreAdd);
  const [scoreRemove, scoreRemoveRes] = useMutation(groupSubjectiveScoreRemove);
  const [evaluationAdd, evaluationAddRes] = useMutation(groupEvaluationAdd);
  const [evaluationRemove, evaluationRemoveRes] = useMutation(
    groupEvaluationRemove
  );

  let sharedSubjectiveScore = !!startup.subjectiveScores?.find(
    ({ isMe }) => isMe
  );

  let sharedEvaluations =
    startup.evaluations?.filter(({ createdByUser }) => createdByUser.isMe) ||
    [];

  let myEvaluations =
    connection?.evaluations?.filter(
      ({ isMe, template }) => isMe && template?.name
    ) || [];

  // Define loading state
  let isLoading =
    scoreAddRes.loading ||
    scoreRemoveRes.loading ||
    evaluationAddRes.loading ||
    evaluationRemoveRes.loading;

  return (
    <Modal
      title="Sharing options"
      submit={close}
      close={close}
      submitTxt="OK"
      closeTxt="CLOSE"
      children={
        <div className="sharing-opions-contianer">
          {isLoading && <div className="loader-blocker" />}
          <div className="question">What do you want to share?</div>
          <div className="options-container">
            <div className="option">
              <InputCheckBox
                checked={sharedSubjectiveScore}
                onChange={() => {
                  if (isLoading) return;

                  // Variables
                  let variables = {
                    groupId: group.id,
                    creativeId: startup?.creative?.id,
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
                  Evaluations{" "}
                  <i
                    className={`fa ${
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
                                groupId: group.id,
                                creativeId: startup?.creative?.id,
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
      }
    />
  );
}
