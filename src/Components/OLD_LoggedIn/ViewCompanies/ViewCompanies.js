import React from "react";
import { Link } from "react-router-dom";
import { Query, Mutation } from "react-apollo";
import { adopt } from "react-adopt";
import moment from "moment";
import {
  getEvaluations,
  getEvaluationOptions,
  getEvaluationQuestions,
  getTags,
  getSettings,
  getFilters,
  // getUser,
  getInbox,
  userGet
} from "../../../Apollo/Queries";
import {
  markAsSeen,
  markAllAsSeen,
  markSharingAsSeen,
  putEvaluation_new,
  putFilters
} from "../../../Apollo/Mutations";

import { GhostLoader } from "../../elements/GhostLoader";
import BackButton from "../../elements/BackButton";

import { newCompany, reporting } from "../../../routes";

import FilterSection from "./FilterSection/";
import Card from "./CompanyCard/";
import { button_class } from "../../elements/Style.module.css";
import NewCompanyModal from "./NewCompanyModal/NewCompanyModal";

import {
  cards_class,
  no_content_container,
  boo_icon,
  boo_text,
  boo_text_2,
  go_to_report,
  go_to_report_inner,
  count_line,
  mark_as_seen
} from "./ViewCompanies.module.css";

const getScore = ({ question, answers }) => {


  if (!question || !question.input_type) return 0;

  // TRAFFIC LIGHT SCORE
  // –––––––––––––––––––
  if (question.input_type === "TRAFFIC_LIGHTS") {
    let answer = answers.find(a => a.input_type === "TRAFFIC_LIGHTS");
    if (answer && answer.val === "red") return 0;
    if (answer && answer.val === "yellow") return 1;
    if (answer && answer.val === "green") return 2;
  }

  // RADIO SCORE
  // –––––––––––
  if (question.input_type === "RADIO") {
    // Answer stored on evaluation
    let givenAnswer = answers.find(a => a.input_type === "RADIO");

    if (!givenAnswer) return 0;

    // Answer stored on input form
    let matchedAnswer = question.options.find(o => o.sid === givenAnswer.sid);

    return matchedAnswer.score || 0;
  }

  // CHECK SCORE
  // –––––––––––
  if (question.input_type === "CHECK") {
    // Answer stored on evaluation
    let givenAnswers = answers.filter(a => a.input_type === "CHECK");

    if (!givenAnswers.length) return 0;

    // Answer stored on input form
    let matchedAnswers = question.options.filter(o =>
      givenAnswers.some(ga => ga.sid === o.sid)
    );

    let score = 0;
    for (let ma of matchedAnswers) {
      score += ma.score || 0;
    }
  }

  return 0;
};

const getPotentialScore = ({ question }) => {

  if (!question || !question.input_type) return 0;
  
  // TRAFFIC LIGHT SCORE
  // –––––––––––––––––––
  if (question.input_type === "TRAFFIC_LIGHTS") return 2;

  // RADIO SCORE
  // –––––––––––
  if (question.input_type === "RADIO") {
    // Get highest number in array
    return Math.max(...question.options.map(o => o.score));
  }

  // CHECK SCORE
  // –––––––––––
  if (question.input_type === "CHECK") {
    if (!question.options.length) return 0;

    return question.options.reduce((total, o) => {
      let tot = parseInt(total) || total.score || 0;
      return tot + (o.score >= 0 ? o.score : 0);
    });
  }

  return 0;
};

const getProgress = (option, evaluation) => {
  let total = 0;
  for (let op of option.options) {
    if ((evaluation.options || []).some(eo => eo.questionID === op.id)) {
      total += 1;
    }
  }
  return (total / option.options.length) * 100;
};

const getEvaluationScores = ({ options, questions, evaluation }) => {
  return options.map(o => {
    let name = o.name;
    let score = 0;
    let potential = 0;
    let answersLength = 0;
    for (let q of o.options) {
      let question = questions.find(qu => qu.id === q.id);
      let answers = (evaluation.options || []).filter(
        e => e.questionID === q.id
      );
      answersLength += answers.length;
      score += getScore({ question, answers });
      potential += getPotentialScore({ question });
    }
    let progress = getProgress(o, evaluation);
    return { name, score, potential, answersLength, progress };
  });
};

const getTotalScore = ({ scores }) => {
  if (!scores.length) return 0;
  if (scores.length === 1) return scores[0].score || 0;

  return (
    (scores.length &&
      scores.reduce((total, s) => {
        let tot = parseInt(total) || total.score || 0;
        return tot + s.score;
      })) ||
    0
  );
};

