import React, { useState } from "react";
import "./evaluate-startup.scss";
import moment from "moment";
import { evaluationGet } from "private/Apollo/Queries";
import { Loader } from "Components/UI_Kits";
import { appsyncClient } from "../../../../../awsconfig";

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

export default function EvaluateStartup({
  setEditEvaluation,
  accountData,
  evaluations,
  setSelectedTemplateToEvaluate,
  setActiveEvaluation,
  setSavedAnswers,
}) {
  const { evaluationTemplates } = accountData;
  const [loader, setLoader] = useState(false);
  const callBack = (template, evaluation) => {
    setLoader(true);
    setSelectedTemplateToEvaluate(template);
    if (evaluation) {
      appsyncClient
        .query({
          query: evaluationGet,
          variables: {
            id: evaluation.id,
          },
        })
        .then(result => {
          setLoader(false);
          let ansArr = result?.data?.evaluationGet?.answers?.map(obj =>
            transform(obj)
          );
          setSavedAnswers(ansArr || []);
          setActiveEvaluation(evaluation);
          setEditEvaluation();
        });
    } else {
      setLoader(false);
      setActiveEvaluation(evaluation);
      setSavedAnswers([]);
      setEditEvaluation();
    }
  };
  const getEvaluations = (templateId, myEvaluations) => {
    return (
      evaluations?.filter(
        data => data.templateId === templateId && data.isMe === myEvaluations
      ) || []
    );
  };
  if (loader) {
    return <Loader size="medium" />;
  }
  return (
    <div className="evaluate-startup-container">
      {evaluationTemplates?.map(template => (
        <div key={template.id} className="evaluation-main">
          <div className="eval-type-heading">{template.name}</div>
          {
            <div className="evaluation-row">
              {getEvaluations(template.id, true)?.map(evaluation => (
                <>
                  <div className="evaluate-action">
                    <div>
                      <span className="evaluated-on">
                        Evaluated on{" "}
                        {moment(evaluation.createdAt).format("lll")}
                      </span>
                      <button
                        style={{ marginBottom: "1rem" }}
                        className="evaluate-section-btn"
                        onClick={() => {
                          callBack(template, evaluation);
                        }}
                      >
                        Edit evaluation
                      </button>
                      <button
                        className="evaluate-section-btn"
                        onClick={() => {
                          callBack(template, null);
                        }}
                      >
                        + New evaluation
                      </button>
                    </div>
                  </div>
                </>
              ))}
              {console.log(
                "EVALUATION CHECK: ",
                getEvaluations(template.id, true)
              )}
              {!(getEvaluations(template.id, true).length > 0) ? (
                <button
                  className="evaluate-section-btn"
                  onClick={() => {
                    callBack(template, null);
                  }}
                >
                  + New evaluation
                </button>
              ) : null}
            </div>
          }
        </div>
      ))}
    </div>
  );
}
