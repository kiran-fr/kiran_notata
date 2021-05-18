import React, { useState } from "react";
import Scrollspy from "react-scrollspy";
import "./edit-evaluation.scss";
import "./summary-evaluation.scss";
import { Modal } from "../../../../../../Components/UI_Kits/Modal/Modal";
import moment from "moment";

export default function SummaryEvaluation({
  setEditEvaluation,
  setSaveEvaluation,
  updateEvaluation,
  companyName,
  selectedTemplateToEvaluate,
  allAnswers,
}) {
  const [problemcollapse, setProblemCollapse] = useState("");
  const [conceptcollapse, setConceptCollapse] = useState("");
  const [deleteMoal, setDeleteMoal] = useState(false);
  console.log("allAnswers", allAnswers, selectedTemplateToEvaluate);
  let sectionNamesArr = selectedTemplateToEvaluate?.sections?.map(section => {
    return {
      name: section.name,
      id: section.id,
    };
  });
  let details = {};
  let sec = selectedTemplateToEvaluate?.sections?.map(item => {
    details[item.id] = "";
  });
  const [collapseDetailList, setCollapseDetailList] = useState(details);

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
        <span className="page-heading">{companyName}</span>
      </div>
      <div className="col-sm-3 col-md-3">
        <div className="menu-container-1">
          <Scrollspy items={sectionNamesArr} currentClassName="is-current">
            {sectionNamesArr.map(link => (
              <li key={link.id}>
                <a
                  href={`#section${link.name}`}
                  onClick={() => {
                    let collapseList = { ...collapseDetailList };
                    collapseList[link.id] = "";
                    setCollapseDetailList(collapseList);
                  }}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </Scrollspy>
        </div>
      </div>
      <div className="col-sm-1 col-md-1"></div>
      <div className="col-sm-8 col-md-8 edit-details summary-details">
        <div className="row">
          <div className="col-sm-5 col-xs-5 summary-heading">Summary</div>
          <div className="col-sm-7 col-xs-7 last-updated">
            Last updated:{" "}
            {moment(selectedTemplateToEvaluate?.createdAt).format("lll")}
          </div>
          <div className="col-sm-12 col-xs-12 created-on">
            Created by: {selectedTemplateToEvaluate?.createdBy}
          </div>
        </div>
        <div className="row total-answers">
          {selectedTemplateToEvaluate?.sections?.map(section => (
            <>
              <div className="col-sm-6 col-xs-6 type-heading">
                {section.name}
              </div>
              <div className="col-sm-6 col-xs-6 attempts">1/2</div>
            </>
          ))}
          {/* <div className="col-sm-6 col-xs-6 type-heading">Concept</div>
          <div className="col-sm-6 col-xs-6 attempts">1/2</div>
          <div className="col-sm-6 col-xs-6 type-heading">Problem</div>
          <div className="col-sm-6 col-xs-6 attempts">0/3</div>
          <div className="col-sm-6 col-xs-6 type-heading">Market</div>
          <div className="col-sm-6 col-xs-6 attempts">1/1</div>
          <div className="col-sm-6 col-xs-6 type-heading">Team</div>
          <div className="col-sm-6 col-xs-6 attempts">1/4</div>
          <div className="col-sm-6 col-xs-6 total-heading">Total</div>
          <div className="col-sm-6 col-xs-6 total-attempts">3/10</div> */}
        </div>
        {selectedTemplateToEvaluate?.sections.map(section => (
          <div className="row section" id={"section" + section.name}>
            <div className="col-sm-6 col-xs-7 section-heading">
              <i
                class={`fa ${
                  collapseDetailList[section.id] === ""
                    ? "fa-chevron-up"
                    : "fa-chevron-down"
                }`}
                aria-hidden="true"
                onClick={() => {
                  let collapseList = { ...collapseDetailList };
                  collapseList[section.id] =
                    collapseList[section.id] === "" ? "collapse" : "";
                  setCollapseDetailList(collapseList);
                }}
              ></i>
              {section.name}
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
            <div
              className={`row question-answers ${
                collapseDetailList[section.id]
              }`}
            >
              {section.questions.map(question => {
                return (
                  <>
                    <div className="col-sm-12 question">{question.name}</div>
                    {question.inputType === "RADIO" &&
                      (allAnswers[question.id]?.val ? (
                        <div className="col-sm-12 answer">
                          {allAnswers[question.id]?.val}
                        </div>
                      ) : (
                        <div className="col-sm-12 no-answer">Not Answered</div>
                      ))}

                    {question.inputType === "CHECK" &&
                      question.options?.map(
                        option =>
                          allAnswers[question.id + option.sid]?.val && (
                            <div className="col-sm-12 answer">
                              {allAnswers[question.id + option.sid]?.val}
                            </div>
                          )
                      )}
                  </>
                );
              })}
              {/* <div className="col-sm-12 question">
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
                  <div className="col-sm-12 answer">Industry monopoly</div> */}
            </div>
          </div>
        ))}

        {/* <div className="row section" id="problem">
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
        </div> */}

        {/* <div className="row section" id="concept">
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
        </div> */}
        <div className="col-sm-12 text-right">
          <button className="delete-btn" onClick={() => setDeleteMoal(true)}>
            DELETE EVALUATION
          </button>
        </div>
      </div>
      {deleteMoal && (
        <Modal
          title="Delete evaluation template"
          submit={() => {
            setEditEvaluation(false);
            setSaveEvaluation(false);
            setDeleteMoal(false);
          }}
          close={() => {
            setDeleteMoal(false);
          }}
          submitTxt="Delete"
          closeTxt="Cancel"
          submitButtonStyle="secondary"
          children={
            <div className="modal-content-description">
              Are you sure you want to delete the evaluation template?
            </div>
          }
        ></Modal>
      )}
    </div>
  );
}
