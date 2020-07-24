import React, { Component } from "react";

// REACT STUFF
// import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";

// API STUFF
import { adopt } from "react-adopt";
import { Mutation, Query } from "@apollo/client/react/components";

import { accountGet } from "../../../../Apollo/Queries";

import {
  evaluationTemplatePut,
  evaluationTemplateDelete
} from "../../../../Apollo/Mutations";

import {
  profile,
  dashboard,
  evaluation_template,
  evaluation_templates
} from "../../../../routes";

// COMPONENTS
import { GhostLoader } from "../../../elements/GhostLoader";
import BreadCrumbs from "../../../elements/BreadCrumbs";
import { content_tag } from "../../../../routes.module.css";

// STYLES
import classnames from "classnames";

import {
  container,
  small_container,
  center_container,
  inner_container,
  button_class,
  standard_form,
  shady_list,
  shady_list_item,
  shady_list_byLine,
  shady_list_name,
  shady_list_open_close
} from "../../../elements/Style.module.css";

class CreateNewTemplate extends React.Component {
  state = {
    name: ""
  };

  render() {
    return (
      <Mutation mutation={evaluationTemplatePut}>
        {(mutate, { error, loading }) => {
          return (
            <form
              className={standard_form}
              onSubmit={e => {
                e.preventDefault();

                let variables = {
                  input: {
                    name: this.state.name,
                    description: this.state.description
                  }
                };

                mutate({
                  variables,
                  update: (proxy, { data: { evaluationTemplatePut } }) => {
                    let data = proxy.readQuery({
                      query: accountGet
                    });
                    data.accountGet.evaluationTemplates.unshift(
                      evaluationTemplatePut
                    );
                  }
                });

                this.setState({ name: "" });
              }}
            >
              <div style={{ marginTop: "30px" }}>
                <input
                  type="text"
                  placeholder='I.e. "Early Stage Companies"'
                  value={this.state.name}
                  onChange={e => this.setState({ name: e.target.value })}
                />
              </div>

              <div style={{ marginTop: "30px" }}>
                <input type="submit" value="Create new template" />
                {loading && <i className="fa fa-spinner fa-spin" />}
              </div>
            </form>
          );
        }}
      </Mutation>
    );
  }
}

const Comp = ({ templates, questions }) => {
  return (
    <div className={content_tag}>
      <BreadCrumbs
        list={[
          {
            val: "profile",
            link: profile
          },
          {
            val: "all templates",
            link: `${evaluation_templates}`
          }
        ]}
      />
      <div className={classnames(container, small_container)}>
        <div className={inner_container}>
          <h1>Templates</h1>

          <div className={shady_list}>
            {templates.map((template, i) => (
              <div
                key={`${template.id}`}
                className={shady_list_item}
                style={{ paddingTop: "10px" }}
              >
                <div className={shady_list_name}>
                  <div className={shady_list_open_close}>
                    <i className="fas fa-caret-right" />
                  </div>

                  <Link to={`${evaluation_template}/${template.id}`}>
                    {template.name} - ({template.sections.length} sections)
                  </Link>
                </div>

                <Mutation mutation={evaluationTemplateDelete}>
                  {(mutate, { error, data, loading }) => {
                    return (
                      <div
                        style={{
                          position: "absolute",
                          right: "18px",
                          top: "14px",
                          color: "rgb(200, 0, 0)",
                          cursor: "pointer",
                          fontSize: "18px"
                        }}
                        onClick={() => {
                          if (loading) return;
                          if (template.sections && template.sections.length) {
                            return window.alert(
                              "You have to delete all the section before you can delete the template"
                            );
                          }
                          let variables = {
                            id: template.id
                          };
                          mutate({
                            variables,
                            update: proxy => {
                              let data = proxy.readQuery({
                                query: accountGet
                              });
                              data.accountGet.evaluationTemplates = data.accountGet.evaluationTemplates.filter(
                                t => t.id !== template.id
                              );
                            }
                          });
                        }}
                      >
                        {(loading && (
                          <i className="fa fa-spinner fa-spin" />
                        )) || <i className="fal fa-trash-alt" />}
                      </div>
                    );
                  }}
                </Mutation>
              </div>
            ))}
          </div>

          {
            // <Link
            //   to={`${evaluation_template}/new`}
            //   className={button_class}
            //   >
            //   Create new evaluation template
            // </Link>
          }

          {}
          {<CreateNewTemplate />}
        </div>
      </div>
    </div>
  );
};

const ComposedComponent = () => {
  const Composed = adopt({
    evaluationTemplateQuery: ({ render }) => (
      <Query query={accountGet}>{render}</Query>
    )
  });

  return (
    <Composed>
      {({ evaluationTemplateQuery }) => {
        const loading = evaluationTemplateQuery.loading;
        const error = evaluationTemplateQuery.error;

        if (loading) return <GhostLoader />;
        if (error) return <div>We are updating </div>;

        const data = evaluationTemplateQuery.data.accountGet;

        const templates = data.evaluationTemplates;
        const questions = data.evaluationQuestions;

        // const user = userQuery.data.userGet;

        return <Comp templates={templates} questions={questions} />;
      }}
    </Composed>
  );
};

export default ComposedComponent;
