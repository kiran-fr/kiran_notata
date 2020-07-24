import React from "react";
import classnames from "classnames";
import { adopt } from "react-adopt";
import { GhostLoader } from "../../elements/GhostLoader";
import { Redirect, Switch, withRouter } from "react-router-dom";
import { cloneDeep } from "lodash";
import {
  container,
  inner_container,
  section,
  section_title,
  question_wrapper,
  question_title,
  option_wrapper,
  option_title,
  url_input_line,
  url_input_delete,
  url_input_new_line,
  textarea_input,
  submit_button
} from "./PublicSubmitForm.module.css";

import { Query, Mutation } from "@apollo/client/react/components";
import { publicGetForm } from "../../../Apollo/Queries";
import { publicSubmitForm } from "../../../Apollo/Mutations";

class RadioInputs extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { name, options, selected } = this.props;
    if (!options) return <span />;
    return (
      <div>
        {options.map((option, i) => (
          <div key={`radio-${i}`}>
            <label>
              <input
                name={name}
                type="radio"
                value={option.val}
                onChange={() => selected(option.val)}
              />
              <span>{option.text}</span>
            </label>
          </div>
        ))}
      </div>
    );
  }
}

class CheckBoxInputs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {}
    };
  }

  render() {
    let { options, selected } = this.props;

    if (!options) return <span />;

    return (
      <div>
        {options.map((option, i) => (
          <div key={`checkbox-${i}`}>
            <label>
              <input
                type="checkbox"
                value={option.val}
                checked={!!this.state.selected[option.val]}
                onChange={() => {
                  this.setState(
                    {
                      selected: {
                        ...this.state.selected,
                        [option.val]: !this.state.selected[option.val]
                      }
                    },
                    () => {
                      let list = [];
                      for (let k of Object.keys(this.state.selected)) {
                        if (this.state.selected[k]) list.push(k);
                      }
                      selected(list);
                    }
                  );
                }}
              />
              <span>{option.text}</span>
            </label>
          </div>
        ))}
      </div>
    );
  }
}

class UrlInputs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [""]
    };
  }

  render() {
    let { selected } = this.props;

    return (
      <div>
        {this.state.list.map((l, i) => (
          <div key={`list-${i}`} className={url_input_line}>
            <input
              type="text"
              value={l}
              placeholder="https://..."
              onChange={e => {
                let val = e.target.value;
                let list = this.state.list;
                list[i] = val;
                this.setState({ list });
              }}
              onBlur={() => selected(this.state.list)}
            />

            {this.state.list.length >= 2 && (
              <div
                className={url_input_delete}
                onClick={() => {
                  let list = cloneDeep(this.state.list);
                  list.splice(i, 1);
                  this.setState({ list });
                }}
              >
                <i className="fas fa-minus-circle" />
              </div>
            )}
          </div>
        ))}

        <div
          onClick={() => {
            let list = this.state.list;
            this.setState({ list: [...this.state.list, ""] });
          }}
          className={url_input_new_line}
        >
          add line
        </div>
      </div>
    );
  }
}

class TextAreaInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
  }

  render() {
    let { selected } = this.props;
    return (
      <textarea
        onChange={e => this.setState({ value: e.target.value })}
        onBlur={() => selected(this.state.value)}
        className={textarea_input}
        rows="4"
        value={this.state.value}
      />
    );
  }
}

class Option extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { option } = this.props;

    return (
      <div className={option_wrapper}>
        <div className={option_title}>{option.text}</div>
      </div>
    );
  }
}

