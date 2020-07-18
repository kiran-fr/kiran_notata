import React from "react";
import { cloneDeep, omit } from "lodash";
import classnames from "classnames";
import { color3 } from "../../elements/Colors.module.css";
import {
  gridContainer,
  gridTitle,
  gridDescription
} from "../../elements/Grid.module.css";
import { multi_line_wrapper } from "../../elements/Form.module.css";
import {
  container,
  section,
  add_line_button,
  comments_container,
  traffic_lights,
  traffic_red,
  traffic_yellow,
  traffic_green
} from "./Section.module.css";

import {
  InputTextArea,
  InputText,
  InputRadio,
  InputCheck,
  InputUrls,
  InputTrafficLights
} from "../../elements/FormElements";

import { Query, Mutation } from "react-apollo";
import { getEvaluation_new } from "../../../Apollo/Queries";
import { putEvaluation_new } from "../../../Apollo/Mutations";

class Comment extends React.Component {
  constructor(props) {
    super(props);

    let object = (this.props.evaluation.options || []).find(
      o => o.sid === this.props.sid && o.questionID === this.props.questionID
    );

    this.state = {
      val: object ? object.val : ""
    };
  }

  render() {
    return (
      <InputTextArea
        val={this.state.val}
        onChange={nVal => this.setState({ val: nVal })}
        save={() => {
          this.props.save(this.state.val);
        }}
        placeholder={this.props.placeholder || "Tap to type..."}
      />
    );
  }
}

class SectionComp extends React.Component {
  constructor(props) {
    super(props);
    let { data } = this.props;
  }

