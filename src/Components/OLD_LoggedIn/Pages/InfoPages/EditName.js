import React from "react";
import { Redirect, Switch, withRouter } from "react-router-dom";
import qp from "../../../../utils/queryParams";
import classnames from "classnames";
import { edit_title } from "../../../elements/Grid.module.css";
import { noselect } from "../../../elements/GeneralStyle.module.css";
import BackButton from "../../../elements/BackButton";
import BigButton from "../../../elements/BigButton";
import { color1, color3 } from "../../../elements/Colors.module.css";

import { infoOverview } from "../../../../routes";
import { Query, Mutation } from "react-apollo";
import { GhostLoader } from "../../../elements/GhostLoader";

import { getOrganization } from "../../../../Apollo/Queries";
import { updateOrganization } from "../../../../Apollo/Mutations";

import {
  error_box,
  container,
  small_container,
  center_container,
  inner_container
} from "../../../elements/Style.module.css";

class Comp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name
    };
  }

  render() {
    const backLink = `${infoOverview}?id=${this.props.id}`;

    return (
      <Mutation mutation={updateOrganization}>
        {(mutate, { data, loading, error }) => {
          if (!error && !loading && data) {
            console.log("backLink", backLink);
            return <Redirect to={backLink} />;
          }

          return (
            <div
              className={classnames(
                container,
                small_container,
                center_container
              )}
            >
              <div className={inner_container}>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (loading) return;
                    if (this.state.name.length <= 2) return;
                    let input = { name: this.state.name };
                    mutate({
                      variables: {
                        orgId: this.props.id,
                        input
                      }
                    });
                  }}
                >
                  <div style={{ marginBottom: "20px" }}>
                    <label>
                      Company name
                      <input
                        type="text"
                        value={this.state.name}
                        placeholder="Company name"
                        onChange={e => this.setState({ name: e.target.value })}
                      />
                    </label>
                  </div>
                  <div>
                    <input type="submit" value="Done" />
                    {loading && <i className="fa fa-spinner fa-spin" />}
                  </div>
                </form>
                <BackButton link={backLink} />
              </div>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

class EditName extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: null };
  }

  componentDidMount() {
    let { id } = qp(this.props.location.search);
    this.setState({ id: id[0] });
  }

  render() {
    if (!this.state.id) return <span />;

    return (
      <Query
        query={getOrganization}
        variables={{ id: this.state.id }}
        fetchPolicy="cache-and-network"
      >
        {({ data, error, loading }) => {
          if (error) console.error("GraphQL error", error);

          if (loading) return <GhostLoader />;

          return (
            <Comp
              id={this.state.id}
              name={((data || {}).getOrganization || {}).name}
            />
          );
        }}
      </Query>
    );
  }
}

export default EditName;