export class Question extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { question, setAnswer } = this.props;

    return (
      <div className={question_wrapper}>
        <div className={question_title}>{question.title}</div>

        {question.type === "radio" && (
          <RadioInputs
            name={question.title}
            options={question.options}
            selected={setAnswer}
          />
        )}

        {question.type === "check" && (
          <CheckBoxInputs
            name={question.title}
            options={question.options}
            selected={setAnswer}
          />
        )}

        {question.type === "textInput" && (
          <TextAreaInput
            name={question.title}
            options={question.options}
            selected={setAnswer}
          />
        )}

        {question.type === "urls" && (
          <UrlInputs
            name={question.title}
            options={question.options}
            selected={setAnswer}
          />
        )}
      </div>
    );
  }
}

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      accepted_terms: false,
      terms: ""
    };
  }

  componentDidMount() {
    let { terms } = this.props.form;
    if (terms) {
      this.setState({ terms });
    }
  }

  getFormSections() {
    let { form } = this.props;
    let sections = {};
    for (let f of form.fields) {
      let skip = form.hiddenFields.some(s => s === f.field);
      if (!skip) {
        sections[f.section] = [...(sections[f.section] || []), f];
      }
    }
    return sections;
  }

  getCustomFields() {
    let { form } = this.props;
    let cF = (form.customFields || []).map(c => {
      let d = {};
      for (let k in c) {
        if (k !== "__typename") {
          d[k] = c[k];
        }
      }
      return d;
    });
    return cF;
  }

  render() {
    let { form } = this.props;
    let sections = this.getFormSections();
    let customFields = this.getCustomFields();

    console.log("this.props", this.props);

    if (!form) return <div />;

    return (
      <Mutation mutation={publicSubmitForm}>
        {(mutate, { called, data, error, loading }) => {
          console.log("called", called);

          if (called && !loading) {
            return (
              <div
                className={container}
                style={{
                  paddingTop: "100px",
                  position: "relative",
                  paddingBottom: "100px"
                }}
              >
                <div className={inner_container}>
                  <div className={section}>
                    <h1>Thank you!</h1>
                    <div>You will hear from us shortly</div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              className={container}
              style={{
                paddingTop: "100px",
                position: "relative",
                paddingBottom: "100px",
                opacity: loading ? 0.2 : 1
              }}
            >
              <div className={inner_container}>
                {(form.name || form.description) && (
                  <div className={section}>
                    {form.name && (
                      <h1 style={{ marginBottom: "10px" }}>{form.name}</h1>
                    )}
                    {form.description && (
                      <div style={{ color: "#999" }}>{form.description}</div>
                    )}
                  </div>
                )}

                <div className={section}>
                  <div className={question_wrapper}>
                    <div className={question_title}>
                      What's the name of your company?
                    </div>

                    <div className={url_input_line}>
                      <input
                        type="text"
                        value={this.state.name}
                        placeholder="Dollar Press Inc."
                        onChange={e => {
                          this.setState({
                            ...this.state,
                            name: e.target.value
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className={section}>
                  {customFields.map((c, i) => {
                    return (
                      <div key={`custom-${i}`}>
                        <Question
                          question={c}
                          setAnswer={answer => {
                            // console.log(answer)
                            this.setState({ ...this.state, [c.field]: answer });
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                {Object.keys(sections).map((k, i) => (
                  <div key={`section-${k}`} className={section}>
                    <div className={section_title}>{k}</div>

                    {sections[k].map((q, ii) => {
                      return (
                        <div key={`q-${i}-${ii}`}>
                          <Question
                            question={q}
                            setAnswer={answer => {
                              // console.log(answer)
                              this.setState({
                                ...this.state,
                                [q.field]: answer
                              });
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}

                <div style={{ padding: "20px" }}>
                  {form.terms && (
                    <div style={{ marginBottom: "30px" }}>
                      Terms and conditions
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#999",
                          marginTop: "10px"
                        }}
                      >
                        {form.terms}
                      </div>
                      <div
                        style={{
                          marginTop: "10px",
                          color: "#999"
                        }}
                      >
                        <label>
                          <input
                            type="checkbox"
                            checked={this.state.accepted_terms}
                            onChange={() => {
                              this.setState({
                                accepted_terms: !this.state.accepted_terms
                              });
                            }}
                          />
                          <span style={{ position: "relative", left: "10px" }}>
                            I accept the terms and conditions above
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  <div
                    style={{ opacity: this.state.accepted_terms ? 1 : 0.2 }}
                    className={submit_button}
                    onClick={() => {
                      if (!this.state.accepted_terms) return;
                      let input = [];
                      for (let k in this.state) {
                        input.push({ val: k, text: this.state[k] });
                      }
                      let variables = { id: this.props.form.id, input };
                      mutate({ variables });
                    }}
                  >
                    Submit
                    {loading && <i className="fa fa-spinner fa-spin" />}
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

class ComposedComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null
    };
  }

  componentDidMount() {
    let { id } = this.props.match.params;
    this.setState({ id });
  }

  componentWillReceiveProps(newProps) {
    if (newProps === this.props) return;
    let { id } = newProps.match.params;
    this.setState({ id });
  }

  render() {
    if (!this.state.id) return <GhostLoader />;

    const Composed = adopt({
      formQuery: ({ render }) => (
        <Query query={publicGetForm} variables={{ id: this.state.id }}>
          {render}
        </Query>
      )
    });

    return (
      <Composed>
        {({ formQuery }) => {
          const loading = formQuery.loading;
          const error = formQuery.error;

          if (error) console.log("error", error);

          if (loading) return <GhostLoader />;
          if (error) return <div>ERROR</div>;

          const form = formQuery.data.publicGetForm;

          return <Component form={form} id={this.state.id} loading={loading} />;
        }}
      </Composed>
    );
  }
}

export default ComposedComponent;
