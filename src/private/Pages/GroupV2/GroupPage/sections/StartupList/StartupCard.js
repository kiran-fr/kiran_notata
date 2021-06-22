import React from "react";

import StartupComments from "./components/StartupComments";
import YourEvaluations from "./components/YourEvaluations";
import StartupHeader from "./components/StartupHeader";
import EvaluationSummaries from "./components/EvaluationSummaries";
import RequestedEvaluations from "./components/RequestedEvaluations";
import EvaluationDetails from "./components/EvaluationDetails";

import "./StartupCard.scss";

export default function StartupCard({ group, startup, history }) {
  return (
    <div className="row">
      <div className="col-sm-12 col-xs-12">
        <div className="card group-startup-card">
          <StartupHeader history={history} startup={startup} group={group} />

          <EvaluationSummaries startup={startup} history={history} />

          <EvaluationDetails startup={startup} history={history} />

          <YourEvaluations startup={startup} group={group} history={history} />

          <RequestedEvaluations
            startup={startup}
            group={group}
            history={history}
          />

          <StartupComments startup={startup} group={group} />
        </div>
      </div>
    </div>
  );
}
