import React from "react";
import { Auth } from "aws-amplify";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import classnames from "classnames";
import {
  container,
  small_container,
  center_container,
  inner_container,
  success_box,
  error_box
} from "../../elements/Style.module.css";
import { login } from "../../../routes";

const makeid = length => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export class ConfirmUser extends React.Component {
  submit = e => {
    e.preventDefault();

    this.setState({ loading: true });

    Auth.forgotPasswordSubmit(
      this.props.email,
      this.state.code,
      this.state.newPassword
    )
      .then(data => {
        this.setState({
          message: "New password has been reset. You can now log in!",
          loading: false,
          success: true
        });
      })
      .catch(err => {
        console.log("failed with error", err);
        this.setState({
          error: "Something went wrong...",
          loading: false
        });
      });
  };

  constructor(props) {
    super(props);
    this.state = {
      code: "",
      newPassword: "",
      message: "Code has been sent to your email",
      loading: false,
      success: false
    };
  }

  render() {
    const setData = data => {
      this.setState({
        ...data,
        error: "",
        loading: false
      });
    };

    return (
      <div className={classnames(container, small_container, center_container)}>
        <div className={inner_container}>
          <div>
            <h1>Set new password</h1>

            {this.state.message && (
              <div className={success_box} style={{ marginBottom: "20px" }}>
                {this.state.message}
              </div>
            )}

            {this.state.success && (
              <div>
                <Link to={login}>Log in</Link>
              </div>
            )}

            {!this.state.success && (
              <div>
                <form onSubmit={this.submit} name={makeid(8)} id={makeid(8)}>
                  <div style={{ marginBottom: "20px" }}>
                    <input
                      autoComplete="new-password"
                      type="text"
                      placeholder="Verification code"
                      name={makeid(8)}
                      id={makeid(8)}
                      value={this.state.code}
                      onChange={e => setData({ code: e.target.value })}
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <input
                      autoComplete="new-password"
                      type="password"
                      placeholder="New password"
                      name={makeid(8)}
                      id={makeid(8)}
                      value={this.state.newPassword}
                      onChange={e => setData({ newPassword: e.target.value })}
                    />
                  </div>

                  <div>
                    <input type="submit" value="Set new password" />
                    {this.state.loading && (
                      <i className="fa fa-spinner fa-spin" />
                    )}
                  </div>
                </form>

                {this.state.error && (
                  <div className={error_box}>{this.state.error}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );

  }
}
