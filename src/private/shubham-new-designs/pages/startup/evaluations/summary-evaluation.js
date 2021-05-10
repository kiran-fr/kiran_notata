import React, { useState } from "react";
import Scrollspy from "react-scrollspy";
import "./edit-evaluation.scss";
import "./summary-evaluation.scss";

export default function SummaryEvaluation({
  setEditEvaluation,
  setSaveEvaluation,
  updateEvaluation,
}) {
  const [problemcollapse, setProblemCollapse] = useState("");
  const [conceptcollapse, setConceptCollapse] = useState("");
  return (
    <div className="row edit-evaluation-container">
      <div className="col-sm-12">
        <span
          class="material-icons back-icon"
          onClick={() => {
            setEditEvaluation(false);
            setSaveEvaluation(false);
          }}
        >
          arrow_back_ios
        </span>
        <span className="page-heading">Great Startup Inc</span>
      </div>
      <div className="col-sm-3 col-md-3">
        <div className="menu-container-1">
          <Scrollspy
            items={["Problem", "Concept", "Market", "Team"]}
            currentClassName="is-current"
          >
            <li>
              <a href="#problem" onClick={() => setProblemCollapse("")}>
                Problem
              </a>
            </li>
            <li>
              <a href="#concept" onClick={() => setConceptCollapse("")}>
                Concept
              </a>
            </li>
            <li>
              <a href="#market">Market</a>
            </li>
            <li>
              <a href="#team">Team</a>
            </li>
          </Scrollspy>
        </div>
      </div>
      <div className="col-sm-1 col-md-1"></div>
      <div className="col-sm-8 col-md-8 edit-details summary-details">
        <div className="row">
          <div className="col-sm-5 col-xs-5 summary-heading">Summary</div>
          <div className="col-sm-7 col-xs-7 last-updated">
            Last updated: Feb 2, 2021 11:34 PM
          </div>
          <div className="col-sm-12 col-xs-12 created-on">
            Created by: Daria Kyselova
          </div>
        </div>
        <div className="row total-answers">
          <div className="col-sm-6 col-xs-6 type-heading">Concept</div>
          <div className="col-sm-6 col-xs-6 attempts">1/2</div>
          <div className="col-sm-6 col-xs-6 type-heading">Problem</div>
          <div className="col-sm-6 col-xs-6 attempts">0/3</div>
          <div className="col-sm-6 col-xs-6 type-heading">Market</div>
          <div className="col-sm-6 col-xs-6 attempts">1/1</div>
          <div className="col-sm-6 col-xs-6 type-heading">Team</div>
          <div className="col-sm-6 col-xs-6 attempts">1/4</div>
          <div className="col-sm-6 col-xs-6 total-heading">Total</div>
          <div className="col-sm-6 col-xs-6 total-attempts">3/10</div>
        </div>
        <div className="row section" id="problem">
          <div className="col-sm-6 col-xs-7 section-heading">
            <i
              class={`fa ${
                problemcollapse === "" ? "fa-chevron-up" : "fa-chevron-down"
              }`}
              aria-hidden="true"
              onClick={() => {
                setProblemCollapse(problemcollapse === "" ? "collapse" : "");
              }}
            ></i>
            Poblem
            <i
              class="fa fa-pencil"
              aria-hidden="true"
              onClick={() => updateEvaluation("problem")}
            ></i>
          </div>
          <div className="col-sm-6 col-xs-5 last-updated">
            3 of 3 questions answered
          </div>
          <div className="col-sm-12 created-on">2 out of 1 points</div>
          <div className={`row question-answers ${problemcollapse}`}>
            <div className="col-sm-12 question">
              Do you understand the problem?
            </div>
            <div className="col-sm-12 answer">yes</div>
            <div className="col-sm-12 question">
              Do you believe they address a real problem?
            </div>
            <div className="col-sm-12 answer">yes</div>
            <div className="col-sm-12 question">
              Why have no one solved this problem before?
            </div>
            <div className="col-sm-12 answer">Too risky</div>
            <div className="col-sm-12 answer">Industry monopoly</div>
          </div>
        </div>
        <div className="row section" id="concept">
          <div className="col-sm-6 col-xs-7 section-heading">
            <i
              class={`fa ${
                conceptcollapse === "" ? "fa-chevron-up" : "fa-chevron-down"
              }`}
              aria-hidden="true"
              onClick={() => {
                setConceptCollapse(conceptcollapse === "" ? "collapse" : "");
              }}
            ></i>
            Concept
            <i
              class="fa fa-pencil"
              aria-hidden="true"
              onClick={() => updateEvaluation("concept")}
            ></i>
          </div>
          <div className="col-sm-6 col-xs-5 last-updated">
            3 of 3 questions answered
          </div>
          <div className="col-sm-12 created-on">2 out of 1 points</div>
          <div className={`row question-answers ${conceptcollapse}`}>
            <div className="col-sm-12 question">
              Do you understand the problem?
            </div>
            <div className="col-sm-12 answer">yes</div>
            <div className="col-sm-12 question">
              Do you believe they address a real problem?
            </div>
            <div className="col-sm-12 answer">yes</div>
            <div className="col-sm-12 question">
              Why have no one solved this problem before?
            </div>
            <div className="col-sm-12 answer">Too risky</div>
            <div className="col-sm-12 answer">Industry monopoly</div>
          </div>
        </div>
        <div className="col-sm-12 text-right">
          <button className="delete-btn">DELETE EVALUATION</button>
        </div>
      </div>
    </div>
  );
}
