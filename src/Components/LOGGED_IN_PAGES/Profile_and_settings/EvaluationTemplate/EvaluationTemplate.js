import React, { Component } from "react";

// REACT STUFF
// import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";

// API STUFF
import { adopt } from "react-adopt";
import { Mutation, Query } from "@apollo/client/react/components";

import { evaluationTemplateGet } from "../../../../Apollo/Queries";

import {
  evaluationTemplatePut,
  evaluationTemplateSectionPut,
  evaluationTemplateSectionDelete
} from "../../../../Apollo/Mutations";

import {
  profile,
  dashboard,
  evaluation_template,
  evaluation_templates
} from "../../../../routes";

// UTILS
import qp from "../../../../utils/queryParams";

// COMPONENTS
import { GhostLoader } from "../../../elements/GhostLoader";
import BigButton from "../../../elements/BigButton";
import BreadCrumbs from "../../../elements/BreadCrumbs";
import TextAreaAutoHeight from "../../../elements/TextAreaAutoHeight";
import Saver from "../../../elements/Saver";

// STYLES
import classnames from "classnames";

import {
  container,
  small_container,
  center_container,
  inner_container,
  button_class,
  standard_form,
  focus_form
} from "../../../elements/Style.module.css";

import { gridContainer } from "../../../elements/Grid.module.css";

import { delete_option, section_style } from "./EvaluationTemplate.module.css";
import { content_tag } from "../../../../routes.module.css";

import {
  color1,
  color1_bg,
  color2_bg,
  color3_bg,
  color4_bg,
  color5_bg,
  color6_bg,
  color7_bg,
  color8_bg,
  color9_bg
} from "../../../elements/Colors.module.css";

const colors = [
  color1_bg,
  color2_bg,
  color3_bg,
  color4_bg,
  color5_bg,
  color6_bg,
  color7_bg,
  color8_bg,
  color9_bg
];

const getColor = i => {
  if (i >= colors.length) i = i - colors.length;
  return colors[i];
};

class NameAndDescription extends React.Component {
  render() {
    let data = this.props.data || {};
    let { name, description, id } = this.props.data;

    return (
      <Mutation mutation={evaluationTemplatePut}>
        {(mutate, { error, loading, data }) => {
          return (
            <form onSubmit={e => e.preventDefault()} className={focus_form}>
              <div
                style={{
                  marginTop: "50px",
                  textAlign: "center"
                }}
              >
                <h1>
                  <TextAreaAutoHeight
                    placeholder='I.e. "Early stage evaluations"'
                    value={name}
                    onBlur={value => {
                      if (name === value) return;
                      let variables = {
                        id: id,
                        input: { name: value }
                      };
                      mutate({
                        variables,
                        optimisticResponse: {
                          __typename: "Mutation",
                          evaluationTemplatePut: {
                            ...this.props.data,
                            name: value
                          }
                        }
                      });
                    }}
                  />

                  <div>
                    <span />
                  </div>
                </h1>
              </div>

              <div
                style={{
                  marginTop: "50px",
                  textAlign: "center"
                }}
              >
                <p>
                  <TextAreaAutoHeight
                    placeholder='I.e. "Template for evaluating early stage startups"'
                    value={description}
                    onBlur={value => {
                      if (description === value) return;
                      let variables = {
                        id: id,
                        input: { description: value }
                      };
                      mutate({
                        variables,
                        optimisticResponse: {
                          __typename: "Mutation",
                          evaluationTemplatePut: {
                            ...this.props.data,
                            description: value
                          }
                        }
                      });
                    }}
                  />
                  <div>
                    <span />
                  </div>
                </p>
              </div>
            </form>
          );
        }}
      </Mutation>
    );
  }
}

class AddNewSection extends React.Component {
  state = {
    name: ""
  };

