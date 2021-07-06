import React, { useEffect, useState } from "react";
// COMPONENTS
import TextBox from "../../../../Components/UI_Kits/from_srv/text-box";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SingleAnswer from "./InputTypes/SingleAnswer";
import MultipleAnswer from "./InputTypes/MultipleAnswer";
import TrafficLights from "./InputTypes/TrafficLights";
import FreeText from "./InputTypes/FreeText";
import TextLines from "./InputTypes/TextLines";
import { cloneDeep } from "@apollo/client/utilities";
import { omit } from "lodash";

const inputTypeMap = [
  "RADIO",
  "CHECK",
  "TRAFFIC_LIGHTS",
  "INPUT_TEXT",
  "INPUT_MUTLIPLE_LINES",
];

function swapArrayElements(arr, indexA, indexB) {
  let clonedArray = cloneDeep(arr);
  let temp = clonedArray[indexA];
  clonedArray[indexA] = clonedArray[indexB];
  clonedArray[indexB] = temp;
  return clonedArray;
}

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

export default function QuestionCard({ question, questions, setQuestions }) {
  const [tab, setTab] = useState(0);

  // Set tab from inputType
  useEffect(() => {
    if (question) {
      let tabVal = inputTypeMap.indexOf(question.inputType);
      setTab(tabVal);
    }
  }, [question]);

  let questionIndex = questions.indexOf(question);
  let isFirst = questionIndex === 0;
  let isLast = questionIndex === questions.length - 1;

  function setName(e) {
    setQuestions(
      questions.map(q =>
        q.id === question.id ? { ...q, name: e.target.value } : q
      )
    );
  }
  function setDescription(e) {
    setQuestions(
      questions.map(q =>
        q.id === question.id ? { ...q, description: e.target.value } : q
      )
    );
  }

  function duplicateQuestion() {
    let copiedQuestion = cloneDeep(question);
    let newQuestion = {
      ...omit(copiedQuestion, "__typename"),
      name: `${copiedQuestion.name} COPY`,
      id: `tmp//${Math.round(Math.random() * 10000).toString()}`,
    };

    let newOptions = copiedQuestion.options.map(option => {
      return {
        ...omit(option, "__typename"),
        questionId: newQuestion.id,
        sid: `tmp//${Math.round(Math.random() * 10000).toString()}`,
      };
    });

    newQuestion = {
      ...newQuestion,
      options: newOptions,
    };

    let copiedQuestions = cloneDeep(questions);

    copiedQuestions.splice(questionIndex + 1, 0, newQuestion);

    setQuestions(copiedQuestions);
  }

  function deleteQuestion() {
    let copiedQuestions = cloneDeep(questions);
    copiedQuestions.splice(questionIndex, 1);
    setQuestions(copiedQuestions);
  }

  return (
    <div className="card">
      {/*TOP PART*/}
      <div className="row">
        <div className="col-sm-12 text-center">
          <span className="material-icons drag-indicator">drag_indicator</span>
        </div>
        <div className="action-container">
          <span className="material-icons copy" onClick={duplicateQuestion}>
            content_copy
          </span>
          <i
            className="fa fa-trash-o delete"
            aria-hidden="true"
            onClick={deleteQuestion}
          />
          {!isFirst && (
            <span
              className="material-icons north"
              onClick={() => {
                setQuestions(
                  swapArrayElements(questions, questionIndex, questionIndex - 1)
                );
              }}
            >
              north
            </span>
          )}

          {!isLast && (
            <span
              className="material-icons south"
              onClick={() => {
                setQuestions(
                  swapArrayElements(questions, questionIndex, questionIndex + 1)
                );
              }}
            >
              south
            </span>
          )}
        </div>
      </div>
      {/*END TOP PART*/}

      <div className="question-container row">
        <div className="col-sm-12">
          <TextBox
            placeholder="Question"
            value={question.name}
            onChange={setName}
          />
        </div>

        <div className="col-sm-12">
          <TextBox
            placeholder="Tagline"
            value={question.description}
            onChange={setDescription}
          />
        </div>

        <div className="col-sm-12 question-container__tabs">
          <Tabs
            value={tab}
            onChange={(e, newValue) => {
              let inputType = inputTypeMap[newValue];

              if (inputType !== question.inputType) {
                setQuestions(
                  questions.map(q =>
                    q.id === question.id ? { ...q, inputType } : q
                  )
                );
              }

              setTab(newValue);
            }}
            scrollButtons="on"
            variant="scrollable"
          >
            <Tab label="SINGLE ANSWER" {...a11yProps(0)} />
            <Tab label="multiple choice" {...a11yProps(1)} />
            <Tab label="traffic lights" {...a11yProps(2)} />
            <Tab label="free text" {...a11yProps(3)} />
            <Tab label="text lines" {...a11yProps(4)} />
          </Tabs>

          {question.inputType === "RADIO" && (
            <SingleAnswer
              question={question}
              questions={questions}
              setQuestions={setQuestions}
            />
          )}

          {question.inputType === "CHECK" && (
            <MultipleAnswer
              question={question}
              questions={questions}
              setQuestions={setQuestions}
            />
          )}

          {question.inputType === "TRAFFIC_LIGHTS" && (
            <TrafficLights
              question={question}
              questions={questions}
              setQuestions={setQuestions}
            />
          )}

          {question.inputType === "INPUT_TEXT" && (
            <FreeText
              question={question}
              questions={questions}
              setQuestions={setQuestions}
            />
          )}

          {question.inputType === "INPUT_MUTLIPLE_LINES" && (
            <TextLines
              question={question}
              questions={questions}
              setQuestions={setQuestions}
            />
          )}
        </div>
      </div>
    </div>
  );
}
