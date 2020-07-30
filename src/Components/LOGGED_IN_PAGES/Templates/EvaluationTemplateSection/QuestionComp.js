import React from "react";
import { omit } from "lodash";
import classnames from "classnames";
import { useMutation } from "@apollo/client";

import DeleteQuestion from "./DeleteQuestionComp";
import TextAreaAutoHeight from "../../../elements/TextAreaAutoHeight";
import InputTrafficLights from "../../../elements/InputTrafficLights";
import InputNumeric from "../../../elements/InputNumeric";

import { evaluationQuestionPut } from "../../../../Apollo/Mutations";

import {
  focus_form,
  tag_list_small,
  active_tag,
  tag
} from "../../../elements/Style.module.css";
import {
  section_style,
  delete_option,
  input_score
} from "./EvaluationTemplateSection.module.css";
import {
  gridContainer,
  gridItem,
  gridDescription
} from "../../../elements/Grid.module.css";
import { color1 } from "../../../elements/Colors.module.css";

const inputMap = [
  {
    label: "Multiple choice",
    val: "CHECK"
  },
  {
    label: "Single answer",
    val: "RADIO"
  },
  {
    label: "Traffic lights",
    val: "TRAFFIC_LIGHTS"
  },
  {
    label: "Free text",
    val: "INPUT_TEXT"
  }
];

function QuestionNameAndDescription({ templateId, sectionId, question }) {
  const [mutate] = useMutation(evaluationQuestionPut);

  return (
    <form onSubmit={e => e.preventDefault()} className={focus_form}>
      <div
        style={{
          marginTop: "50px",
          textAlign: "center"
        }}
      >
        <div style={{ position: "relative" }}>
          <DeleteQuestion
            templateId={templateId}
            sectionId={sectionId}
            question={question}
          />

          <h2>
            <TextAreaAutoHeight
              placeholder="Question name"
              value={question.name}
              onBlur={value => {
                if (question.name === value) return;

                let variables = {
                  id: question.id,
                  input: { name: value }
                };

                mutate({
                  variables,
                  optimisticResponse: {
                    __typename: "Mutation",
                    evaluationQuestionPut: {
                      ...question,
                      name: value
                    }
                  }
                });
              }}
            />

            <span />
          </h2>
        </div>
      </div>

      <div
        style={{
          marginTop: "50px",
          textAlign: "center"
        }}
      >
        <p className={gridDescription} style={{ fontSize: "16px" }}>
          <TextAreaAutoHeight
            placeholder='I.e. "Template for evaluating early stage startups"'
            value={question.description}
            onBlur={value => {
              if (value === question.description) return;

              let variables = {
                id: question.id,
                input: {
                  description: value
                }
              };

              mutate({
                variables,
                optimisticResponse: {
                  __typename: "Mutation",
                  evaluationQuestionPut: {
                    ...question,
                    description: value
                  }
                }
              });
            }}
          />
          <span />
        </p>
      </div>
    </form>
  );
}

function ToggleInputType({ question }) {
  const [mutate] = useMutation(evaluationQuestionPut);

  return (
    <div
      className={tag_list_small}
      style={{
        marginBottom: "15px",
        top: "-10px",
        position: "relative"
      }}
    >
      {inputMap.map((inp, i) => {
        return (
          <div
            className={classnames(
              tag,
              question.inputType === inp.val && active_tag
            )}
            key={`inputMap-${question.id}-${i}`}
            onClick={() => {
              let inputType = inp.val;

              let variables = {
                id: question.id,
                input: { inputType }
              };

              mutate({
                variables,
                optimisticResponse: {
                  __typename: "Mutation",
                  evaluationQuestionPut: {
                    ...question,
                    inputType
                  }
                }
              });
            }}
          >
            {inp.label}
          </div>
        );
      })}
    </div>
  );
}

function TrafficLightOption() {
  return (
    <div>
      <div className={gridContainer}>
        {["red", "yellow", "green"].map((color, i) => (
          <InputTrafficLights
            key={`traffic-${color}-${i}`}
            active={false}
            onClick={() => {}}
            color={color}
          />
        ))}
      </div>

      <div className={color1} style={{ marginTop: "15px" }}>
        Red = 0 points. Yellow = 1 point. Green = 2 points.
      </div>
    </div>
  );
}

