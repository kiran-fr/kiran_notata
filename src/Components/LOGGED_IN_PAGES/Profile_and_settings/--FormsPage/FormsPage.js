import React, { Component } from "react";
import { cloneDeep, omit } from "lodash";
import { adopt } from "react-adopt";
import { GhostLoader } from "../../../elements/GhostLoader";
import { Query, Mutation } from "@apollo/client/react/components";
import { Link } from "react-router-dom";
import { publicSubmitForm } from "../../../../routes";

import { Question } from "../../../Shared/PublicSubmitForm/PublicSubmitForm";
import {
  section,
  section_title,
  textarea_input
} from "../../../Shared/PublicSubmitForm/PublicSubmitForm.module.css";

import {
  // getUser,
  userGet,
  getTeam,
  getForms
} from "../../../../Apollo/Queries";

import { putForm } from "../../../../Apollo/Mutations";

import { skip_answer_class, section_class } from "./FormsPage.module.css";

import {
  color1_bg,
  color2_bg,
  color3_bg,
  color4_bg,
  color5_bg,
  color6_bg
} from "../../../elements/Colors.module.css";
import {
  container,
  small_container,
  center_container,
  inner_container,
  error_box,
  button_class
} from "../../../elements/Style.module.css";

import classnames from "classnames";

const default_terms =
  "By accepting the terms and conditions you grant the receiver of this data full rights to share and distribute the data with people inside and outside their organization as they see fit.";

class CustomInputField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
  }

  render() {
    let { form, customFields, setNewCustomField } = this.props;

    return (
      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          placeholder="Title"
          value={this.state.value}
          onChange={e => this.setState({ value: e.target.value })}
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            background: "#eee",
            padding: "10px",
            paddingRight: "40px",
            borderRadius: "2px"
          }}
        />
        <div
          style={{
            opacity: this.state.value.length <= 2 ? 0.2 : 1,
            marginTop: "5px"
          }}
          className={button_class}
          onClick={() => {
            if (this.state.value.length <= 2) return;
            let customField = {
              title: this.state.value.trim(),
              field: this.state.value.trim().toLowerCase(),
              type: "textInput"
            };
            setNewCustomField(customField);
            this.setState({ value: "" });
          }}
        >
          add
        </div>
      </div>
    );
  }
}