const getTotalPotential = ({ scores }) => {
  if (!scores.length) return 0;
  if (scores.length === 1) return scores[0].potential || 0;
  return (
    (scores.length &&
      scores.reduce((total, s) => {
        let tot = parseInt(total) || total.potential || 0;
        return tot + s.potential;
      })) ||
    0
  );
};

const getTotalProgress = ({ scores }) => {
  if (!scores.length) return 0;
  if (scores.length === 1) return scores[0].progress || 0;
  return (
    Math.round(
      scores.reduce((total, s) => {
        let tot = parseInt(total) || total.progress || 0;
        return tot + parseInt(s.progress);
      })
    ) / scores.length
  );
};

const SortLine = ({ merged, filters }) => {
  let resultCount = !!merged.length;

  return (
    <Mutation mutation={putFilters}>
      {(mutate, mRes) => (
        <div className={count_line}>
          <div>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                let sortDirection =
                  filters.sortDirection === "asc" ? "desc" : "asc";
                let variables = { input: { sortDirection } };
                mutate({
                  variables,
                  optimisticResponse: {
                    __typename: "Mutation",
                    putFilters: {
                      ...filters,
                      sortDirection,
                      filters: JSON.stringify(filters.filters)
                    }
                  }
                });
              }}
            >
              {filters.sortDirection === "desc" ? (
                <i className="fas fa-sort-amount-down" />
              ) : (
                <i className="fas fa-sort-amount-up" />
              )}
            </span>

            <span
              style={{ cursor: "pointer", paddingLeft: "18px" }}
              onClick={() => {
                let sortBy = "alphabetical";
                if (filters.sortBy === "date") sortBy = "alphabetical";
                if (filters.sortBy === "alphabetical") sortBy = "score";
                if (filters.sortBy === "score") sortBy = "pooma";
                if (filters.sortBy === "pooma") sortBy = "date";
                let variables = { input: { sortBy: sortBy } };
                mutate({
                  variables,
                  optimisticResponse: {
                    __typename: "Mutation",
                    putFilters: {
                      ...filters,
                      sortBy: sortBy,
                      filters: JSON.stringify(filters.filters)
                    }
                  }
                });
              }}
            >
              <span>Sort by: </span>
              {((!filters.sortBy || filters.sortBy === "date") &&
                "date created") ||
                (filters.sortBy === "alphabetical" && "alphabetical") ||
                (filters.sortBy === "score" && "score") ||
                (filters.sortBy === "pooma" && "subjective score")}
              <span>
                {" "}
                <i className="fas fa-caret-down" />
              </span>
            </span>
          </div>
          <div>
            <span>Showing {merged.length} results</span>
          </div>
        </div>
      )}
    </Mutation>
  );
};

const getUnseenData = ({
  options,
  questions,
  evaluations,
  evaluationsSharedWithMe
}) => {
  let unseen = [...evaluations, ...evaluationsSharedWithMe];

  unseen = unseen
    .filter(m => m.organization)
    .filter(m => !m.archived)
    .filter(m => !m.seen);

  unseen = unseen.map(evaluation => {
    let scores = getEvaluationScores({ options, questions, evaluation });
    let totalScore = getTotalScore({ scores });
    let totalProgress = getTotalProgress({ scores });
    let totalPotential = getTotalPotential({ scores });
    return {
      ...evaluation,
      scores,
      totalScore,
      totalProgress,
      totalPotential
    };
  });

  unseen = unseen.sort((a, b) => b.createdAt - a.createdAt).map(m => [m]);

  return unseen;
};

