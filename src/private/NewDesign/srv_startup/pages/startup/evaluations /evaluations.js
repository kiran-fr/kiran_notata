import React, { useState } from "react";
import "./evaluations.scss";
import Scrollspy from "react-scrollspy";
import { Modal } from "../../../../../../Components/UI_Kits/Modal/Modal";
import RequestEvaluation from "./request-evaluation";
import SubmissionFullList from "./submission-full-list";
import EvaluateStartup from "./evaluate-startup";
import EditEvaluation from "./edit-evaluation";
import SummaryEvaluation from "./summary-evaluation";
import ManageTemplates from "./manage-templates";

export default function Evaluations() {
  const [myEvalState, setMyEvalState] = useState("");
  const [myTeamEvalState, setMyTeamEvalState] = useState("");
  const [expertEvalState, setExpertEvalState] = useState("");
  const [groupEvalState, setGroupEvalState] = useState("");

  const [
    myTeamFirstImpressionEvalState,
    setMyTeamFirstImpressionEvalState,
  ] = useState("collapse");
  const [
    myTeamBeforePitchingEvalState,
    setMyTeamBeforePitchingEvalState,
  ] = useState("collapse");
  const [
    myTeamAfterPitchingEvalState,
    setMyTeamAfterPitchingEvalState,
  ] = useState("collapse");

  const [
    expertFirstImpressionEvalState,
    setExpertFirstImpressionEvalState,
  ] = useState("collapse");
  const [
    expertBeforePitchingEvalState,
    setExpertBeforePitchingEvalState,
  ] = useState("collapse");
  const [
    expertAfterPitchingEvalState,
    setExpertAfterPitchingEvalState,
  ] = useState("collapse");

  const [evaluateModal, setEvaluateModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [fullListModal, setFullListModal] = useState(false);
  const [manageTemplateModal, setManageTemplateModal] = useState(false);
  // pass a value to full list from this state variable
  const [fullListModalObj, setFullListModalObj] = useState({
    evalType: "First Impression",
    submittedBy: "Daria Kyselova",
    summary: "65%",
    details: [
      {
        id: "concept",
        name: "Concept",
        value: "65%",
        detail: [
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
        ],
      },
      {
        id: "market",
        name: "Market",
        value: "65%",
        detail: [
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
        ],
      },
      {
        id: "problem",
        name: "Problem",
        value: "65%",
        detail: [
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
        ],
      },
      {
        id: "team",
        name: "Team",
        value: "65%",
        detail: [
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
        ],
      },
    ],
  });

  const [editEvaluation, setEditEvaluation] = useState(false);
  const [saveEvaluation, setSaveEvaluation] = useState(false);
  const [updateEvaluation, setUpdateEvaluation] = useState("");
  return (
    <div className="row tab-panel-container">
      <div className="col-sm-12">
        <div className="card evaluation-container">
          {editEvaluation ? (
            saveEvaluation ? (
              <SummaryEvaluation
                setEditEvaluation={setEditEvaluation}
                setSaveEvaluation={setSaveEvaluation}
                updateEvaluation={type => {
                  setSaveEvaluation(false);
                  setUpdateEvaluation(type);
                }}
              />
            ) : (
              <EditEvaluation
                setEditEvaluation={setEditEvaluation}
                setSaveEvaluation={setSaveEvaluation}
                updateEvaluation={updateEvaluation}
              />
            )
          ) : (
            <div className="row">
              <div className="col-lg-3 col-md-3">
                <div className="menu-container">
                  <Scrollspy
                    items={[
                      "My evaluations",
                      "My team evaluations",
                      "External experts evaluations",
                      "Groups evaluations",
                    ]}
                    currentClassName="is-current"
                  >
                    <li>
                      <a href="#my-eval" onClick={() => setMyEvalState("")}>
                        My evaluations
                      </a>
                    </li>
                    <li>
                      <a
                        href="#my-team-eval"
                        onClick={() => setMyTeamEvalState("")}
                      >
                        My team evaluations
                      </a>
                    </li>
                    <li>
                      <a
                        href="#external-eval"
                        onClick={() => setExpertEvalState("")}
                      >
                        External experts evaluations
                      </a>
                    </li>
                    <li>
                      <a
                        href="#group-eval"
                        onClick={() => setGroupEvalState("")}
                      >
                        Groups evaluations
                      </a>
                    </li>
                  </Scrollspy>
                </div>
              </div>
              <div className="col-lg-6 col-md-8 col-sm-12 col-xs-12 evalations-container">
                <div className="row heading-icon">
                  <div className="col-sm-1 col-xs-1 name-icon">G</div>
                  <div className="col-sm-9 col-xs-8 evalations-container__heading">
                    Great Startup Inc
                    <span className="material-icons">star</span>
                  </div>
                </div>
                <div className="row evalations-container__details">
                  <div className="col-sm-5 col-xs-9 eval-score-heading">
                    Average subjective score
                  </div>
                  <div className="col-sm-4 col-xs-10 submitions">
                    15 Submitions
                  </div>
                  <div className="col-sm-3 col-xs-2 score">8,5</div>
                </div>
                <div className="row">
                  <div className="col-sm-12 eval-section-heading">
                    Average evaluations
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-5 col-xs-9 eval-score-heading">
                    First Impression
                  </div>
                  <div className="col-sm-4 col-xs-9 submitions">
                    20 Submitions
                  </div>
                  <div className="col-sm-3 col-xs-3 score">8,5</div>
                </div>
                <div className="row">
                  <div className="col-sm-5 col-xs-9 eval-score-heading">
                    Before Pitching
                  </div>
                  <div className="col-sm-4 col-xs-9 submitions">
                    20 Submitions
                  </div>
                  <div className="col-sm-3 col-xs-3 score">8,5</div>
                </div>
                <div className="row">
                  <div className="col-sm-5 col-xs-9 eval-score-heading">
                    After Pitching
                  </div>
                  <div className="col-sm-4 col-xs-9 submitions">
                    20 Submitions
                  </div>
                  <div className="col-sm-3 col-xs-3 score">8,5</div>
                </div>
                <div className="col-sm-12" id="my-eval">
                  <div className="separator"></div>
                </div>
                <div className={`col-sm-12 details`}>
                  <div className="col-sm-8 col-xs-12 heading">
                    <i
                      class={`fa ${
                        myEvalState === "" ? "fa-chevron-up" : "fa-chevron-down"
                      }`}
                      aria-hidden="true"
                      onClick={() =>
                        setMyEvalState(myEvalState === "" ? "collapse" : "")
                      }
                    ></i>
                    My evaluations
                  </div>
                  <div className="col-sm-4 col-xs-12 request-eval">
                    <button onClick={() => setEvaluateModal(true)}>
                      Evaluate
                    </button>
                  </div>
                  <div className={myEvalState}>
                    {/* <div className="row evalations-container__details">
                          <div className="col-sm-6 col-xs-9 eval-score-heading">Avarage subjective score</div>
                          <div className="col-sm-4 col-xs-10 submitions">15 Submitions</div>
                          <div className="col-sm-2 col-xs-2 score">8,5</div>                    
                        </div>
                        <div className="row">
                          <div className="col-sm-12 eval-section-heading">Avarage evaluations</div>
                        </div> */}
                    <div className="row evalations-container__details">
                      <div className="col-sm-5 col-xs-9 eval-score-heading">
                        First Impression
                      </div>
                      <div className="col-sm-4 col-xs-9 submitions">
                        20 Submitions
                      </div>
                      <div className="col-sm-3 col-xs-3 score">8,5</div>
                    </div>
                    <div className="row">
                      <div className="col-sm-5 col-xs-9 eval-score-heading">
                        Before Pitching
                      </div>
                      <div className="col-sm-4 col-xs-9 submitions">
                        20 Submitions
                      </div>
                      <div className="col-sm-3 col-xs-3 score">8,5</div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12" id="my-team-eval">
                  <div className="separator"></div>
                </div>

                <div className={`col-sm-12 details`}>
                  <div className="heading">
                    <i
                      class={`fa ${
                        myTeamEvalState === ""
                          ? "fa-chevron-up"
                          : "fa-chevron-down"
                      }`}
                      aria-hidden="true"
                      onClick={() =>
                        setMyTeamEvalState(
                          myTeamEvalState === "" ? "collapse" : ""
                        )
                      }
                    ></i>
                    My team evaluations
                  </div>
                  <div className={myTeamEvalState}>
                    <div className="row evalations-container__details">
                      <div className="col-sm-5 col-xs-9 eval-score-heading">
                        <i
                          className={`fa ${
                            myTeamFirstImpressionEvalState === ""
                              ? "fa-chevron-up"
                              : "fa-chevron-down"
                          }`}
                          aria-hidden="true"
                          onClick={() =>
                            setMyTeamFirstImpressionEvalState(
                              myTeamFirstImpressionEvalState === ""
                                ? "collapse"
                                : ""
                            )
                          }
                        ></i>
                        First Impression
                      </div>
                      <div className="col-sm-4 col-xs-9 submitions">
                        20 Submitions
                      </div>
                      <div className="col-sm-3 col-xs-3 score">8,5</div>
                    </div>
                    <div
                      className={`submission-section ${myTeamFirstImpressionEvalState}`}
                    >
                      <div className="row">
                        <div className="col-sm-9 col-xs-9 submitions">
                          Daria Kyselova <span className="you">(you)</span>
                        </div>
                        <div className="col-sm-3 col-xs-3 score score-submisisons">
                          75%{" "}
                          <span
                            className="full-list"
                            onClick={() => setFullListModal(true)}
                          >
                            Full List
                          </span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-9 col-xs-9 submitions">
                          Roman Kaykov
                        </div>
                        <div className="col-sm-3 col-xs-3 score score-submisisons">
                          75%{" "}
                          <span
                            className="full-list"
                            onClick={() => setFullListModal(true)}
                          >
                            Full List
                          </span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-9 col-xs-9 submitions">
                          Anton Konovalov
                        </div>
                        <div className="col-sm-3 col-xs-3 score score-submisisons">
                          75%{" "}
                          <span
                            className="full-list"
                            onClick={() => setFullListModal(true)}
                          >
                            Full List
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-5 col-xs-9 eval-score-heading">
                        <i
                          className={`fa ${
                            myTeamBeforePitchingEvalState === ""
                              ? "fa-chevron-up"
                              : "fa-chevron-down"
                          }`}
                          aria-hidden="true"
                          onClick={() =>
                            setMyTeamBeforePitchingEvalState(
                              myTeamBeforePitchingEvalState === ""
                                ? "collapse"
                                : ""
                            )
                          }
                        ></i>
                        Before Pitching
                      </div>
                      <div className="col-sm-4 col-xs-9 submitions">
                        20 Submitions
                      </div>
                      <div className="col-sm-3 col-xs-3 score">8,5</div>
                    </div>
                    <div
                      className={`submission-section ${myTeamBeforePitchingEvalState}`}
                    >
                      <div className="row">
                        <div className="col-sm-9 col-xs-9 submitions">
                          Daria Kyselova <span className="you">(you)</span>
                        </div>
                        <div className="col-sm-3 col-xs-3 score score-submisisons">
                          75%{" "}
                          <span
                            className="full-list"
                            onClick={() => setFullListModal(true)}
                          >
                            Full List
                          </span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-9 col-xs-9 submitions">
                          Roman Kaykov
                        </div>
                        <div className="col-sm-3 col-xs-3 score score-submisisons">
                          75%{" "}
                          <span
                            className="full-list"
                            onClick={() => setFullListModal(true)}
                          >
                            Full List
                          </span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-9 col-xs-9 submitions">
                          Anton Konovalov
                        </div>
                        <div className="col-sm-3 col-xs-3 score score-submisisons">
                          75%{" "}
                          <span
                            className="full-list"
                            onClick={() => setFullListModal(true)}
                          >
                            Full List
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-5 col-xs-9 eval-score-heading">
                        <i
                          className={`fa ${
                            myTeamAfterPitchingEvalState === ""
                              ? "fa-chevron-up"
                              : "fa-chevron-down"
                          }`}
                          aria-hidden="true"
                          onClick={() =>
                            setMyTeamAfterPitchingEvalState(
                              myTeamAfterPitchingEvalState === ""
                                ? "collapse"
                                : ""
                            )
                          }
                        ></i>
                        After Pitching
                      </div>
                      <div className="col-sm-4 col-xs-9 submitions">
                        20 Submitions
                      </div>
                      <div className="col-sm-3 col-xs-3 score">8,5</div>
                    </div>
                    <div
                      className={`submission-section ${myTeamAfterPitchingEvalState}`}
                    >
                      <div className="row">
                        <div className="col-sm-9 col-xs-9 submitions">
                          Daria Kyselova <span className="you">(you)</span>
                        </div>
                        <div className="col-sm-3 col-xs-3 score score-submisisons">
                          75%{" "}
                          <span
                            className="full-list"
                            onClick={() => setFullListModal(true)}
                          >
                            Full List
                          </span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-9 col-xs-9 submitions">
                          Roman Kaykov
                        </div>
                        <div className="col-sm-3 col-xs-3 score score-submisisons">
                          75%{" "}
                          <span
                            className="full-list"
                            onClick={() => setFullListModal(true)}
                          >
                            Full List
                          </span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-9 col-xs-9 submitions">
                          Anton Konovalov
                        </div>
                        <div className="col-sm-3 col-xs-3 score score-submisisons">
                          75%{" "}
                          <span
                            className="full-list"
                            onClick={() => setFullListModal(true)}
                          >
                            Full List
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12" id="external-eval">
                  <div className="separator"></div>
                </div>
                <div className={`col-sm-12 details`}>
                  <div className="col-sm-8 col-xs-12 heading">
                    <i
                      class={`fa ${
                        expertEvalState === ""
                          ? "fa-chevron-up"
                          : "fa-chevron-down"
                      }`}
                      aria-hidden="true"
                      onClick={() =>
                        setExpertEvalState(
                          expertEvalState === "" ? "collapse" : ""
                        )
                      }
                    ></i>
                    External experts evaluations
                  </div>
                  <div className="col-sm-4 col-xs-12 request-eval">
                    <button onClick={() => setRequestModal(true)}>
                      Request Evaluation
                    </button>
                  </div>
                  <div className={expertEvalState}>
                    <div className="row evalations-container__details">
                      <div className="col-sm-5 col-xs-9 eval-score-heading">
                        <i
                          className={`fa ${
                            expertFirstImpressionEvalState === ""
                              ? "fa-chevron-up"
                              : "fa-chevron-down"
                          }`}
                          aria-hidden="true"
                          onClick={() =>
                            setExpertFirstImpressionEvalState(
                              expertFirstImpressionEvalState === ""
                                ? "collapse"
                                : ""
                            )
                          }
                        ></i>
                        First Impression
                      </div>
                      <div className="col-sm-4 col-xs-9 submitions">
                        20 Submitions
                      </div>
                      <div className="col-sm-3 col-xs-3 score">8,5</div>
                    </div>
                    <div
                      className={`submission-section ${expertFirstImpressionEvalState}`}
                    >
                      <div className="row">
                        <div className="col-sm-9 col-xs-9 submitions">
                          Daria Kyselova <span className="you">(you)</span>
                        </div>
                        <div className="col-sm-3 col-xs-3 score score-submisisons">
                          75%{" "}
                          <span
                            className="full-list"
                            onClick={() => setFullListModal(true)}
                          >
                            Full List
                          </span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-9 col-xs-9 submitions">
                          Roman Kaykov
                        </div>
                        <div className="col-sm-3 col-xs-3 score score-submisisons">
                          75%{" "}
                          <span
                            className="full-list"
                            onClick={() => setFullListModal(true)}
                          >
                            Full List
                          </span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-9 col-xs-9 submitions">
                          Anton Konovalov
                        </div>
                        <div className="col-sm-3 col-xs-3 score score-submisisons">
                          75%{" "}
                          <span
                            className="full-list"
                            onClick={() => setFullListModal(true)}
                          >
                            Full List
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-5 col-xs-9 eval-score-heading">
                        <i
                          className={`fa ${
                            expertBeforePitchingEvalState === ""
                              ? "fa-chevron-up"
                              : "fa-chevron-down"
                          }`}
                          aria-hidden="true"
                          onClick={() =>
                            setExpertBeforePitchingEvalState(
                              expertBeforePitchingEvalState === ""
                                ? "collapse"
                                : ""
                            )
                          }
                        ></i>
                        Before Pitching
                      </div>
                      <div className="col-sm-4 col-xs-9 submitions">
                        20 Submitions
                      </div>
                      <div className="col-sm-3 col-xs-3 score">8,5</div>
                    </div>
                    <div
                      className={`submission-section ${expertBeforePitchingEvalState}`}
                    >
                      <div className="row">
                        <div className="col-sm-9 col-xs-9 submitions">
                          Daria Kyselova <span className="you">(you)</span>
                        </div>
                        <div className="col-sm-3 col-xs-3 score score-submisisons">
                          75%{" "}
                          <span
                            className="full-list"
                            onClick={() => setFullListModal(true)}
                          >
                            Full List
                          </span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-9 col-xs-9 submitions">
                          Roman Kaykov
                        </div>
                        <div className="col-sm-3 col-xs-3 score score-submisisons">
                          75%{" "}
                          <span
                            className="full-list"
                            onClick={() => setFullListModal(true)}
                          >
                            Full List
                          </span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-9 col-xs-9 submitions">
                          Anton Konovalov
                        </div>
                        <div className="col-sm-3 col-xs-3 score score-submisisons">
                          75%{" "}
                          <span
                            className="full-list"
                            onClick={() => setFullListModal(true)}
                          >
                            Full List
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-5 col-xs-9 eval-score-heading">
                        <i
                          className={`fa ${
                            expertAfterPitchingEvalState === ""
                              ? "fa-chevron-up"
                              : "fa-chevron-down"
                          }`}
                          aria-hidden="true"
                          onClick={() =>
                            setExpertAfterPitchingEvalState(
                              expertAfterPitchingEvalState === ""
                                ? "collapse"
                                : ""
                            )
                          }
                        ></i>
                        After Pitching
                      </div>
                      <div className="col-sm-4 col-xs-9 submitions">
                        20 Submitions
                      </div>
                      <div className="col-sm-3 col-xs-3 score">8,5</div>
                    </div>
                    <div
                      className={`submission-section ${expertAfterPitchingEvalState}`}
                    >
                      <div className="row">
                        <div className="col-sm-9 col-xs-9 submitions">
                          Daria Kyselova <span className="you">(you)</span>
                        </div>
                        <div className="col-sm-3 col-xs-3 score score-submisisons">
                          75%{" "}
                          <span
                            className="full-list"
                            onClick={() => setFullListModal(true)}
                          >
                            Full List
                          </span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-9 col-xs-9 submitions">
                          Roman Kaykov
                        </div>
                        <div className="col-sm-3 col-xs-3 score score-submisisons">
                          75%{" "}
                          <span
                            className="full-list"
                            onClick={() => setFullListModal(true)}
                          >
                            Full List
                          </span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-9 col-xs-9 submitions">
                          Anton Konovalov
                        </div>
                        <div className="col-sm-3 col-xs-3 score score-submisisons">
                          75%{" "}
                          <span
                            className="full-list"
                            onClick={() => setFullListModal(true)}
                          >
                            Full List
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-12" id="group-eval">
                  <div className="separator"></div>
                </div>
                <div className={`col-sm-12 details`}>
                  <div className="heading">
                    <i
                      class={`fa ${
                        groupEvalState === ""
                          ? "fa-chevron-up"
                          : "fa-chevron-down"
                      }`}
                      aria-hidden="true"
                      onClick={() =>
                        setGroupEvalState(
                          groupEvalState === "" ? "collapse" : ""
                        )
                      }
                    ></i>
                    Groups evaluations
                  </div>
                  <div className={groupEvalState}>
                    <div className="row evalations-container__details">
                      <div className="col-sm-12 group-heading">Big Group 1</div>
                      <div className="evalations-container__heading">
                        Average subjective score
                      </div>
                      <div className="col-sm-12 eval-section-heading">
                        Average evaluations
                      </div>
                      <div className="col-sm-5 col-xs-9 eval-score-heading">
                        {" "}
                        First Impression
                      </div>
                      <div className="col-sm-4 col-xs-9 submitions">
                        20 Submitions
                      </div>
                      <div className="col-sm-3 col-xs-3 score">8,5</div>
                    </div>
                    <div className="row">
                      <div className="col-sm-5 col-xs-9 eval-score-heading">
                        {" "}
                        Before Pitching
                      </div>
                      <div className="col-sm-4 col-xs-9 submitions">
                        20 Submitions
                      </div>
                      <div className="col-sm-3 col-xs-3 score">8,5</div>
                    </div>
                    <div className="row">
                      <div className="col-sm-5 col-xs-9 eval-score-heading">
                        {" "}
                        After Pitching
                      </div>
                      <div className="col-sm-4 col-xs-9 submitions">
                        20 Submitions
                      </div>
                      <div className="col-sm-3 col-xs-3 score">8,5</div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 text-right">
                  <button
                    className="evaluation-templates-btn"
                    onClick={() => setManageTemplateModal(true)}
                  >
                    Evaluations templates
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {requestModal && (
        <Modal
          title="Share"
          submit={() => {
            setRequestModal(false);
          }}
          close={() => {
            setRequestModal(false);
          }}
          submitTxt="Request"
          closeTxt="Cancel"
          children={<RequestEvaluation />}
        ></Modal>
      )}
      {fullListModal && (
        <Modal
          title={`${fullListModalObj.evalType} (${fullListModalObj.submittedBy})`}
          submit={() => {
            setFullListModal(false);
          }}
          close={() => {
            setFullListModal(false);
          }}
          submitTxt="OK"
          children={<SubmissionFullList obj={fullListModalObj} />}
        ></Modal>
      )}
      {evaluateModal && (
        <Modal
          title="Evaluate startup"
          close={() => {
            setEvaluateModal(false);
          }}
          children={
            <EvaluateStartup
              setEditEvaluation={() => {
                setEvaluateModal(false);
                setEditEvaluation(true);
              }}
            />
          }
        ></Modal>
      )}
      {manageTemplateModal && (
        <Modal
          title="Manage templates"
          submit={() => {
            setManageTemplateModal(false);
          }}
          close={() => {
            setManageTemplateModal(false);
          }}
          submitTxt="Save"
          closeTxt="Cancel"
          children={<ManageTemplates></ManageTemplates>}
        ></Modal>
      )}
    </div>
  );
}
