import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { Link, Redirect, withRouter } from "react-router-dom";
import classnames from "classnames";
import {
  container,
  small_container,
  center_container,
  inner_container,
  success_box,
  error_box,
  standard_form
} from "../../elements/Style.module.css";

import { login, awaiting } from "../../../routes";

export const Signup = withRouter(
  class SignupComp extends Component {
    constructor(props, context) {
      super(props, context);

      this.state = {
        email: "",
        password: "",
        passwordRepeat: "",
        error: false,
        passordOK: false,
        loading: false,
        done: false
      };
    }

    componentDidMount() {
      const search = this.props.location.search;
      const params = new URLSearchParams(search);

      let email = params.get("email");

      let dataFromUrl = {};
      if (email) dataFromUrl.email = email;

      this.setState(dataFromUrl);
    }

    render() {
      const { location } = this.props;

      if (this.state.done) {
        return (
          <Redirect
            to={{
              pathname: awaiting,
              search: `awaitingConfirm=true&email=${encodeURIComponent(
                this.state.doneUsername
              )}`,
              state: location.state
            }}
          />
        );
      }

      const submit = e => {
        e.preventDefault();

        if (this.state.password === "") {
          return this.setState({
            error: "signup.password.requirederror"
          });
        }

        if (this.state.password.length < 8) {
          return this.setState({
            error: "signup.password.min8characterserror"
          });
        }

        if (
          this.state.password.length >= 8 &&
          this.state.passwordRepeat === ""
        ) {
          return this.setState({
            error: "signup.repeatpassword.requirederror"
          });
        }

        if (this.state.password !== this.state.passwordRepeat) {
          return this.setState({
            error: "signup.password.repeatpassword.doesnotmatcherror"
          });
        }

        // if (!this.state.termsChecked) {
        //   return this.setState({
        //     error: "signup.terms.requirederror",
        //   });
        // }

        this.setState({
          loading: true
        });

        const email = this.state.email.trim().toLowerCase();
        const password = this.state.password;

        // const firstName = this.state.firstName.trim();
        // const lastName = this.state.lastName.trim();

        Auth.signUp({
          username: email,
          password,
          attributes: { email }
        })
          .then(data => {
            this.setState({
              loading: false,
              done: true,
              doneUsername: data.user.username
            });
          })
          .catch(err => {
            this.setState({
              error: err.message,
              loading: false
            });
          });
      };

      const setData = data => {
        this.setState({
          ...data,
          error: false
        });
      };

      return (
        <div
          className={classnames(container, small_container, center_container)}
        >
          <div className={inner_container}>
            <form onSubmit={submit} className={standard_form}>
              <div>
                <h1>Create new account</h1>

                <div style={{ marginBottom: "20px" }}>
                  <input
                    placeholder="email"
                    type="text"
                    value={this.state.email}
                    onChange={e => {
                      setData({ email: e.target.value });
                    }}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <input
                    placeholder="password"
                    type="password"
                    value={this.state.password}
                    onChange={e => setData({ password: e.target.value })}
                  />
                </div>

                <div style={{ marginBottom: "50px" }}>
                  <input
                    placeholder="repeat password"
                    type="password"
                    value={this.state.passwordRepeat}
                    onChange={e => setData({ passwordRepeat: e.target.value })}
                  />
                </div>

                {this.state.error && (
                  <div className={error_box}>{this.state.error}</div>
                )}

                <div>
                  <input type="submit" value="Create account" />
                  {this.state.loading && (
                    <i className="fa fa-spinner fa-spin" />
                  )}
                </div>

                <div>
                  <div>
                    <a href="/login">Log in</a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      );
    }
  }
);
