import React, { useEffect, useState, useMemo } from "react";
import Scrollspy from "react-scrollspy";
import "./edit-evaluation.scss";
import RadioButton from "../../ui-kits/radio-button";
import InputCheckBox from "../../ui-kits/check-box";
import { useQuery, useMutation } from "@apollo/client";
import { evaluationUpdate, evaluationCreate } from "private/Apollo/Mutations";

import { evaluationGet, evaluationTemplateGet } from "private/Apollo/Queries";

export default function EditEvaluation({
  setEditEvaluation,
  setSaveEvaluation,
  updateEvaluation,
  selectedTemplateToEvaluate,
  setAllAnswers,
  connectionId,
  evaluation,
  savedAnswers,
  setActiveEvaluation,
}) {
  const [savedEvalution, setSavedEvalution] = useState(savedAnswers);

  const [radioAnswers, setRadioAnswers] = useState({});
  const [checkAnswers, setCheckAnswers] = useState({});
  // Mutations
  const [mutateEvaluationUpdate] = useMutation(evaluationUpdate);
  const [mutateEvaluationCreate] = useMutation(evaluationCreate);

  const getSavedAnswer = (arr, value, questionId) => {
    if (Array.isArray(arr)) {
      let ans = arr?.find(ans => ans.questionId === questionId);
      return ans?.val === value;
    }
  };

  const getSavedCheckboxAnswer = (questionId, sid) => {
    let ans = savedEvalution?.find(
      ans => ans.questionId === questionId && ans.sid === sid
    );
    return ans?.val;
  };

  let sectionNamesArr = selectedTemplateToEvaluate?.sections?.map(section => {
    return {
      name: section.name,
      id: section.id,
    };
  });

  let details = {};
  let sec = selectedTemplateToEvaluate?.sections?.map(item => {
    details[item.id] = "collapse";
  });
  const [collapseDetailList, setCollapseDetailList] = useState(details);

  const onRadioSelect = obj => {
    setRadioAnswers({
      ...radioAnswers,
      [obj.questionId]: obj,
    });
  };

  const collectionAllAnswers = async () => {
    try {
      let radioButtonAns = Object.keys(radioAnswers).map(
        answer => radioAnswers[answer]
      );
      let checkButtonAns = Object.keys(checkAnswers).map(
        answer => checkAnswers[answer]
      );
      let ansArr = radioButtonAns.concat(checkButtonAns);
      if (evaluation?.id) {
        let comapare = savedAnswers?.map(oldAns => {
          if (
            oldAns.inputType === "RADIO" &&
            radioAnswers[oldAns.questionId] === undefined
          ) {
            ansArr.push(oldAns);
          }
          if (
            oldAns.inputType === "CHECK" &&
            checkAnswers[oldAns.questionId + oldAns.sid] === undefined
          ) {
            ansArr.push(oldAns);
          }
        });
        let updateVariables = {
          id: evaluation?.id,
          answers: ansArr,
        };

        let update = await mutateEvaluationUpdate({
          variables: updateVariables,
        });
        console.log("updated", update?.data?.evaluationUpdate);
      } else {
        let variables = {
          connectionId: connectionId,
          templateId: selectedTemplateToEvaluate.id,
          answers: ansArr,
        };

        let ansCreate = await mutateEvaluationCreate({ variables });

        let evaluationCreateResp = ansCreate?.data?.evaluationCreate;
        console.log("evaluationCreateResp", evaluationCreateResp);
        setActiveEvaluation(evaluationCreateResp);
      }

      setAllAnswers(ansArr);
      setSaveEvaluation(true);
    } catch (error) {
      console.log("ERROR CREATING STARTUP", error);
    }
  };

  const onCheckboxSelect = obj => {
    let answerCopy = checkAnswers;
    if (answerCopy[obj.questionId + obj.sid]) {
      delete answerCopy[obj.questionId + obj.sid];
      setCheckAnswers(answerCopy);
      return;
    }
    setCheckAnswers({ ...checkAnswers, [obj.questionId + obj.sid]: obj });
  };

  // if (!evaluationGetData) {
  //   return 'Loading...';
  // }
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
          <Scrollspy items={sectionNamesArr} currentClassName="is-current">
            {sectionNamesArr.map(link => (
              <li key={link.id}>
                <a
                  href={`#${link.name}`}
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
      <div className="col-sm-8 col-md-8 edit-details">
        {selectedTemplateToEvaluate?.sections?.map(section => (
          <div className="row" id={section.name}>
            <div className="col-sm-12 heading">
              <i
                class={`fa ${
                  collapseDetailList[section?.id] === ""
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
            </div>
            <div className={`${collapseDetailList[section?.id]}`}>
              {section?.questions.map(question => (
                <>
                  <div className="row">
                    <div className="col-sm-12 question">{question.name}</div>
                    <div className="options">
                      {question.inputType === "RADIO" &&
                        question.options.map(option => (
                          <div>
                            <RadioButton
                              label={option.val}
                              name={question.id}
                              defaultChecked={getSavedAnswer(
                                savedEvalution,
                                option.val,
                                question.id
                              )}
                              onChange={e =>
                                onRadioSelect({
                                  inputType: question.inputType,
                                  sectionId: section.id,
                                  sectionName: section.name,
                                  questionId: question.id,
                                  questionName: question.name,
                                  val: option.val,
                                  sid: option.sid,
                                })
                              }
                            ></RadioButton>
                          </div>
                        ))}
                      {question.inputType === "CHECK" &&
                        question.options.map(option => (
                          <div>
                            <InputCheckBox
                              name="problem-question-1"
                              label={option.val}
                              name={question.id}
                              id="problem-question-1-yes"
                              defaultChecked={
                                option.val ===
                                getSavedCheckboxAnswer(question.id, option.sid)
                              }
                              onChange={e =>
                                onCheckboxSelect({
                                  inputType: question.inputType,
                                  sectionId: section.id,
                                  sectionName: section.name,
                                  questionId: question.id,
                                  questionName: question.name,
                                  val: option.val,
                                  sid: option.sid,
                                })
                              }
                            ></InputCheckBox>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12 col-xs-12 add-comment">
                      Add comment
                      <input type="text" className="add-comment-txt" />
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        ))}
        <div className="col-sm-12 text-right">
          <button className="save-btn delete" onClick={collectionAllAnswers}>
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
}