const getMergedData = ({
  options,
  questions,
  evaluations,
  evaluationsSharedWithMe,
  filters,
  search,
  sortBy,
  sortDirection
}) => {
  let merged = [];

  let archived = [...evaluations].filter(m => m.archived);

  if (filters.my_own) {
    merged = [...merged, ...evaluations];
  }

  if (filters.shared_with_me) {
    merged = [...merged, ...evaluationsSharedWithMe];
  }

  merged = merged
    .filter(m => m.organization)
    .filter(m => !m.archived)
    .filter(m => m.seen);

  merged = merged.map(evaluation => {
    let scores = getEvaluationScores({ options, questions, evaluation });
    let totalScore = getTotalScore({ scores });
    let totalProgress = getTotalProgress({ scores });
    let totalPotential = getTotalPotential({ scores });
    return {
      ...evaluation,
      scores,
      totalScore,
      totalProgress,
      totalPotential
    };
  });

  if (filters.from_date) {
    merged = merged.filter(
      m => m.createdAt >= moment(filters.from_date).format("x")
    );
  }

  if (filters.to_date) {
    merged = merged.filter(
      m => m.createdAt <= moment(filters.to_date).format("x")
    );
  }

  if (filters.include_archived) {
    merged = [...merged, ...archived];
  }

  if (filters.n_tags && filters.n_tags.length) {
    merged = merged.filter(m => {
      if (!m.n_tags || !m.n_tags.length) return false;
      return filters.n_tags.some(nt => {
        let match = m.n_tags.some(mnt => mnt === nt);
        return match;
      });
    });
  }

  if (filters.n_funnel && filters.n_funnel.length) {
    merged = merged.filter(m => {
      if (!m.n_funnel || !m.n_funnel.length) return false;
      return filters.n_funnel.every(v => m.n_funnel.some(a => a === v));
    });
  }

  if (search !== "") {
    let s = search.toLowerCase();
    merged = merged.filter(m => {
      if (!m.organization) return;
      if (m.organization.name.toLowerCase().includes(s)) {
        return true;
      }
      if ((m.tags || []).some(t => t.toLowerCase().includes(s))) {
        return true;
      }
    });
  }

  if (sortBy === "score" && sortDirection === "asc") {
    merged = merged.sort((a, b) => a.totalScore - b.totalScore);
  }

  if (sortBy === "score" && sortDirection !== "asc") {
    merged = merged.sort((a, b) => b.totalScore - a.totalScore);
  }

  if (sortBy === "pooma" && sortDirection === "asc") {
    merged = merged.sort((a, b) => a.comments_puma - b.comments_puma);
  }

  if (sortBy === "pooma" && sortDirection !== "asc") {
    merged = merged.sort((a, b) => b.comments_puma - a.comments_puma);
  }

  // Sort by date
  if (sortBy === "date" && sortDirection === "asc") {
    merged = merged.sort((a, b) => b.createdAt - a.createdAt);
  }

  if (sortBy === "date" && sortDirection !== "asc") {
    merged = merged.sort((a, b) => a.createdAt - b.createdAt);
  }

  // Sort by name
  if (sortBy === "alphabetical" && sortDirection === "asc") {
    merged = merged.sort((a, b) => {
      if (a.organization.name < b.organization.name) return 1;
      if (a.organization.name > b.organization.name) return -1;
    });
  }

  if (sortBy === "alphabetical" && sortDirection !== "asc") {
    merged = merged.sort((a, b) => {
      if (a.organization.name < b.organization.name) return -1;
      if (a.organization.name > b.organization.name) return 1;
    });
  }

  merged = merged.map(m => [m]);

  return merged;
};



class Inbox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      openCards: {}
    }
  }

  toggleOpen(item, force) {
    this.setState({
      openCards: {
        ...this.state.openCards,
        [item.id]: force
          ? true
          : !this.state.openCards[item.id]
      }
    })
  }

  render() {

    let {
      user,
      options,
      questions,
      tags,
      openInModal
    } = this.props; 


    return (
      <Query query={getInbox}>
        {({ data, loading, error }) => {

          let inbox = [];
          if (data && data.getInbox) {
            inbox = data.getInbox;
          }

          if (!inbox.length) return <span/>

          return (
            <div
              className={cards_class}
              style={{ marginBottom: "50px" }}
              >
              <div className={count_line}>
                <div>
                  <span>Inbox</span>
                </div>
                <div>Showing {inbox.length} results</div>
              </div>
              <div>
                {inbox.map((it, i) => {
                  return (
                    <Card
                      cardType="inbox"
                      user={user}
                      key={`row-unseen-${it.id}-${i}`}
                      hasEvaluated={false}
                      unseen={true}
                      it={[it]}
                      options={options}
                      questions={questions}
                      tags={tags}
                      openCards={this.state.openCards}
                      openInModal={openInModal}
                      markAsSeen={id => {}}
                      toggleOpen={(...p) => this.toggleOpen(...p)}
                    />
                  );
                })}
              </div>
            </div>
          )
        }}
      </Query>
    )
  }
}


