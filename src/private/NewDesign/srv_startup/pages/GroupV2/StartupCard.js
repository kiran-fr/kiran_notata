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

import { evaluate_page, startup_page } from "../../../../../definitions";
import SharingOptions from "../../../StartupPage/TabPages/Groups/sharing-options";
import { Modal } from "../../../../../Components/UI_Kits";
import { useForm } from "react-hook-form";
import { AddScore } from "private/NewDesign/Startup/DealFlow/addScore";

function RequestedEvaluations({ startup, group, history }) {
  let connection = startup?.connection;

  let evaluations = connection?.evaluations?.filter(({ isMe }) => isMe) || [];

  let unusedEvaluations = group?.evaluationTemplates?.filter(
    ({ id }) => !evaluations.some(({ templateId }) => templateId === id)
  );

  if (!unusedEvaluations.length) {
    return <span />;
  }

  return (
    <div className="row requested-evaluations-container">
      <div className="col-sm-12">
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
                      let path = `${evaluate_page}/${connection?.id}/${template.id}?groupId=${group.id}`;
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
      </div>
    </div>
  );
}

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

  // let unusedEvaluations = group?.evaluationTemplates?.filter(
  //   ({ id }) => !evaluations.some(({ templateId }) => templateId === id)
  // );

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
                    ? "your-evaluations-container__score-option-active"
                    : "your-evaluations-container__score-option"
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
        {/* <AddScore connection={connection} /> */}
        {/* <AddScore connection={connection} /> */}

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
                      {evaluation.template?.name}{" "}
                      <i
                        className="fa fa-pen"
                        onClick={() => {
                          let path = `${evaluate_page}/${connection?.id}/${evaluation.template?.id}/${evaluation.id}?groupId=${group.id}`;
                          history.push(path);
                        }}
                      />
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

      {/*{unusedEvaluations && !!unusedEvaluations.length && (*/}
      {/*  <>*/}
      {/*    <div className="col-sm-12 your-evaluations-container__details-heading">*/}
      {/*      requested evaluations*/}
      {/*    </div>*/}

      {/*    {unusedEvaluations.map(template => {*/}
      {/*      return (*/}
      {/*        <div className="row" key={template.id}>*/}
      {/*          <div className="col-sm-12 your-evaluations-container__record">*/}
      {/*            <div className="col-sm-5 col-xs-7 subjective-score-evaluation-container__name">*/}
      {/*              {template.name}*/}
      {/*            </div>*/}
      {/*            <div className="col-sm-2 col-xs-6 subjective-score-evaluation-container__submitions">*/}
      {/*              <span />*/}
      {/*            </div>*/}
      {/*            <div className="col-sm-1 col-xs-5 subjective-score-evaluation-container__score">*/}
      {/*              <span />*/}
      {/*            </div>*/}
      {/*            <div className="col-md-4 col-sm-6 col-xs-6">*/}
      {/*              <div*/}
      {/*                className="your-evaluations-container__record__share-with-group"*/}
      {/*                onClick={() => {*/}
      {/*                  let path = `${evaluate_page}/${connection?.id}/${template.id}?groupId=${group.id}`;*/}
      {/*                  history.push(path);*/}
      {/*                }}*/}
      {/*              >*/}
      {/*                Evaluate*/}
      {/*              </div>*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*        </div>*/}
      {/*      );*/}
      {/*    })}*/}
      {/*  </>*/}
      {/*)}*/}
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
    <div className="commentBox">
      <div className="comments">
        {startup.log?.map(logItem => {
          return (
            <div className="comment">
              <div className="commentHead">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0)">
                    <path
                      d="M21.9208 17.2663L20.6431 13.5476C21.259 12.2885 21.5845 10.8883 21.5866 9.47935C21.5904 7.02957 20.6426 4.71325 18.9178 2.95711C17.1926 1.20063 14.8936 0.211878 12.4444 0.173077C9.90475 0.132944 7.51757 1.09897 5.7229 2.89361C3.99237 4.62409 3.03253 6.90543 3.00215 9.34331C1.29655 10.6275 0.28983 12.6296 0.293139 14.7681C0.294729 15.7689 0.519971 16.7636 0.946781 17.6632L0.0666502 20.2245C-0.0846431 20.6648 0.0258727 21.1429 0.3551 21.4721C0.586788 21.7038 0.892253 21.8272 1.2064 21.8272C1.33857 21.8272 1.47229 21.8054 1.6027 21.7605L4.16403 20.8804C5.06358 21.3072 6.05835 21.5325 7.0591 21.534C7.06271 21.534 7.06614 21.534 7.06975 21.534C9.24011 21.534 11.2575 20.5013 12.537 18.7539C13.8685 18.7188 15.1858 18.3965 16.3768 17.8139L20.0955 19.0917C20.2504 19.1449 20.4093 19.1709 20.5664 19.1709C20.9397 19.1709 21.3027 19.0243 21.5781 18.7488C21.9693 18.3576 22.1006 17.7895 21.9208 17.2663ZM7.06967 20.2245C7.06687 20.2245 7.06391 20.2245 7.06112 20.2245C6.17536 20.2232 5.29574 20.0048 4.51753 19.5931C4.35752 19.5085 4.16966 19.4938 3.99856 19.5526L1.37217 20.4551L2.27465 17.8288C2.33343 17.6576 2.31882 17.4698 2.23417 17.3098C1.82244 16.5315 1.60407 15.652 1.6027 14.7662C1.60051 13.3413 2.15476 11.9909 3.12401 10.9797C3.44061 12.9096 4.36044 14.6881 5.78623 16.0886C7.2015 17.4786 8.98049 18.3637 10.9 18.6531C9.88645 19.6521 8.52021 20.2245 7.06967 20.2245ZM20.652 17.8229C20.6148 17.8601 20.5706 17.8703 20.5209 17.8532L16.54 16.4852C16.4708 16.4614 16.3989 16.4497 16.3272 16.4497C16.2216 16.4497 16.1163 16.4752 16.021 16.5257C14.8844 17.127 13.5999 17.4459 12.3065 17.4479C12.3022 17.4479 12.2984 17.4479 12.2941 17.4479C7.96015 17.4479 4.38029 13.9273 4.31163 9.59434C4.27704 7.41217 5.10711 5.36131 6.64887 3.81954C8.19064 2.27778 10.2418 1.44801 12.4237 1.48238C16.7608 1.55117 20.2838 5.13765 20.2771 9.47729C20.2751 10.7707 19.9562 12.0552 19.355 13.1918C19.2703 13.3517 19.2557 13.5396 19.3145 13.7108L20.6824 17.6917C20.6995 17.7416 20.6892 17.7857 20.652 17.8229Z"
                      fill="#53CAB2"
                    />
                    <path
                      d="M16.1945 5.99609H8.39304C8.03141 5.99609 7.73828 6.28927 7.73828 6.65085C7.73828 7.01248 8.03146 7.30561 8.39304 7.30561H16.1945C16.5561 7.30561 16.8492 7.01244 16.8492 6.65085C16.8492 6.28927 16.5561 5.99609 16.1945 5.99609Z"
                      fill="#53CAB2"
                    />
                    <path
                      d="M16.1945 8.6875H8.39304C8.03141 8.6875 7.73828 8.98068 7.73828 9.34226C7.73828 9.70384 8.03146 9.99702 8.39304 9.99702H16.1945C16.5561 9.99702 16.8492 9.70384 16.8492 9.34226C16.8492 8.98068 16.5561 8.6875 16.1945 8.6875Z"
                      fill="#53CAB2"
                    />
                    <path
                      d="M13.1915 11.3789H8.39304C8.03141 11.3789 7.73828 11.6721 7.73828 12.0337C7.73828 12.3953 8.03146 12.6884 8.39304 12.6884H13.1915C13.5531 12.6884 13.8462 12.3952 13.8462 12.0337C13.8462 11.6721 13.5531 11.3789 13.1915 11.3789Z"
                      fill="#53CAB2"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <rect width="22" height="22" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <div className="commentUserName">
                  {logItem.createdByUser?.given_name}{" "}
                  {logItem.createdByUser?.family_name}
                </div>
              </div>

              <div>
                <div className="commentText">{logItem.dataPairs?.[0]?.val}</div>
              </div>

              <div className="commentTime">
                {moment(logItem.createdAt).format("lll")}{" "}
                {logItem.createdAt !== logItem.updatedAt && (
                  <span>(edited)</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit(submit)}>
        <div className="commentInput">
          <input ref={register} name="text" type="text" />
          {!loading && (
            <button type="submit" aria-hidden="true" value="">
              <i className="fa fa-paper-plane" />
            </button>
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
            </div>
          )}

          <RequestedEvaluations
            startup={startup}
            group={group}
            history={history}
          />

          <div className="row your-evaluations-container">
            {/*<div className="col-md-4 col-sm-6 col-xs-7">*/}
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
            {/*</div>*/}
          </div>
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
