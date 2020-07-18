import React from "react";
import { Redirect, Link, Switch, withRouter } from "react-router-dom";
import { adopt } from "react-adopt";
import classnames from "classnames";
import { gridContainer, page_title } from "../../../elements/Grid.module.css";
import BackButton from "../../../elements/BackButton";
import BigButton from "../../../elements/BigButton";
import {
  viewCompanies,
  evaluation_new,
  company_details
} from "../../../../routes";

import { Query } from "react-apollo";
import {
  getEvaluation_new,
  getEvaluationOptions,
  getEvaluationQuestions
} from "../../../../Apollo/Queries";
import { GhostLoader } from "../../../elements/GhostLoader";

import { button_class } from "../../../elements/Style.module.css";

import {
  color1,
  color1_bg,
  color2_bg,
  color3_bg,
  color4_bg,
  color5_bg,
  color6_bg,
  color7_bg,
  color8_bg,
  color9_bg
} from "../../../elements/Colors.module.css";

const colors = [
  color1_bg,
  color2_bg,
  color3_bg,
  color4_bg,
  color5_bg,
  color6_bg,
  color7_bg,
  color8_bg,
  color9_bg
];

const getColor = i => {
  if (i >= colors.length) i = i - colors.length;
  return colors[i];
};

export class EvaluationOverviewComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { redirect: false };
  }

  getScores = options => {
    let score = 0;
    let potential = 0;
    for (let q of options) {
      let question = this.props.questions.find(qu => qu.id === q.id);
      let answers = (this.props.evaluation.options || []).filter(
        e => e.questionID === q.id
      );
      score += this.getScore({ question, answers });
      potential += this.getPotentialScore({ question });
    }
    return { score, potential };
  };

  getScore = ({ question, answers }) => {
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

  getPotentialScore = ({ question }) => {
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

  render() {
    let {
      history,
      options,
      evaluation,
      // questions,
      loading
    } = this.props;

    const getProgress = option => {
      let total = 0;
      for (let op of option.options) {
        if ((evaluation.options || []).some(eo => eo.questionID === op.id)) {
          total += 1;
        }
      }
      return (total / option.options.length) * 100;
    };


    let name = evaluation.organization.name;

    return (
      <content>
        <div>
          <div className={classnames(page_title, color1)}>
            {name || <span>&nbsp;</span>}
          </div>
          <div className={gridContainer}>
            {options.map((d, i) => (
              <Link
                to={`${evaluation_new}/${this.props.id}/${d.sid}`}
                key={`question-${i}`}
              >
                <BigButton
                  key={`k-${i}`}
                  label={d.name}
                  subLabel={`${this.getScores(d.options).score} / ${
                    this.getScores(d.options).potential
                  }`}
                  className={getColor(i)}
                  progress={getProgress(d)}
                />
              </Link>
            ))}
          </div>

          {
            <Link
              to={`${company_details}/${this.props.id}`}
              className={button_class}
              style={{
                marginTop: "70px",
                maxWidth: "626px",
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              <span>View summary</span>
            </Link>
          }
        </div>

      </content>
    );
  }
}

class ComposedComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null
    };
  }

  componentDidMount() {
    let { id } = this.props.match.params;
    this.setState({ id });
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
        <Query query={getEvaluation_new} variables={{ id: this.state.id }}>
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
          evaluationOptionsQuery,
          evaluationQuestionsQuery,
          evaluationQuery
        }) => {
          const loading =
            evaluationOptionsQuery.loading ||
            evaluationQuestionsQuery.loading ||
            evaluationQuery.loading;

          const error =
            evaluationOptionsQuery.error ||
            evaluationQuestionsQuery.error ||
            evaluationQuery.error;

          if (loading) return <GhostLoader />;
          if (error) return <div>ERROR</div>;

          const options = evaluationOptionsQuery.data.getEvaluationOptions;
          const questions =
            evaluationQuestionsQuery.data.getEvaluationQuestions;
          const evaluation = evaluationQuery.data.getEvaluation_new;

          return (
            <EvaluationOverviewComp
              evaluation={evaluation}
              questions={questions}
              options={(options[0] || {}).options || []}
              id={this.state.id}
              loading={loading}
            />
          );
        }}
      </Composed>
    );
  }
}

export default ComposedComponent;




