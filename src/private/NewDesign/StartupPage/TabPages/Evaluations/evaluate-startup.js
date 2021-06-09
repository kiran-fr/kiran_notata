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
        <div className="row">
          <div className="col-sm-4 col-xs-8 eval-type-heading">
            {template.name}
          </div>
          {
            <div>
              {getEvaluations(template.id, true)?.map(evaluation => (
                <div className="row">
                  <div className="col-sm-4 col-xs-5 evaluated-on">
                    evaluated on {moment(evaluation.createdAt).format("lll")}
                  </div>
                  <div className="col-sm-3 col-xs-5 evaluate-action">
                    <button
                      onClick={() => {
                        callBack(template, evaluation);
                      }}
                    >
                      Edit evaluation
                    </button>
                  </div>
                </div>
              ))}
              <div className="col-sm-4 col-xs-5 evaluated-on"></div>
              <div className="col-sm-3 col-xs-5 evaluate-action">
                <button
                  onClick={() => {
                    callBack(template, null);
                  }}
                >
                  + New evaluation
                </button>
              </div>
            </div>
          }
        </div>
      ))}
    </div>
  );
}
