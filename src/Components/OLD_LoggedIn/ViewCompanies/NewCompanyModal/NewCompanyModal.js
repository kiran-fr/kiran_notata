import React from "react";
import moment from "moment";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { Query, Mutation } from "react-apollo";
import Tags from "../CompanyCard/Tags";
import {
  viewCompanies,
  evaluation_new,
  infoOverview,
  company_details
} from "../../../../routes";
import { createOrganization } from "../../../../Apollo/Mutations";
import { getEvaluations } from "../../../../Apollo/Queries";
import { button_class } from "../../../elements/Style.module.css";
import {
  modal_outer,
  modal_inner,
  button_section,
  button,
  close_modal,
  similar_names,
  similar_names_title,
  similar_name
} from "./NewCompanyModal.module.css";
import { GhostLoader } from "../../../elements/GhostLoader";

class NewCompany extends React.Component {
  constructor(props) {
    super(props);
    this.state = { v: "" };
  }

  getSimilarNames() {
    if (!this.state.v || this.state.v === "" || this.state.v.length < 3)
      return [];
    let allnames = this.props.evaluations
      .filter(e => e.organization)
      .map(e => e.organization.name);
    let similarNames = allnames.filter(n =>
      n.toLowerCase().includes(this.state.v.toLowerCase())
    );
    if (similarNames.length > 3) similarNames.length = 3;
    return similarNames;
  }

  render() {
    let { newCompany } = this.props;

    return (
      <Mutation mutation={createOrganization}>
        {(mutate, { data, loading, error }) => {

          console.log('{ data, loading, error }', { data, loading, error })

          if (!error && !loading && data) {
            newCompany(data.createOrganization);
          }
          return (
            <div>
              <h1>Create new evaluation</h1>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (loading) return;

                  if (this.state.v.length <= 2) return;
                  let input = { name: this.state.v };
                  mutate({
                    variables: { input },
                    refetchQueries: [{ query: getEvaluations }]
                  });
                }}
              >
                <div style={{ marginBottom: "20px" }}>
                  <label>
                    Company name
                    <input
                      type="text"
                      value={this.state.v}
                      placeholder="Dollar Press Inc."
                      onChange={e => {
                        this.setState({
                          v: e.target.value
                        });
                      }}
                    />
                  </label>
                </div>
                <div>
                  <input
                    type="submit"
                    value="Continue"
                    style={{
                      opacity: this.state.v.length >= 3 ? 1 : 0.3
                    }}
                  />
                  {loading && <i className="fa fa-spinner fa-spin" />}
                </div>
              </form>

              {(this.getSimilarNames().length && (
                <div className={similar_names}>
                  <div className={similar_names_title}>
                    Have you already evaluated this startup?
                  </div>
                  {this.getSimilarNames().map((name, i) => (
                    <div key={`name-${i}`} className={similar_name}>
                      {name}
                    </div>
                  ))}
                </div>
              )) || <span />}
            </div>
          );
        }}
      </Mutation>
    );
  }
}

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newCompanyId: undefined,
      item: undefined
    };
  }

  getSelectedTags({ tags, item }) {
    let n_tags = item.n_tags || [];
    let selectedTags = n_tags
      .map(t => tags.find(_t => _t.id === t))
      .filter(t => t);
    return selectedTags;
  }

  getSelectedFunnelTags({ tags, item }) {
    let n_funnel = item.n_funnel || [];
    let selectedFunnelTags = n_funnel
      .map(t => tags.find(_t => _t.id === t))
      .filter(t => t);
    return selectedFunnelTags;
  }

  componentDidMount() {
    let { evaluations, content } = this.props;
    let stateData = { evaluations, content };
    let item;
    if (content) item = evaluations.find(e => e.id === content.id);
    if (item) stateData.item = item;
    this.setState(stateData);
  }

  componentWillUpdate(newProps) {
    if (newProps === this.props) return;
    let { evaluations, content } = newProps;
    let stateData = { evaluations, content };
    let item;
    if (content) item = evaluations.find(e => e.id === content.id);
    if (item) stateData.item = item;
    this.setState(stateData);
  }

  render() {
    let { evaluations } = this.state;
    let { tags, close } = this.props;
    let new_item;
    if (!this.state.item && this.state.newCompanyId) {
      new_item = (this.props.evaluations || []).find(
        ev => ev.id === this.state.newCompanyId
      );
    }

    let { content } = this.props;
    let item = this.state.item || new_item || content;


    return (
      <div className={modal_outer}>
        <div className={modal_inner}>
          <div className={close_modal} onClick={close}>
            close
          </div>

          {!item && (
            <NewCompany
              evaluations={evaluations}
              newCompany={newCompany => {
                if (!this.state.newCompanyId) {
                  this.setState({ newCompanyId: newCompany.id });
                }
              }}
            />
          )}

          {item && (
            <div>
              <h1>{item.organization.name}</h1>

              {
                !this.props.content && (
                  <div style={{ marginTop: "-30px" }}>
                    <Tags
                      item={item}
                      tags={tags}
                      selected={this.getSelectedTags({ tags, item })}
                      selected_funnel_tags={this.getSelectedFunnelTags({
                        tags,
                        item
                      })}
                    />
                  </div>
                )
              }

              {/* BUTTON SECTION */}
              {
                <div className={button_section}>
                  <Link
                    className={classnames(button_class, button)}
                    to={`${evaluation_new}/${item.id}`}
                  >
                    Evaluate
                  </Link>

                  <Link
                    className={classnames(button_class, button)}
                    to={`${infoOverview}?id=${item.orgId}`}
                  >
                    Facts
                  </Link>
                </div>
              }
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Component;














