import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import {
  connectionSubjectiveScorePut,
  groupEvaluationAdd,
  groupEvaluationRemove,
  groupSubjectiveScoreAdd,
  groupSubjectiveScoreRemove,
} from "../../../../../../Apollo/Mutations";
import ButtonWithIcon from "../../../../../srv_startup/pages/ui-kits/button-with-icon";
import { ICONPOSITION } from "../../../../../srv_startup/pages/constants";
import { evaluate_page } from "../../../../../../../definitions";
import moment from "moment";
import SharingOptionsModal from "../../../../modals/SharingOptionsModal";
import { useHistory } from "react-router-dom";

export default function YourEvaluations({ startup, group }) {
  const history = useHistory();

  let connection = startup?.connection;

  // States
  const [openList, setOpenList] = useState(true);
  const [viewModal, setViewModal] = useState(false);
  const [subjectiveScoreState, setSubjectiveScoreState] = useState();
  const [loadingStates, setLoadingStates] = useState({});

  // Mutations
  let [shareScoreAdd, shareScoreAddRes] = useMutation(groupSubjectiveScoreAdd);
  let [shareScoreRemove, shareScoreRemoveRes] = useMutation(
    groupSubjectiveScoreRemove
  );
  let [shareEvaluationAdd] = useMutation(groupEvaluationAdd);
  let [shareEvaluationRemove] = useMutation(groupEvaluationRemove);
  let [setScore, setScoreRes] = useMutation(connectionSubjectiveScorePut);

  let subjectiveScore = connection?.subjectiveScores?.find(({ isMe }) => isMe);
  let evaluations = connection?.evaluations?.filter(({ isMe }) => isMe) || [];
  let sharedSubjectiveScore = startup?.subjectiveScores?.find(
    ({ isMe }) => isMe
  );

  const canShare = group?.settings?.addEvaluation;

  useEffect(() => {
    if (subjectiveScore) {
      setSubjectiveScoreState(subjectiveScore.score);
    }
  }, [subjectiveScore]);

  if (!startup.isInMyDealFlow) {
    return <span />;
  }

  return (
    <>
      <div className="group-startup-card__your-evaluations">
        <div
          className="group-startup-card__content-section"
          onClick={() => setOpenList(!openList)}
        >
          <div className="group-startup-card__content-section__title">
            YOUR EVALUATIONS
          </div>
          <i
            className={`group-startup-card__content-section__icon ${
              openList ? "fa fa-chevron-down" : "fa fa-chevron-right"
            }`}
            aria-hidden="true"
          />
        </div>

        {openList && (
          <div className="group-startup-card__content-inner">
            <div className="row">
              <div className="col-sm-12 group-startup-card__your-evaluations__subjective">
                Subjective Score
              </div>
            </div>

            {/* Subjective score chooser */}
            <div className="row">
              <div
                className={
                  canShare ? "col-lg-9 col-md-12" : "col-lg-12 col-md-12"
                }
              >
                <div className="group-startup-card__your-evaluations__option-container">
                  {[...Array(10)].map((elementInArray, index) => {
                    return (
                      <span
                        key={`score-option-id-${index}`}
                        className={
                          subjectiveScoreState === index + 1
                            ? "group-startup-card__your-evaluations__score-option-active"
                            : "group-startup-card__your-evaluations__score-option"
                        }
                        onClick={() => {
                          let newScore = index + 1;
                          setSubjectiveScoreState(newScore);
                          if (setScoreRes.loading) {
                            return;
                          }
                          let variables = {
                            id: connection.id,
                            score: newScore,
                          };
                          setScore({ variables });
                        }}
                      >
                        <p>{index + 1}</p>
                      </span>
                    );
                  })}
                </div>
              </div>

              {canShare && (
                <div className="col-lg-3 group-startup-card__your-evaluations__buttons-container">
                  {
                    /* Share subjective score buttons */
                    sharedSubjectiveScore ? (
                      <ButtonWithIcon
                        iconName={
                          shareScoreRemoveRes.loading ? "loop" : "clear"
                        }
                        className="stop-sharing-btn"
                        text="Stop sharing"
                        iconPosition={ICONPOSITION.END}
                        onClick={() => {
                          if (shareScoreRemoveRes.loading) {
                            return;
                          }
                          let variables = {
                            groupId: group.id,
                            creativeId: startup?.creative?.id,
                          };
                          shareScoreRemove({ variables });
                        }}
                      />
                    ) : (
                      <ButtonWithIcon
                        iconName={shareScoreAddRes.loading ? "loop" : "add"}
                        className="sharing-bth"
                        text="Share score"
                        iconPosition={ICONPOSITION.END}
                        onClick={() => {
                          if (shareScoreAddRes.loading) {
                            return;
                          }
                          let variables = {
                            groupId: group.id,
                            creativeId: startup?.creative?.id,
                          };
                          shareScoreAdd({ variables });
                        }}
                      />
                    )
                  }
                </div>
              )}
            </div>

            {
              // YOUR EVALUATIONS
              evaluations.length !== 0 && (
                <>
                  <div className="row">
                    <div className="col-sm-12 group-startup-card__your-evaluations__details-heading">
                      Evaluations
                    </div>
                  </div>

                  {evaluations?.map(evaluation => {
                    let hit = startup.evaluations?.find(
                      ({ id }) => id === evaluation.id
                    );
                    return (
                      <div className="row" key={evaluation.id}>
                        <div className="group-startup-card__your-evaluations__record">
                          <div className="col-lg-5 col-sm-5 col-xs-10 group-startup-card__your-evaluations__name">
                            {evaluation.template?.name}{" "}
                            <i
                              className="fa fa-pen"
                              onClick={() => {
                                let path = `${evaluate_page}/${connection?.id}/${evaluation.template?.id}/${evaluation.id}?groupId=${group.id}`;
                                history.push(path);
                              }}
                            />
                          </div>

                          <div className="col-lg-2 col-sm-5 group-startup-card__your-evaluations__time-stamp">
                            {moment(evaluation.createdAt).format("ll")}
                          </div>

                          <div className="col-lg-1 col-sm-2 col-xs-2 group-startup-card__your-evaluations__score">
                            {evaluation.summary?.scorePercent}%
                          </div>

                          {canShare && (
                            <div className="col-lg-4 col-sm-12 col-xs-12 group-startup-card__your-evaluations__button">
                              {hit ? (
                                <ButtonWithIcon
                                  iconName={
                                    loadingStates[`${evaluation.id}-remove`]
                                      ? "loop"
                                      : "clear"
                                  }
                                  className="stop-sharing-btn"
                                  text="Stop sharing"
                                  iconPosition={ICONPOSITION.END}
                                  onClick={async () => {
                                    let variables = {
                                      groupId: group.id,
                                      creativeId: startup?.creative?.id,
                                      evaluationId: evaluation.id,
                                    };
                                    let lKey = `${evaluation.id}-remove`;
                                    if (loadingStates[lKey]) {
                                      return;
                                    }
                                    setLoadingStates({
                                      ...loadingStates,
                                      [lKey]: true,
                                    });
                                    try {
                                      await shareEvaluationRemove({
                                        variables,
                                      });
                                    } catch (error) {
                                      console.log("error", error);
                                    }
                                    setLoadingStates({
                                      ...loadingStates,
                                      [lKey]: false,
                                    });
                                  }}
                                />
                              ) : (
                                <ButtonWithIcon
                                  iconName={
                                    loadingStates[`${evaluation.id}-add`]
                                      ? "loop"
                                      : "add"
                                  }
                                  className="sharing-bth"
                                  text="Share"
                                  iconPosition={ICONPOSITION.END}
                                  onClick={async () => {
                                    let variables = {
                                      groupId: group.id,
                                      creativeId: startup?.creative?.id,
                                      evaluationId: evaluation.id,
                                    };
                                    let lKey = `${evaluation.id}-add`;
                                    if (loadingStates[lKey]) {
                                      return;
                                    }
                                    setLoadingStates({
                                      ...loadingStates,
                                      [lKey]: true,
                                    });
                                    try {
                                      await shareEvaluationAdd({ variables });
                                    } catch (error) {
                                      console.log("error", error);
                                    }
                                    setLoadingStates({
                                      ...loadingStates,
                                      [lKey]: false,
                                    });
                                  }}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              )
            }

            {canShare && (
              <div className="group-startup-card__your-evaluations__sharing-options">
                <div className="row">
                  <div className="col-sm-12">
                    <ButtonWithIcon
                      iconName={"share"}
                      className="sharing-bth"
                      text="Sharing options"
                      iconPosition={ICONPOSITION.END}
                      onClick={() => {
                        setViewModal(true);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {viewModal && (
        <SharingOptionsModal
          close={() => setViewModal(false)}
          startup={startup}
          group={group}
        />
      )}
    </>
  );
}
