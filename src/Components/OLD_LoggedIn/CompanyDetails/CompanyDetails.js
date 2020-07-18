import React from "react";
import { adopt } from "react-adopt";
import qp from "../../../utils/queryParams";
import validateEmail from "../../../utils/validateEmail";
import classnames from "classnames";
import { cloneDeep } from "lodash";
import { Redirect, Link } from "react-router-dom";
import BackButton from "../../elements/BackButton";
import {
  viewCompanies,
  overviewBoth,
  inviteInvestorToViewEvaluation,
  link_bridge
} from "../../../routes";
import { Query } from "react-apollo";
import { GhostLoader } from "../../elements/GhostLoader";
import EvaluationProgressBar from "../../elements/EvaluationProgressBar";
import moment from "moment";
import getScore from "../getScore";
import {
  error_box,
  skip_class,
  error_class,
  error_message
} from "../../elements/Style.module.css";
import {
  color1,
  color1_bg,
  color2,
  color2_bg,
  color3,
  color3_bg,
  color4_bg
} from "../../elements/Colors.module.css";
import {
  web_box,
  web_title,
  web_image,
  web_provider
} from "../../elements/Form.module.css";

import {
  getInboxItem,
  getEvaluation_new,
  getEvaluationOptions,
  getEvaluationQuestions
} from "../../../Apollo/Queries";

import {
  container,
  section,
  section_title,
  questions_class,
  question_class,
  question_title,
  question_answer,
  section_score,
  header_section,
  company_name,
  time_stamp,
  edit_link,
  company_by,
  invited_email,
  kill_invitation,
  not_answered,
  answer_text,
  answer_url,
  linkText,
  comment_class,
  score_class,
  traffic_light_style,
  traffic_light_red,
  traffic_light_yellow,
  traffic_light_green
} from "./CompanyDetails.module.css";

import {
  scores_table,
  scores_row,
  scores_sum,
  scores_cell_1,
  scores_cell_1_1,
  scores_cell_2,
  scores_cell_3,
  scores_cell_4,
  scores_cell_5,
  color_indicator
} from "../ViewCompanies/CompanyCard/index.module.css";

import combinedInfoData from "../Pages/InfoPages/combinedData";

const traffic_light_color = {
  red: traffic_light_red,
  yellow: traffic_light_yellow,
  green: traffic_light_green
};

const getVal = ({ evaluation, type, field, options }) => {
  if (type === "radio") {
    let k = (evaluation || {})[field];
    let it = options.find(o => o.val === k);
    return it ? [it.text] : undefined;
  }

  if (type === "check") {
    let k = (evaluation || {})[field];
    let rr = (k || [""]).map(_k => {
      let it = options.find(o => o.val === _k);
      return it ? it.text : undefined;
    });
    return rr;
  }

  if (type === "textInput") {
    let k = (evaluation || {})[field];
    return k ? [k] : undefined;
  }

  if (type === "multi_line") {
    let k = (evaluation || {})[field];
    return k ? [k] : undefined;
  }

  if (type === "urls") {
    let k = (evaluation || {})[field];
    return k ? k : undefined;
  }

  if (evaluation) {
    let k = (evaluation || {})[field];
    return k ? k : undefined;
  }
  return;
};