function InputTextOption() {
  return (
    <div
      className={color1}
      style={{
        marginTop: "15px",
        lineHeight: "2",
        marginTop: "35px"
      }}
    >
      All questions will by default have the option for additional comments,
      regardless of it being multiple choice, single answer or traffic lights.
      By choosing the "free text" option you simply remove the possibility of
      giving an input score while keeping the comments field.
    </div>
  );
}

function CheckOrRadioOption({ question }) {
  const [mutate] = useMutation(evaluationQuestionPut);

  return (
    <form onSubmit={e => e.preventDefault()} className={focus_form}>
      <div className={gridContainer}>
        {question.options.map((option, i) => {
          return (
            <div key={`option-${i}`} className={classnames(gridItem, color1)}>
              <TextAreaAutoHeight
                placeholder='I.e. "Template for evaluating early stage startups"'
                value={option.val}
                onBlur={value => {
                  // let newVal = option.val;
                  let oldVal = (question.options[i] || {}).val;
                  if (value === oldVal) return;

                  let variables = {
                    id: question.id,
                    input: {
                      editOption: {
                        ...omit(option, ["__typename"]),
                        val: value
                      }
                    }
                  };

                  let optimisticOptions = question.options.map(o =>
                    o.sid !== option.sid ? o : { ...o, val: value }
                  );

                  mutate({
                    variables,
                    optimisticResponse: {
                      __typename: "Mutation",
                      evaluationQuestionPut: {
                        ...question,
                        options: optimisticOptions
                      }
                    }
                  });
                }}
              />

              <div className={input_score}>
                <label>
                  score:
                  <InputNumeric
                    value={(option.score || 0).toString()}
                    className="no-class"
                    placeholder="0"
                    selectOnFocus
                    onBlur={value => {
                      if (!option.sid) return;
                      if (value === option.score) return;

                      let variables = {
                        id: question.id,
                        input: {
                          editOption: {
                            ...omit(option, ["__typename"]),
                            score: value
                          }
                        }
                      };

                      mutate({
                        variables,
                        optimisticResponse: {
                          __typename: "Mutation",
                          evaluationQuestionPut: {
                            ...question,
                            options: question.options.map(o =>
                              o.sid === option.sid ? { ...o, score: value } : o
                            )
                          }
                        }
                      });
                    }}
                  />
                </label>
              </div>

              <div
                className={delete_option}
                onClick={() => {
                  let variables = {
                    id: question.id,
                    input: {
                      deleteOption: option.sid
                    }
                  };
                  mutate({
                    variables,
                    optimisticResponse: {
                      __typename: "Mutation",
                      evaluationQuestionPut: {
                        ...question,
                        options: question.options.filter(
                          o => o.sid !== option.sid
                        )
                      }
                    }
                  });
                }}
              >
                delete
              </div>
            </div>
          );
        })}

        {
          <div
            className={classnames(gridItem, color1)}
            onClick={() => {
              let variables = {
                id: question.id,
                input: {
                  newOptions: [
                    {
                      val: "New option",
                      score: 0,
                      index: question.options.length + 1
                    }
                  ]
                }
              };

              let optimisticOptions = [
                ...question.options,
                {
                  val: "New option",
                  score: 0,
                  index: question.options.length + 1,
                  sid: "temp",
                  __typename: "EvaluationQuestionOption"
                }
              ];

              mutate({
                variables,
                optimisticResponse: {
                  __typename: "Mutation",
                  evaluationQuestionPut: {
                    ...question,
                    options: optimisticOptions
                  }
                }
              });
            }}
          >
            <i className="fal fa-plus-circle" style={{ fontSize: "90px" }} />
            <div className={input_score}>add new option</div>
          </div>
        }
      </div>
    </form>
  );
}

export default function Question({ templateId, sectionId, question }) {
  return (
    <div className={section_style}>
      <QuestionNameAndDescription
        templateId={templateId}
        sectionId={sectionId}
        question={question}
      />

      <ToggleInputType question={question} />

      {question.inputType === "INPUT_TEXT" && <InputTextOption />}
      {question.inputType === "TRAFFIC_LIGHTS" && <TrafficLightOption />}
      {["CHECK", "RADIO"].some(type => type === question.inputType) && (
        <CheckOrRadioOption question={question || {}} />
      )}
    </div>
  );
}
