import React from "react";
import { Query, Mutation } from "react-apollo";
import classnames from "classnames";
import { cloneDeep } from "lodash";
import { getSharingsByEvaluationId } from "../../../../Apollo/Queries";
import { putSharings, revokeSharing } from "../../../../Apollo/Mutations";
import { color1_bg, color3 } from "../../../elements/Colors.module.css";

import { invited_email, kill_invitation, copyLink } from "./Share.module.css";

import { tag, tag_container, section, section_title } from "./index.module.css";

import validateEmail from "../../../../utils/validateEmail";

class ShareBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emails: (this.props.emailData || []).map(em => em.sharedWithEmail) || [],
      error: false,
      copySuccess: false,
      emailInput: "",
      isValidEmail: false,
      gotData: false
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.emailData !== this.props.emailData) {
      this.setState({
        emails: (newProps.emailData || []).map(em => em.sharedWithEmail) || []
      });
    }
  }

  copyToClipboard = textArea => {
    navigator.clipboard.writeText(this[textArea].value);
    this.setState({ copySuccess: textArea });
  };

  setEmailInput = e => {
    let emailInput = e.target.value;
    let isValidEmail = validateEmail(emailInput);
    this.setState({ emailInput, isValidEmail });
  };

  render() {
    return (
      <div>
        <Mutation mutation={revokeSharing}>
          {(mutate, { data, loading, error }) => (
            <div
              style={{
                paddingTop: "7px",
                paddingBottom: "2px"
              }}
            >
              {this.state.emails.map((it, i) => (
                <div key={`item-${i}`} className={classnames(invited_email)}>
                  <div>
                    <span>{it}</span>
                    <span
                      className={copyLink}
                      onClick={() => {
                        this.copyToClipboard(`textArea_${i}`);
                      }}
                    >
                      {this.state.copySuccess === `textArea_${i}` ? (
                        <i className="fas fa-thumbs-up"></i>
                      ) : (
                        <i className="fas fa-copy" />
                      )}
                    </span>
                  </div>

                  <input
                    ref={text => (this[`textArea_${i}`] = text)}
                    type="hidden"
                    value={`https://notata.io/view_shared_evaluation?id=${this.props.evaluationId}&email=${it}`}
                  />

                  <div
                    className={classnames(kill_invitation, color3)}
                    onClick={() => {
                      let emails = cloneDeep(this.state.emails);
                      let index = emails.indexOf(it);
                      emails.splice(index, 1);
                      mutate({
                        variables: {
                          email: it,
                          evaluationId: this.props.evaluationId
                        }
                      });
                      this.setState({ emails });
                    }}
                  >
                    <i className="fas fa-minus-circle" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Mutation>
        <div style={{ marginTop: "5px", marginBottom: "25px" }}>
          <Mutation mutation={putSharings}>
            {(mutate, { data, loading, error }) => {
              if (
                data &&
                data.putSharings &&
                !error &&
                !loading &&
                !this.state.mutationCompleted
              ) {
                let newSharing = data.putSharings[0];
                let emails = cloneDeep(this.state.emails);
                emails.push(newSharing.sharedWithEmail);
                this.setState({
                  mutationCompleted: true,
                  emailInput: "",
                  isValidEmail: false,
                  emails
                });
              }

              return (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (!this.state.isValidEmail) return;
                    this.setState({
                      mutationCompleted: false
                    });
                    let {
                      organizationId,
                      evaluationId,
                      timestamp
                    } = this.props;

                    let variables = {
                      input: {
                        sharedWithEmail: this.state.emailInput.toLowerCase(),
                        organizationId,
                        timestamp: parseInt(timestamp)
                      },
                      evaluationId
                    };
                    mutate({ variables });
                  }}
                >
                  <input
                    type="text"
                    placeholder="invite"
                    onChange={this.setEmailInput}
                    value={this.state.emailInput}
                    style={{
                      fontSize: "16px",
                      padding: "10px 10px"
                    }}
                  />
                  {this.state.isValidEmail && (
                    <div style={{ textAlign: "right" }}>
                      <input
                        type="submit"
                        value="give access"
                        style={{
                          padding: "10px 15px",
                          marginTop: "10px",
                          width: "auto",
                          fontSize: "16px",
                          marginBottom: "0px",
                          paddingRight: loading ? "50px" : "15px"
                        }}
                      />
                      {loading && (
                        <i
                          style={{ top: "15px" }}
                          className="fa fa-spinner fa-spin"
                        />
                      )}
                    </div>
                  )}
                </form>
              );
            }}
          </Mutation>
        </div>
      </div>
    );
  }
}

const ShareBoxWithQuery = ({ ...props }) => (
  <Query
    query={getSharingsByEvaluationId}
    variables={{ evaluationId: props.evaluationId }}
    fetchPolicy="cache-and-network"
  >
    {({ data, error, loading }) => {
      return (
        <ShareBox
          emailData={(data || {}).getSharingsByEvaluationId}
          {...props}
        />
      );
    }}
  </Query>
);

class Share extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view_share_box: false
    };
  }

  render() {
    let { orgId, evaluationId, timestamp } = this.props;
    return (
      <div>
        <Query
          query={getSharingsByEvaluationId}
          variables={{ evaluationId }}
          fetchPolicy="cache-and-network"
        >
          {({ data, error, loading }) => {
            let hasNotShared =
              !data.getSharingsByEvaluationId ||
              data.getSharingsByEvaluationId.length === 0;

            return (
              <div className={section}>
                {!hasNotShared && (
                  <div className={section_title}>Shared with</div>
                )}
                <div className={tag_container}>
                  {(data.getSharingsByEvaluationId || []).map((it, i) => (
                    <div
                      key={`${evaluationId}-mail-${i}`}
                      style={{
                        background: "#e6e6e6",
                        color: "#333"
                      }}
                      className={classnames(tag)}
                    >
                      {it.sharedWithEmail}
                    </div>
                  ))}
                  <div
                    style={{
                      cursor: "pointer"
                    }}
                    className={classnames(tag, color1_bg)}
                    onClick={() => {
                      this.setState({
                        view_share_box: !this.state.view_share_box
                      });
                    }}
                  >
                    share <i className="fas fa-share-alt" />
                  </div>
                </div>
              </div>
            );
          }}
        </Query>

        {this.state.view_share_box && (
          <div>
            <ShareBoxWithQuery
              evaluationId={evaluationId}
              organizationId={orgId}
              timestamp={timestamp}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Share;
