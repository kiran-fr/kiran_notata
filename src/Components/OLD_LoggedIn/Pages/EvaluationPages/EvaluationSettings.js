import React from "react";
import { Redirect, Switch, withRouter } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { adopt } from "react-adopt";
import qp from "../../../../utils/queryParams";
import classnames from "classnames";

import { Query, Mutation } from "react-apollo";
import {
  getEvaluation_new,
  getEvaluationOptions,
  getEvaluationQuestions
} from "../../../../Apollo/Queries";

import {
  putEvaluationOptions,
  putEvaluationQuestion
} from "../../../../Apollo/Mutations";

import { GhostLoader } from "../../../elements/GhostLoader";

import {
  wrapper,
  inner_container,
  section,
  title_class,
  question_container,
  question_title,
  question_description,
  input_type_container,
  input_type_class,
  alternative_class,
  input_box,
  remove_icon,
  edit_icon,
  edit_name,
  edit_title,
  delete_question_class,
  input_score,
  score_number,
  score_carets,
  score_caret_up,
  score_caret_down
} from "./EvaluationSettings.module.css";

const inputTypes = [
  {
    type: "RADIO",
    label: "Single answer"
  },
  {
    type: "CHECK",
    label: "Multiple choice"
  },
  {
    type: "TRAFFIC_LIGHTS",
    label: "Traffic lights"
  },
  {
    type: "INPUT_TEXT",
    label: "Free text"
  }
];

const s4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

const sid = () => `${s4()}${s4()}`;

class InputScore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || 0
    };
  }

  handleFocus = e => e.target.select();

  handleChange = e => {
    let value = e.target.value;
    let regexp = /^-?[0-9]+$/;
    if (!regexp.test(value)) return;
    this.setState({ value }, () => {
      this.props.setScore(value);
    });
  };

  render() {
    return (
      <div className={input_score}>
        <div className={score_carets}>
          <i
            className="fas fa-caret-up"
            onClick={() => {
              let value = (this.state.value += 1);
              this.setState({ value }, () => {
                this.props.setScore(value);
              });
            }}
          />
          <i
            className="fas fa-caret-down"
            onClick={() => {
              let value = (this.state.value -= 1);
              this.setState({ value }, () => {
                this.props.setScore(value);
              });
            }}
          />
        </div>
        <div className={score_number}>{this.state.value}</div>
      </div>
    );
  }
}

class InputBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || ""
    };
  }

  render() {
    return (
      <div className={input_box}>
        <label>
          <input
            type="text"
            placeholder={this.props.placeholder || "Type here"}
            value={this.state.value}
            onChange={e => this.setState({ value: e.target.value })}
            onBlur={() => {
              this.props.submit(this.state.value);
              this.setState({ value: "" });
            }}
            onKeyPress={e => {
              if (e.key === "Enter") {
                this.props.submit(this.state.value);
                this.setState({ value: "" });
              }
            }}
          />
        </label>
      </div>
    );
  }
}

