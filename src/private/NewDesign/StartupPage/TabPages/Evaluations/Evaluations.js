import React, { useState } from "react";
import "./Evaluations.scss";
import Scrollspy from "react-scrollspy";
import { Modal } from "../../../../../Components/UI_Kits/Modal/Modal";
import RequestEvaluation from "./request-evaluation";
import SubmissionFullList from "./submission-full-list";
import EvaluateStartup from "./evaluate-startup";
import EditEvaluation from "./edit-evaluation";
import SummaryEvaluation from "./summary-evaluation";
import { evaluation_templates_page } from "definitions";
import FullListModal from "./FullListModal";
import { getEvaluationsByTemplate } from "../../../srv_startup/pages/GroupV2/_helpers";
import moment from "moment";

// function EditEvaluationSection({connection, account}) {
//
//   return (
//     <div>
//       <div style={{ display: saveEvaluation === true ? "block" : "none" }}>
//         <SummaryEvaluation
//           companyName={connection?.creative?.name}
//           accountData={account}
//           setEditEvaluation={setEditEvaluation}
//           setSaveEvaluation={setSaveEvaluation}
//           selectedTemplateToEvaluate={selectedTemplateToEvaluate}
//           updateEvaluation={type => {
//             setSaveEvaluation(false);
//             setUpdateEvaluation(type);
//           }}
//           allAnswers={allAnswers}
//           evaluation={activeEvaluation}
//         />
//       </div>
//       <div style={{ display: saveEvaluation !== true ? "block" : "none" }}>
//         <EditEvaluation
//           setEvaluateModal={setEvaluateModal}
//           companyName={connection.creative.name}
//           setEditEvaluation={setEditEvaluation}
//           setSaveEvaluation={setSaveEvaluation}
//           updateEvaluation={updateEvaluation}
//           selectedTemplateToEvaluate={selectedTemplateToEvaluate}
//           setAllAnswers={setAllAnswers}
//           allAnswers={allAnswers}
//           connectionId={id}
//           evaluation={activeEvaluation}
//           savedAnswers={savedAnswers}
//           setActiveEvaluation={setActiveEvaluation}
//         />
//       </div>
//     </div>
//   )
// }

function NavigationComp() {
  return (
    <div className="col-lg-3 col-md-3">
      <div className="menu-container">
        <Scrollspy
          items={[
            "My Evaluations",
            "My team Evaluations",
            "Groups Evaluations",
          ]}
          currentClassName="is-current"
        >
          <li>
            <a href="#my-eval">My evaluations</a>
          </li>
          <li>
            <a href="#my-team-eval">My team evaluations</a>
          </li>

          <li>
            <a href="#group-eval">Groups evaluations</a>
          </li>
        </Scrollspy>
      </div>
    </div>
  );
}

