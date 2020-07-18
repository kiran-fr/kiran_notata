import React from "react";
import { Query, Mutation } from "react-apollo";
import classnames from "classnames";
import { cloneDeep } from "lodash";
// import { getSharingsByEvaluationId } from "../../../../Apollo/Queries";
// import { putSharings, revokeSharing } from "../../../../Apollo/Mutations";
import { updateOrganization } from "../../../../Apollo/Mutations";

import { color1_bg, color3 } from "../../../elements/Colors.module.css";

import {
  invited_email,
  kill_invitation,
  copyLink,
  tag,
  tag_container,
  section,
  section_title,
  link_copyer
} from "./InviteStartup.module.css";

import validateEmail from "../../../../utils/validateEmail";

class ShareBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      error: false,
      copySuccess: false,
      isValidEmail: false,
      gotData: false
    };
  }

  copyToClipboard = textArea => {
    navigator.clipboard.writeText(this[textArea].value);
    this.setState({ copySuccess: textArea });
  };

  setEmailInput = e => {
    let email = e.target.value;
    let isValidEmail = validateEmail(email);
    this.setState({
      email,
      isValidEmail,
      mutationCompleted: false,
      copySuccess: false
    });
  };

  render() {
    const haveSubmittedData =
      (this.props.email && !this.state.email) || this.state.mutationCompleted;

    return (
      <div
        style={{
          paddingRight: !haveSubmittedData ? "0px" : "39px",
          position: "relative"
        }}
      >
        <div style={{ marginTop: "5px", marginBottom: "25px" }}>
          <Mutation mutation={updateOrganization}>
            {(mutate, { data, loading, error }) => {
              console.log("{ data, loading, error }", { data, loading, error });

              if (
                data &&
                data.updateOrganization &&
                !error &&
                !loading &&
                !this.state.mutationCompleted
              ) {
                this.setState({ mutationCompleted: true });
              }
              return (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (!this.state.isValidEmail) return;
                    let variables = {
                      orgId: this.props.orgId,
                      input: { invitedStartup: this.state.email }
                    };
                    mutate({ variables }, () =>
                      this.setState({ email: "", copySuccess: false })
                    );
                  }}
                >
                  <input
                    type="text"
                    placeholder="invite startup (email)"
                    onChange={this.setEmailInput}
                    value={this.state.email || this.props.email || ""}
                    style={{
                      fontSize: "16px",
                      padding: "10px 10px"
                    }}
                  />

                  {haveSubmittedData && (
                    <div
                      className={link_copyer}
                      onClick={() => {
                        this.copyToClipboard(`textArea`);
                      }}
                    >
                      {this.state.copySuccess === `textArea` ? (
                        <i className="fas fa-thumbs-up" />
                      ) : (
                        <i className="fas fa-copy" />
                      )}
                      <input
                        ref={text => (this[`textArea`] = text)}
                        type="hidden"
                        value={`https://www.notata.io/company_profile?orgId=${this.props.orgId}&email=${this.props.email}`}
                      />
                    </div>
                  )}

                  {this.state.isValidEmail && (
                    <div
                      style={{
                        textAlign: "right",
                        marginRight: haveSubmittedData ? "-39px" : "0px"
                      }}
                    >
                      <input
                        type="submit"
                        value="give access"
                        style={{
                          padding: "10px 15px",
                          marginTop: "10px",
                          width: "auto",
                          fontSize: "16px",
                          marginBottom: "0px",
                          paddingRight: loading ? "50px" : "15px",
                          width: "100%"
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

class Share extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { orgId, email } = this.props;

    return (
      <div
        style={{
          width: "100%",
          maxWidth: "306px",
          margin: "auto"
        }}
      >
        <div className={section_title}>
          Invited startup (get invitation link)
        </div>
        <ShareBox email={email} orgId={orgId} />
      </div>
    );
  }
}

export default Share;
