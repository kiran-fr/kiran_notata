import React from "react";
import { Auth } from "aws-amplify";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { userLoggedIn } from "../../../Modules/user";
import queryString from "query-string";
import { dashboard, forgotPassword } from "../../../routes";
import classnames from "classnames";
import { getUserIsLoggedIn } from "../../../Modules";
import {
  container,
  small_container,
  center_container,
  inner_container,
  success_box,
  error_box,
  standard_form
} from "../../elements/Style.module.css";

export class LoginComp extends React.Component {
  constructor(props) {
    super(props);
    const search = queryString.parse(this.props.location.search);
    this.state = {
      email: search.email || "",
      password: "",
      loading: false,
      verified: search.verified,
      SMS_MFA: false,
      code: "",
      MFA_ERROR: false
    };
  }

  render() {
    const submit = async e => {
      e.preventDefault();
      this.setState({ loading: true });
      if (this.state.signinUser && this.state.SMS_MFA) {
        try {
          const loggedUser = await Auth.confirmSignIn(
            this.state.signinUser,
            this.state.code.trim(),
            "SMS_MFA"
          );
          this.props.userLoggedIn(loggedUser)
        } catch (error) {
          this.setState({ loading: false, MFA_ERROR: true });
        }
      }

      if (!this.state.signinUser && !this.state.SMS_MFA) {
        let email = this.state.email.trim().toLowerCase();        
        try {
          let signinUser = await Auth.signIn(email, this.state.password);
          this.setState({signinUser})
          if (signinUser.challengeName === "SMS_MFA") {
            return this.setState({
              loading: false,
              SMS_MFA: true
            })
          }
          this.setState({ loading: false });
          this.props.userLoggedIn(signinUser)
        } catch (error) {
          console.log('error', error)
          this.setState({ loading: false, error: "Something went wrong..." });
        }
      }

    };

    const setData = data => {
      this.setState({
        ...data,
        error: false,
        loading: false
      });
    };

    const { userIsLoggedIn, location } = this.props;

    if (userIsLoggedIn) {
      return <Redirect to={location.state || dashboard} />;
    }

    return (
      <div className={classnames(container, small_container, center_container)}>
        <div className={inner_container}>
          {this.state.verified && (
            <div className={success_box}>
              <h4>Whoop whoop 🎉</h4>
              <div>
                Your email have been verified, so now you are ready to rock'n
                rumble!
              </div>
            </div>
          )}
          <form onSubmit={submit} className={standard_form}>
            <div>
              <h1>Log in</h1>

              {!this.state.SMS_MFA && (
                  <div>
                    <div style={{ marginBottom: "20px" }}>
                      <input
                        type="text"
                        placeholder="email"
                        value={this.state.email}
                        onChange={e => this.setState({ email: e.target.value })}
                      />
                    </div>
                    <div style={{ marginBottom: "50px" }}>
                      <input
                        type="password"
                        placeholder="password"
                        value={this.state.password}
                        onChange={e => this.setState({ password: e.target.value })}
                      />
                    </div>
                  </div>
                )
              }


              { this.state.signinUser && this.state.SMS_MFA && (
                <div>
                  <div style={{ marginBottom: "50px" }}>

                    {
                      console.log('this.state.signinUser', this.state.signinUser)
                    }

                    <div>

                      {
                        !this.state.resend && (
                          <div style={{fontSize: "12px"}}>
                            <span>A code has been sent to your phone: </span>
                            <span>{this.state.signinUser.challengeParam.CODE_DELIVERY_DESTINATION}. </span>
                            <span>Did get one? </span>
                            <span
                              style={{
                                color: "blue",
                                textDecoration: "underscore",
                                cursor: "pointer"
                              }}
                              onClick={() => {
                                Auth.resendSignUp(this.state.email)
                                this.setState({resend: true})
                              }}
                              >
                              Resend
                            </span>
                            <span> code?</span>
                          </div>
                        )       
                      }

                      {
                        this.state.resend && (
                          <div style={{fontSize: "12px"}}>A new code has been sent.</div>
                        )
                      }

                    </div>
                    <input
                      type="text"
                      placeholder="SMS code"
                      value={this.state.code}
                      onChange={e => this.setState({ code: e.target.value })}
                    />

                    {
                      this.state.MFA_ERROR && (
                        <div style={{color: "#c80000"}}>
                          The code doesn't seem to match...
                        </div>
                      )
                    }
                  </div>
                </div>
              )}

              <div>
                <input type="submit" value="Log in" />
                {this.state.loading && <i className="fa fa-spinner fa-spin" />}
              </div>

              <div>
                <Link to={forgotPassword}>I forgot my password</Link>
              </div>

              {this.state.error && (
                <div className={error_box}>{this.state.error}</div>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export const Login = connect(
  state => ({
    userIsLoggedIn: getUserIsLoggedIn(state)
  }),
  {
    userLoggedIn
  }
)(LoginComp);
