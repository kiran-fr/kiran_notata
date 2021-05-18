import React, { useEffect, useState } from "react";
import Scrollspy from "react-scrollspy";
import "./edit-evaluation.scss";
import RadioButton from "../../ui-kits/radio-button";
import InputCheckBox from "../../ui-kits/check-box";
import { useQuery, useMutation } from "@apollo/client";
import { evaluationUpdate, evaluationCreate } from "private/Apollo/Mutations";

import { evaluationGet } from "private/Apollo/Queries";

export default function EditEvaluation({
  setEditEvaluation,
  setSaveEvaluation,
  updateEvaluation,
  selectedTemplateToEvaluate,
  setAllAnswers,
  connectionId,
}) {
  // Mutations
  const [mutateEvaluationUpdate] = useMutation(evaluationUpdate);
  const [mutateEvaluationCreate] = useMutation(evaluationCreate);
  // const selectedTemplateToEvaluate = sections;
  console.log("selectedTemplateToEvaluate", selectedTemplateToEvaluate);

  const { data: evaluationGetData } = useQuery(evaluationGet, {
    variables: {
      id:
        // '1b8c44d3-f392-3d5c-11dc-b2164520cdd1'
        selectedTemplateToEvaluate.id,
    },
  });

  console.log("accountGetData", evaluationGetData);

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
  const [radioAnswers, setRadioAnswers] = useState({});
  const [checkAnswers, setCheckAnswers] = useState({});

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
      console.log("answers to api call", ansArr);
      console.log(selectedTemplateToEvaluate);

      let variables = {
        connectionId: connectionId,
        templateId: selectedTemplateToEvaluate.id,
        answers: ansArr,
      };

      let ansCreate = await mutateEvaluationCreate({ variables });

      let evaluationCreateResp = ansCreate?.data?.evaluationCreate;
      console.log("evaluationCreateResp", evaluationCreateResp);

      // let variables = { id: selectedTemplateToEvaluate.id, answers:ansArr};
      // let ansMutation = await mutateEvaluationUpdate({ variables });

      // console.log('ansMutation', ansMutation)
      // let connection = ansMutation?.data?.connectionCreate;

      let allAnswers = Object.assign({}, radioAnswers, checkAnswers);
      setAllAnswers(allAnswers);
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
            </div>
            <div className={`${collapseDetailList[section.id]}`}>
              {section?.questions.map(question => (
                <div className="row">
                  <div className="col-sm-12 question">{question.name}</div>
                  <div className="options">
                    {question.inputType === "RADIO" &&
                      question.options.map(option => (
                        <div>
                          <RadioButton
                            label={option.val}
                            name={question.id}
                            value={option.val}
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
              ))}
              <div className="row">
                <div className="col-sm-12 col-xs-12 add-comment">
                  Add comment
                  <input type="text" className="add-comment-txt" />
                </div>
              </div>
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
