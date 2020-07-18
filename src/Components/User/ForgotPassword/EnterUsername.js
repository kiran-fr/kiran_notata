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


export class EnterUsername extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      loading: false
    };
  }

  render() {
    const submit = e => {
      e.preventDefault();

      this.setState({ loading: true });

      const username = this.state.email;
      Auth.forgotPassword(username)
        .then(data => {
          this.props.done(username);
          this.setState({
            loading: false
          });
        })
        .catch(err => {
          console.log(err);
          if (err.code === "UserNotFoundException") {
            this.setState({
              error: "User not found.",
              loading: false
            });
          } else if (err.code === "LimitExceededException") {
            this.setState({
              error:
                "You have tried to many times. Wait a few minutes, and try again.",
              loading: false
            });
          } else {
            this.setState({
              error: "Oops... something went wrong...",
              loading: false
            });
          }
        });
    };

    const setData = data => {
      this.setState({
        ...data,
        error: false,
        loading: false
      });
    };

    const { location } = this.props;

    return (
      <div className={classnames(container, small_container, center_container)}>
        <div className={inner_container}>
          <form onSubmit={submit}>
            <div>
              <h1>Forgot your password?</h1>
              <div style={{ marginBottom: "20px" }}>
                <input
                  type="text"
                  placeholder="email"
                  autoComplete="off"
                  value={this.state.email}
                  onChange={e => setData({ email: e.target.value })}
                />
              </div>

              <div>
                <input type="submit" value="Reset" />
                {this.state.loading && <i className="fa fa-spinner fa-spin" />}
              </div>

              <div>
                <Link
                  to={{
                    pathname: login,
                    state: location.state
                  }}
                >
                  Login
                </Link>
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