class Comp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      tagSearch: "",
      openCards: {},
      unseen: [],
      modal_contentId: undefined,
      modal_content: undefined
    };
  }

  componentDidMount() {
    let unseen = this.props.evaluations.filter(e => !e.seen).map(e => e.id);
    let unseen2 = this.props.evaluationsSharedWithMe
      .filter(e => !e.seen)
      .map(e => e.id);
    this.setState({ unseen: [...unseen, ...unseen2] });
  }

  render() {
    let {
      evaluations,
      options,
      questions,
      evaluationsSharedWithMe,
      tags,
      filters,
      // inbox
    } = this.props;

    let merged =
      getMergedData({
        options,
        questions,
        evaluations,
        evaluationsSharedWithMe,
        search: this.state.search,
        filters: filters.filters,
        sortBy: filters.sortBy,
        sortDirection: filters.sortDirection
      }) || [];

    let unseen =
      getUnseenData({
        options,
        questions,
        evaluations,
        evaluationsSharedWithMe
      }) || [];

    let startDate;
    if (evaluations.length) {
      let firstEntry = evaluations.reduce((a, b) =>
        a.createdAt < b.createdAt ? a : b
      );
      startDate = (firstEntry || {}).createdAt;
    } else {
      startDate = moment()
        .subtract(90, "days")
        .format("x");
    }

    return (
      <content>
        <div style={{ margin: "auto" }}>
          {
            <FilterSection
              evaluations={evaluations}
              evaluationsSharedWithMe={evaluationsSharedWithMe}
              tags={tags}
              filters={filters}
              search={this.state.search}
              tagSearch={this.state.tagSearch}
              setSearch={search => this.setState({ search })}
              setTagSearch={tagSearch => this.setState({ tagSearch })}
              startDate={startDate}
              resultCount={merged.length}
            />
          }

          {
            <Inbox
              user={this.props.user}
              options={options}
              questions={questions}
              tags={tags}
              openInModal={modal_content => {
                this.setState({
                  modal_content,
                  show_modal: true
                })
              }}
            />
          }          

          {(!merged.length && !unseen.length && (
            <div className={no_content_container}>
              <div className={boo_icon}>👻</div>
              <div className={boo_text}>BOO!</div>
              <div className={boo_text_2}>there is nothing here</div>
            </div>
          )) || <span />}



          {!!unseen.length && (
            <div className={cards_class} style={{ marginBottom: "50px" }}>
              <div className={count_line}>
                <div>
                  <span>New</span>
                  {!!this.state.unseen.length && (
                    <span
                      onClick={() => {
                        let variables = {};
                        this.props.markAllAsSeenMutation({
                          variables,
                          refetchQueries: [{ query: getEvaluations }]
                        });
                        this.setState({ unseen: [] });
                      }}
                    >
                      <span>&nbsp;</span>
                      <span className={mark_as_seen}>(mark all as seen)</span>
                    </span>
                  )}
                </div>
                <div>Showing {unseen.length} results</div>
              </div>
              <div>
                {unseen.map((it, i) => {
                  return (
                    <Card
                      hasEvaluated={evaluations.some(
                        o => o.orgId === it[0].orgId
                      )}
                      user={this.props.user}
                      key={`row-unseen-${it.id}-${i}`}
                      history={this.props.history}
                      it={it}
                      options={options}
                      questions={questions}
                      tags={tags}
                      openCards={this.state.openCards}
                      unseen={this.state.unseen.some(s => s === it[0].id)}
                      openInModal={modal_content => {
                        this.setState({
                          modal_content,
                          show_modal: true
                        });
                      }}
                      markAsSeen={id => {
                        let item = it[0];
                        if (!item.sharedByEmail) {
                          let variables = { id };
                          this.props.markAsSeenMutation({ variables });
                        }
                        if (item.sharedByEmail) {
                          let variables = { evaluationId: id };
                          this.props.markSharingAsSeenMutation({ variables });
                        }
                        let unseen = this.state.unseen.filter(s => s !== id);
                        this.setState({ unseen });
                      }}
                      toggleOpen={(item, force) => {
                        this.setState({
                          openCards: {
                            ...this.state.openCards,
                            [item.id]: force
                              ? true
                              : !this.state.openCards[item.id]
                          }
                        });
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}





          {!!merged.length && (
            <div className={cards_class}>
              <SortLine merged={merged} filters={filters} />
              <Mutation mutation={markAsSeen}>
                {(mutate, { data, loading, error }) => (
                  <div>
                    {merged.map((it, i) => (
                      <Card
                        hasEvaluated={evaluations.some(
                          o => o.orgId === it[0].orgId
                        )}
                        user={this.props.user}
                        key={`row-${it.id}-${i}`}
                        history={this.props.history}
                        it={it}
                        options={options}
                        questions={questions}
                        tags={tags}
                        openCards={this.state.openCards}
                        unseen={this.state.unseen.some(s => s === it[0].id)}
                        openInModal={modal_content => {
                          this.setState({
                            modal_content,
                            show_modal: true
                          });
                        }}
                        markAsSeen={id => {
                          let variables = { id };
                          mutate({ variables });
                          let unseen = this.state.unseen.filter(s => s !== id);
                          this.setState({ unseen });
                        }}
                        toggleOpen={(item, force) => {
                          this.setState({
                            openCards: {
                              ...this.state.openCards,
                              [item.id]: force
                                ? true
                                : !this.state.openCards[item.id]
                            }
                          });
                        }}
                      />
                    ))}
                  </div>
                )}
              </Mutation>
            </div>
          )}
        </div>

        <BackButton
          onClick={() => {
            this.setState({ show_modal: !this.state.show_modal });
          }}
          label="create new evaluation"
        />

        {this.state.show_modal && (
          <div>
            <NewCompanyModal
              tags={tags}
              evaluations={this.props.evaluations}
              content={this.state.modal_content}
              close={() =>
                this.setState({
                  show_modal: false,
                  modal_content: undefined
                })
              }
            />
          </div>
        )}
      </content>
    );
  }
}

const ComposedComponent = () => {
  const Composed = adopt({
    // inboxQuery: ({render}) => (
    //   <Query query={getInbox}>{render}</Query>
    // ),
    evaluationsQuery: ({ render }) => (
      <Query query={getEvaluations}>{render}</Query>
    ),
    evaluationOptionsQuery: ({ render }) => (
      <Query query={getEvaluationOptions}>{render}</Query>
    ),
    evaluationQuestionsQuery: ({ render }) => (
      <Query query={getEvaluationQuestions}>{render}</Query>
    ),
    tagsQuery: ({ render }) => (
      <Query query={getTags}>{render}</Query>
    ),
    filtersQuery: ({ render }) => (
      <Query query={getFilters}>{render}</Query>
    ),
    userQuery: ({ render }) => (
      <Query query={userGet}>{render}</Query>
    ),
    markAsSeenMutation: ({ render }) => (
      <Mutation mutation={markAsSeen}>{render}</Mutation>
    ),
    markAllAsSeenMutation: ({ render }) => (
      <Mutation mutation={markAllAsSeen}>{render}</Mutation>
    ),
    markSharingAsSeenMutation: ({ render }) => (
      <Mutation mutation={markSharingAsSeen}>{render}</Mutation>
    )
  });

  return (
    <Composed>
      {({
        // inboxQuery,
        evaluationsQuery,
        evaluationOptionsQuery,
        evaluationQuestionsQuery,
        tagsQuery,
        filtersQuery,
        userQuery,
        markAsSeenMutation,
        markAllAsSeenMutation,
        markSharingAsSeenMutation
      }) => {
        const loading =
          // inboxQuery.loading ||
          evaluationsQuery.loading ||
          evaluationOptionsQuery.loading ||
          evaluationQuestionsQuery.loading ||
          tagsQuery.loading ||
          filtersQuery.loading ||
          userQuery.loading;

        const error =
          // inboxQuery.error ||
          evaluationsQuery.error ||
          evaluationOptionsQuery.error ||
          evaluationQuestionsQuery.error ||
          tagsQuery.error ||
          filtersQuery.error ||
          userQuery.error;

        if (error) console.log("error", error);
        if (loading) return <GhostLoader />;
        if (error) return <div>We are updating </div>;

        // const inbox = inboxQuery.data.getInbox;
        const evaluations = evaluationsQuery.data.getEvaluations;
        const evaluationsSharedWithMe = evaluationsQuery.data.getEvaluationsSharedWithMe;
        const tags = tagsQuery.data.getTags;
        const filters = filtersQuery.data.getFilters;
        const user = userQuery.data.userGet;
        const options = evaluationOptionsQuery.data.getEvaluationOptions;
        const questions = evaluationQuestionsQuery.data.getEvaluationQuestions;

        if (typeof filters.filters === "string") {
          try {
            filters.filters = JSON.parse(filters.filters);
          } catch (error) {
            filters.filters = {};
          }
        }

        return (
          <Comp
            markAsSeenMutation={markAsSeenMutation}
            markAllAsSeenMutation={markAllAsSeenMutation}
            markSharingAsSeenMutation={markSharingAsSeenMutation}
            evaluations={evaluations}
            evaluationsSharedWithMe={evaluationsSharedWithMe}
            options={(options[0] || {}).options || []}
            questions={questions}
            tags={tags}
            filters={filters}
            user={user}
            // inbox={inbox}
          />
        );
      }}
    </Composed>
  );
};

export default ComposedComponent;




