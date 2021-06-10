import React, { useEffect, useState } from "react";
import Scrollspy from "react-scrollspy";
// import "./edit-evaluation.scss";
// import "./summary-evaluation.scss";
import red_color from "../../../assets/images/red_color.svg";
import green_color from "../../../assets/images/green_color.svg";
import yellow_color from "../../../assets/images/yellow_color.svg";


import { Modal } from "Components/UI_Kits/Modal/Modal";
import moment from "moment";
import { useLazyQuery, useMutation } from "@apollo/client";
import { evaluationDelete } from "private/Apollo/Mutations";
import {
  connectionGet,
  evaluationGet,
  evaluationTemplateGet,
} from "../../Apollo/Queries";
import { GhostLoader } from "../../../Components/elements";
import { evaluate_page, startup_page } from "../../../definitions";

export default function EvaluationSummaryPage({ match, history }) {
  let { connectionId, templateId, evaluationId } = match?.params;

  // States
  const [deleteModal, setDeleteModal] = useState(false);
  const [collapsed, setCollapsed] = useState({});

  // Queries
  const [getConnection, connectionRes] = useLazyQuery(connectionGet);
  const [getTemplate, templateRes] = useLazyQuery(evaluationTemplateGet);
  const [getEvaluation, evaluationRes] = useLazyQuery(evaluationGet);

  // Mutations
  const [mutateEvaluationDelete, deleteRes] = useMutation(evaluationDelete);

  // Maps and reducers
  let connection = connectionRes?.data?.connectionGet;
  let template = templateRes?.data?.evaluationTemplateGet;
  let evaluation = evaluationRes?.data?.evaluationGet;

  // Effects
  useEffect(() => {
    try {
      let variables = { id: connectionId };
      getConnection({ variables });
    } catch (error) {
      return console.log("error", error);
    }
  }, [connectionId]);

  useEffect(() => {
    try {
      let variables = { id: templateId };
      getTemplate({ variables });
    } catch (error) {
      return console.log("error", error);
    }
  }, [templateId]);

  useEffect(() => {
    try {
      let variables = { id: evaluationId };
      getEvaluation({ variables });
    } catch (error) {
      return console.log("error", error);
    }
  }, [evaluationId]);

  const deleteEvaluation = async () => {
    let variables = { id: evaluationId };
    try {
      await mutateEvaluationDelete({ variables });
      history.push(`${startup_page}/company/${connection?.id}?tab=2`);
    } catch (error) {
      return console.log("error", error);
    }
  };

  const getScoreCount = (answers, sectionId) => {
    return answers?.filter(ans => ans.sectionId === sectionId)?.length || 0;
  };

  const findAns = questionId => {
    return evaluation?.answers?.find(ans => ans.questionId === questionId);
  };

  let isLoading =
    connectionRes.loading || templateRes.loading || evaluationRes.loading;

  if (isLoading) {
    return <GhostLoader />;
  }

  return (
    <div className="card edit-evaluation-container">
      <div className="col-sm-12">
        <span
          class="material-icons back-icon"
          onClick={() =>
            history.push(`${startup_page}/company/${connection?.id}?tab=2`)
          }
        >
          arrow_back_ios
        </span>
        <span className="page-heading">{connection?.creative?.name}</span>
      </div>
      <div className="col-sm-3 col-md-3">
        <div className="menu-container-1">
          <Scrollspy
            items={template?.sections || []}
            currentClassName="is-current"
          >
            {template?.sections?.map(section => (
              <li key={section.id}>
                <a
                  href={`#${section.name}`}
                  onClick={() => {
                    setCollapsed({
                      ...collapsed,
                      [section.id]: false,
                    });
                  }}
                >
                  {section.name}
                </a>
              </li>
            ))}
          </Scrollspy>
        </div>
      </div>
      <div className="col-sm-1 col-md-1" />
      <div className="col-sm-8 col-md-8 edit-details summary-details">
        <div className="row">
          <div className="col-sm-5 col-xs-5 summary-heading">Summary</div>
          <div className="col-sm-7 col-xs-7 last-updated">
            Last updated: {moment(evaluation?.createdAt).format("ll")}
          </div>
          <div className="col-sm-12 col-xs-12 created-on">
            Created by: {evaluation?.createdByUser?.given_name}{" "}
            {evaluation?.createdByUser?.family_name}{" "}
          </div>
        </div>
        <div className="row total-answers">
          {template?.sections?.map(section => (
            <div className="row summary-list">
              <div className="col-sm-6 col-xs-6 type-heading">
                {section.name}
              </div>
              <div className="col-sm-6 col-xs-6 attempts">{`${getScoreCount(
                evaluation?.answers || [],
                section.id
              )}/${section?.questions?.length || 0}`}</div>
            </div>
          ))}
        </div>
        {template?.sections.map(section => (
          <div className="row section" id={section.name}>
            <div className="col-sm-6 col-xs-7 section-heading">
              <i
                className={`fa fa-chevron-up`}
                className={`fa ${
                  collapsed[section.id] ? "fa-chevron-up" : "fa-chevron-down"
                }`}
                aria-hidden="true"
                onClick={() => {
                  setCollapsed({
                    ...collapsed,
                    [section.id]: !collapsed[section.id],
                  });
                }}
              />
              <div>{section.name}</div>
            </div>
            <div className="col-sm-6 col-xs-5 last-updated">
              {`${getScoreCount(evaluation?.answers, section.id)} of ${
                section?.questions?.length || 0
              } questions answered`}
            </div>
            <div
              className={`row question-answers ${
                collapsed[section?.id] ? "collapse" : ""
              }`}
            >
              {section.questions.map(question => {
                return (
                  <>
                    <div
                      className="col-sm-12 question"
                      style={{
                        marginLeft: "0px",
                        marginBottom: "0px",
                        marginTop: "30px",
                      }}
                    >
                      {question.name}
                    </div>

                    {findAns(question.id) ? (
                      <div className="col-sm-12 answer">
                        <img src=
                          {
                            findAns(question.id)?.val === "1"
                            ?
                              red_color
                            : 
                              findAns(question.id)?.val === "2"
                              ?
                                yellow_color
                              :
                                green_color
                          }
                          width="20"
                          height="20"
                        />
                      </div>
                    ) : (
                      <div className="col-sm-12 no-answer">Not Answered</div>
                    )}
                  </>
                );
              })}
            </div>
          </div>
        ))}

        <div className="col-sm-12 text-right">
          <button
            className="edit-btn"
            onClick={() => {
              history.push(
                `${evaluate_page}/${connectionId}/${templateId}/${evaluationId}`
              );
            }}
          >
            EDIT EVALUATION
            {/*DELETE EVALUATION*/}
          </button>
        </div>

        <div
          className="delete-txt"
          onClick={() => {
            setDeleteModal(true);
          }}
        >
          delete permanently
        </div>
      </div>

      {deleteModal && (
        <Modal
          title="Delete evaluation template"
          submit={deleteEvaluation}
          loading={deleteRes.loading}
          close={() => {
            setDeleteModal(false);
          }}
          submitTxt="Delete"
          closeTxt="Cancel"
          submitButtonStyle="secondary"
          children={
            <div className="modal-content-description">
              Are you sure you want to delete the evaluation?
            </div>
          }
        />
      )}
    </div>
  );
}
