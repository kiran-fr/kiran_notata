import React from "react";
import { Redirect, Switch, withRouter } from "react-router-dom";
import { adopt } from "react-adopt";
import qp from "../../../../utils/queryParams";
import classnames from "classnames";

import { Query } from "react-apollo";
import {
  getEvaluation_new,
  getEvaluationOptions,
  getEvaluationQuestions
} from "../../../../Apollo/Queries";
import { GhostLoader } from "../../../elements/GhostLoader";
import PageCompNew from "../PageCompNew";

class ComposedComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      sid: null
    };
  }

  componentDidMount() {
    let { id, sid } = this.props.match.params;
    this.setState({ id, sid });
  }

  componentWillReceiveProps(newProps) {
    if (newProps === this.props) return;
    let { id, sid } = newProps.match.params;
    this.setState({ id, sid });
  }

  render() {
    if (!this.state.id || !this.state.sid) return <GhostLoader />;

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

          const evaluation = evaluationQuery.data.getEvaluation_new;
          const options = evaluationOptionsQuery.data.getEvaluationOptions;
          const questions =
            evaluationQuestionsQuery.data.getEvaluationQuestions;

          let allOptions = (options[0] || {}).options || [];
          let option = allOptions.find(o => o.sid === this.state.sid);

          return (
            <div>
              <PageCompNew
                id={this.state.id}
                sid={this.state.sid}
                allOptions={allOptions}
                option={option}
                options={(options[0] || {}).options || []}
                questions={questions}
                evaluation={evaluation}
                history={this.props.history}
              />
            </div>
          );
        }}
      </Composed>
    );
  }
}

export default ComposedComponent;