function MyEvaluations({ connection }) {
  let myEvaluations = connection?.evaluations?.filter(
    ({ isMe, template }) => isMe && template?.name
  );

  return (
    <div className={`col-sm-12 details`}>
      <div className="eval-section-heading">My evaluations</div>

      <div className="">
        {myEvaluations?.map((evaluation, i) => (
          <div
            key={evaluation.id}
            className={`row ${i === 0 ? "evalations-container__details" : ""}`}
          >
            <div className="col-sm-5 col-xs-9 eval-score-heading">
              {evaluation.template?.name}
            </div>
            <div className="col-sm-4 col-xs-9 submitions">
              {moment(evaluation.createdAt).format("ll")}
            </div>
            <div className="col-sm-3 col-xs-3 score">
              {evaluation?.summary?.scorePercent || 0}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyTeamEvaluations({ connection }) {
  let evaluationsByTemplate = getEvaluationsByTemplate(connection);

  return (
    <div className={`col-sm-12 details`}>
      <div className="eval-section-heading">My teams evaluations</div>

      <div>
        {evaluationsByTemplate?.map(({ evaluations, summary }, i) => (
          <>
            <div
              className={`row ${
                i === 0 ? "evalations-container__details" : ""
              }`}
            >
              <div className="col-sm-5 col-xs-9 eval-score-heading">
                {summary?.templateName}
              </div>

              <div className="col-sm-4 col-xs-9 submitions">
                {summary?.submissions} Submissions
              </div>

              <div className="col-sm-3 col-xs-3 score">
                {summary?.averagePercentageScore}%
              </div>
            </div>
            <div className={`submission-section`}>
              {evaluations.map(evaluation => (
                <div key={evaluation.id} className={`row`}>
                  <div className="col-sm-5 col-xs-9 submitions">
                    {evaluation?.createdByUser?.given_name}{" "}
                    {evaluation?.createdByUser?.family_name}
                  </div>
                  <div className="col-sm-4 col-xs-9 submitions">
                    {moment(evaluation.createdAt).format("ll")}
                  </div>
                  <div className="col-sm-3 col-xs-3 score">
                    {evaluation?.summary?.scorePercent || 0}%
                  </div>
                </div>
              ))}
            </div>
          </>
        ))}
      </div>
    </div>
  );
}

function GroupEvaluations({ connection }) {
  let sharingInfo = connection?.groupSharingInfo;
  sharingInfo = sharingInfo.filter(
    ({ evaluationSummaries }) => evaluationSummaries.length
  );

  return (
    <div className={`col-sm-12 details`}>
      <div className="eval-section-heading">Group evaluations</div>

      <div className="">
        {sharingInfo?.map(info => (
          <div
            key={info.group?.id}
            className="row evalations-container__details"
          >
            <div
              className="col-sm-12 group-heading"
              onClick={() => console.log("go to group page...")}
            >
              {info.group?.name}
            </div>

            {info.evaluationSummaries.map((summary, i) => {
              let evaluations = info?.evaluations?.filter(
                evaluation => evaluation?.template?.id === summary.templateId
              );

              return (
                <div style={{ marginLeft: "15px", marginRight: "15px" }}>
                  <div className={`row`}>
                    <div className="col-sm-5 col-xs-9 eval-score-heading">
                      {summary?.templateName}
                    </div>

                    <div className="col-sm-4 col-xs-9 submitions">
                      {summary?.submissions} Submissions
                    </div>

                    <div className="col-sm-3 col-xs-3 score">
                      {summary?.averagePercentageScore}%
                    </div>
                  </div>
                  <div className={`submission-section`}>
                    {evaluations?.map(evaluation => (
                      <div key={evaluation.id} className={`row`}>
                        <div className="col-sm-5 col-xs-9 submitions">
                          {evaluation?.createdByUser?.given_name}{" "}
                          {evaluation?.createdByUser?.family_name}
                        </div>
                        <div className="col-sm-4 col-xs-9 submitions">
                          {moment(evaluation.createdAt).format("ll")}
                        </div>
                        <div className="col-sm-3 col-xs-3 score">
                          {evaluation?.summary?.scorePercent || 0}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function SummarySection({ connection }) {
  const getTotalScore = arr => {
    if (Array.isArray(arr) && arr.length > 0) {
      return arr?.reduce((acc, obj) => {
        return acc + (obj.score || 0);
      }, 0);
    }
    return 0;
  };

  let totalAvgScore = (
    getTotalScore(connection?.subjectiveScores) /
      connection?.subjectiveScores?.length || 0
  ).toFixed(1);

  return (
    <>
      {/* Summary section */}
      <div className="row evalations-container__details">
        <div className="col-sm-5 col-xs-9 eval-score-heading">
          Average subjective score
        </div>
        <div className="col-sm-4 col-xs-10 submitions">
          {connection?.subjectiveScores?.length || 0} Submission
        </div>
        <div className="col-sm-3 col-xs-2 score">{totalAvgScore}</div>
      </div>

      {/*{*/}
      {/*  !!connection?.evaluationSummaries?.length && (*/}
      {/*    <>*/}
      {/*      <div className="row">*/}
      {/*        <div className="col-sm-12 eval-section-heading">*/}
      {/*          Evaluation summaries*/}
      {/*        </div>*/}
      {/*      </div>*/}

      {/*      {connection?.evaluationSummaries?.map(evaluation => (*/}
      {/*        <div*/}
      {/*          className="row"*/}
      {/*          key={evaluation.id}*/}
      {/*        >*/}
      {/*          <div className="col-sm-5 col-xs-9 eval-score-heading">*/}
      {/*            {evaluation.templateName}*/}
      {/*          </div>*/}
      {/*          <div className="col-sm-4 col-xs-9 submitions">*/}
      {/*            {evaluation.submissions} Submission*/}
      {/*          </div>*/}
      {/*          <div className="col-sm-3 col-xs-3 score">*/}
      {/*            {evaluation.averagePercentageScore || 0}%*/}
      {/*          </div>*/}
      {/*        </div>*/}
      {/*      ))}*/}
      {/*    </>*/}
      {/*  )*/}
      {/*}*/}
    </>
  );
}

export default function Evaluations({ connection, account, history }) {
  const [collapsed, setCollapsed] = useState({});

  // const [myEvalState, setMyEvalState] = useState("");
  // const [myTeamEvalState, setMyTeamEvalState] = useState("");
  // const [groupEvalState, setGroupEvalState] = useState("");

  const [evaluationExpandState, setEvaluationExpandState] = useState({});

  const [evaluateModal, setEvaluateModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [fullListModal, setFullListModal] = useState(false);
  // pass a value to full list from this state variable
  const [fullListModalObj, setFullListModalObj] = useState({});

  const [editEvaluation, setEditEvaluation] = useState(false);
  const [saveEvaluation, setSaveEvaluation] = useState(false);
  const [updateEvaluation, setUpdateEvaluation] = useState("");
  const [selectedTemplateToEvaluate, setSelectedTemplateToEvaluate] = useState(
    {}
  );
  const [activeEvaluation, setActiveEvaluation] = useState(null);
  const [allAnswers, setAllAnswers] = useState([]);
  const [savedAnswers, setSavedAnswers] = useState([]);

  return (
    <div className="row tab-panel-container">
      <div className="col-sm-12">
        <div className="card evaluation-container">
          <div className="row">
            <NavigationComp />

            <div className="col-lg-6 col-md-8 col-sm-12 col-xs-12 evalations-container">
              {/* Header section */}
              <div className="row heading-icon">
                <div className="col-sm-1 col-xs-1 name-icon">
                  {connection?.creative?.name?.substr(0, 1)?.toUpperCase()}
                </div>
                <div className="col-sm-9 col-xs-8 evalations-container__heading">
                  {connection?.creative?.name}
                  <span className="material-icons">star</span>
                </div>
              </div>

              <SummarySection connection={connection} />

              {/* --- */}

              <div className="col-sm-12" id="my-eval">
                <div className="separator" />
              </div>

              <MyEvaluations connection={connection} />

              <div className="col-sm-12" id="my-team-eval">
                <div className="separator" />
              </div>

              {account?.members?.length !== 1 && (
                <MyTeamEvaluations connection={connection} />
              )}

              <div className="col-sm-12" id="group-eval">
                <div className="separator" />
              </div>

              <GroupEvaluations connection={connection} />

              <div className="col-sm-12 text-right">
                <button
                  className="evaluation-templates-btn"
                  onClick={() => history.push(evaluation_templates_page)}
                >
                  Evaluations templates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {fullListModal && (
        <FullListModal
          close={() => setFullListModal(false)}
          evaluation={fullListModalObj}
        />
      )}

      {/*{evaluateModal && (*/}
      {/*  <Modal*/}
      {/*    title="Evaluate startup"*/}
      {/*    close={() => {*/}
      {/*      setEvaluateModal(false);*/}
      {/*    }}*/}
      {/*    children={*/}
      {/*      <EvaluateStartup*/}
      {/*        account={account}*/}
      {/*        setSelectedTemplateToEvaluate={setSelectedTemplateToEvaluate}*/}
      {/*        setActiveEvaluation={setActiveEvaluation}*/}
      {/*        setEditEvaluation={() => {*/}
      {/*          setEvaluateModal(false);*/}
      {/*          setEditEvaluation(true);*/}
      {/*        }}*/}
      {/*        evaluations={evaluations}*/}
      {/*        setSavedAnswers={setSavedAnswers}*/}
      {/*      />*/}
      {/*    }*/}
      {/*  />*/}
      {/*)}*/}
    </div>
  );
}
