import React from "react";

import StartupComments from "./components/StartupComments";
import YourEvaluations from "./components/YourEvaluations";
import StartupHeader from "./components/StartupHeader";
import EvaluationSummaries from "./components/EvaluationSummaries";
import RequestedEvaluations from "./components/RequestedEvaluations";
import EvaluationDetails from "./components/EvaluationDetails";

import "./StartupCard.scss";

export default function StartupCard({ group, startup, adminView }) {
  return (
    <div className="row">
      <div className="col-sm-12 col-xs-12">
        <div className="card group-startup-card">
          <StartupHeader
            startup={startup}
            group={group}
            adminView={adminView}
          />

          <EvaluationSummaries
            startup={startup}
            group={group}
            adminView={adminView}
          />

          <EvaluationDetails
            startup={startup}
            group={group}
            adminView={adminView}
          />

          <YourEvaluations
            startup={startup}
            group={group}
            adminView={adminView}
          />

          <RequestedEvaluations
            startup={startup}
            group={group}
            adminView={adminView}
          />

          <StartupComments
            startup={startup}
            group={group}
            adminView={adminView}
          />
        </div>
      </div>
    </div>
  );
}
