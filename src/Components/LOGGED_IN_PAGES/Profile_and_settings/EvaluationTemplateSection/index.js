import React, { Component } from "react";

// REACT STUFF
// import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";

// API STUFF
import { adopt } from "react-adopt";
import { Mutation, Query } from "react-apollo";

import {
  evaluationTemplateGet
} from "../../../../Apollo/Queries";

import {
  evaluationQuestionPut,
} from "../../../../Apollo/Mutations";

import {
//   dashboard,
  profile,
  evaluation_template,
  evaluation_templates
} from "../../../../routes";


// UTILS
import qp from "../../../../utils/queryParams";

// COMPONENTS
import { GhostLoader } from "../../../elements/GhostLoader";
import BreadCrumbs from "../../../elements/BreadCrumbs";
import Saver from "../../../elements/Saver";
import NameAndDescription from "./NameAndDescriptionComp";
import Question from "./QuestionComp";


// STYLES
import classnames from "classnames";

import {
  container,
  small_container,
  center_container,
  inner_container,
  standard_form,
} from "../../../elements/Style.module.css";

import {
  section_style,
} from "./EvaluationTemplateSection.module.css";

import {
  color3
} from "../../../elements/Colors.module.css";


class NewQuestion extends React.Component {

  constructor(props) {
    super(props)
    this.state = { name: '' }
  }

  render() {

    let {
      templateId,
      sectionId
    } = this.props;

    return (
      <div className={section_style}>

        {
          <Mutation mutation={evaluationQuestionPut}>
            {(mutate, {error, loading, data}) => {
              return (
                <form
                  className={standard_form}
                  onSubmit={e => {
                    e.preventDefault()
                    if (!this.state.name.length) return;
                    let variables = {
                      sectionId: sectionId,
                      input: {
                        name: this.state.name,
                        inputType: "CHECK"
                      }
                    }
                    mutate({
                      variables,
                      refetchQueries: [{
                        query: evaluationTemplateGet,
                        variables: { id: templateId }                        
                      }],
                      update: (proxy, { data: { evaluationQuestionPut } }) => {
                        let data = proxy.readQuery({
                          query: evaluationTemplateGet,
                          variables: { id: templateId }
                        })
                        let sections = data.evaluationTemplateGet.sections;
                        data.evaluationTemplateGet.sections = sections.map(s => {
                          if (s.id !== sectionId) return s;
                          return {...s, questions: [...s.questions, evaluationQuestionPut]}
                        })
                        this.setState({name: ''})
                      }
                    })
                  }}
                  >

                  <div style={{marginTop: '30px'}}>
                    <input
                      type="text"
                      placeholder="Question name"
                      value={this.state.name}
                      onChange={e => this.setState({name: e.target.value})}
                    />
                  </div>


                  <div style={{marginTop: '30px'}}>
                    <input
                      type="submit"
                      value="Add new question"
                    />
                    {
                      loading && (
                        <i className="fa fa-spinner fa-spin" />
                      )
                    }
                  </div>

                </form>
              )
            }}
          </Mutation>
        }

      </div>
    )
  }
}


class Comp extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      id: null,
      sectionId: null,
      saving: false
    }
  }

  componentDidMount() {
    let { id, sectionId } = this.props.match.params;
    if (id !== 'new') {
      this.setState({ id, sectionId });
    }
  }  

  render() {

    let skip = !this.state.id || this.state.id === 'new';


    const Composed = adopt({
      evaluationTemplateQuery: ({ render }) => (
        <Query
          query={evaluationTemplateGet}
          variables={{id: this.state.id}}
          skip={skip}
          >
          {render}
        </Query>
      ),
    });    


    return (


      <Composed>
        {({evaluationTemplateQuery}) => {
          const loading = evaluationTemplateQuery.loading;
          const error = evaluationTemplateQuery.error;


          if (error) console.log("error", error);
          if (loading) return <GhostLoader />;
          if (error) return <div>We are updating </div>;

          const data = evaluationTemplateQuery.data.evaluationTemplateGet;

          if (!data) {
            return <div>no data</div>
          }

          let section = {};
          if (this.state.sectionId) {
            section = (data.sections || []).find(s => s.id === this.state.sectionId)
          }


          return (
            <content>

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
                  },
                  {
                    val: "template section",
                    link: `${evaluation_template}/${this.state.id}/${this.state.sectionId}`
                  },
                ]}
              />

              <div
                className={
                  classnames(container,small_container)
                }
                style={{maxWidth: '650px'}}
                >
                <div className={inner_container}>

                  <NameAndDescription
                    template={data}
                    section={section || {}}
                    id={this.state.id}
                    sectionId={this.state.sectionId}
                  />

                  {
                    (section.questions || []).map((question, i) => (
                      <Question
                        key={`question-${i}-${question.id}`}
                        question={question || {}}
                        templateId={this.state.id}
                        sectionId={this.state.sectionId}
                      />
                    ))
                  }

                  <NewQuestion
                    templateId={this.state.id}
                    sectionId={this.state.sectionId}
                  />


                </div>
              </div>
            </content>
          )

        }}

      </Composed>

    )
  }
}

export default Comp;




