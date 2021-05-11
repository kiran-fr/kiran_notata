import React, { useState } from "react";
import Scrollspy from "react-scrollspy";
import "./edit-evaluation.scss";
import RadioButton from "../../ui-kits/radio-button";

export default function EditEvaluation({
  setEditEvaluation,
  setSaveEvaluation,
  updateEvaluation,
}) {
  const [problemCollapse, setProblemCollapse] = useState("");
  const [conceptCollapse, setConceptCollapse] = useState("");
  const [marketCollapse, setMarketCollapse] = useState("");
  const [teamCollapse, setTeamCollapse] = useState("");
  return (
    <div className="row edit-evaluation-container">
      <div className="col-sm-12">
        <span
          class="material-icons back-icon"
          onClick={() => setEditEvaluation(false)}
        >
          arrow_back_ios
        </span>
        <span className="page-heading">Sharing template</span>
      </div>
      <div className="col-sm-3 col-md-3">
        <div className="menu-container-1">
          <Scrollspy
            items={["Problem", "Concept", "Market", "Team"]}
            currentClassName="is-current"
          >
            <li>
              <a href="#problem">Problem</a>
            </li>
            <li>
              <a href="#concept">Concept</a>
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
      <div className="col-sm-8 col-md-8 edit-details">
        <div className="row" id="problem">
          <div className="col-sm-12 heading">
            <i
              class={`fa ${
                problemCollapse === "" ? "fa-chevron-up" : "fa-chevron-down"
              }`}
              aria-hidden="true"
              onClick={() => {
                setProblemCollapse(problemCollapse === "" ? "collapse" : "");
              }}
            ></i>
            Poblem
          </div>
          <div className={problemCollapse}>
            <div className="row">
              <div className="col-sm-12 question">
                Do you understand the problem?
              </div>
              <div className="options">
                <div>
                  <RadioButton
                    name="problem-question-1"
                    label="yes"
                    id="problem-question-1-yes"
                    checked={false}
                  ></RadioButton>
                </div>
                <div>
                  <RadioButton
                    name="problem-question-1"
                    label="no"
                    id="problem-question-1-no"
                    checked={false}
                  ></RadioButton>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-xs-12 add-comment">
                Add comment
                <input type="text" className="add-comment-txt" />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 question">
                Do you understand the problem?
              </div>
              <div className="options">
                <div>
                  <RadioButton
                    name="problem-question-1"
                    label="yes"
                    id="problem-question-1-yes"
                    checked={false}
                  ></RadioButton>
                </div>
                <div>
                  <RadioButton
                    name="problem-question-1"
                    label="no"
                    id="problem-question-1-no"
                    checked={false}
                  ></RadioButton>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-xs-12 add-comment">
                Add comment
                <input type="text" className="add-comment-txt" />
              </div>
            </div>
          </div>
        </div>
        <div className="row" id="concept">
          <div className="col-sm-12 heading">
            <i
              class={`fa ${
                conceptCollapse === "" ? "fa-chevron-up" : "fa-chevron-down"
              }`}
              aria-hidden="true"
              onClick={() => {
                setConceptCollapse(conceptCollapse === "" ? "collapse" : "");
              }}
            ></i>
            Concept
          </div>
          <div className={conceptCollapse}>
            <div className="row">
              <div className="col-sm-12 question">
                Do you understand the problem?
              </div>
              <div className="options">
                <div>
                  <RadioButton
                    name="problem-question-1"
                    label="yes"
                    id="problem-question-1-yes"
                    checked={false}
                  ></RadioButton>
                </div>
                <div>
                  <RadioButton
                    name="problem-question-1"
                    label="no"
                    id="problem-question-1-no"
                    checked={false}
                  ></RadioButton>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-xs-12 add-comment">
                Add comment
                <input type="text" className="add-comment-txt" />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 question">
                Do you understand the problem?
              </div>
              <div className="options">
                <div>
                  <RadioButton
                    name="problem-question-1"
                    label="yes"
                    id="problem-question-1-yes"
                    checked={false}
                  ></RadioButton>
                </div>
                <div>
                  <RadioButton
                    name="problem-question-1"
                    label="no"
                    id="problem-question-1-no"
                    checked={false}
                  ></RadioButton>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-xs-12 add-comment">
                Add comment
                <input type="text" className="add-comment-txt" />
              </div>
            </div>
          </div>
        </div>
        <div className="row" id="market">
          <div className="col-sm-12 heading">
            <i
              class={`fa ${
                marketCollapse === "" ? "fa-chevron-up" : "fa-chevron-down"
              }`}
              aria-hidden="true"
              onClick={() => {
                setMarketCollapse(marketCollapse === "" ? "collapse" : "");
              }}
            ></i>
            Market
          </div>
          <div className={marketCollapse}>
            <div className="row">
              <div className="col-sm-12 question">
                Do you understand the problem?
              </div>
              <div className="options">
                <div>
                  <RadioButton
                    name="problem-question-1"
                    label="yes"
                    id="problem-question-1-yes"
                    checked={false}
                  ></RadioButton>
                </div>
                <div>
                  <RadioButton
                    name="problem-question-1"
                    label="no"
                    id="problem-question-1-no"
                    checked={false}
                  ></RadioButton>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-xs-12 add-comment">
                Add comment
                <input type="text" className="add-comment-txt" />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 question">
                Do you understand the problem?
              </div>
              <div className="options">
                <div>
                  <RadioButton
                    name="problem-question-1"
                    label="yes"
                    id="problem-question-1-yes"
                    checked={false}
                  ></RadioButton>
                </div>
                <div>
                  <RadioButton
                    name="problem-question-1"
                    label="no"
                    id="problem-question-1-no"
                    checked={false}
                  ></RadioButton>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-xs-12 add-comment">
                Add comment
                <input type="text" className="add-comment-txt" />
              </div>
            </div>
          </div>
        </div>
        <div className="row" id="team">
          <div className="col-sm-12 heading">
            <i
              class={`fa ${
                teamCollapse === "" ? "fa-chevron-up" : "fa-chevron-down"
              }`}
              aria-hidden="true"
              onClick={() => {
                setTeamCollapse(teamCollapse === "" ? "collapse" : "");
              }}
            ></i>
            Team
          </div>
          <div className={teamCollapse}>
            <div className="row">
              <div className="col-sm-12 question">
                Do you understand the problem?
              </div>
              <div className="options">
                <div>
                  <RadioButton
                    name="problem-question-1"
                    label="yes"
                    id="problem-question-1-yes"
                    checked={false}
                  ></RadioButton>
                </div>
                <div>
                  <RadioButton
                    name="problem-question-1"
                    label="no"
                    id="problem-question-1-no"
                    checked={false}
                  ></RadioButton>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-xs-12 add-comment">
                Add comment
                <input type="text" className="add-comment-txt" />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 question">
                Do you understand the problem?
              </div>
              <div className="options">
                <div>
                  <RadioButton
                    name="problem-question-1"
                    label="yes"
                    id="problem-question-1-yes"
                    checked={false}
                  ></RadioButton>
                </div>
                <div>
                  <RadioButton
                    name="problem-question-1"
                    label="no"
                    id="problem-question-1-no"
                    checked={false}
                  ></RadioButton>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-xs-12 add-comment">
                Add comment
                <input type="text" className="add-comment-txt" />
              </div>
            </div>
            <div className="col-sm-12 text-right">
              <button
                className="save-btn delete"
                onClick={() => setSaveEvaluation(true)}
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
