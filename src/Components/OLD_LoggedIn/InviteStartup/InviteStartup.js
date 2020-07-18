import React from "react";
import classnames from "classnames";
import { Redirect, Link } from "react-router-dom";
import validateEmail from "../../../utils/validateEmail";
import qp from "../../../utils/queryParams";
import BackButton from "../../elements/BackButton";
import { GhostLoader } from "../../elements/GhostLoader";
// import { skip_class } from './InviteStartup.module.css';
import { overviewBoth, infoOverview, dashboard } from "../../../routes";

import {
  error_box,
  skip_class,
  error_class,
  error_message,
  label_class
} from "../../Style.module.css";

import { Mutation, Query } from "react-apollo";
import { inviteStartupMutation } from "../../../Apollo/Mutations";
import { getUserAndOrganization } from "../../../Apollo/Queries";

class Comp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      id: this.props.orgId,
      email: "",
      subject: "",
      body: ""
    };
  }

  componentDidMount() {
    let { family_name, given_name, email } = this.props.user;
    let companyName = this.props.organization.name;
    let subject = `${email} is requesting some information from you.`;
    let body = `Good news!

${given_name} ${family_name} is evaluating your business, and would like to have some more info about you. By filling out the information in the link below you'll help ${given_name} understand your business and needs more.

If you have any questions, plese don't respond to this email, but contact ${given_name} directly on this email: ${email}

`;
    this.setState({ subject, body });
  }

  render() {
    let { mutate, data, loading, error } = this.props;

    if (!error && !loading && data) {
      let { id } = data.inviteStartup;
      return <Redirect to={`${infoOverview}?id=${id}`} />;
    }

    return (
      <content>
        <h1>Invite startup</h1>

        <form
          onSubmit={e => {
            e.preventDefault();
            if (loading) return;
            if (!validateEmail(this.state.email)) {
              return this.setState({
                error: "That doesn't look like a valid email."
              });
            }

            let variables = {
              email: this.state.email,
              orgId: this.state.id,
              subject: this.state.subject,
              body: this.state.body
            };

            console.log(variables);

            mutate({ variables });
          }}
        >
          <div style={{ marginBottom: "30px" }}>
            <label>
              <div className={label_class}>Email</div>
              <input
                type="text"
                className={this.state.error ? error_class : ""}
                placeholder="email"
                value={this.state.email_input}
                onChange={e => {
                  this.setState({
                    email: e.target.value.toLowerCase().trim(),
                    error: false
                  });
                }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label>
              <div className={label_class}>Subject</div>
              <textarea
                // type="text"
                placeholder="subject"
                rows="2"
                style={{ resize: "none" }}
                value={this.state.subject}
                onChange={e => {
                  this.setState({ subject: e.target.value });
                }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>
              <div className={label_class}>
                Body (link will appear in email)
              </div>
              <textarea
                placeholder="body"
                rows="10"
                style={{ resize: "none" }}
                value={this.state.body}
                onChange={e => {
                  this.setState({ body: e.target.value });
                }}
              />
            </label>
          </div>

          {this.state.error && (
            <div className={error_message}>{this.state.error}</div>
          )}

          <div>
            <input type="submit" value="invite startup" />
            {loading && <i className="fa fa-spinner fa-spin" />}
          </div>
        </form>
      </content>
    );
  }
}

const CompWithMutation = ({ ...props }) => (
  <Mutation mutation={inviteStartupMutation}>
    {(mutate, { data, loading, error }) => (
      <Comp
        mutate={mutate}
        data={data}
        loading={loading}
        error={error}
        {...props}
      />
    )}
  </Mutation>
);

class CompWithQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = { orgId: null };
  }

  componentDidMount() {
    let { id } = qp(this.props.location.search);
    this.setState({ orgId: id[0] });
  }

  render() {
    if (!this.state.orgId) return <span />;

    return (
      <div>
        <Query
          query={getUserAndOrganization}
          variables={{ id: this.state.orgId }}
          fetchPolicy="cache-and-network"
        >
          {({ data, error, loading }) => {
            if (loading) return <GhostLoader />;
            return (
              <CompWithMutation
                user={data.getUser}
                organization={data.getOrganization}
                orgId={this.state.orgId}
              />
            );
          }}
        </Query>
        <BackButton link={`${infoOverview}?id=${this.state.orgId}`} />
      </div>
    );
  }
}

export default CompWithQuery;