  render() {
    let {
      data,
      id,
      sid,
      option,
      questions,
      allOptions,
      evaluation
    } = this.props;

    let question = questions.find(q => q.id === data.id);

    const isActive = sid => {
      let isActive = ((evaluation || {}).options || [])
        .filter(op => op.questionID === question.id) // Is current question
        .filter(op => op.sid === sid); // Is current option
      return !!isActive.length;
    };

    const isActiveTrafficLight = color => {
      let isActive = ((evaluation || {}).options || [])
        .filter(op => op.questionID === question.id) // Is current question
        .filter(op => op.sid === "traffic_light"); // Is current option
      return isActive.length && isActive[0].val === color;
    };

    const getOptimistic = options => {
      let its = (evaluation.options || []).filter(
        o => !(options || []).some(op => op.questionID === o.questionID)
      );

      let optimisticOptions;
      if (options.length) {
        optimisticOptions = [...its, ...options];
      }

      if (!options.length) {
        optimisticOptions = [
          ...its.filter(it => it.questionID !== question.id)
        ];
      }

      let optimisticResponse = {
        __typename: "Mutation",
        putEvaluation_new: {
          ...this.props.evaluation,
          options: optimisticOptions.map(o => ({
            ...o,
            __typename: "EvaluationInputOption"
          }))
        }
      };

      return optimisticResponse;
    };

    return (
      <div className={section}>
        <Mutation mutation={putEvaluation_new}>
          {(mutate, { data, loading, error }) => {
            return (
              <div>
                <div className={classnames(color3, gridTitle)}>
                  {question.name}
                </div>

                {question.description && (
                  <div className={classnames(gridDescription)}>
                    {question.description}
                  </div>
                )}

                <div className={gridContainer}>
                  {question.input_type === "INPUT_TEXT" && (
                    <Comment
                      questionID={question.id}
                      evaluation={evaluation}
                      sid={"input_text"}
                      save={newVal => {
                        let options = evaluation.options
                          .filter(o => o.questionID === question.id)
                          .map(o => omit(o, ["__typename"]));

                        let text = options.find(o => o.sid === "input_text");

                        if (text) {
                          options = options.map(o =>
                            o.sid !== "input_text" ? o : { ...o, val: newVal }
                          );
                        } else {
                          options.push({
                            val: newVal,
                            sid: "input_text",
                            input_type: "INPUT_TEXT",
                            question: question.name,
                            questionID: question.id
                          });
                        }

                        let variables = {
                          id: id,
                          input: { options }
                        };

                        mutate({
                          variables,
                          optimisticResponse: getOptimistic(options)
                        });
                      }}
                    />
                  )}

                  {question.input_type === "TRAFFIC_LIGHTS" &&
                    ["red", "yellow", "green"].map((color, i) => (
                      <InputTrafficLights
                        key={`traffic-${question.id}-${i}`}
                        active={isActiveTrafficLight(color)}
                        onClick={() => {
                          let options = (evaluation.options || [])
                            .filter(o => o.questionID === question.id)
                            .map(o => omit(o, ["__typename"]));

                          if (isActiveTrafficLight(color)) {
                            options = options.filter(
                              op => op.sid !== "traffic_light"
                            );
                          } else {
                            options = (options || []).filter(
                              op => op.input_type !== "TRAFFIC_LIGHTS"
                            );
                            options.push({
                              val: color,
                              sid: "traffic_light",
                              input_type: question.input_type,
                              question: question.name,
                              questionID: question.id
                            });
                          }

                          let variables = { id };
                          variables.input = options.length
                            ? { options }
                            : { clear_options: question.id };

                          mutate({
                            variables,
                            optimisticResponse: getOptimistic(options)
                          });
                        }}
                        color={color}
                      />
                    ))}

                  {question.input_type === "RADIO" &&
                    question.options.map((o, i) => (
                      <InputRadio
                        key={`${o.field}-${i}`}
                        active={isActive(o.sid)}
                        label={o.val}
                        onClick={() => {
                          let options = (evaluation.options || [])
                            .filter(o => o.questionID === question.id)
                            .map(o => omit(o, ["__typename"]));

                          if (isActive(o.sid)) {
                            options = options.filter(op => op.sid !== o.sid);
                          } else {
                            options = (options || []).filter(
                              op => op.input_type !== "RADIO"
                            );
                            options.push({
                              val: o.val,
                              sid: o.sid,
                              input_type: question.input_type,
                              question: question.name,
                              questionID: question.id
                            });
                          }

                          let variables = { id };
                          variables.input = options.length
                            ? { options }
                            : { clear_options: question.id };

                          mutate({
                            variables,
                            optimisticResponse: getOptimistic(options)
                          });
                        }}
                      />
                    ))}

                  {question.input_type === "CHECK" &&
                    question.options.map((o, i) => (
                      <InputCheck
                        key={`${o.field}-${i}`}
                        active={isActive(o.sid)}
                        label={o.val}
                        onClick={() => {
                          let options = (evaluation.options || [])
                            .filter(o => o.questionID === question.id)
                            .map(o => omit(o, ["__typename"]));

                          if (isActive(o.sid)) {
                            options = options.filter(op => op.sid !== o.sid);
                          } else {
                            options.push({
                              val: o.val,
                              sid: o.sid,
                              input_type: question.input_type,
                              question: question.name,
                              questionID: question.id
                            });
                          }

                          let variables = { id };
                          variables.input = options.length
                            ? { options }
                            : { clear_options: question.id };

                          mutate({
                            variables,
                            optimisticResponse: getOptimistic(options)
                          });
                        }}
                      />
                    ))}
                </div>

                {(question.input_type === "CHECK" ||
                  question.input_type === "RADIO" ||
                  question.input_type === "TRAFFIC_LIGHTS") && (
                  <div className={comments_container}>
                    <Comment
                      questionID={question.id}
                      evaluation={evaluation}
                      sid={"comment"}
                      placeholder="Tap to add comments..."
                      save={newVal => {
                        let options = evaluation.options
                          .filter(o => o.questionID === question.id)
                          .map(o => omit(o, ["__typename"]));

                        let text = options.find(o => o.sid === "comment");

                        if (text) {
                          options = options.map(o =>
                            o.sid !== "comment" ? o : { ...o, val: newVal }
                          );
                        } else {
                          options.push({
                            val: newVal,
                            sid: "comment",
                            input_type: "COMMENT",
                            question: question.name,
                            questionID: question.id
                          });
                        }

                        let variables = {
                          id,
                          input: { options }
                        };

                        mutate({
                          variables,
                          optimisticResponse: getOptimistic(options)
                        });
                      }}
                    />
                  </div>
                )}
              </div>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default SectionComp;
