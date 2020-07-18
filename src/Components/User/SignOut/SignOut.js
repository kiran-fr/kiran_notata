import React from "react";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { login } from "../../../routes";
import {
  container,
  center_container,
  small_container,
  inner_container,
  success_box
} from "../../elements/Style.module.css";

export class SignOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signOut: false,
      signOutError: false
    };
  }

  componentDidMount() {
    Auth.signOut()
      .then(() => {
        this.setState({ signOut: true });
      })
      .catch(() => {
        this.setState({ signOutError: true });
      });
  }

  render() {
    return (
      <div className={classnames(container, small_container, center_container)}>
        <div className={inner_container}>
          <div className={success_box}>
            <h4>Bye bye 😭</h4>
            <div>You have been logged out!</div>
          </div>

          <div>
            <a href="/login">Log in</a>
          </div>
        </div>
      </div>
    );
  }
}
