import React from "react";
import { Redirect, Switch, withRouter } from "react-router-dom";
import qp from "../../../../utils/queryParams";
import classnames from "classnames";
import {
  gridContainer,
  gridItem,
  progress_container,
  progress_inner,
  page_title,
  edit_title
} from "../../../elements/Grid.module.css";
import { noselect } from "../../../elements/GeneralStyle.module.css";
import BackButton from "../../../elements/BackButton";
import BigButton from "../../../elements/BigButton";
import { color1, color3 } from "../../../elements/Colors.module.css";

import { public_new_company } from "../../../../routes";
import { Query, Mutation } from "@apollo/client/react/components";
import { GhostLoader } from "../../../elements/GhostLoader";
import { error_box } from "../../../elements/Style.module.css";

import { public_getOrganization } from "../../../../Apollo/Queries";
import { public_updateOrganization } from "../../../../Apollo/Mutations";
import {
  container,
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
    const backLink = `${public_new_company}?orgId=${this.props.orgId}&email=${this.props.email}`;

    return (
      <Mutation mutation={public_updateOrganization}>
        {(mutate, { data, loading, error }) => {
          if (!error && !loading && data) {
            console.log("backLink", backLink);
            return <Redirect to={backLink} />;
          }

          return (
            <div className={classnames(container, center_container)}>
              <div className={inner_container}>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (loading) return;
                    if (this.state.name.length <= 2) return;
                    let input = { name: this.state.name };
                    mutate({
                      variables: {
                        email: this.props.email,
                        id: this.props.orgId,
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

class StartupCreateCompany extends React.Component {
  constructor(props) {
    super(props);
    this.state = { orgId: null, email: null };
  }

  componentDidMount() {
    let { orgId, email } = qp(this.props.location.search);
    this.setState({ orgId: orgId[0], email: email[0] });
  }

  render() {
    if (!this.state.orgId) return <span />;

    return (
      <Query
        query={public_getOrganization}
        variables={{ id: this.state.orgId, email: this.state.email }}
      >
        {({ data, error, loading }) => {
          if (loading) return <GhostLoader />;

          if (error) {
            return (
              <div className={container}>
                <div className={inner_container}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "96px" }}>💥</div>
                    <div className={error_box}>
                      Ooops. Seems like something went wrong...
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <Comp
              orgId={this.state.orgId}
              email={this.state.email}
              name={((data || {}).public_getOrganization || {}).name}
            />
          );
        }}
      </Query>
    );
  }
}

export default StartupCreateCompany;