class Alternatives extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    if (!result || !result.destination) return;

    let { question } = this.props;
    let { options } = question;

    let sid = result.draggableId;
    let option = options.find(op => op.sid === sid);

    let fromIndex = result.source.index;
    let toIndex = result.destination.index;

    let addIndex = fromIndex > toIndex ? +1 : -1;
    let newOrder = [
      { val: option.val, sid, score: option.score, index: toIndex }
    ];

    for (let op of options) {
      if (op.sid !== sid) {
        let smallerThanLargest = op.index <= Math.max(fromIndex, toIndex);
        let biggerThanLowest = op.index >= Math.min(fromIndex, toIndex);
        biggerThanLowest && smallerThanLargest
          ? newOrder.push({
              val: op.val,
              sid: op.sid,
              score: op.score,
              index: op.index + addIndex
            })
          : newOrder.push({
              val: op.val,
              sid: op.sid,
              score: op.score,
              index: op.index
            });
      }
    }

    newOrder = newOrder.sort((a, b) => a.index - b.index);

    let variables = {
      id: question.id,
      input: {
        name: question.name,
        input_type: question.input_type,
        options: newOrder
      }
    };

    let optimistic = {
      ...question,
      options: newOrder.map(no => ({
        ...no,
        __typename: "EvaluationQuestionOption"
      }))
    };

    this.props.mutate({
      variables,
      optimisticResponse: {
        __typename: "Mutation",
        putEvaluationQuestion: optimistic
      }
    });
  }

  remove = alt => {
    let { question } = this.props;
    let { options } = question;

    let ops = options
      .filter(op => op.sid !== alt.sid)
      .map((op, index) => ({ val: op.val, sid: op.sid, index }));

    let variables = {
      id: question.id,
      input: {
        name: question.name,
        input_type: question.input_type,
        options: ops
      }
    };

    let optimistic = {
      ...question,
      options: ops.map(no => ({
        ...no,
        __typename: "EvaluationQuestionOption"
      }))
    };

    this.props.mutate({
      variables,
      optimisticResponse: {
        __typename: "Mutation",
        putEvaluationQuestion: optimistic
      }
    });
  };

  newName = ({ alt, newVal }) => {
    let { question } = this.props;
    let { options } = question;

    let ops = options.map(op => ({
      sid: op.sid,
      index: op.index,
      val: op.sid === alt.sid ? newVal : op.val
    }));

    let variables = {
      id: question.id,
      input: {
        name: question.name,
        input_type: question.input_type,
        options: ops
      }
    };

    let optimistic = {
      ...question,
      options: ops.map(no => ({
        ...no,
        __typename: "EvaluationQuestionOption"
      }))
    };

    this.props.mutate({
      variables,
      optimisticResponse: {
        __typename: "Mutation",
        putEvaluationQuestion: optimistic
      }
    });

    this.setState({ edit: false });
  };

  setScore = ({ alt, newScore }) => {
    console.log("setScore", newScore);

    let { question } = this.props;
    let { options } = question;

    let ops = options.map(op => ({
      sid: op.sid,
      index: op.index,
      val: op.val,
      score: op.sid === alt.sid ? newScore : op.score || 0
    }));

    let variables = {
      id: question.id,
      input: {
        name: question.name,
        input_type: question.input_type,
        options: ops
      }
    };

    let optimistic = {
      ...question,
      options: ops.map(no => ({
        ...no,
        __typename: "EvaluationQuestionOption"
      }))
    };

    console.log("optimistic", optimistic);

    this.props.mutate({
      variables,
      optimisticResponse: {
        __typename: "Mutation",
        putEvaluationQuestion: optimistic
      }
    });

    this.setState({ edit: false });
  };

  render() {
    const { question } = this.props;

    return (
      <div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId={question.id}>
            {(provided_droppable, snapshot_droppable) => (
              <div
                {...provided_droppable.droppableProps}
                ref={provided_droppable.innerRef}
              >
                {question.options.map((alt, i) => (
                  <Draggable
                    key={`alt-${alt.sid}`}
                    draggableId={alt.sid}
                    index={i}
                  >
                    {(provided, snapshot) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className={alternative_class}
                        style={{
                          ...provided.draggableProps.style
                        }}
                      >
                        {this.state.edit === alt.sid && (
                          <div className={edit_name}>
                            <InputBox
                              value={alt.val}
                              submit={newVal => this.newName({ alt, newVal })}
                            />
                          </div>
                        )}

                        {this.state.edit !== alt.sid && (
                          <div>
                            <span>{alt.val}</span>
                            <InputScore
                              value={alt.score || 0}
                              setScore={newScore => {
                                this.setScore({ alt, newScore });
                              }}
                            />

                            <i
                              className={classnames(
                                remove_icon,
                                "fas fa-minus-circle"
                              )}
                              onClick={() => this.remove(alt)}
                            />

                            <i
                              className={classnames(edit_icon, "fas fa-edit")}
                              onClick={() => {
                                this.setState({ edit: alt.sid });
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided_droppable.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <Mutation mutation={putEvaluationQuestion}>
          {(mutate, { data, loading, error }) => (
            <div style={{ marginTop: "15px" }}>
              <InputBox
                placeholder="Add option"
                submit={newVal => {
                  let newOptions = [
                    ...question.options.map(o => ({
                      val: o.val,
                      sid: o.sid,
                      score: o.score,
                      index: o.index
                    })),
                    {
                      val: newVal,
                      sid: sid(),
                      score: 0,
                      index: question.options.length + 1
                    }
                  ];
                  let variables = {
                    id: question.id,
                    input: {
                      name: question.name,
                      input_type: question.input_type,
                      options: newOptions
                    }
                  };

                  console.log("variables", variables);

                  mutate({
                    variables,
                    optimisticResponse: {
                      __typename: "Mutation",
                      putEvaluationQuestion: {
                        ...question,
                        options: newOptions.map(o => ({
                          ...o,
                          __typename: "EvaluationQuestionOption"
                        }))
                      }
                    }
                  });
                }}
              />
            </div>
          )}
        </Mutation>
      </div>
    );
  }
}

class AddQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redy_for_next_step: false
    };
  }

  storeOnOption = question => {
    this.setState({ redy_for_next_step: false });

    let options = this.props.option.options;
    let newOptions = [
      ...this.props.option.options.map(o => ({ id: o.id, index: o.index })),
      { id: question.id, index: this.props.option.options.length }
    ];

    let variables = {
      id: this.props.optionsID,
      input: {
        name: this.props.option.name,
        sid: this.props.option.sid,
        index: this.props.option.index,
        options: newOptions
      }
    };

    let op = this.props._options[0];
    let optimistic = {
      ...op,
      options: op.options.map(oo => {
        if (oo.sid === this.props.option.sid) {
          return {
            ...this.props.option,
            options: newOptions.map(n => ({ ...n, __typename: "id_and_index" }))
          };
        }
        return oo;
      })
    };

    this.props.mutate({
      variables,
      optimisticResponse: {
        __typename: "Mutation",
        putEvaluationOptions: [optimistic]
      }
    });
  };

  render() {
    return (
      <Mutation mutation={putEvaluationQuestion}>
        {(mutate, { data, loading, error }) => {
          if (data && !loading && !error && this.state.redy_for_next_step) {
            this.storeOnOption(data.putEvaluationQuestion);
          }
          return (
            <div className={title_class}>
              <span>Add question </span>
              <i
                className="fas fa-plus-circle"
                onClick={() => {
                  this.setState({ redy_for_next_step: true });
                  let variables = {
                    input: {
                      name: "New question",
                      input_type: "CHECK",
                      options: []
                    }
                  };
                  mutate({
                    variables,
                    refetchQueries: [{ query: getEvaluationQuestions }]
                  });
                }}
              />
            </div>
          );
        }}
      </Mutation>
    );
  }
}

class Questions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit_title: false,
      is_saving: false
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    if (!result || !result.destination) return;

    let questionID = result.draggableId;
    let question = this.getQuestion(questionID);

    let options = this.props.option.options;
    let option = options.find(op => op.id === questionID);

    let fromIndex = result.source.index;
    let toIndex = result.destination.index;

    let addIndex = fromIndex > toIndex ? +1 : -1;
    let newOrder = [{ id: option.id, index: toIndex }];

    for (let op of options) {
      if (op.id !== option.id) {
        let smallerThanLargest = op.index <= Math.max(fromIndex, toIndex);
        let biggerThanLowest = op.index >= Math.min(fromIndex, toIndex);
        biggerThanLowest && smallerThanLargest
          ? newOrder.push({ id: op.id, index: op.index + addIndex })
          : newOrder.push({ id: op.id, index: op.index });
      }
    }

    newOrder = newOrder.sort((a, b) => a.index - b.index);

    let variables = {
      id: this.props.optionsID,
      input: {
        name: this.props.option.name,
        sid: this.props.option.sid,
        index: this.props.option.index,
        options: newOrder
      }
    };

    let op = this.props._options[0];
    let optimistic = {
      ...op,
      options: op.options.map(oo => {
        if (oo.sid === this.props.option.sid) {
          return {
            ...this.props.option,
            options: newOrder.map(n => ({ ...n, __typename: "id_and_index" }))
          };
        }
        return oo;
      })
    };

    this.props.mutate({
      variables,
      optimisticResponse: {
        __typename: "Mutation",
        putEvaluationOptions: [optimistic]
      }
    });
  }

  getQuestion = id => {
    if (!this.props.questions) return false;
    return this.props.questions.find(q => q.id === id) || {};
  };

  render() {
    const { option, _options, optionsID, questions } = this.props;

    return (
      <div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId={option.sid}>
            {(provided_droppable, snapshot_droppable) => (
              <div
                {...provided_droppable.droppableProps}
                ref={provided_droppable.innerRef}
              >
                {option.options.map((op, i) => {
                  let question = this.getQuestion(op.id);
                  return (
                    <Draggable
                      key={question.id}
                      draggableId={question.id}
                      index={i}
                    >
                      {(provided, snapshot) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className={question_container}
                          style={{
                            ...provided.draggableProps.style
                          }}
                        >
                          <div
                            className={delete_question_class}
                            onClick={() => {
                              let _op = this.props._options[0];

                              let variables = {
                                id: this.props.optionsID,
                                input: {
                                  name: option.name,
                                  sid: option.sid,
                                  index: option.index,
                                  options: option.options
                                    .filter(o => o.id !== op.id)
                                    .map(o => ({ id: o.id, index: o.index }))
                                }
                              };

                              let optimistic = {
                                ..._op,
                                options: _op.options.map(oo =>
                                  oo.sid === option.sid
                                    ? {
                                        ...option,
                                        options: option.options.filter(
                                          o => o.id !== op.id
                                        )
                                      }
                                    : oo
                                )
                              };

                              this.props.mutate({
                                variables,
                                optimisticResponse: {
                                  __typename: "Mutation",
                                  putEvaluationOptions: [optimistic]
                                }
                              });
                            }}
                          >
                            delete
                          </div>

                          <div className={question_title}>
                            {this.state.edit_title !== question.id && (
                              <span>
                                <span>{question.name}</span>
                                <i
                                  className={classnames("fas fa-edit")}
                                  onClick={() => {
                                    this.setState({ edit_title: question.id });
                                  }}
                                />
                              </span>
                            )}

                            {this.state.edit_title === question.id && (
                              <Mutation mutation={putEvaluationQuestion}>
                                {(mutate, { data, loading, error }) => (
                                  <div className={edit_title}>
                                    <InputBox
                                      value={question.name}
                                      submit={newVal => {
                                        let variables = {
                                          id: question.id,
                                          input: {
                                            name: newVal,
                                            input_type: question.input_type,
                                            options: (
                                              question.options || []
                                            ).map(o => ({
                                              val: o.val,
                                              sid: o.sid,
                                              index: o.index
                                            }))
                                          }
                                        };
                                        mutate({
                                          variables,
                                          optimisticResponse: {
                                            __typename: "Mutation",
                                            putEvaluationQuestion: {
                                              ...question,
                                              name: newVal
                                            }
                                          }
                                        });
                                        this.setState({ edit_title: false });
                                      }}
                                    />
                                  </div>
                                )}
                              </Mutation>
                            )}
                          </div>

                          <div className={question_description}>
                            {this.state.edit_description !== question.id && (
                              <span>
                                <span>
                                  {question.description || "description..."}
                                </span>
                                <i
                                  className={classnames("fas fa-edit")}
                                  onClick={() => {
                                    this.setState({
                                      edit_description: question.id
                                    });
                                  }}
                                />
                              </span>
                            )}

                            {this.state.edit_description === question.id && (
                              <Mutation mutation={putEvaluationQuestion}>
                                {(mutate, { data, loading, error }) => (
                                  <div className={edit_title}>
                                    <InputBox
                                      value={question.description || ""}
                                      submit={newVal => {
                                        let variables = {
                                          id: question.id,
                                          input: {
                                            name: question.name,
                                            description: newVal,
                                            input_type: question.input_type,
                                            options: (
                                              question.options || []
                                            ).map(o => ({
                                              val: o.val,
                                              sid: o.sid,
                                              index: o.index
                                            }))
                                          }
                                        };
                                        mutate({
                                          variables,
                                          optimisticResponse: {
                                            __typename: "Mutation",
                                            putEvaluationQuestion: {
                                              ...question,
                                              description: newVal
                                            }
                                          }
                                        });
                                        this.setState({
                                          edit_description: false
                                        });
                                      }}
                                    />
                                  </div>
                                )}
                              </Mutation>
                            )}
                          </div>

                          <div className={input_type_container}>
                            {inputTypes.map((ip, ii) => (
                              <Mutation mutation={putEvaluationQuestion}>
                                {(mutate, { data, loading, error }) => (
                                  <div
                                    className={input_type_class}
                                    key={`ip-${i}-${ii}`}
                                    style={{
                                      opacity:
                                        ip.type === question.input_type
                                          ? 1
                                          : 0.5
                                    }}
                                    onClick={() => {
                                      let variables = {
                                        id: question.id,
                                        input: {
                                          name: question.name,
                                          input_type: ip.type,
                                          options: question.options.map(o => ({
                                            val: o.val,
                                            sid: o.sid,
                                            index: o.index
                                          }))
                                        }
                                      };
                                      mutate({
                                        variables,
                                        optimisticResponse: {
                                          __typename: "Mutation",
                                          putEvaluationQuestion: {
                                            ...question,
                                            input_type: ip.type
                                          }
                                        }
                                      });
                                    }}
                                  >
                                    {ip.label}
                                  </div>
                                )}
                              </Mutation>
                            ))}
                          </div>
                          {(question.input_type === "RADIO" ||
                            question.input_type === "CHECK") && (
                            <Mutation mutation={putEvaluationQuestion}>
                              {(mutate, { data, loading, error }) => {
                                return (
                                  <Alternatives
                                    question={question}
                                    mutate={mutate}
                                  />
                                );
                              }}
                            </Mutation>
                          )}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided_droppable.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <AddQuestion
          mutate={this.props.mutate}
          option={option}
          optionsID={optionsID}
          _options={_options}
        />
      </div>
    );
  }
}

class Comp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit_title: false
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {}

  render() {
    const { options, questions } = this.props;

    const optionsID = (options[0] || {}).id;
    const allOptions = (options[0] || {}).options || [];

    return (
      <div className={wrapper}>
        <div
          className={inner_container}
          style={{ minWidth: `${(allOptions.length + 1) * 420}px` }}
        >
          {allOptions.map((option, i) => (
            <Mutation mutation={putEvaluationOptions}>
              {(mutate, { data, loading, error }) => {
                return (
                  <div className={section}>
                    <div className={title_class}>
                      {!option.options.length && (
                        <div
                          className={delete_question_class}
                          onClick={() => {
                            let variables = {
                              id: optionsID,
                              delete_page: option.sid
                            };
                            let op = options[0];
                            let optimistic = {
                              ...op,
                              options: op.options.filter(
                                oo => oo.sid !== option.sid
                              )
                            };
                            mutate({
                              variables,
                              optimisticResponse: {
                                __typename: "Mutation",
                                putEvaluationOptions: [optimistic]
                              }
                            });
                          }}
                        >
                          delete
                        </div>
                      )}

                      {this.state.edit_title !== option.sid && (
                        <span>
                          <span>{option.name}</span>
                          <i
                            className={classnames("fas fa-edit")}
                            onClick={() => {
                              this.setState({ edit_title: option.sid });
                            }}
                          />
                        </span>
                      )}

                      {this.state.edit_title === option.sid && (
                        <InputBox
                          value={option.name}
                          submit={newVal => {
                            let variables = {
                              id: optionsID,
                              input: {
                                name: newVal,
                                sid: option.sid,
                                index: option.index,
                                options: option.options.map(o => ({
                                  id: o.id,
                                  index: o.index
                                }))
                              }
                            };

                            let op = options[0];
                            let optimistic = {
                              ...op,
                              options: op.options.map(oo => {
                                if (oo.sid === option.sid) {
                                  return {
                                    ...option,
                                    name: newVal
                                  };
                                }
                                return oo;
                              })
                            };

                            mutate({
                              variables,
                              optimisticResponse: {
                                __typename: "Mutation",
                                putEvaluationOptions: [optimistic]
                              }
                            });

                            this.setState({ edit_title: false });
                          }}
                        />
                      )}
                    </div>

                    <Questions
                      _options={options}
                      mutate={mutate}
                      optionsID={optionsID}
                      option={option}
                      questions={questions}
                    />
                  </div>
                );
              }}
            </Mutation>
          ))}

          {
            <div className={section}>
              <Mutation mutation={putEvaluationOptions}>
                {(mutate, { data, loading, error }) => {
                  return (
                    <div className={title_class}>
                      <span>Add page </span>
                      <i
                        className="fas fa-plus-circle"
                        onClick={() => {
                          let option = options[0] || { options: [] };
                          let input = {
                            name: "New page",
                            sid: sid(),
                            index: (option.options || []).length + 1,
                            options: []
                          };
                          let variables = {
                            id: optionsID,
                            input
                          };

                          let optimistic = {
                            ...option,
                            options: [
                              ...(option.options || []),
                              {
                                ...input,
                                __typename: "EvaluationOptions"
                              }
                            ]
                          };

                          mutate({
                            variables
                            // optimisticResponse: {
                            //   __typename: "Mutation",
                            //   putEvaluationOptions: [optimistic]
                            // }
                          });
                        }}
                      />
                    </div>
                  );
                }}
              </Mutation>
            </div>
          }
        </div>
      </div>
    );
  }
}

class ComposedComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const Composed = adopt({
      evaluationOptionsQuery: ({ render }) => (
        <Query query={getEvaluationOptions}>{render}</Query>
      ),
      evaluationQuestionsQuery: ({ render }) => (
        <Query query={getEvaluationQuestions}>{render}</Query>
      )
    });

    return (
      <Composed>
        {({ evaluationOptionsQuery, evaluationQuestionsQuery }) => {
          const loading =
            evaluationOptionsQuery.loading || evaluationQuestionsQuery.loading;

          const error =
            evaluationOptionsQuery.error || evaluationQuestionsQuery.error;

          if (error) console.log("error", error);
          if (loading) return <GhostLoader />;
          if (error) return <div>ERROR</div>;

          const options = evaluationOptionsQuery.data.getEvaluationOptions;
          const questions =
            evaluationQuestionsQuery.data.getEvaluationQuestions;

          console.log("options", options);

          return (
            <Comp
              options={options}
              // allOptions={allOptions}
              questions={questions}
              history={this.props.history}
            />
          );
        }}
      </Composed>
    );
  }
}

export default ComposedComponent;
