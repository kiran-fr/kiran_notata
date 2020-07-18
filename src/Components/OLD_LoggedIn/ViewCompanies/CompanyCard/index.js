import React from "react";
import { Link } from "react-router-dom";
import { Mutation } from "react-apollo";
import {
  getInbox,
  getEvaluations
} from "../../../../Apollo/Queries";
import {
  saveInboxItem,
  deleteInboxItem,

  putEvaluation,
  putEvaluation_new,
  deleteEvaluation
} from "../../../../Apollo/Mutations";

import classnames from "classnames";
import {
  infoOverview,
  evaluation_new,
  public_view_evaluation,
  company_details
} from "../../../../routes";
import { button_class } from "../../../elements/Style.module.css";
import {
  container,
  comment_section,
  section,
  section_title,
  section_comments,
  button_section,
  button,
  delete_section,
  delete_class,
  archive_class,
  poma_score,
  poma_each,
  poma_active,
  section_scores,
  section_score_val,
  scores_table,
  scores_row,
  scores_sum,
  scores_cell_1,
  scores_cell_2,
  scores_cell_3,
  scores_cell_4,
  scores_cell_5,
  progress_container,
  color_indicator,
  seen_class
} from "./index.module.css";
import TopSection from "./TopSection";
import EvaluationsToggler from "./EvaluationsToggler";
import Share from "./Share";
import Tags from "./Tags";
import InputTextAreaGray from "../../../elements/InputTextAreaGray";
import EvaluationProgressBar from "../../../elements/EvaluationProgressBar";

const DeleteSection = ({ evaluation }) => {
  return (
    <div className={delete_section}>
      {!evaluation.sharedByEmail && (
        <Mutation mutation={putEvaluation_new}>
          {(mutate, { data, loading, error }) => (
            <div
              className={archive_class}
              onClick={() => {
                let variables = {
                  id: evaluation.id,
                  orgId: evaluation.orgId,
                  input: { archived: !evaluation.archived }
                };
                mutate({
                  variables,
                  optimisticResponse: {
                    __typename: "Mutation",
                    putEvaluation_new: {
                      ...evaluation,
                      archived: !evaluation.archived
                    }
                  }
                });
              }}
            >
              {evaluation.archived ? "Un-archive" : "Archive"}
            </div>
          )}
        </Mutation>
      )}

      {evaluation.sharedByEmail && (
        <Mutation mutation={putEvaluation}>
          {(mutate, { data, loading, error }) => (
            <div
              className={archive_class}
              onClick={() => {
                let variables = {
                  evaluationId: evaluation.id,
                  input: { archived: !evaluation.archived }
                };
                mutate({
                  variables,
                  optimisticResponse: {
                    __typename: "Mutation",
                    putEvaluation: {
                      ...evaluation,
                      archived: !evaluation.archived
                    }
                  }
                });
              }}
            >
              {evaluation.archived ? "Un-archive" : "Archive"}
            </div>
          )}
        </Mutation>
      )}

      {evaluation.archived && (
        <Mutation mutation={deleteEvaluation}>
          {(mutate, { data, loading, error }) => {
            return (
              <div
                className={delete_class}
                onClick={() => {
                  if (loading) return;
                  if (
                    window.confirm(
                      "Are you sure you want to delete this evaluation permanently?"
                    )
                  ) {
                    let variables = { id: evaluation.id };
                    mutate({
                      variables,
                      refetchQueries: [{ query: getEvaluations }]
                    });
                  } else {
                    /* Do nothing */
                  }
                }}
              >
                {loading ? "...deleting" : "Delete permanently"}
              </div>
            );
          }}
        </Mutation>
      )}
    </div>
  );
};

class CommentSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
  }

  render() {
    let { item } = this.props;

    return (
      <div className={comment_section}>
        {item.comments_worries && (
          <div className={section}>
            <div className={section_title}>This worries me:</div>
            <div className={section_comments}>{item.comments_worries}</div>
          </div>
        )}

        {item.comments_excites && (
          <div className={section}>
            <div className={section_title}>This excites me:</div>
            <div className={section_comments}>{item.comments_excites}</div>
          </div>
        )}

        <div className={section}>
          <div className={section_title}>Comments:</div>

          {this.state.editing && (
            <Mutation mutation={putEvaluation_new}>
              {(mutate, { data, loading, error }) => (
                <InputTextAreaGray
                  val={item.comments_other}
                  save={nval => {
                    let variables = {
                      input: { comments_other: nval }
                    };
                    variables.id = item.id;
                    mutate({
                      variables,
                      optimisticResponse: {
                        __typename: "Mutation",
                        putEvaluation_new: {
                          ...item,
                          comments_other: nval
                        }
                      }
                    });
                    this.setState({ editing: false });
                  }}
                />
              )}
            </Mutation>
          )}

          {!this.state.editing && (
            <div
              className={section_comments}
              onClick={() => {
                if (!item.sharedByEmail) {
                  this.setState({ editing: true });
                }
              }}
            >
              {item.comments_other ||
                (!item.sharedByEmail ? "Tap to type..." : "")}
            </div>
          )}
        </div>

        {!item.sharedByEmail && (
          <Mutation mutation={putEvaluation_new}>
            {(mutate, { data, loading, error }) => (
              <div className={section}>
                <div className={section_title}>Subjective score:</div>
                <div className={poma_score}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(p => (
                    <div
                      key={`puma-${p}`}
                      className={classnames(
                        poma_each,
                        item.comments_puma === p ? poma_active : ""
                      )}
                      onClick={() => {
                        let variables = {
                          input: { comments_puma: p }
                        };
                        if (item.comments_puma === p) {
                          variables.input.comments_puma = 0;
                        }

                        variables.id = item.id;
                        // item.sharedByEmail
                        // ? (variables.id = item.id)
                        // : (variables.orgId = item.orgId);
                        mutate({
                          variables,
                          optimisticResponse: {
                            __typename: "Mutation",
                            putEvaluation_new: {
                              ...item,
                              comments_puma: variables.input.comments_puma
                            }
                          }
                        });
                      }}
                    >
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Mutation>
        )}
      </div>
    );
  }
}

const ScoreSection = ({
  scores,
  options,
  totalScore,
  totalProgress,
  totalPotential,
  it
}) => {
  let id = it[0].id;

  if (!scores) return <span />;

  options = options || [];

  const getSid = s => {
    let obj = options.find(o => o.name === s.name);
    return obj ? obj.sid : "no-object";
  };

  return (
    <div className={section}>
      <div className={section_title}>Evalution scores</div>

      <div className={scores_table}>
        {scores.map((s, i) => (
          <div key={`score-${i}`} className={scores_row}>
            <div className={scores_cell_1}>
              <span>{s.name} </span>
              <span>
                <Link to={`${evaluation_new}/${id}/${getSid(s)}`}>
                  <i className="fal fa-external-link-square" />
                </Link>
              </span>
            </div>

            <div className={scores_cell_2}>{s.score}</div>

            <div className={scores_cell_3}>/</div>

            <div className={scores_cell_4}>{s.potential}</div>

            <div className={scores_cell_5}>
              <div className={progress_container}>
                <EvaluationProgressBar
                  percent={Math.round(s.progress)}
                  total={s.score}
                  potential={s.potential}
                  bg="rgba(255,255,255,0.6)"
                />
              </div>
            </div>
          </div>
        ))}

        {
          <div className={classnames(scores_row, scores_sum)}>
            <div className={scores_cell_1}>TOTAL: </div>
            <div className={scores_cell_2}>{totalScore}</div>
            <div className={scores_cell_3}>/</div>
            <div className={scores_cell_4}>{totalPotential}</div>
            <div className={scores_cell_5}>
              <div className={progress_container}>
                <EvaluationProgressBar
                  percent={totalProgress}
                  total={totalScore}
                  potential={totalPotential}
                />
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewingIndex: 0,
      loading: false
    };
  }

  getSelectedTags({ tags, item }) {
    let n_tags = item.n_tags || [];
    let selectedTags = n_tags
      .map(t => tags.find(_t => _t.id === t))
      .filter(t => t);
    return selectedTags;
  }

  getSelectedFunnelTags({ tags, item }) {
    let n_funnel = item.n_funnel || [];
    let selectedFunnelTags = n_funnel
      .map(t => tags.find(_t => _t.id === t))
      .filter(t => t);
    return selectedFunnelTags;
  }


  render() {
    let {
      it,
      history,
      user,
      tags,
      unseen,
      hasEvaluated,
      cardType
    } = this.props;

    let item = it[0];
    let { scores, totalScore, totalProgress, totalPotential } = item;

    return (
      <div
        className={classnames(container, unseen && seen_class)}
      >
        <TopSection
          item={item}
          it={it}
          scores={scores}
          unseen={unseen}
          expanded={this.props.openCards[item.id]}
          expand={() => {
            this.props.toggleOpen(item);
            this.props.markAsSeen(item.id);
          }}
        />

        {
          this.props.openCards[item.id] &&
          cardType === 'inbox' && (
            <div>
              <div className={button_section}>
                <Mutation mutation={saveInboxItem}>
                  {(mutate, { data, loading, error, called }) => {
                    if (data && this.state.loading) {
                      this.setState({loading: false})
                      this.props.openInModal(data.saveInboxItem)
                    }
                    return (
                      <div
                        className={classnames(button_class, button)}
                        onClick={() => {
                          this.setState({loading: true})
                          let variables = { id: item.id };
                          mutate({
                            variables,
                            refetchQueries: [{
                              query: getEvaluations,
                              query: getInbox
                            }]
                          })
                        }}
                      >
                        Save
                      </div>
                    )
                  }}
                </Mutation>


                <Mutation mutation={deleteInboxItem}>
                  {(mutate, { data, loading, error, called }) => {
                    return (
                      <div
                        className={classnames(button_class, button)}
                        onClick={() => {
                          let variables = { id: item.id };
                          mutate({
                            variables,
                            refetchQueries: [{
                              query: getEvaluations,
                              query: getInbox
                            }]
                          })
                        }}
                      >
                        Delete
                      </div>
                    )
                  }}
                </Mutation>                

              
                <Link
                  className={classnames(button_class, button)}
                  to={`${company_details}/${item.id}?inbox=true`}
                >
                  View
                </Link>
              </div>

            </div>
          )
        }



        {/* EXPANDED SECTION */}
        { cardType !== 'inbox' &&
          this.props.openCards[item.id] && (
          <div>
            {/* IF MULTIPLE EVALUATIONS */}
            {!(it.length === 1 && !it[0].sharedByEmail) && (
              <EvaluationsToggler
                it={it}
                item={item}
                openInModal={this.props.openInModal}
                viewingIndex={this.state.viewingIndex}
                setViewingIndex={viewingIndex =>
                  this.setState({ viewingIndex }, () => {
                    this.props.toggleOpen(it[viewingIndex], true);
                  })
                }
                hasEvaluated={hasEvaluated}
                history={history}
              />
            )}

            {/* SHARE BOX */}
            {!item.sharedByEmail && (
              <Share
                orgId={item.orgId}
                evaluationId={item.id}
                timestamp={item.createdAt}
              />
            )}

            {/* TAGS */}
            {!item.sharedByEmail && (
              <Tags
                item={item}
                tags={tags}
                selected={this.getSelectedTags({ tags, item })}
                selected_funnel_tags={this.getSelectedFunnelTags({
                  tags,
                  item
                })}
              />
            )}

            {/* COMMENT SECTION */}
            <CommentSection item={item} />

            {!item.sharedByEmail && (
              <ScoreSection
                scores={scores}
                totalScore={totalScore}
                totalProgress={totalProgress}
                totalPotential={totalPotential}
                options={this.props.options}
                it={this.props.it}
              />
            )}

            {/* BUTTON SECTION */}
            {
              <div className={button_section}>
                {!item.sharedByEmail && (
                  <Link
                    className={classnames(button_class, button)}
                    to={`${evaluation_new}/${item.id}`}
                  >
                    Evaluate
                  </Link>
                )}

                {!item.sharedByEmail && (
                  <Link
                    className={classnames(button_class, button)}
                    to={`${infoOverview}?id=${item.orgId}`}
                  >
                    Facts
                  </Link>
                )}

                <Link
                  className={classnames(button_class, button)}
                  to={
                    item.sharedByEmail
                      ? `${public_view_evaluation}?id=${item.id}&email=${user.email}`
                      : `${company_details}/${item.id}`
                  }
                >
                  View
                </Link>
              </div>
            }

            <DeleteSection evaluation={item} />
          </div>
        )}



      </div>
    );
  }
}

export default Card;









