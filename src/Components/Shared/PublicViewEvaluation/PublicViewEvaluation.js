import React from "react";
import classnames from "classnames";
import qp from "../../../utils/queryParams";
import { Redirect, Switch, withRouter } from "react-router-dom";
import { GhostLoader } from "../../elements/GhostLoader";

import combinedInfoData from "../../LoggedIn/Pages/InfoPages/combinedData";
import moment from "moment";
import { link_bridge } from "../../../routes";
import {
  // container,
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
  archive_text,
  archive_icon,
  linkText,
  shared_with_me_box,
  traffic_light_style,
  traffic_light_red,
  traffic_light_yellow,
  traffic_light_green,
  comment_class
} from "./PublicViewEvaluation.module.css";

import { Query } from "@apollo/client/react/components";
import { public_getSharedEvaluation } from "../../../Apollo/Queries";

import {
  web_box,
  web_title,
  web_image,
  web_provider
} from "../../elements/Form.module.css";

import {
  color1_bg,
  color2_bg,
  color1,
  color2,
  color3_bg,
  color3
} from "../../elements/Colors.module.css";

import {
  container,
  small_container,
  center_container,
  inner_container,
  error_box
} from "../../elements/Style.module.css";

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

        // if (q.type === "urls" && val.filter(link => link.url) )
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

const CompanyDetailsComp = ({ evaluation, loading }) => {
  if (loading) return <GhostLoader />;

  let organization = (evaluation || {}).organization || {};

  let evaluationSections = {};

  let options = evaluation.shared_options;

  const getUniqueIds = ops => {
    let ids = {};
    for (let o of ops) {
      ids[o.questionID] = true;
    }
    return Object.keys(ids);
  };

  const getQuestionName = (id, option) => {
    return option.options.find(o => o.questionID === id).question;
  };

  const getQuestionType = (id, option) =>
    option.options.find(o => o.questionID === id && o.input_type !== "COMMENT")
      .input_type;

  const getAnswer = (id, option) =>
    option.options
      .filter(o => o.questionID === id && o.input_type !== "COMMENT")
      .map(o => o.val);

  const getComment = (id, option) => {
    let hit = option.options.find(
      o => o.questionID === id && o.input_type === "COMMENT"
    );
    return hit ? hit.val : undefined;
  };

  const getSharedOption = () =>
    evaluation.shared_options.filter(d => getUniqueIds(d.options).length);

  return (
    <div
      style={{
        maxWidth: "550px",
        marginTop: "50px",
        marginBottom: "100px"
      }}
    >
      <div className={header_section}>
        <div className={classnames(company_name, color1_bg)}>
          {organization.name}
        </div>

        <div className={classnames(shared_with_me_box, color2_bg)}>
          {evaluation.sharedByName} ({evaluation.sharedByEmail}) shared this
          evaluation with you.
        </div>

        <div className={time_stamp}>
          {moment(evaluation.createdAt).format("ll")}
        </div>
      </div>

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

      {getSharedOption().map((d, i) => {
        return (
          <div className={section} key={`cd-${i}`}>
            <div className={classnames(section_title, color1_bg)}>
              Evaluation: {d.name}
            </div>

            {getUniqueIds(d.options).map((questionID, ii) => (
              <div
                className={question_class}
                key={`option-${questionID}-${i}-${ii}`}
              >
                <div className={question_title}>
                  {getQuestionName(questionID, d)}
                </div>

                <div className={classnames(question_answer, color1)}>
                  {(getQuestionType(questionID, d) === "TRAFFIC_LIGHTS" &&
                    getAnswer(questionID, d).length && (
                      <div
                        className={classnames(
                          traffic_light_style,
                          traffic_light_color[getAnswer(questionID, d)[0].val]
                        )}
                      />
                    )) ||
                    (getAnswer(questionID, d).length
                      ? getAnswer(questionID, d).join(", ")
                      : "n/a")}
                </div>

                {getComment(questionID, d) && (
                  <div className={comment_class}>
                    {getComment(questionID, d).val}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      email: false
    };
  }

  componentDidMount() {
    let { id, email } = qp(this.props.location.search);
    this.setState({ id: id[0], email: email[0] });
  }

  render() {
    if (!this.state.id) return <div />;

    return (
      <Query
        query={public_getSharedEvaluation}
        variables={{ id: this.state.id, email: this.state.email }}
        fetchPolicy="cache-and-network"
      >
        {({ data, error, loading }) => {
          if (error) {
            return (
              <div
                className={classnames(
                  container,
                  small_container,
                  center_container
                )}
              >
                <div className={inner_container}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "96px" }}>💥</div>
                    <div className={error_box}>
                      Ooops. Seems like something went wrong...
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              className={classnames(
                container,
                small_container,
                center_container
              )}
            >
              <div className={inner_container}>
                <CompanyDetailsComp
                  evaluation={(data || {}).public_getSharedEvaluation || {}}
                  loading={loading}
                />
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default withRouter(Component);
