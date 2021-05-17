import React, { useEffect, useState } from "react";
import Scrollspy from "react-scrollspy";
import "./edit-evaluation.scss";
import RadioButton from "../../ui-kits/radio-button";
import InputCheckBox from "../../ui-kits/check-box";

const sections = [
  {
    id: "2e4c82e4-fd55-a1d1-e8bd-0e7974b0fdda",
    name: "Market",
    questions: [
      {
        id: "96050e0f-b880-97e8-f291-e9d77bc304d0",
        name: "Is this a new or an existing market?",
        description: "",
        inputType: "RADIO",
        options: [
          {
            index: 1,
            sid: "040e9c55",
            score: 0,
            val: "New",
          },
          {
            index: 2,
            sid: "17c94569",
            score: null,
            val: "Existing",
          },
        ],
      },
      {
        id: "d34bfec0-9a2f-5a06-e3d5-c2bd039ce53e",
        name: "Customers willingness to pay",
        description: "",
        inputType: "CHECK",
        options: [
          {
            index: 1,
            sid: "3501137e",
            score: 0,
            val: "Low",
          },
          {
            index: 2,
            sid: "80b84fce",
            score: 1,
            val: "High",
          },
          {
            index: 3,
            sid: "93ae5185",
            score: 0,
            val: "I don't know",
          },
        ],
      },
    ],
  },
];

export default function EditEvaluation({
  setEditEvaluation,
  setSaveEvaluation,
  updateEvaluation,
  selectedTemplateToEvaluate,
}) {
  // const selectedTemplateToEvaluate = sections;
  console.log("selectedTemplateToEvaluate", selectedTemplateToEvaluate);

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
      [obj.questionId]: [obj],
    });
  };

  useEffect(() => {
    console.log(radioAnswers);
  }, [radioAnswers]);

  useEffect(() => {
    console.log(checkAnswers);
  }, [checkAnswers]);

  const onCheckboxSelect = obj => {
    let answerCopy = checkAnswers;
    if (answerCopy[obj.questionId + obj.sid]) {
      delete answerCopy[obj.questionId + obj.sid];
      setCheckAnswers(answerCopy);
      return;
    }
    setCheckAnswers({ ...checkAnswers, [obj.questionId + obj.sid]: [obj] });
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
          <button
            className="save-btn delete"
            onClick={() => setSaveEvaluation(true)}
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
}
