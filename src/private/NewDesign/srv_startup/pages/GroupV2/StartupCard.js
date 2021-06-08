import React, { useEffect, useState } from "react";
import {
  getEvaluationsByTemplate,
  getSubjectiveScoreSummary,
} from "./_helpers";
import ButtonWithIcon from "../ui-kits/button-with-icon";
import { ICONPOSITION } from "../constants";
import moment from "moment";
import { useMutation } from "@apollo/client";
import {
  groupSubjectiveScoreAdd,
  groupSubjectiveScoreRemove,
  groupEvaluationAdd,
  groupEvaluationRemove,
  connectionSubjectiveScorePut,
  groupLogCreate,
  groupLogMarkConversationAsSeen,
  connectionCreate,
} from "../../../../Apollo/Mutations";

import { groupGetV2 } from "../../../../Apollo/Queries";

import { startup_page } from "../../../../../definitions";
import SharingOptions from "../../../StartupPage/TabPages/Groups/sharing-options";
import { Modal } from "../../../../../Components/UI_Kits";
import { useForm } from "react-hook-form";

function YourEvaluations({ startup, group, history }) {
  let connection = startup?.connection;

  // States
  const [subjectiveScoreState, setSubjectiveScoreState] = useState();

  // Mutations
  let [shareScoreAdd, shareScoreAddRes] = useMutation(groupSubjectiveScoreAdd);
  let [shareScoreRemove, shareScoreRemoveRes] = useMutation(
    groupSubjectiveScoreRemove
  );
  let [shareEvaluationAdd] = useMutation(groupEvaluationAdd);
  let [shareEvaluationRemove] = useMutation(groupEvaluationRemove);
  let [setScore, setScoreRes] = useMutation(connectionSubjectiveScorePut);

  const [loadingStates, setLoadingStates] = useState({});

  let subjectiveScore = connection?.subjectiveScores?.find(({ isMe }) => isMe);

  let evaluations = connection?.evaluations?.filter(({ isMe }) => isMe) || [];

  let unusedEvaluations = group?.evaluationTemplates?.filter(
    ({ id }) => !evaluations.some(({ templateId }) => templateId === id)
  );

  let sharedSubjectiveScore = startup?.subjectiveScores?.find(
    ({ isMe }) => isMe
  );

  useEffect(() => {
    if (subjectiveScore) {
      setSubjectiveScoreState(subjectiveScore.score);
    }
  }, [subjectiveScore]);

  return (
    <>
      <div className="col-sm-12 your-evaluations-container__score">
        <span className="your-evaluations-container__subjective">
          Subjective Score
        </span>

        {/* Subjective score chooser */}
        <span className="your-evaluations-container__option-container">
          {[...Array(10)].map((elementInArray, index) => {
            return (
              <span
                key={`score-option-id-${index}`}
                className={
                  subjectiveScoreState === index + 1
                    ? "your-Evaluations-container__score-option-active"
                    : "your-Evaluations-container__score-option"
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
        </span>

        {
          /* Share subjective score buttons */
          sharedSubjectiveScore ? (
            <ButtonWithIcon
              iconName={shareScoreRemoveRes.loading ? "loop" : "clear"}
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
              text="Share"
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

      {
        // YOUR EVALUATIONS
        evaluations.length !== 0 && (
          <>
            <div className="col-sm-12 your-evaluations-container__details-heading">
              your evaluations
            </div>
            {evaluations?.map(evaluation => {
              let hit = startup.evaluations?.find(
                ({ id }) => id === evaluation.id
              );
              return (
                <div className="row" key={evaluation.id}>
                  <div className="col-sm-12 your-evaluations-container__record">
                    <div className="col-sm-5 col-xs-7 subjective-score-evaluation-container__name">
                      {evaluation.template?.name}
                    </div>
                    <div className="col-sm-2 col-xs-6 subjective-score-evaluation-container__submitions">
                      {moment(evaluation.createdAt).format("ll")}
                    </div>
                    <div className="col-sm-1 col-xs-5 subjective-score-evaluation-container__score">
                      {evaluation.summary?.scorePercent}%
                    </div>
                    <div className="col-md-4 col-sm-4 col-xs-6">
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
                              await shareEvaluationRemove({ variables });
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
                  </div>
                </div>
              );
            })}
          </>
        )
      }

      {unusedEvaluations && !!unusedEvaluations.length && (
        <>
          <div className="col-sm-12 your-evaluations-container__details-heading">
            requested evaluations
          </div>

          {unusedEvaluations.map(template => {
            return (
              <div className="row" key={template.id}>
                <div className="col-sm-12 your-evaluations-container__record">
                  <div className="col-sm-5 col-xs-7 subjective-score-evaluation-container__name">
                    {template.name}
                  </div>
                  <div className="col-sm-2 col-xs-6 subjective-score-evaluation-container__submitions">
                    <span />
                  </div>
                  <div className="col-sm-1 col-xs-5 subjective-score-evaluation-container__score">
                    <span />
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6">
                    <div
                      className="your-evaluations-container__record__share-with-group"
                      onClick={() => {
                        let path = `${startup_page}/${connection?.id}/evaluationV2/template/${template.id}`;
                        history.push(path);
                      }}
                    >
                      Evaluate
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </>
  );
}

function CommentSection({ startup, group }) {
  const [addComment, { error, data, loading }] = useMutation(groupLogCreate);

  const { register, handleSubmit, setValue, formState } = useForm();
  // const { isSubmitting } = formState;

  // Submit comment function
  async function submit({ text }) {
    // If loading or text is empty, return
    if (!text.length || loading) {
      return;
    }

    // Mutation variables
    let variables = {
      groupId: group.id,
      creativeId: startup.creative.id,
      input: {
        logType: "COMMENT",
        dataPairs: [
          {
            key: "text",
            val: text,
          },
        ],
      },
    };

    console.log("variables", variables);

    // Update group object in Apollo cache
    function update(proxy, { data: { groupLogCreate } }) {
      // Get old group data
      const data = proxy.readQuery({
        query: groupGetV2,
        variables: { id: group.id },
      });

      // Predict new group data
      const newData = {
        groupGetV2: {
          ...data?.groupGetV2,
          startups: data?.groupGetV2.startups.map(startup => ({
            ...startup,
            log: [...startup.log, groupLogCreate],
          })),
        },
      };

      // Update cache
      proxy.writeQuery({
        query: groupGetV2,
        variables: { id: group.id },
        data: newData,
      });
    }

    // Clear input field
    setValue("text", "");

    // Mutate, and update cache
    addComment({
      variables,
      update,
    });
  }

  return (
    <div className="comment-container">
      {startup.log?.map(logItem => {
        return (
          <div key={logItem.id} className="col-sm-12 col-xs-12 comment">
            <div>
              <span className="comment__username">
                {logItem.createdByUser?.given_name}{" "}
                {logItem.createdByUser?.family_name}
              </span>
              <span className="comment__datetime">
                {moment(logItem.createdAt).format("ll")}
              </span>
            </div>

            <div>
              <p className="comment__comment">{logItem.dataPairs?.[0]?.val}</p>
            </div>
          </div>
        );
      })}

      <form onSubmit={handleSubmit(submit)}>
        <div className="col-sm-12 col-xs-12">
          <input
            ref={register}
            name="text"
            type="text"
            className="comment__write-comment"
          />

          {!loading && (
            <button
              type="submit"
              className="comment__send fa fa-paper-plane"
              aria-hidden="true"
              value=""
            />
          )}

          {loading && <i className="fal fa-spinner fa-spin" />}
        </div>
      </form>
    </div>
  );
}

export default function StartupCard({
  group,
  startup,
  setFullListModal,
  history,
}) {
  // States
  const [expandedTemplates, setExpandedTemplates] = useState({});
  const [subjectiveScoreState, setSubjectiveScoreState] = useState(false);
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [yourEvaluation, setYourEvaluation] = useState(false);
  const [startupDescription, setStartupDescription] = useState(false);
  const [viewSharingOptions, setViewSharingOptions] = useState();

  // Mutations
  const [markConversationAsSeen] = useMutation(groupLogMarkConversationAsSeen);
  const [createConnection, createConnectionRes] = useMutation(
    connectionCreate,
    {
      refetchQueries: [
        {
          query: groupGetV2,
          variables: { id: group.id },
        },
      ],
      awaitRefetchQueries: true,
    }
  );

  // Data maps
  let subjectiveScoreSummary = getSubjectiveScoreSummary(startup);
  let evaluationsByTemplate = getEvaluationsByTemplate(startup);
  let unreadComments = startup?.log?.filter(({ seen }) => !seen) || [];

  let oneLiner, problem, solution;
  if (startup?.creative?.answers) {
    let _oneLiner = startup?.creative?.answers?.find(
      ({ questionId }) => questionId === "q01_section_info"
    );
    if (_oneLiner) oneLiner = _oneLiner.val;
    let _problem = startup?.creative?.answers?.find(
      ({ questionId }) => questionId === "q02_section_info"
    );
    if (_problem) problem = _problem.val;
    let _solution = startup?.creative?.answers?.find(
      ({ questionId }) => questionId === "q03_section_info"
    );
    if (_solution) solution = _solution.val;
  }
  let noMeta = !oneLiner && !problem && !solution;

  return (
    <>
      <div className="col-sm-12 col-xs-12 startup-container">
        <div className="card">
          <div className="row">
            {/* StartupPage name */}
            <div className="group-dashboard-container__card-heading startup-heading col-md-6 col-sm-12">
              <div className="startup-container__startup-icon">G</div>
              <span
                onMouseEnter={() => setStartupDescription(true)}
                onMouseLeave={() => setStartupDescription(false)}
                onClick={() => {
                  if (startup.connection) {
                    history.push(
                      `${startup_page}/company/${startup.connection.id}`
                    );
                  }
                }}
              >
                {startup?.creative?.name}
              </span>
            </div>

            <div className="col-md-5 col-sm-12 group-dashboard-container__in-my-deal-flow-container">
              {startup.isInMyDealFlow ? (
                <>
                  <span className="group-dashboard-container__in-my-deal-flow">
                    IN MY DEALFLOW
                  </span>
                  <ButtonWithIcon
                    iconName="share"
                    className="stop-sharing-btn"
                    text="SHARING OPTIONS"
                    iconPosition={ICONPOSITION.START}
                    onClick={() => setViewSharingOptions(true)}
                  />
                </>
              ) : (
                <ButtonWithIcon
                  iconName="add"
                  className="add-to-deal-flow"
                  text="ADD TO DEAL FLOW"
                  iconPosition={ICONPOSITION.START}
                  loading={createConnectionRes.loading}
                  onClick={() => {
                    let variables = {
                      groupId: group.id,
                      creativeId: startup?.creative?.id,
                    };
                    createConnection({ variables });
                  }}
                />
              )}
            </div>
          </div>

          {/* hover info */}
          {!noMeta && startupDescription && (
            <div className="group-dashboard-container__info-window info-window">
              <div className="group-dashboard-container__info-window__heading">
                {startup?.creative?.name}
              </div>

              {oneLiner && (
                <p className="group-dashboard-container__info-window__description">
                  {oneLiner}
                </p>
              )}

              {problem && (
                <>
                  <div className="group-dashboard-container__info-window__heading">
                    Problem
                  </div>
                  <p className="group-dashboard-container__info-window__description">
                    {problem}
                  </p>
                </>
              )}

              {solution && (
                <>
                  <div className="group-dashboard-container__info-window__heading">
                    Solution
                  </div>
                  <p className="group-dashboard-container__info-window__description">
                    {solution}
                  </p>
                </>
              )}
            </div>
          )}

          {/* StartupPage one liner */}
          <div className="row">
            <p className="startup-container__description">{oneLiner || ""}</p>
          </div>

          {startup.evaluationSummaries &&
            !!startup.evaluationSummaries.length &&
            subjectiveScoreSummary && (
              <>
                {/* subjective score */}
                <div className="row subjective-score-container">
                  {/* toggle open */}
                  <div style={{ position: "relative " }}>
                    <i
                      className={`subjective-score-container__heading__icon
                  ${
                    subjectiveScoreState
                      ? "fa fa-chevron-up"
                      : "fa fa-chevron-down"
                  }`}
                      aria-hidden="true"
                      onClick={() =>
                        setSubjectiveScoreState(!subjectiveScoreState)
                      }
                    />
                  </div>

                  {/* subjective score */}
                  {subjectiveScoreSummary && (
                    <div className="col-sm-4 col-md-3 col-xs-6 subjective-score-container__subjective-score">
                      <div className="subjective-score-container__heading">
                        subjective score
                      </div>

                      <div className="subjective-score-container__score">
                        {subjectiveScoreSummary?.average}
                      </div>

                      <div className="subjective-score-container__highest-lowest-score">
                        <div className="subjective-score-container__highest-lowest-score__record">
                          <span className="material-icons north">north</span>
                          <span className="subjective-score-container__highest-lowest-score__score highest">
                            {subjectiveScoreSummary?.max}
                          </span>
                          <span className="subjective-score-container__highest-lowest-score__type">
                            highest
                          </span>
                        </div>
                        <div className="subjective-score-container__highest-lowest-score__record">
                          <span className="material-icons south">south</span>
                          <span className="subjective-score-container__highest-lowest-score__score lowest">
                            {subjectiveScoreSummary?.min}
                          </span>
                          <span className="subjective-score-container__highest-lowest-score__type">
                            lowest
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/*</div>*/}

                  {/* ... end subjective score */}
                  {startup.evaluationSummaries?.map(summary => {
                    return (
                      <div className="col-sm-6 col-md-3 col-xs-6">
                        <div className="subjective-score-container__heading subjective-score-container__evaluations-heading">
                          {summary.templateName}
                        </div>
                        <div className="subjective-score-container__score">
                          {summary.averagePercentageScore}%
                        </div>
                        <div className="subjective-score-container__highest-lowest-score">
                          <div className="subjective-score-container__highest-lowest-score__record">
                            <span className="material-icons north">north</span>
                            <span className="subjective-score-container__highest-lowest-score__score highest">
                              {summary.highestScore}
                            </span>
                            <span className="subjective-score-container__highest-lowest-score__type">
                              highest
                            </span>
                          </div>
                          <div className="subjective-score-container__highest-lowest-score__record">
                            <span className="material-icons south">south</span>
                            <span className="subjective-score-container__highest-lowest-score__score lowest">
                              {summary.lowestScore}
                            </span>
                            <span className="subjective-score-container__highest-lowest-score__type">
                              lowest
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {subjectiveScoreState && (
                  <>
                    {/* subjective score */}
                    <div className="row subjective-score-evaluation-container">
                      <i
                        className={`subjective-score-evaluation-container__icon fa fa-chevron-down`}
                        aria-hidden="true"
                        onClick={() => null}
                      />
                      <div className="col-sm-6 col-xs-9 subjective-score-evaluation-container__name">
                        Subjective Score
                      </div>

                      <div className="col-sm-3 col-xs-9 subjective-score-evaluation-container__submitions">
                        {startup.subjectiveScores?.length} submissions
                      </div>
                      <div className="col-sm-3 col-xs-3 subjective-score-evaluation-container__score">
                        {subjectiveScoreSummary?.average}
                      </div>
                    </div>

                    {/* Evaluations */}
                    <div className="row evaluation-container">
                      <div className="col-sm-12 evaluation-container__heading">
                        EVALUATIONS
                      </div>
                    </div>

                    {evaluationsByTemplate?.map(({ summary, evaluations }) => {
                      return (
                        <>
                          <div
                            className="row evaluation-container"
                            key={summary.templateId}
                          >
                            {/* toggle open */}
                            <i
                              className={`subjective-score-evaluation-container__icon 
                            ${
                              expandedTemplates[summary.templateId]
                                ? "fa fa-chevron-up"
                                : "fa fa-chevron-down"
                            }`}
                              aria-hidden="true"
                              onClick={() =>
                                setExpandedTemplates({
                                  ...expandedTemplates,
                                  [summary.templateId]: !expandedTemplates[
                                    summary.templateId
                                  ],
                                })
                              }
                            />

                            <div className="col-sm-6 col-xs-9 subjective-score-evaluation-container__name">
                              {summary.templateName}
                            </div>
                            <div className="col-sm-3 col-xs-9 subjective-score-evaluation-container__submitions">
                              {evaluations.length} submitions
                            </div>
                            <div className="col-sm-3 col-xs-3 subjective-score-evaluation-container__score">
                              {summary.averagePercentageScore}%
                            </div>
                          </div>

                          {expandedTemplates[summary.templateId] &&
                            evaluations.map(evaluation => {
                              return (
                                <div
                                  className="row evaluation-list-container"
                                  key={evaluation.id}
                                >
                                  <div className="col-sm-6 col-xs-9 subjective-score-evaluation-container__username">
                                    {evaluation.createdByUser?.given_name}{" "}
                                    {evaluation.createdByUser?.family_name}
                                  </div>
                                  <div className="col-sm-3 col-xs-9 subjective-score-evaluation-container__submitions">
                                    {moment(evaluation.updatedAt).format("ll")}
                                  </div>
                                  <div className="col-sm-3 col-xs-3 subjective-score-evaluation-container__score">
                                    {evaluation.summary?.scorePercent}%{" "}
                                    <span
                                      className="full-list"
                                      onClick={() =>
                                        setFullListModal(evaluation)
                                      }
                                    >
                                      Full list
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                        </>
                      );
                    })}
                  </>
                )}
              </>
            )}

          {/*Only show "your Evaluations" if StartupPage is in deal flow*/}
          {startup.isInMyDealFlow && (
            <div className="row your-evaluations-container">
              <div className="col-md-4 col-sm-6 col-xs-7">
                <i
                  className={`your-evaluations-container__icon fa ${
                    yourEvaluation ? "fa-chevron-up" : "fa-chevron-down"
                  }`}
                  aria-hidden="true"
                  onClick={() => setYourEvaluation(!yourEvaluation)}
                />
                <div className="your-evaluations-container__heading">
                  YOUR EVALUATIONS
                </div>
              </div>

              {yourEvaluation && (
                <YourEvaluations
                  startup={startup}
                  group={group}
                  history={history}
                />
              )}

              <div
                className={`col-md-5 col-sm-12 col-xs-12 your-evaluations-container__comment-section ${
                  yourEvaluation ? "your-evaluation-open" : ""
                }`}
              >
                <i
                  className="your-evaluations-container__icon fa fa-comment"
                  aria-hidden="true"
                  onClick={() => null}
                />

                <div className="your-evaluations-container__message-count">
                  {startup?.log?.length || 0}
                </div>

                <div className="your-evaluations-container__show-comments">
                  {!!unreadComments.length && (
                    <span>{unreadComments.length} unread comments</span>
                  )}
                  <i
                    className={`fa ${
                      showCommentSection ? "fa-chevron-up" : "fa-chevron-down"
                    }`}
                    aria-hidden="true"
                    onClick={() => {
                      if (!showCommentSection) {
                        let variables = {
                          groupId: group.id,
                          creativeId: startup.creative.id,
                        };
                        markConversationAsSeen({ variables });
                      }
                      setShowCommentSection(!showCommentSection);
                    }}
                  />
                </div>
              </div>

              {showCommentSection && (
                <CommentSection startup={startup} group={group} />
              )}
            </div>
          )}
        </div>
      </div>

      {viewSharingOptions && (
        <Modal
          title="Sharing options"
          submit={() => {
            setViewSharingOptions(false);
          }}
          close={() => {
            setViewSharingOptions(false);
          }}
          submitTxt="OK"
          closeTxt="CLOSE"
          children={
            <SharingOptions
              groupId={group.id}
              creativeId={startup.creative.id}
              connection={startup.connection}
              sharedSubjectiveScore={
                !!startup.subjectiveScores?.find(({ isMe }) => isMe)
              }
              sharedEvaluations={
                startup.evaluations?.filter(
                  ({ createdByUser }) => createdByUser.isMe
                ) || []
              }
            />
          }
          // innerClassName="invite-member-modal"
        />
      )}
    </>
  );
}