class Comp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      terms: default_terms
    };
  }

  componentDidMount() {
    let form = this.getForm();
    this.setState({
      name: form.name || "",
      description: form.description || "",
      terms: form.terms || default_terms
    });
  }

  getFormSections() {
    let { forms } = this.props;
    let sections = {};
    if (forms && forms.length) {
      let form = forms[0];
      for (let field of form.fields) {
        sections[field.section] = [...(sections[field.section] || []), field];
      }
    }
    return sections;
  }

  getHiddenFields() {
    let hiddenFields = [];
    let { forms } = this.props;
    if (!forms || !forms.length) return [];
    return forms[0].hiddenFields || [];
  }

  getCustomFields() {
    let { forms } = this.props;
    if (!forms || !forms.length) return [];
    let form = forms[0];
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

  getForm() {
    let { forms } = this.props;
    if (!forms || !forms.length) return {};
    return forms[0];
  }

  render() {
    let { user, team, forms } = this.props;

    let form = this.getForm();
    let sections = this.getFormSections();
    let hiddenFields = this.getHiddenFields();
    let customFields = this.getCustomFields();

    if (!team.id) {
      return (
        <div
          className={classnames(container, small_container, center_container)}
        >
          <div className={inner_container}>
            <div className={error_box}>
              Input forms are only avalable for teams. Contact us for more
              information about how to upgrade your account.
            </div>
          </div>
        </div>
      );
    }

    if (!form) {
      return (
        <div className={classnames(container, small_container)}>
          <div className={inner_container}>
            <Mutation mutation={putForm}>
              {(mutate, mRes) => (
                <div onClick={() => mutate()}>Create new form</div>
              )}
            </Mutation>
          </div>
        </div>
      );
    }

    return (
      <div className={classnames(container, small_container)}>
        <div className={inner_container}>
          <div className={section}>
            <div>Your form ID is: {form.id}</div>

            <Link to={`${publicSubmitForm}/${form.id}`}>View form</Link>
          </div>

          <div>
            <Mutation mutation={putForm}>
              {(mutate, mRes) => {
                return (
                  <div>
                    <div className={section}>
                      <div>
                        <div>Form title</div>
                        <div style={{ marginTop: "10px" }}>
                          <input
                            type="text"
                            placeholder="Title"
                            value={this.state.name}
                            onChange={e =>
                              this.setState({ name: e.target.value })
                            }
                            style={{
                              width: "100%",
                              border: "none",
                              outline: "none",
                              background: "#eee",
                              padding: "10px",
                              paddingRight: "40px",
                              borderRadius: "2px"
                            }}
                            onBlur={() => {
                              let variables = {
                                id: form.id,
                                input: {
                                  name: this.state.name
                                }
                              };
                              mutate({
                                variables,
                                optimisticResponse: {
                                  __typename: "Mutation",
                                  putForm: {
                                    ...form,
                                    name: this.state.name
                                  }
                                }
                              });
                            }}
                          />
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: "20px"
                        }}
                      >
                        <div>Form description</div>
                        <textarea
                          onChange={e =>
                            this.setState({ description: e.target.value })
                          }
                          onBlur={() => {
                            let variables = {
                              id: form.id,
                              input: {
                                description: this.state.description
                              }
                            };
                            mutate({
                              variables,
                              optimisticResponse: {
                                __typename: "Mutation",
                                putForm: {
                                  ...form,
                                  description: this.state.description
                                }
                              }
                            });
                          }}
                          className={textarea_input}
                          rows="4"
                          value={this.state.description}
                        />
                      </div>

                      <div
                        style={{
                          marginTop: "20px"
                        }}
                      >
                        <div>Terms and conditions</div>
                        <textarea
                          onChange={e =>
                            this.setState({ terms: e.target.value })
                          }
                          onBlur={() => {
                            let variables = {
                              id: form.id,
                              input: {
                                terms: this.state.terms
                              }
                            };
                            mutate({
                              variables,
                              optimisticResponse: {
                                __typename: "Mutation",
                                putForm: {
                                  ...form,
                                  terms: this.state.terms
                                }
                              }
                            });
                          }}
                          className={textarea_input}
                          rows="4"
                          value={this.state.terms}
                        />
                      </div>
                    </div>

                    <div className={section}>
                      <div className={section_title}>Custom</div>
                      {customFields.map((c, i) => {
                        return (
                          <div className={section_class} key={`custom-${i}`}>
                            <Question
                              question={c}
                              setAnswer={answer => console.log(answer)}
                            />
                            <div
                              className={skip_answer_class}
                              onClick={() => {
                                customFields.splice(i, 1);

                                let variables = {
                                  id: form.id,
                                  input: { customFields }
                                };

                                mutate({
                                  variables,
                                  optimisticResponse: {
                                    __typename: "Mutation",
                                    putForm: { ...form, customFields }
                                  }
                                });
                              }}
                            >
                              delete
                            </div>
                          </div>
                        );
                      })}

                      <CustomInputField
                        form={form}
                        customFields={customFields}
                        setNewCustomField={newField => {
                          let variables = {
                            id: form.id,
                            input: {
                              customFields: [...customFields, newField]
                            }
                          };
                          mutate({
                            variables,
                            optimisticResponse: {
                              __typename: "Mutation",
                              putForm: {
                                ...form,
                                customFields: variables.input.customFields.map(
                                  c => ({
                                    ...c,
                                    section: c.section || "",
                                    options: c.options || [],
                                    __typename: "FormFields"
                                  })
                                )
                              }
                            }
                          });
                        }}
                      />
                    </div>

                    {Object.keys(sections).map((k, i) => (
                      <div key={`section-${k}`} className={section}>
                        <div className={section_title}>{k}</div>

                        {sections[k].map((q, ii) => {
                          let index = hiddenFields.indexOf(q.field);
                          let isHidden = index >= 0;

                          return (
                            <div
                              key={`q-${i}-${ii}`}
                              className={section_class}
                              style={{
                                opacity: isHidden ? 0.2 : 1
                              }}
                            >
                              <Question
                                question={q}
                                setAnswer={answer => console.log(answer)}
                              />
                              <div
                                className={skip_answer_class}
                                onClick={() => {
                                  if (!isHidden) {
                                    hiddenFields.push(q.field);
                                  } else {
                                    hiddenFields.splice(index, 1);
                                  }

                                  let variables = {
                                    id: form.id,
                                    input: {
                                      hiddenFields: [...new Set(hiddenFields)]
                                    }
                                  };
                                  mutate({
                                    variables,
                                    optimisticResponse: {
                                      __typename: "Mutation",
                                      putForm: {
                                        ...form,
                                        hiddenFields:
                                          variables.input.hiddenFields
                                      }
                                    }
                                  });
                                }}
                              >
                                {isHidden ? "show" : "hide"}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                );
              }}
            </Mutation>
          </div>
        </div>
      </div>
    );
  }
}

const ComposedComponent = () => {
  const Composed = adopt({
    userQuery: ({ render }) => <Query query={userGet}>{render}</Query>,
    teamQuery: ({ render }) => <Query query={getTeam}>{render}</Query>,
    formsQuery: ({ render }) => <Query query={getForms}>{render}</Query>
  });

  return (
    <Composed>
      {({ userQuery, teamQuery, formsQuery }) => {
        const loading =
          userQuery.loading || teamQuery.loading || formsQuery.loading;
        const error = userQuery.error || teamQuery.error || formsQuery.error;
        if (error) console.log("error", error);
        if (loading) return <GhostLoader />;
        if (error) return <div>We are updating </div>;

        const user = userQuery.data.userGet;
        const team = teamQuery.data.getTeam;
        const forms = formsQuery.data.getForms;

        return <Comp user={user} team={team} forms={forms} />;
      }}
    </Composed>
  );
};

export default ComposedComponent;