  render() {
    const { id, data } = this.props;

    return (
      <Mutation mutation={evaluationTemplateSectionPut}>
        {(mutate, { error, loading }) => {
          return (
            <form
              className={standard_form}
              onSubmit={e => {
                e.preventDefault();

                let variables = {
                  templateId: id,
                  input: {
                    name: this.state.name
                  }
                };

                let fakeObject = {
                  name: this.state.name,
                  description: "",
                  __typename: "EvaluationTemplateSection",
                  createdAt: new Date().getTime(),
                  updatedAt: new Date().getTime(),
                  createdBy: "tmp",
                  id: "tmp",
                  questions: []
                };

                mutate({
                  variables,
                  optimisticResponse: {
                    __typename: "Mutation",
                    evaluationTemplateSectionPut: {
                      ...data,
                      sections: [...data.sections, fakeObject]
                    }
                  }
                });

                this.setState({ name: "" });
              }}
            >
              <div style={{ marginTop: "30px" }}>
                <input
                  type="text"
                  placeholder='I.e. "Team"'
                  value={this.state.name}
                  onChange={e => this.setState({ name: e.target.value })}
                />
              </div>

              <div style={{ marginTop: "30px" }}>
                <input type="submit" value="Add new section" />
                {
                  // loading && (
                  //   <i className="fa fa-spinner fa-spin" />
                  // )
                }
              </div>
            </form>
          );
        }}
      </Mutation>
    );
  }
}

class Sections extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "" };
  }

  render() {
    let { id, data } = this.props;

    return (
      <div>
        <div className={gridContainer} style={{ margin: "0px -30px" }}>
          {(data.sections || []).map((section, i) => (
            <div key={`section-${section.id}`} style={{ position: "relative" }}>
              <BigButton
                className={getColor(i)}
                label={section.name}
                subLabel={`${section.questions.length} ${
                  section.questions.length === 1 ? "question" : "questions"
                } `}
                link={`${evaluation_template}/${id}/${section.id}`}
              />

              <Mutation mutation={evaluationTemplateSectionDelete}>
                {(mutate, { error, data, loading }) => {
                  if (loading) return <GhostLoader />;
                  return (
                    <div
                      className={delete_option}
                      onClick={() => {
                        if (section.questions.length) {
                          return window.alert(
                            "You have to delete all the questions in a section before you can delete the section"
                          );
                        }
                        let variables = {
                          id: section.id
                        };
                        mutate({
                          variables,
                          update: proxy => {
                            let data = proxy.readQuery({
                              query: evaluationTemplateGet,
                              variables: { id }
                            });

                            let { sections } = data.evaluationTemplateGet;

                            data.evaluationTemplateGet.sections = sections.filter(
                              s => s.id !== section.id
                            );
                          }
                        });
                      }}
                    >
                      delete
                    </div>
                  );
                }}
              </Mutation>
            </div>
          ))}
        </div>

        <AddNewSection data={data} id={id} />
      </div>
    );
  }
}

class Comp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null
    };
  }

  componentDidMount() {
    let { id } = this.props.match.params;
    if (id !== "new") {
      this.setState({ id });
    }
  }

  render() {
    let skip = !this.state.id || this.state.id === "new";

    const Composed = adopt({
      evaluationTemplateQuery: ({ render }) => (
        <Query
          query={evaluationTemplateGet}
          variables={{ id: this.state.id }}
          skip={skip}
        >
          {render}
        </Query>
      )
    });

    return (
      <Composed>
        {({ evaluationTemplateQuery }) => {
          const loading = evaluationTemplateQuery.loading;
          const error = evaluationTemplateQuery.error;

          if (error) console.log("error", error);
          if (this.state.id && loading) return <GhostLoader />;
          if (error) return <div>We are updating </div>;

          const data = evaluationTemplateQuery.data.evaluationTemplateGet;

          return (
            <div className={content_tag}>
              <Saver />

              <BreadCrumbs
                list={[
                  {
                    val: "profile",
                    link: profile
                  },
                  {
                    val: "all templates",
                    link: `${evaluation_templates}`
                  },
                  {
                    val: "template overview",
                    link: `${evaluation_template}/${this.state.id}`
                  }
                ]}
              />

              <div
                className={classnames(container, small_container)}
                style={{ maxWidth: "650px" }}
              >
                <div className={inner_container}>
                  <NameAndDescription data={data || {}} />

                  {this.state.id && data && (
                    <Sections data={data} id={this.state.id} />
                  )}
                </div>
              </div>
            </div>
          );
        }}
      </Composed>
    );
  }
}

export default Comp;