const Questions = ({ d, i, evaluation, color }) => {
  let completedCount = d.filter(q => {
    let val = getVal({ evaluation, ...q });
    return !(!val || (val.length === 1 && val[0] === undefined));
  });

  return (
    <div className={questions_class}>
      {!completedCount.length && (
        <div
          className={classnames(question_title)}
          style={{ fontStyle: "italic", textAlign: "center" }}
        >
          This section have not been completed
        </div>
      )}

      {d.map((q, o) => {
        let isSite = q.field === "info_website";
        let val = getVal({ evaluation, ...q });
        if (!val || (val.length === 1 && val[0] === undefined)) return;
        if (q.type === "urls" && val.length === 1 && !val[0].url) {
          return;
        }

        val = val.join(", ");

        return (
          <div key={`dd-${i}-${o}`}>
            <div className={question_class}>
              <div className={classnames(question_title)}>{q.title}</div>

              {(q.type === "radio" || q.type === "check") && (
                <div
                  className={classnames(
                    question_answer,
                    color,
                    val === "n/a" ? not_answered : ""
                  )}
                  key={`a-${i}-${o}`}
                >
                  {val}
                </div>
              )}

              {q.type === "textInput" && (
                <div className={answer_text}>{val}</div>
              )}

              {q.type === "multi_line" &&
                getVal({ evaluation, ...q }).map((ml, z) => (
                  <div key={`dd-${i}-${o}-ml${z}`} className={answer_text}>
                    {ml}
                  </div>
                ))}

              {q.type === "urls" &&
                getVal({ evaluation, ...q })
                  .filter(link => link.url)
                  .map((link, z) => (
                    <a
                      key={`dd-${i}-${o}-link${z}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                      href={`${link_bridge}?link=${link.url}`}
                      target="_blank"
                    >
                      {link.title && (
                        <div className={web_box} style={{ marginTop: "10px" }}>
                          <div className={web_title}>
                            <div className={classnames(web_provider, color3)}>
                              {link.provider}
                            </div>
                            {link.title}
                          </div>
                          {link.image && link.image.slice(0, 4) === "http" && (
                            <div className={web_image}>
                              <img src={link.image} />
                            </div>
                          )}
                        </div>
                      )}

                      {!link.title && (
                        <span className={classnames(answer_url, color3_bg)}>
                          {link.url}
                        </span>
                      )}
                    </a>
                  ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CompanyDetailsComp = ({
  evaluation,
  allOptions,
  questions,
  loading,
  id,
  isInbox
}) => {

  if (loading) return <GhostLoader />;

  let organization = (evaluation || {}).organization || {};

  const getAnswer = id => {
    let question = questions.find(q => q.id === id);
    let answers = (evaluation.options || []).filter(e => e.questionID === id);
    let givenAnswers = answers.filter(
      a => a.input_type === question.input_type
    );
    let matchedAnswers = question.options.filter(o =>
      givenAnswers.some(ga => ga.sid === o.sid)
    );
    if (question.input_type === "TRAFFIC_LIGHTS") {
      return givenAnswers.map(a => a.val);
    }
    if (question.input_type === "INPUT_TEXT") {
      return givenAnswers.map(a => a.val);
    }
    return matchedAnswers.map(a => a.val);
  };

  const getComment = id => {
    let obj = (evaluation.options || []).find(
      e => e.questionID === id && e.input_type === "COMMENT"
    );
    return obj && obj.val;
  };

  const getScore = id => {
    let question = questions.find(q => q.id === id);
    let answers = (evaluation.options || []).filter(e => e.questionID === id);

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

      return score;
    }

    return 0;
  };

  const getPotentialScore = id => {
    let question = questions.find(q => q.id === id);

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
      let qa = question.options.reduce((total, o) => {
        let tot = parseInt(total) || total.score || 0;
        return tot + (o.score >= 0 ? o.score : 0);
      });
      return qa;
    }

    return 0;
  };

  const getProgress = options => {
    let total = 0;
    for (let op of options.options) {
      if ((evaluation.options || []).some(eo => eo.questionID === op.id)) {
        total += 1;
      }
    }
    return (total / options.options.length) * 100;
  };

  const getTotalScore = dd => {
    let total = 0;
    let potential = 0;
    for (let d of dd.options) {
      total += getScore(d.id) || 0;
      potential += getPotentialScore(d.id) || 0;
    }
    let progress = getProgress(dd);
    return { total, potential, progress };
  };

  let allScores, totalScore, totalPotential, totalProgress;

  if (!isInbox) {

    allScores = allOptions.map(o => getTotalScore(o));

    totalScore =
      (allScores.length &&
        allScores.reduce((total, s) => {
          let tot = parseInt(total) || total.total || 0;
          return tot + s.total;
        })) ||
      0;

    totalPotential =
      (allScores.length &&
        allScores.reduce((total, s) => {
          let tot = parseInt(total) || total.potential || 0;
          return tot + s.potential;
        })) ||
      0;

    totalProgress = Math.round(
      allScores.reduce((total, s) => {
        let tot = parseInt(total) || total.progress || 0;
        return tot + parseInt(s.progress);
      }) / allScores.length
    );
  }

  return (
    <div className={container}>
      <div className={header_section}>
        <div className={classnames(company_name, color1_bg)}>
          {organization.name}
        </div>

        <div className={time_stamp}>
          {moment(evaluation.createdAt).format("ll")}
        </div>
      </div>

      {
        (isInbox || organization.invitedStartup) && (
          <div className={section}>
            <div className={classnames(section_title, color1_bg)}>
              TERMS
            </div>

            {
              !organization.accepted_terms && (
                <div style={{color: "#c80000"}}>
                  This organization has not yet acceted the terms and conditions
                </div>
              ) || (
                <div>
                  <div>
                    Accpted terms: <span style={{color: "green"}}>true</span>
                  </div>
                  <div style={{
                      fontSize: "12px",
                      color: "gray",
                      marginTop: "10px"
                    }}>
                    {organization.terms}
                  </div>
                </div>
              )
            }

          </div>
        )
      }
    
      {
        !isInbox && (
          <div className={section}>
            <div className={classnames(section_title, color1_bg)}>
              Evaluation Summaries
            </div>

            <div className={scores_table}>
              {allOptions.map((option, i) => {
                let { progress, total, potential } = getTotalScore(option);
                return (
                  <div key={`ao-${i}`} className={scores_row}>
                    <div className={scores_cell_1}>{option.name}</div>

                    <div className={scores_cell_2}>{total}</div>

                    <div className={scores_cell_3}>/</div>

                    <div className={scores_cell_4}>{potential}</div>

                    <div className={scores_cell_5}>
                      <div style={{ position: "relative", top: "3px" }}>
                        <EvaluationProgressBar
                          percent={progress}
                          total={total}
                          potential={potential}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className={classnames(scores_row, scores_sum)}>
                <div className={scores_cell_1}>TOTAL: </div>
                <div className={scores_cell_2}>{totalScore}</div>
                <div className={scores_cell_3}>/</div>
                <div className={scores_cell_4}>{totalPotential}</div>
                <div className={scores_cell_5}>
                  <div style={{ position: "relative", top: "3px" }}>
                    <EvaluationProgressBar
                      percent={totalProgress}
                      total={totalScore}
                      potential={totalPotential}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {allOptions.map((option, i) => (
        <div className={section} key={`cd-${i}`}>
          <div className={classnames(section_title, color1_bg)}>
            Evaluation: {option.name}
            <div className={score_class}>
              Score: {getTotalScore(option).total} /{" "}
              {getTotalScore(option).potential}
            </div>
          </div>

          {option.options.map((o, ii) => {
            let question = questions.find(q => q.id === o.id);

            return (
              <div className={question_class} key={`op-${i}-${ii}`}>
                <div className={question_title}>{question.name}</div>
                <div
                  className={classnames(
                    question_answer,
                    getAnswer(o.id).length ? color1 : color2
                  )}
                >
                  {(question.input_type === "TRAFFIC_LIGHTS" &&
                    getAnswer(o.id).length && (
                      <div
                        className={classnames(
                          traffic_light_style,
                          traffic_light_color[getAnswer(o.id).join(", ")]
                        )}
                      />
                    )) ||
                    (getAnswer(o.id).length
                      ? getAnswer(o.id).join(", ")
                      : "n/a")}
                </div>

                {getComment(o.id) && (
                  <div className={comment_class}>{getComment(o.id)}</div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {combinedInfoData.map((d, i) => {
        let completedCount = d.questions.filter(q => {
          let val = getVal({ evaluation: organization, ...q });
          return !(!val || (val.length === 1 && val[0] === undefined));
        });

        if (completedCount.length === 0) return;

        return (
          <div className={section} key={`cd-${i}`}>
            <div className={classnames(section_title, color2_bg)}>
              Facts: {d.title}
            </div>
            <Questions
              d={d.questions}
              i={i}
              evaluation={organization}
              color={color2}
            />
          </div>
        );
      })}
    </div>
  );
};

class ComposedComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: null,
      inbox: false
    };
  }

  componentDidMount() {
    let { id } = this.props.match.params;    
    let { inbox } = qp(this.props.location.search);
    if (inbox && inbox.length) {
      let isInbox = inbox[0] === 'true';
      this.setState({id, inbox: true})
    } else {
      this.setState({ id })
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps === this.props) return;
    let { id } = newProps.match.params;
    this.setState({ id });
  }

  render() {
    if (!this.state.id) return <GhostLoader />;

    const Composed = adopt({
      evaluationQuery: ({ render }) => (
        <Query query={
          this.state.inbox ? getInboxItem : getEvaluation_new
        } variables={{ id: this.state.id }}>
          {render}
        </Query>
      ),
      evaluationOptionsQuery: ({ render }) => (
        <Query query={getEvaluationOptions}>{render}</Query>
      ),
      evaluationQuestionsQuery: ({ render }) => (
        <Query query={getEvaluationQuestions}>{render}</Query>
      )
    });

    return (
      <Composed>
        {({
          evaluationQuery,
          evaluationOptionsQuery,
          evaluationQuestionsQuery
        }) => {
          const loading =
            evaluationQuery.loading ||
            evaluationOptionsQuery.loading ||
            evaluationQuestionsQuery.loading;

          const error =
            evaluationQuery.error ||
            evaluationOptionsQuery.error ||
            evaluationQuestionsQuery.error;

          if (error) console.log("error", error);
          if (loading) return <GhostLoader />;
          if (error) return <div>ERROR</div>;

          const evaluation = this.state.inbox
            ? evaluationQuery.data.getInboxItem
            : evaluationQuery.data.getEvaluation_new;

          const options = evaluationOptionsQuery.data.getEvaluationOptions;
          const questions =
            evaluationQuestionsQuery.data.getEvaluationQuestions;
          const allOptions = (options[0] || {}).options || [];

          return (
            <CompanyDetailsComp
              id={this.state.id}
              evaluation={evaluation}
              allOptions={allOptions}
              questions={questions}
              loading={loading}
              isInbox={this.state.inbox}
              {...this.props}
            />
          );
        }}
      </Composed>
    );
  }
}

export default ComposedComponent;



