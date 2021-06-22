import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  connectionGet,
  evaluationGet,
  evaluationTemplateGet,
} from "../../Apollo/Queries";
import { evaluationUpdate, evaluationCreate } from "private/Apollo/Mutations";
import { GhostLoader } from "../../../Components/elements";
import Scrollspy from "react-scrollspy";
import { GeneralInput } from "../StartupPage/Inputs/GeneralInput";
import { evaluation_summary_page, startup_page } from "../../../definitions";
import queryString from "query-string";
import { groupEvaluationAdd } from "../../Apollo/Mutations";
import "./edit-evaluation.scss";

const transform = obj => {
  if (obj) {
    return {
      inputType: obj.inputType,
      questionId: obj.questionId,
      sectionId: obj.sectionId,
      sid: obj.sid,
      val: obj.val,
    };
  }
};

export default function EvaluatePage({ match, history, location }) {
  let { connectionId, templateId, evaluationId } = match?.params;

  // States
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState({});

  // Queries
  const [getConnection, connectionRes] = useLazyQuery(connectionGet);
  const [getTemplate, templateRes] = useLazyQuery(evaluationTemplateGet);
  const [getEvaluation, evaluationRes] = useLazyQuery(evaluationGet);

  // Mutations
  const [mutateEvaluationUpdate] = useMutation(evaluationUpdate);
  const [mutateEvaluationCreate] = useMutation(evaluationCreate);
  const [evaluationAddToGroup] = useMutation(groupEvaluationAdd);

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

  useEffect(() => {
    if (evaluation) {
      let ansArr = evaluation?.answers?.map(transform);
      setAnswers(ansArr || []);
    }
  }, [evaluation]);

  // Functions

  const save = async () => {
    console.log("save");

    let { groupId } = queryString.parse(location.search);

    setLoading(true);

    // Create new
    if (!evaluationId) {
      console.log("new");

      try {
        let variables = {
          connectionId,
          templateId,
          answers,
        };
        let res = await mutateEvaluationCreate({ variables });
        evaluationId = res?.data?.evaluationCreate?.id;
      } catch (error) {
        console.log("error", error);
      }
    }

    // Update
    if (evaluationId) {
      console.log("update");

      try {
        let updateVariables = {
          id: evaluationId,
          answers,
        };
        await mutateEvaluationUpdate({
          variables: updateVariables,
        });
      } catch (error) {
        console.log("error", error);
      }
    }

    if (groupId) {
      // Variables
      let variables = {
        evaluationId,
        groupId,
        creativeId: connection.creative.id,
      };

      // Add evaluation
      try {
        await evaluationAddToGroup({ variables });
      } catch (error) {
        console.log("error", error);
      }
    }

    history.push(
      `${evaluation_summary_page}/${connectionId}/${templateId}/${evaluationId}`
    );
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
          className="material-icons back-icon"
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
      <div className="col-sm-8 col-md-8 edit-details">
        {template?.sections?.map(section => (
          <div className="row" id={section.name}>
            <div className="col-sm-12 heading">
              <i
                className={`fa ${
                  collapsed[section?.id] ? "fa-chevron-up" : "fa-chevron-down"
                }`}
                aria-hidden="true"
                onClick={() => {
                  setCollapsed({
                    ...collapsed,
                    [section.id]: !collapsed[section.id],
                  });
                }}
              />
              {section.name}
            </div>
            <div className={`${collapsed[section?.id] ? "collapse" : ""}`}>
              {section?.questions.map(question => (
                <>
                  <div className="row">
                    <div className="col-sm-12 question">
                      {question.name}
                      {question.description && (
                        <div>{question.description}</div>
                      )}
                    </div>

                    <div className="options">
                      <GeneralInput
                        question={question}
                        section={section}
                        answers={answers}
                        setAnswers={setAnswers}
                      />

                      {/*<div className="row">*/}
                      {/*  <div className="col-sm-12 col-xs-12 add-comment">*/}
                      {/*    Add comment*/}
                      {/*    <div className="textbox">*/}
                      {/*      <textarea placeholder="Write your comment..."/>*/}
                      {/*    </div>*/}
                      {/*  </div>*/}
                      {/*</div>*/}
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        ))}
        <div className="col-sm-12 text-right">
          <button className="save-btn delete" onClick={save}>
            {loading ? (
              <i className="fa fa-spinner fa-spin" />
            ) : (
              <span>SAVE</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
