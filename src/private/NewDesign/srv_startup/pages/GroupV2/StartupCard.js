import React, { useEffect, useState } from "react";
import {
  getEvaluationsByTemplate,
  getSubjectiveScoreSummary,
} from "./_helpers";
import ButtonWithIcon from "../ui-kits/button-with-icon";
import { ICONPOSITION } from "../constants";
import moment from "moment";
import { useLazyQuery, useMutation } from "@apollo/client";
import { connectionGet } from "../../../../Apollo/Queries";
import {
  groupSubjectiveScoreAdd,
  groupSubjectiveScoreRemove,
  groupEvaluationAdd,
  groupEvaluationRemove,
} from "../../../../Apollo/Mutations";

function YourEvaluations({ startup, group }) {
  let connectionId = startup?.connection?.id;

  // Queries
  let [getConnection, { data, loading, error }] = useLazyQuery(connectionGet);

  // Mutations
  let [shareScore] = useMutation(groupSubjectiveScoreAdd);
  let [shareScoreRemove] = useMutation(groupSubjectiveScoreRemove);
  let [shareEvaluation] = useMutation(groupEvaluationAdd);
  let [shareEvaluationRemove] = useMutation(groupEvaluationRemove);

  useEffect(() => {
    if (connectionId) {
      let variables = {
        id: connectionId,
      };
      getConnection({ variables });
    }
  }, [connectionId]);

  let subjectiveScore = data?.connectionGet?.subjectiveScores?.find(
    ({ isMe }) => isMe
  );
  let evaluations =
    data?.connectionGet?.evaluations?.filter(({ isMe }) => isMe) || [];

  let unusedEvaluations = group?.evaluationTemplates?.filter(
    id => !evaluations.some(({ templateId }) => templateId === id)
  );

  let sharedSubjectiveScore = startup?.subjectiveScores.find(
    ({ isMe }) => isMe
  );

  console.log("unusedEvaluations", unusedEvaluations);
  console.log("group?.evaluationTemplates", group?.evaluationTemplates);
  console.log("evaluations", evaluations);

  return (
    <>
      <div className="col-sm-12 your-evaluations-container__score">
        <span className="your-evaluations-container__subjective">
          Subjective Score
        </span>
        <span className="your-evaluations-container__option-container">
          {[...Array(10)].map((elementInArray, index) => {
            return (
              <span
                key={`score-option-id-${index}`}
                className={
                  subjectiveScore?.score === index
                    ? "your-evaluations-container__score-option-active"
                    : "your-evaluations-container__score-option"
                }
              >
                <p>{index + 1}</p>
              </span>
            );
          })}
        </span>
        <span
          className="your-evaluations-container__share-with-group"
          onClick={() => {
            let variables = {
              groupId: group.id,
              creativeId: startup?.creative?.id,
            };
            sharedSubjectiveScore
              ? shareScoreRemove({ variables })
              : shareScore({ variables });
          }}
        >
          {sharedSubjectiveScore ? "Stop Sharing" : "Share With Group"}
        </span>
      </div>
      <div className="col-sm-12 your-evaluations-container__details-heading">
        your evaluations
      </div>

      {
        // MY EVALUATIONS
        evaluations?.map(evaluation => {
          let hit = startup.evaluations?.find(({ id }) => id === evaluation.id);

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
                  <div
                    className="your-evaluations-container__record__share-with-group"
                    onClick={() => {
                      let variables = {
                        groupId: group.id,
                        creativeId: startup?.creative?.id,
                        evaluationId: evaluation.id,
                      };

                      hit
                        ? shareEvaluationRemove({ variables })
                        : shareEvaluation({ variables });
                    }}
                  >
                    {hit ? "Stop Sharing" : "Share With Group"}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      }

      {unusedEvaluations && unusedEvaluations.length && (
        <>
          <div className="col-sm-12 your-evaluations-container__details-heading">
            requested evaluations
          </div>

          {unusedEvaluations.map(evaluation => {
            console.log("evaluation", evaluation);
            return (
              <div className="row" key={evaluation.id}>
                <div className="col-sm-12 your-evaluations-container__record">
                  <div className="col-sm-5 col-xs-7 subjective-score-evaluation-container__name">
                    {evaluation.name}
                  </div>
                  <div className="col-sm-2 col-xs-6 subjective-score-evaluation-container__submitions">
                    <span />
                  </div>
                  <div className="col-sm-1 col-xs-5 subjective-score-evaluation-container__score">
                    <span />
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6">
                    <div className="your-evaluations-container__record__share-with-group">
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

export default function StartupCard({ group, startup, setFullListModal }) {
  // States
  const [expandedTemplates, setExpandedTemplates] = useState({});
  const [subjectiveScoreState, setSubjectiveScoreState] = useState(false);
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [yourEvaluation, setYourEvaluation] = useState(false);
  const [startupDescription, setStartupDescription] = useState(false);

  let subjectiveScoreSummary = getSubjectiveScoreSummary(startup);
  let evaluationsByTemplate = getEvaluationsByTemplate(startup);
  let unreadComments = startup?.log?.map(({ seen }) => !seen) || [];

  return (
    <div className="col-sm-12 col-xs-12 startup-container">
      <div className="card">
        <div className="row">
          {/* startup name */}
          <div className="group-dashboard-container__card-heading startup-heading col-md-6 col-sm-12">
            <div className="startup-container__startup-icon">G</div>
            <span
              onMouseEnter={() => setStartupDescription(true)}
              onMouseLeave={() => setStartupDescription(false)}
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
                  className="share-back"
                  text="SHARING OPTIONS"
                  iconPosition={ICONPOSITION.START}
                />
              </>
            ) : (
              <ButtonWithIcon
                iconName="add"
                className="add-to-deal-flow"
                text="ADD TO DEAL FLOW"
                iconPosition={ICONPOSITION.START}
              />
            )}
          </div>
        </div>

        {/* hover info */}
        {startupDescription && (
          <div className="group-dashboard-container__info-window info-window">
            <div className="group-dashboard-container__info-window__heading">
              Great Startup Inc
            </div>
            <p className="group-dashboard-container__info-window__description">
              Great Startup is a simple tool for investors to evaluate startups
              and engage their network
            </p>
            <div className="group-dashboard-container__info-window__heading">
              Problem
            </div>
            <p className="group-dashboard-container__info-window__description">
              It's hard to avoid unconscious bias when investing in early stage
              startups. A systematic approach to evaluate companies has proven
              to increase the return of investment. Most online platforms are
              focused on startups, while tools for investors are often
              complicated, expensive and lack sharing capabilites. Entering the
              market as a new investor is difficult without open access to a
              network. Notata is the only tool which offers deal flow
              management, collaboration and sharing between investors.
            </p>
            <div className="group-dashboard-container__info-window__heading">
              Solution
            </div>
            <p className="group-dashboard-container__info-window__description">
              A simple and sexy system to evaluate startups on the fly, with
              sharing and collaboration at the core.
            </p>
          </div>
        )}

        {/* startup one liner */}
        <div className="row">
          <p className="startup-container__description">
            Great Startup Inc helps people to find a way to change their
            financial perspectives
          </p>
        </div>

        {/* subjective score */}
        <div className="row subjective-score-container">
          <div className="col-sm-4 col-md-3 col-xs-6 subjective-score-container__subjective-score">
            {/* toggle open */}
            <i
              className={`subjective-score-container__heading__icon
                ${
                  subjectiveScoreState
                    ? "fa fa-chevron-up"
                    : "fa fa-chevron-down"
                }`}
              aria-hidden="true"
              onClick={() => setSubjectiveScoreState(!subjectiveScoreState)}
            />

            {/* subjective score */}
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

            {/* evaluations */}
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
                              onClick={() => setFullListModal(evaluation)}
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
          <div className="col-md-3 col-sm-6 col-xs-5">
            <div className="your-evaluations-container__availability">
              6 available
            </div>
          </div>

          {yourEvaluation && (
            <YourEvaluations startup={startup} group={group} />
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
              {!!unreadComments.length && <span>4 unread comments</span>}
              <i
                className={`fa ${
                  showCommentSection ? "fa-chevron-up" : "fa-chevron-down"
                }`}
                aria-hidden="true"
                onClick={() => setShowCommentSection(!showCommentSection)}
              />
            </div>
          </div>

          {showCommentSection && (
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
                        {moment(logItem.createdAt).fomat("ll")}
                      </span>
                    </div>
                    <div>
                      <p className="comment__comment">
                        {logItem.dataPairs?.[0]?.val}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="col-sm-12 col-xs-12">
                <input type="text" className="comment__write-comment" />
                <i
                  className="comment__send fa fa-paper-plane"
                  aria-hidden="true"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
